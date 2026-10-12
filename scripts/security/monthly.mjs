import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { applyBaseline, loadBaseline } from './lib/baseline.mjs';
import { root } from './lib/context.mjs';

const modulesDir = path.join(root, 'scripts', 'security', 'modules');
const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low', 'info'];
const BLOCKING = new Set(['critical', 'high']);

const args = process.argv.slice(2);
const option = (name) => {
  const entry = args.find((arg) => arg.startsWith(`--${name}=`));
  return entry ? entry.slice(name.length + 3).split(',').filter(Boolean) : null;
};

const modules = [];
for (const file of fs.readdirSync(modulesDir).filter((name) => name.endsWith('.mjs')).sort()) {
  modules.push((await import(pathToFileURL(path.join(modulesDir, file)).href)).default);
}

if (args.includes('--list')) {
  for (const mod of modules) console.log(`${mod.id.padEnd(22)} OWASP ${mod.owasp.join(', ').padEnd(14)} ${mod.title}`);
  process.exit(0);
}

const only = option('only');
const skip = option('skip') ?? [];
const unknown = [...(only ?? []), ...skip].filter((id) => !modules.some((mod) => mod.id === id));
if (unknown.length) {
  console.error(`[security] Unbekannte Module: ${unknown.join(', ')} (siehe --list)`);
  process.exit(2);
}

const selected = modules.filter((mod) => (!only || only.includes(mod.id)) && !skip.includes(mod.id) && !(args.includes('--offline') && mod.network));
const baseline = loadBaseline();
const today = new Date().toISOString().slice(0, 10);
const results = [];

for (const mod of selected) {
  process.stdout.write(`[security] ${mod.id} ... `);
  try {
    const outcome = await mod.run({ baseline, today });
    const sorted = applyBaseline(outcome.findings, baseline, today);
    const stale = sorted.stale.filter((entry) => entry.id.startsWith(`${mod.id}:`));
    results.push({ mod, outcome, ...sorted, stale });
    const state = outcome.status ?? 'ok';
    console.log(`${state}: ${sorted.open.length} offen, ${sorted.expired.length} abgelaufen, ${sorted.tracked.length} bekannt, ${sorted.accepted.length} akzeptiert`);
  } catch (error) {
    results.push({ mod, outcome: { status: 'error', findings: [], notes: [error.message] }, open: [], tracked: [], accepted: [], expired: [], stale: [] });
    console.log(`error: ${error.message}`);
  }
}

const bySeverity = (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);
const blocking = results.flatMap((r) => [...r.open, ...r.expired]).filter((item) => BLOCKING.has(item.severity));

const lines = [`# Security-Check ${today}`, '', `Letzter Review: ${baseline.lastReview}. Module: ${selected.map((mod) => mod.id).join(', ')}.`, ''];
lines.push('| Modul | OWASP Top 10:2025 | Status | offen | abgelaufen | bekannt | akzeptiert |', '|---|---|---|---|---|---|---|');
for (const r of results) {
  lines.push(`| ${r.mod.id} | ${r.mod.owasp.join(', ')} | ${r.outcome.status ?? 'ok'} | ${r.open.length} | ${r.expired.length} | ${r.tracked.length} | ${r.accepted.length} |`);
}
lines.push('');

for (const r of results) {
  lines.push(`## ${r.mod.title}`, '', `OWASP Top 10:2025: ${r.mod.owasp.join(', ')}. Developer Guide: ${r.mod.devGuide}.`, '');
  for (const note of r.outcome.notes ?? []) lines.push(`- ${note}`);
  const groups = [
    ['Offen', r.open],
    ['Akzeptanz abgelaufen (neu bewerten)', r.expired],
    ['Bekannt, Entscheidung läuft', r.tracked],
    ['Akzeptiert', r.accepted],
  ];
  for (const [label, items] of groups) {
    if (!items.length) continue;
    lines.push('', `**${label}**`, '');
    for (const item of [...items].sort(bySeverity)) {
      lines.push(`- [${item.severity}] ${item.title}${item.detail ? `\n  ${item.detail.replace(/\n/g, '\n  ')}` : ''}${item.hint ? `\n  Hinweis: ${item.hint}` : ''}${item.reason ? `\n  Grund: ${item.reason}${item.reviewBy ? ` (prüfen bis ${item.reviewBy})` : ''}${item.ref ? ` [${item.ref}]` : ''}` : ''}`);
    }
  }
  if (r.stale.length) {
    lines.push('', '**Veraltete Baseline-Einträge (Befund tritt nicht mehr auf, Eintrag entfernen)**', '');
    for (const entry of r.stale) lines.push(`- ${entry.id}`);
  }
  lines.push('');
}

lines.push('## Manuelle Prüfung', '', 'Die Punkte aus `docs/security/monthly-check.md` (Abschnitt "Manuelle Prüfung") sind nicht automatisierbar und müssen im Review abgehakt werden.', '');

const outDir = path.join(root, 'logs', 'security');
fs.mkdirSync(outDir, { recursive: true });
const stamp = today.slice(0, 7);
fs.writeFileSync(path.join(outDir, `monthly-${stamp}.md`), `${lines.join('\n')}\n`, 'utf8');
fs.writeFileSync(
  path.join(outDir, `monthly-${stamp}.json`),
  `${JSON.stringify({ date: today, results: results.map(({ mod, outcome, open, expired, tracked, accepted, stale }) => ({ module: mod.id, status: outcome.status ?? 'ok', open, expired, tracked, accepted, stale })) }, null, 2)}\n`,
  'utf8',
);

console.log(`\n[security] Bericht: logs/security/monthly-${stamp}.md`);
console.log(`[security] ${blocking.length} blockierende Befunde (critical/high, offen oder abgelaufen)`);
process.exit(blocking.length ? 1 : 0);
