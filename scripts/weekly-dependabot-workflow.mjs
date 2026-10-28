import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

// Packages that must stay on the same version; a patch for one is applied to all.
const COUPLED_PACKAGES = [['nuxt', '@nuxt/kit']];

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

const unpatchedAlerts = collectUnpatchedAlerts(alerts);
const preferredVersions = collectPreferredVersions(alerts);
const auditTargets = resolveAuditTargets(collectAuditFindings(), preferredVersions);
Object.assign(preferredVersions, auditTargets.targets);
applyCoupledPackages(preferredVersions);
const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

const updates = [];
applyUpdates(packageJson.dependencies, preferredVersions, 'dependencies', updates);
applyUpdates(packageJson.devDependencies, preferredVersions, 'devDependencies', updates);
applyResolutions(packageJson.resolutions, preferredVersions, updates);
addMissingResolutions(packageJson, auditTargets.targets, updates);

if (updates.length > 0) {
  await fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
}

const report = renderReport(repo, alerts, preferredVersions, updates, unpatchedAlerts, auditTargets.manual);
await fs.writeFile(reportPath, report, 'utf8');

console.log(`[weekly-dependabot] Repo: ${repo}`);
console.log(`[weekly-dependabot] Open alerts fetched: ${alerts.length}`);
console.log(`[weekly-dependabot] Preferred package targets: ${Object.keys(preferredVersions).length}`);
console.log(`[weekly-dependabot] Updated entries: ${updates.length}`);
console.log(`[weekly-dependabot] Needs manual review: ${unpatchedAlerts.length + auditTargets.manual.length}`);
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

function collectUnpatchedAlerts(alertsList) {
  return alertsList
    .filter((alert) => !alert?.security_vulnerability?.first_patched_version?.identifier)
    .map((alert) => ({
      number: alert.number,
      package: alert.security_vulnerability?.package?.name,
      range: alert.security_vulnerability?.vulnerable_version_range,
      summary: alert.security_advisory?.summary,
    }));
}

function runCapture(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', shell: true, maxBuffer: 64 * 1024 * 1024 });
  return { status: result.status, stdout: result.stdout || '' };
}

// "yarn npm audit" exits non-zero when it finds advisories, so only stdout is parsed.
function collectAuditFindings() {
  const { stdout } = runCapture('corepack', ['yarn', 'npm', 'audit', '--recursive', '--json']);
  const findings = [];

  for (const line of stdout.split('\n')) {
    if (!line.trim()) {
      continue;
    }
    try {
      const entry = JSON.parse(line);
      findings.push({
        package: entry.value,
        range: entry.children?.['Vulnerable Versions'] ?? '',
        treeVersions: entry.children?.['Tree Versions'] ?? [],
        severity: entry.children?.Severity,
        issue: entry.children?.Issue,
      });
    } catch {
      console.warn(`[weekly-dependabot] Ignoring unparsable audit line: ${line.slice(0, 80)}`);
    }
  }

  return findings;
}

function listStableVersions(pkg) {
  const { status, stdout } = runCapture('npm', ['view', pkg, 'versions', '--json']);
  if (status !== 0) {
    return [];
  }
  const versions = JSON.parse(stdout);
  return (Array.isArray(versions) ? versions : [versions]).filter((v) => /^\d+\.\d+\.\d+$/.test(v));
}

// Derives the lowest fixed version from an audit range such as ">=3.0.0 <3.1.9" or "<=10.7.3".
function fixedVersionFromRange(pkg, range) {
  const candidates = [];

  for (const alternative of range.split('||')) {
    const exclusive = alternative.match(/(?:^|\s)<\s*(\d+\.\d+\.\d+)/);
    const inclusive = alternative.match(/<=\s*(\d+\.\d+\.\d+)/);
    if (exclusive) {
      candidates.push(exclusive[1]);
    } else if (inclusive) {
      const [major] = parseSemver(inclusive[1]);
      const next = listStableVersions(pkg)
        .filter((v) => compareSemver(v, inclusive[1]) > 0 && parseSemver(v)[0] === major)
        .sort(compareSemver)[0];
      if (next) {
        candidates.push(next);
      }
    }
  }

  return candidates.sort(compareSemver).at(-1) ?? null;
}

// Audit findings that the GitHub alerts do not already cover get a target; the rest need a human.
function resolveAuditTargets(findings, alertTargets) {
  const targets = {};
  const manual = [];

  for (const finding of findings) {
    const fixed = fixedVersionFromRange(finding.package, finding.range);
    if (!fixed) {
      // A fix in a newer major is already known from the GitHub alert.
      if (!alertTargets[finding.package]) {
        manual.push({ ...finding, reason: 'no fixed version published' });
      }
      continue;
    }
    if (alertTargets[finding.package] && compareSemver(alertTargets[finding.package], fixed) >= 0) {
      continue;
    }
    if (!targets[finding.package] || compareSemver(fixed, targets[finding.package]) > 0) {
      targets[finding.package] = fixed;
    }
  }

  return { targets, manual };
}

function applyCoupledPackages(targets) {
  for (const group of COUPLED_PACKAGES) {
    const highest = group
      .filter((pkg) => targets[pkg])
      .map((pkg) => targets[pkg])
      .sort(compareSemver)
      .at(-1);
    if (highest) {
      for (const pkg of group) {
        targets[pkg] = highest;
      }
    }
  }
}

function addMissingResolutions(manifest, auditTargetMap, updates) {
  const known = new Set([
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.devDependencies ?? {}),
    ...Object.keys(manifest.resolutions ?? {}),
  ]);

  for (const [pkg, target] of Object.entries(auditTargetMap)) {
    if (known.has(pkg)) {
      continue;
    }
    manifest.resolutions = { ...manifest.resolutions, [pkg]: target };
    updates.push({ section: 'resolutions (new)', package: pkg, from: '-', to: target });
  }
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

function renderReport(repository, alertsList, preferred, updates, unpatched, manualAudit) {
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

  lines.push('## Needs Manual Review');
  lines.push('');
  if (unpatched.length === 0 && manualAudit.length === 0) {
    lines.push('- None.');
  } else {
    for (const alert of unpatched) {
      lines.push(`- Alert #${alert.number} ${alert.package} (${alert.range}): no patched version reported by GitHub. ${alert.summary ?? ''}`.trim());
    }
    for (const finding of manualAudit) {
      lines.push(`- Audit ${finding.package} ${finding.treeVersions.join(', ')} (${finding.severity}, ${finding.range}): ${finding.reason}. ${finding.issue ?? ''}`.trim());
    }
  }
  lines.push('');

  lines.push('## Next Commands');
  lines.push('');
  lines.push('- yarn security:weekly:test');
  lines.push('- yarn security:weekly:finalize:commit');
  lines.push('- git push origin <branch printed by finalize>');

  return `${lines.join('\n')}\n`;
}
