import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const separatorIndex = args.indexOf('--');

if (separatorIndex === -1) {
  console.error('[run-with-env] Usage: node scripts/run-with-env.mjs KEY=value -- command args...');
  process.exit(1);
}

const envAssignments = args.slice(0, separatorIndex);
const commandArgs = args.slice(separatorIndex + 1);

if (!commandArgs.length) {
  console.error('[run-with-env] Missing command after "--".');
  process.exit(1);
}

const env = { ...process.env };

for (const assignment of envAssignments) {
  const equalsIndex = assignment.indexOf('=');
  if (equalsIndex === -1) {
    console.error(`[run-with-env] Invalid env assignment: ${assignment}`);
    process.exit(1);
  }

  const key = assignment.slice(0, equalsIndex);
  const value = assignment.slice(equalsIndex + 1);
  env[key] = value;
}

const [command, ...commandRest] = commandArgs;
const result = spawnSync(command, commandRest, {
  stdio: 'inherit',
  shell: true,
  env,
});

if (result.error) {
  console.error('[run-with-env] Failed to start command:', result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
