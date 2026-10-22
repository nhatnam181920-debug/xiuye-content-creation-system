import {copyFileSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {basename, dirname, extname, resolve} from 'node:path';
import {assertJob, parseArgs, readJson, root} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const jobPath = resolve(root, String(args.job || 'examples/jobs/multi-world-editorial.demo.json'));
if (!existsSync(jobPath)) throw new Error(`Job not found: ${jobPath}`);
const job = readJson(jobPath);
assertJob(job);

const runtimeDir = resolve(root, '.runtime');
const publicRuntime = resolve(root, 'public', 'runtime');
mkdirSync(runtimeDir, {recursive: true});
mkdirSync(publicRuntime, {recursive: true});

const resolveInput = (value) => resolve(dirname(jobPath), value);
let originalVideo = null;
if (job.inputVideo) {
  originalVideo = resolveInput(job.inputVideo);
  if (!existsSync(originalVideo)) throw new Error(`Input video not found: ${originalVideo}`);
  const ext = extname(originalVideo).toLowerCase() || '.mp4';
  const runtimeName = `presenter${ext}`;
  copyFileSync(originalVideo, resolve(publicRuntime, runtimeName));
  job.inputVideo = `runtime/${runtimeName}`;
}

const parseTime = (value, fps) => {
  const match = value.match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!match) throw new Error(`Invalid SRT timestamp: ${value}`);
  const seconds = Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4].padEnd(3, '0').slice(0, 3)) / 1000;
  return Math.round(seconds * fps);
};

if (job.subtitles) {
  const srtPath = resolveInput(job.subtitles);
  if (!existsSync(srtPath)) throw new Error(`Subtitle file not found: ${srtPath}`);
  const raw = await import('node:fs').then(({readFileSync}) => readFileSync(srtPath, 'utf8').replace(/^\uFEFF/, ''));
  job.captions = raw.split(/\r?\n\r?\n/).map((block) => {
    const lines = block.trim().split(/\r?\n/);
    const timingIndex = lines.findIndex((line) => line.includes('-->'));
    if (timingIndex < 0) return null;
    const [start, end] = lines[timingIndex].split('-->').map((part) => part.trim());
    const text = lines.slice(timingIndex + 1).join(' ').replace(/<[^>]+>/g, '').trim();
    return text ? {startFrame: parseTime(start, job.fps), endFrame: parseTime(end, job.fps), text} : null;
  }).filter(Boolean);
  delete job.subtitles;
}

const preparedPath = resolve(runtimeDir, 'job.json');
writeFileSync(preparedPath, `${JSON.stringify(job, null, 2)}\n`, 'utf8');
writeFileSync(resolve(runtimeDir, 'source.json'), `${JSON.stringify({job: jobPath, inputVideo: originalVideo, preparedAt: new Date().toISOString()}, null, 2)}\n`, 'utf8');
console.log(`PREPARED ${preparedPath}`);
console.log(`Scenes: ${job.scenes.length}; frames: ${job.scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0)}; captions: ${job.captions?.length ?? 0}`);
console.log(originalVideo ? `Private runtime copy: public/runtime/${basename(job.inputVideo)}` : 'Demo mode: no private presenter video.');
