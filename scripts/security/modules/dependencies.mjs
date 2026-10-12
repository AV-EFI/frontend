import { finding, run } from '../lib/context.mjs';

const SEVERITY = { critical: 'critical', high: 'high', moderate: 'medium', low: 'low', info: 'low' };

export default {
  id: 'dependencies',
  title: 'Abhängigkeiten (yarn npm audit)',
  owasp: ['A03'],
  devGuide: 'Implementation › Dependencies',
  async run() {
    const { status, stdout, stderr } = run('corepack', ['yarn', 'npm', 'audit', '--recursive', '--json']);
    const findings = [];
    const notes = [];

    for (const line of stdout.split('\n').filter(Boolean)) {
      let advisory;
      try {
        advisory = JSON.parse(line);
      } catch {
        continue;
      }
      const details = advisory.children;
      if (!advisory.value || !details) continue;
      findings.push(
        finding(`dependencies:${advisory.value}`, SEVERITY[details.Severity] ?? 'medium', `${advisory.value}: ${details.Issue}`, {
          detail: `betroffen ${details['Vulnerable Versions']}, im Baum ${(details['Tree Versions'] ?? []).join(', ')}; Abhängig über ${(details.Dependents ?? []).join(', ')}; ${details.URL}`,
          hint: `corepack yarn why ${advisory.value}`,
        }),
      );
    }

    if (status !== 0 && !findings.length) {
      return { status: 'error', findings, notes: [`yarn npm audit lieferte keine auswertbare Ausgabe: ${stderr.trim().slice(0, 300)}`] };
    }
    notes.push(`${findings.length} Advisory-Paket(e), Exit ${status}`);
    return { findings, notes };
  },
};
