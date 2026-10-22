import {copyFileSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {findExecutable, parseArgs, readJson, root, run, runRemotion} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const jobPath = resolve(root, String(args.job || '.runtime/job.json'));
if (!existsSync(jobPath)) throw new Error('Prepared job missing. Run pnpm job:prepare first.');
const job = readJson(jobPath);
const sourcePath = resolve(root, '.runtime/source.json');
const source = existsSync(sourcePath) ? readJson(sourcePath) : {};
const outputDir = resolve(root, String(args.output || 'outputs'));
const clipsDir = resolve(outputDir, 'clips');
mkdirSync(outputDir, {recursive: true});

const muted = resolve(outputDir, 'xiuye-animation-full-muted.mp4');
const final = resolve(outputDir, 'xiuye-animation-full.mp4');
runRemotion(['render', 'src/index.ts', 'XiuyeAnimationFull', muted, '--codec=h264', '--crf=18', '--muted', '--overwrite', `--props=${jobPath}`, '--log=error']);

if (source.inputVideo) {
  const ffmpeg = findExecutable('FFMPEG_PATH', 'ffmpeg');
  if (!ffmpeg) throw new Error('FFmpeg is required to restore the source voice track. Set FFMPEG_PATH or add ffmpeg to PATH.');
  run(ffmpeg, ['-y', '-i', muted, '-i', source.inputVideo, '-map', '0:v:0', '-map', '1:a:0?', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', final, '-loglevel', 'error']);
} else copyFileSync(muted, final);

if (args.clips) {
  mkdirSync(clipsDir, {recursive: true});
  for (let i = 0; i < job.scenes.length; i += 1) {
    const clipJob = {...job, selectedSceneIndex: i, captions: []};
    const clipProps = resolve(root, '.runtime', `clip-${String(i + 1).padStart(2, '0')}.json`);
    writeFileSync(clipProps, `${JSON.stringify(clipJob, null, 2)}\n`, 'utf8');
    runRemotion(['render', 'src/index.ts', 'XiuyeAnimationScene', resolve(clipsDir, `${String(i + 1).padStart(2, '0')}-${job.scenes[i].id}.mp4`), '--codec=h264', '--crf=18', '--muted', '--overwrite', `--props=${clipProps}`, '--log=error']);
  }
}

console.log(`RENDERED ${final}`);
if (args.clips) console.log(`CLIPS ${clipsDir}`);
