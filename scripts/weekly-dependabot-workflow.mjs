import fs from 'node:fs/promises';
import path from 'node:path';

const repo = process.env.GITHUB_DEPENDABOT_REPO || 'AV-EFI/frontend';
const token = process.env.GITHUB_TOKEN || '';

if (!token) {
  console.error('[weekly-dependabot] Missing GITHUB_TOKEN.');
  console.error('[weekly-dependabot] Set GITHUB_TOKEN and retry.');
  process.exit(1);
}

const rootDir = process.cwd();
const packageJsonPath = path.join(rootDir, 'package.json');
const logsDir = path.join(rootDir, 'logs', 'security');
const alertsJsonPath = path.join(logsDir, 'dependabot-alerts-open.json');
const reportPath = path.join(logsDir, 'dependabot-weekly-report.md');

const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
};

const alerts = await fetchAllAlerts(repo);
await fs.mkdir(logsDir, { recursive: true });
await fs.writeFile(alertsJsonPath, JSON.stringify(alerts, null, 2), 'utf8');

const preferredVersions = collectPreferredVersions(alerts);
const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

const updates = [];
applyUpdates(packageJson.dependencies, preferredVersions, 'dependencies', updates);
applyUpdates(packageJson.devDependencies, preferredVersions, 'devDependencies', updates);
applyResolutions(packageJson.resolutions, preferredVersions, updates);

if (updates.length > 0) {
  await fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
}

const report = renderReport(repo, alerts, preferredVersions, updates);
await fs.writeFile(reportPath, report, 'utf8');

console.log(`[weekly-dependabot] Repo: ${repo}`);
console.log(`[weekly-dependabot] Open alerts fetched: ${alerts.length}`);
console.log(`[weekly-dependabot] Preferred package targets: ${Object.keys(preferredVersions).length}`);
console.log(`[weekly-dependabot] Updated entries: ${updates.length}`);
console.log(`[weekly-dependabot] Wrote: ${relativeToRoot(alertsJsonPath)}`);
console.log(`[weekly-dependabot] Wrote: ${relativeToRoot(reportPath)}`);

function relativeToRoot(filePath) {
  return path.relative(rootDir, filePath).replaceAll('\\\\', '/');
}

async function fetchAllAlerts(repository) {
  const all = [];
  let url = `https://api.github.com/repos/${repository}/dependabot/alerts?state=open&per_page=100`;

  while (true) {
    const res = await fetch(url, { headers });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[weekly-dependabot] GitHub API error ${res.status}: ${text}`);
      process.exit(1);
    }

    const batch = await res.json();
    if (!Array.isArray(batch)) {
      break;
    }

    all.push(...batch);

    const nextUrl = getNextPageUrl(res.headers.get('link'));
    if (!nextUrl) {
      break;
    }

    url = nextUrl;
  }

  return all;
}

function getNextPageUrl(linkHeader) {
  if (!linkHeader) {
    return null;
  }

  for (const link of linkHeader.split(',')) {
    const match = link.match(/<([^>]+)>;\s*rel="next"/);
    if (match) {
      return match[1];
    }
  }

  return null;
}

function collectPreferredVersions(alertsList) {
  const targets = {};

  for (const alert of alertsList) {
    const pkg = alert?.security_vulnerability?.package?.name;
    const patched = alert?.security_vulnerability?.first_patched_version?.identifier;
    if (!pkg || !patched) {
      continue;
    }

    if (!targets[pkg] || compareSemver(patched, targets[pkg]) > 0) {
      targets[pkg] = patched;
    }
  }

  return targets;
}

function applyUpdates(section, targets, sectionName, updates) {
  if (!section || typeof section !== 'object') {
    return;
  }

  for (const [pkg, target] of Object.entries(targets)) {
    if (!(pkg in section)) {
      continue;
    }

    const current = String(section[pkg]);
    const next = withOriginalPrefix(current, target);
    const currentVersion = extractSemver(current);

    if (currentVersion && compareSemver(target, currentVersion) <= 0) {
      continue;
    }

    if (next !== current) {
      section[pkg] = next;
      updates.push({ section: sectionName, package: pkg, from: current, to: next });
    }
  }
}

function applyResolutions(section, targets, updates) {
  if (!section || typeof section !== 'object') {
    return;
  }

  for (const [pkg, target] of Object.entries(targets)) {
    if (!(pkg in section)) {
      continue;
    }

    const current = String(section[pkg]);
    const currentVersion = extractSemver(current);

    if (currentVersion && compareSemver(target, currentVersion) <= 0) {
      continue;
    }

    if (current !== target) {
      section[pkg] = target;
      updates.push({ section: 'resolutions', package: pkg, from: current, to: target });
    }
  }
}

function withOriginalPrefix(current, target) {
  const trimmed = current.trim();
  if (trimmed.startsWith('^')) {
    return `^${target}`;
  }
  if (trimmed.startsWith('~')) {
    return `~${target}`;
  }
  return target;
}

function extractSemver(raw) {
  const match = String(raw).match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    return null;
  }
  return `${match[1]}.${match[2]}.${match[3]}`;
}

function compareSemver(a, b) {
  const pa = parseSemver(a);
  const pb = parseSemver(b);

  for (let i = 0; i < 3; i += 1) {
    if (pa[i] > pb[i]) {
      return 1;
    }
    if (pa[i] < pb[i]) {
      return -1;
    }
  }

  return 0;
}

function parseSemver(v) {
  const m = String(v).match(/(\d+)\.(\d+)\.(\d+)/);
  if (!m) {
    return [0, 0, 0];
  }
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function renderReport(repository, alertsList, preferred, updates) {
  const lines = [];
  lines.push('# Weekly Dependabot Prep Report');
  lines.push('');
  lines.push(`- Repository: ${repository}`);
  lines.push(`- Open alerts fetched: ${alertsList.length}`);
  lines.push(`- Preferred package targets: ${Object.keys(preferred).length}`);
  lines.push(`- package.json updates applied: ${updates.length}`);
  lines.push('');

  lines.push('## Preferred Targets From Open Alerts');
  lines.push('');
  lines.push('| Package | Target |');
  lines.push('| --- | --- |');
  for (const pkg of Object.keys(preferred).sort()) {
    lines.push(`| ${pkg} | ${preferred[pkg]} |`);
  }
  lines.push('');

  lines.push('## Applied Updates');
  lines.push('');
  if (updates.length === 0) {
    lines.push('- No package.json changes were needed.');
  } else {
    for (const update of updates) {
      lines.push(`- ${update.section} :: ${update.package}: ${update.from} -> ${update.to}`);
    }
  }
  lines.push('');

  lines.push('## Next Commands');
  lines.push('');
  lines.push('- yarn install');
  lines.push('- yarn test:ci:fast');
  lines.push('- yarn npm audit --recursive --json');
  lines.push('- git add package.json yarn.lock logs/security/dependabot-weekly-report.md logs/security/dependabot-alerts-open.json');
  lines.push('- git status --short');

  return `${lines.join('\n')}\n`;
}
