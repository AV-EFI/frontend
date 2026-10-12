import { finding } from '../lib/context.mjs';

const REQUIRED = [
  { header: 'strict-transport-security', label: 'HSTS' },
  { header: 'content-security-policy', alternative: 'content-security-policy-report-only', label: 'CSP (zunächst Report-Only)' },
  { header: 'x-content-type-options', label: 'nosniff' },
  { header: 'referrer-policy', label: 'Referrer-Policy' },
  { header: 'permissions-policy', label: 'Permissions-Policy' },
];

export default {
  id: 'live-headers',
  network: true,
  title: 'Security-Header der Live-Systeme',
  owasp: ['A02'],
  devGuide: 'Operations › Overview',
  async run({ baseline }) {
    const findings = [];
    const notes = [];
    let reachable = 0;

    for (const url of baseline.config.liveUrls) {
      const host = new URL(url).host;
      let response;
      try {
        response = await fetch(url, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(15000) });
      } catch (error) {
        notes.push(`${host}: nicht erreichbar (${error.cause?.code ?? error.message}), nicht bewertet`);
        continue;
      }
      reachable += 1;
      const headers = response.headers;

      for (const { header, alternative, label } of REQUIRED) {
        if (!headers.has(header) && !(alternative && headers.has(alternative))) {
          findings.push(finding(`live-headers:${host}:${header}`, 'medium', `${host}: ${label} fehlt`));
        }
      }
      const csp = headers.get('content-security-policy') ?? headers.get('content-security-policy-report-only') ?? '';
      if (!headers.has('x-frame-options') && !/frame-ancestors/i.test(csp)) {
        findings.push(finding(`live-headers:${host}:frame-protection`, 'medium', `${host}: Frame-Schutz fehlt (X-Frame-Options oder CSP frame-ancestors)`));
      }
      for (const leaking of ['x-powered-by', 'server']) {
        if (headers.has(leaking) && /\d/.test(headers.get(leaking))) {
          findings.push(finding(`live-headers:${host}:${leaking}`, 'low', `${host}: ${leaking} nennt eine Version (${headers.get(leaking)})`));
        }
      }
      notes.push(`${host}: HTTP ${response.status}`);
    }

    return { status: reachable ? undefined : 'skipped', findings, notes };
  },
};
