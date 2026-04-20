import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const reportPath = resolve(process.cwd(), 'logs', 'data-quality', 'quality-statistics.md');
const identifiersPath = resolve(process.cwd(), 'logs', 'data-quality', 'quality-failing-identifiers.md');
const stakeholderDir = resolve(process.cwd(), 'logs', 'data-quality', 'stakeholders');

if (existsSync(reportPath)) {
  rmSync(reportPath, { force: true });
}

if (existsSync(identifiersPath)) {
  rmSync(identifiersPath, { force: true });
}

if (existsSync(stakeholderDir)) {
  rmSync(stakeholderDir, { recursive: true, force: true });
}
