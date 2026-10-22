import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {findExecutable, root} from './lib.mjs';

const checks = [];
const add = (name, ok, detail) => checks.push({name, ok, detail});

const major = Number(process.versions.node.split('.')[0]);
add('Node.js 20+', major >= 20, process.version);
add('package.json', existsSync(resolve(root, 'package.json')), resolve(root, 'package.json'));
add('dependencies', existsSync(resolve(root, 'node_modules', 'remotion')), 'run pnpm install when missing');
add('Remotion browser', existsSync(resolve(root, 'node_modules', '.remotion', 'chrome-headless-shell')), 'run pnpm browser:ensure when missing');
add('FFmpeg', Boolean(findExecutable('FFMPEG_PATH', 'ffmpeg')), process.env.FFMPEG_PATH || 'PATH');
add('FFprobe', Boolean(findExecutable('FFPROBE_PATH', 'ffprobe')), process.env.FFPROBE_PATH || 'PATH');

for (const item of checks) console.log(`${item.ok ? 'PASS' : 'MISS'}  ${item.name}  ${item.detail}`);
if (checks.some((item) => !item.ok)) {
  console.error('\nEnvironment is not ready for a verified render. Missing tools were not installed automatically.');
  process.exitCode = 1;
} else console.log('\nEnvironment ready.');
