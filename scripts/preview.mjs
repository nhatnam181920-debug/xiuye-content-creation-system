import {existsSync, mkdirSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {parseArgs, readJson, root, runRemotion} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const jobPath = resolve(root, String(args.job || '.runtime/job.json'));
if (!existsSync(jobPath)) throw new Error('Prepared job missing. Run pnpm job:prepare first.');
const job = readJson(jobPath);
const outputDir = resolve(root, String(args.output || 'outputs/previews'));
if (existsSync(outputDir)) rmSync(outputDir, {recursive: true, force: true});
mkdirSync(outputDir, {recursive: true});

let cursor = 0;
for (let i = 0; i < job.scenes.length; i += 1) {
  const scene = job.scenes[i];
  const frame = cursor + Math.floor(scene.durationInFrames / 2);
  const output = resolve(outputDir, `${String(i + 1).padStart(2, '0')}-${scene.id}.png`);
  runRemotion(['still', 'src/index.ts', 'XiuyeAnimationFull', output, `--frame=${frame}`, `--props=${jobPath}`, '--log=error']);
  cursor += scene.durationInFrames;
}
console.log(`PREVIEWED ${job.scenes.length} scenes in ${outputDir}`);
