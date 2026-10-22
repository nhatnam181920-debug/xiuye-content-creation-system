import {accessSync, constants, existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

export const root = resolve(import.meta.dirname, '..');

export const parseArgs = (argv) => {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const [rawKey, inline] = token.slice(2).split('=', 2);
    if (inline !== undefined) args[rawKey] = inline;
    else if (argv[i + 1] && !argv[i + 1].startsWith('--')) args[rawKey] = argv[++i];
    else args[rawKey] = true;
  }
  return args;
};

export const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

export const assertJob = (job) => {
  const errors = [];
  if (job.version !== '1') errors.push('version must be "1"');
  if (job.template !== 'multi-world-editorial') errors.push('template must be multi-world-editorial');
  if (!Number.isInteger(job.fps) || job.fps < 24 || job.fps > 60) errors.push('fps must be an integer from 24 to 60');
  if (!Number.isInteger(job.width) || !Number.isInteger(job.height)) errors.push('width and height must be integers');
  if (!job.brand?.name || !/^#[0-9a-f]{6}$/i.test(job.brand?.accent ?? '') || !/^#[0-9a-f]{6}$/i.test(job.brand?.secondary ?? '')) errors.push('brand name and six-digit hex colors are required');
  if (!job.presenter || job.presenter.cropX < 0 || job.presenter.cropX > 100 || job.presenter.cropY < 0 || job.presenter.cropY > 100 || job.presenter.scale < 0.8 || job.presenter.scale > 2.5) errors.push('presenter crop and scale are invalid');
  if (!Array.isArray(job.scenes) || job.scenes.length === 0) errors.push('at least one scene is required');
  const ids = new Set();
  for (const [index, scene] of (job.scenes ?? []).entries()) {
    if (!/^[a-z0-9-]+$/.test(scene.id ?? '')) errors.push(`scene ${index + 1}: invalid id`);
    if (ids.has(scene.id)) errors.push(`scene ${index + 1}: duplicate id ${scene.id}`);
    ids.add(scene.id);
    if (!['hook', 'cards', 'process', 'network', 'summary'].includes(scene.kind)) errors.push(`scene ${index + 1}: invalid kind`);
    if (!['paper', 'academic', 'practice', 'money', 'plum'].includes(scene.world)) errors.push(`scene ${index + 1}: invalid world`);
    if (!['full', 'circle', 'none'].includes(scene.presenterMode)) errors.push(`scene ${index + 1}: invalid presenterMode`);
    if (!Number.isInteger(scene.durationInFrames) || scene.durationInFrames < 30) errors.push(`scene ${index + 1}: durationInFrames must be at least 30`);
    if (!Number.isInteger(scene.sourceStartFrame) || scene.sourceStartFrame < 0) errors.push(`scene ${index + 1}: invalid sourceStartFrame`);
    if (!scene.title || scene.title.length > 48) errors.push(`scene ${index + 1}: title is missing or too long`);
    if ((scene.points?.length ?? 0) > 5) errors.push(`scene ${index + 1}: no more than five points`);
  }
  if (errors.length) throw new Error(`Invalid job:\n- ${errors.join('\n- ')}`);
};

export const findExecutable = (envName, fallbackName) => {
  const fromEnv = process.env[envName];
  if (fromEnv) {
    accessSync(fromEnv, constants.X_OK);
    return fromEnv;
  }
  const probe = spawnSync(fallbackName, ['-version'], {stdio: 'ignore', shell: process.platform === 'win32'});
  return probe.status === 0 ? fallbackName : null;
};

export const localBin = (name) => {
  const file = resolve(root, 'node_modules', '.bin', `${name}${process.platform === 'win32' ? '.cmd' : ''}`);
  if (!existsSync(file)) throw new Error(`Missing ${name}. Run pnpm install first.`);
  return file;
};

export const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {cwd: root, stdio: 'inherit', shell: process.platform === 'win32' && command.endsWith('.cmd'), ...options});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with code ${result.status}`);
};

export const runRemotion = (args) => {
  const cli = resolve(root, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
  if (!existsSync(cli)) throw new Error('Missing Remotion CLI. Run pnpm install first.');
  run(process.execPath, [cli, ...args]);
};

export const totalFrames = (job) => job.scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0);

