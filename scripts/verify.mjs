import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {findExecutable, parseArgs, readJson, root, totalFrames} from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const jobPath = resolve(root, String(args.job || '.runtime/job.json'));
const videoPath = resolve(root, String(args.video || 'outputs/xiuye-animation-full.mp4'));
if (!existsSync(jobPath) || !existsSync(videoPath)) throw new Error('Prepared job or rendered video missing.');
const job = readJson(jobPath);
const ffprobe = findExecutable('FFPROBE_PATH', 'ffprobe');
const ffmpeg = findExecutable('FFMPEG_PATH', 'ffmpeg');
if (!ffprobe || !ffmpeg) throw new Error('FFprobe and FFmpeg are required for verification.');

const inspect = (file, expectedFrames) => {
  const probe = spawnSync(ffprobe, ['-v', 'error', '-count_frames', '-show_entries', 'stream=codec_type,width,height,r_frame_rate,codec_name,nb_read_frames', '-show_entries', 'format=duration,size', '-of', 'json', file], {encoding: 'utf8'});
  if (probe.status !== 0) throw new Error(probe.stderr || `FFprobe failed: ${file}`);
  const data = JSON.parse(probe.stdout);
  const video = data.streams.find((stream) => stream.codec_type === 'video');
  const audioCount = data.streams.filter((stream) => stream.codec_type === 'audio').length;
  const actualFrames = Number(video?.nb_read_frames || 0);
  const checks = {
    width: video?.width === job.width,
    height: video?.height === job.height,
    fps: video?.r_frame_rate === `${job.fps}/1`,
    codec: video?.codec_name === 'h264',
    frames: Math.abs(actualFrames - expectedFrames) <= 2,
  };
  const decode = spawnSync(ffmpeg, ['-v', 'error', '-i', file, '-f', 'null', process.platform === 'win32' ? 'NUL' : '/dev/null'], {stdio: 'inherit'});
  checks.decode = decode.status === 0;
  return {file, expectedFrames, actual: {width: video?.width, height: video?.height, fps: video?.r_frame_rate, frames: actualFrames, codec: video?.codec_name, audioTracks: audioCount, duration: Number(data.format?.duration || 0), sizeBytes: Number(data.format?.size || 0)}, checks, passed: Object.values(checks).every(Boolean)};
};

const full = inspect(videoPath, totalFrames(job));
const clips = job.scenes.map((scene, index) => {
  const file = resolve(root, 'outputs', 'clips', `${String(index + 1).padStart(2, '0')}-${scene.id}.mp4`);
  return existsSync(file) ? inspect(file, scene.durationInFrames) : {file, expectedFrames: scene.durationInFrames, passed: false, checks: {exists: false}};
});
const passed = full.passed && clips.every((clip) => clip.passed);
const report = {status: passed ? 'PASS' : 'FAIL', checkedAt: new Date().toISOString(), expected: {width: job.width, height: job.height, fps: job.fps}, full, clips};
mkdirSync(resolve(root, 'outputs'), {recursive: true});
writeFileSync(resolve(root, 'outputs', 'verification.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;
