import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {extname, relative, resolve} from 'node:path';
import {root} from './lib.mjs';

const ignored = new Set(['.git', 'node_modules', '.runtime', 'outputs']);
const privateExtensions = new Set(['.mp4', '.mov', '.mkv', '.avi', '.wav', '.mp3', '.m4a', '.aac', '.srt', '.vtt']);
const findings = [];

const walk = (dir) => {
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    if (ignored.has(entry.name)) continue;
    const path = resolve(dir, entry.name);
    const rel = relative(root, path).replaceAll('\\', '/');
    if (rel === 'public/runtime' || rel.startsWith('public/runtime/')) continue;
    if (entry.isDirectory()) walk(path);
    else {
      const stat = statSync(path);
      if (privateExtensions.has(extname(entry.name).toLowerCase())) findings.push(`${rel}: private media extension`);
      if (stat.size > 5 * 1024 * 1024) findings.push(`${rel}: file larger than 5 MB`);
      if (stat.size < 1024 * 1024 && !['.png', '.jpg', '.jpeg', '.gif', '.woff', '.woff2'].includes(extname(entry.name).toLowerCase())) {
        const text = readFileSync(path, 'utf8');
        if (/[A-Za-z]:\\(?:Users|自媒体视频)\\/i.test(text)) findings.push(`${rel}: local absolute path`);
        if (/(api[_-]?key|access[_-]?token|refresh[_-]?token)\s*[:=]\s*["'][^"']{8,}/i.test(text)) findings.push(`${rel}: possible secret`);
      }
    }
  }
};

if (!existsSync(resolve(root, 'README.md'))) findings.push('README.md missing');
walk(root);
if (findings.length) {
  console.error(`RELEASE CHECK FAILED\n- ${findings.join('\n- ')}`);
  process.exitCode = 1;
} else console.log('PASS: no obvious private media, oversized files, machine paths or secrets in the public tree.');
