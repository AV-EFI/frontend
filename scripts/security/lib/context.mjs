import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const root = process.cwd();

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
  return { status: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

/** Tracked and not-yet-committed (non-ignored) files matching one of the path prefixes or extensions. */
export function trackedFiles({ prefixes = [], extensions = [], exclude = [] } = {}) {
  const { stdout } = run('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { shell: false });
  return stdout
    .split('\0')
    .filter(Boolean)
    .filter((file) => !prefixes.length || prefixes.some((prefix) => file === prefix || file.startsWith(prefix)))
    .filter((file) => !extensions.length || extensions.some((ext) => file.endsWith(ext)))
    .filter((file) => !exclude.some((part) => file.startsWith(part)));
}

export function readText(file) {
  return fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
}

export function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

export function finding(id, severity, title, extra = {}) {
  return { id, severity, title, ...extra };
}
