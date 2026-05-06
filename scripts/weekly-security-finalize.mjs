import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const args = process.argv.slice(2);
const shouldCommit = args.includes('--commit');

const stamp = new Date().toISOString().slice(0, 10);
const branchName = `chore/security-weekly-${stamp}`;
const commitMessage = `chore(security): weekly dependabot prep ${stamp}`;

run('git', ['checkout', '-B', branchName]);

const candidateFiles = [
  'package.json',
  'yarn.lock',
  'logs/security/dependabot-weekly-report.md',
  'logs/security/dependabot-alerts-open.json',
];

const filesToAdd = candidateFiles.filter((file) => fs.existsSync(file));
if (filesToAdd.length > 0) {
  run('git', ['add', ...filesToAdd]);
}

const status = runCapture('git', ['status', '--short']);
const hasChanges = status
  .split('\n')
  .map((line) => line.trim())
  .some((line) => line.length > 0);

if (!hasChanges) {
  console.log('[weekly-security-finalize] No changes to commit.');
  process.exit(0);
}

console.log(`[weekly-security-finalize] Branch ready: ${branchName}`);
console.log('[weekly-security-finalize] Staged files:');
console.log(status);

if (shouldCommit) {
  run('git', ['commit', '-m', commitMessage]);
  console.log(`[weekly-security-finalize] Commit created: ${commitMessage}`);
  console.log(`[weekly-security-finalize] Next: git push origin ${branchName}`);
} else {
  console.log(`[weekly-security-finalize] Suggested commit message: ${commitMessage}`);
  console.log('[weekly-security-finalize] Next commands:');
  console.log(`  git commit -m \"${commitMessage}\"`);
  console.log(`  git push origin ${branchName}`);
}

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    stdio: 'inherit',
    shell: true,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runCapture(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: true,
  });

  if (result.status !== 0) {
    if (result.stderr) {
      process.stderr.write(result.stderr);
    }
    process.exit(result.status ?? 1);
  }

  return result.stdout || '';
}
