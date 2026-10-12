import { finding, readText, trackedFiles } from '../lib/context.mjs';

const AUTH = /requireAuthenticatedUser|getAuthSession|requireCmsMutationsEnabled|requireAdmin|requireSecretToken|MAIL_TEST_TOKEN/;
const VALIDATION = /safeParse|\.parse\(|readValidatedBody|getValidatedQuery|z\.object/;
const SIDE_EFFECT = /writeFile|appendFile|sendMail|createTransport|\.rm\(|unlink|\.bulk\(|\.index\(|\.delete\(/;
const RATE_LIMIT = /consumeRateLimit/;

function routeOf(file) {
  const match = file.match(/^server\/(api|routes)\/(.+?)(?:\.(get|post|put|patch|delete))?\.(?:ts|js|mjs)$/);
  if (!match) return null;
  return { path: `/${match[1] === 'api' ? 'api/' : ''}${match[2].replace(/\/index$/, '')}`, method: (match[3] ?? 'any').toUpperCase() };
}

export default {
  id: 'server-routes',
  title: 'Nitro-Routen (Auth, Validierung, Missbrauchsschutz)',
  owasp: ['A01', 'A06', 'A07'],
  devGuide: 'Design › Threat modeling',
  async run({ baseline }) {
    const findings = [];
    const files = trackedFiles({ prefixes: ['server/api/', 'server/routes/'], extensions: ['.ts', '.js', '.mjs'] });
    const known = new Set(baseline.config.reviewedRoutes);
    const routes = [];

    for (const file of files) {
      const route = routeOf(file);
      if (!route) continue;
      const key = `${route.method} ${route.path}`;
      routes.push(key);
      const text = readText(file);
      const mutating = route.method !== 'GET';
      const hasAuth = AUTH.test(text);

      if (!known.has(key)) {
        findings.push(finding(`server-routes:new:${key}`, 'medium', `Neue oder noch nicht geprüfte Route ${key}`, { detail: file, hint: 'Auth, Validierung, Rate-Limit prüfen, dann in baseline.config.reviewedRoutes aufnehmen' }));
      }
      if (SIDE_EFFECT.test(text) && !hasAuth && !RATE_LIMIT.test(text)) {
        findings.push(finding(`server-routes:unprotected-side-effect:${key}`, 'high', `${key} hat Schreib- oder Versandzugriff ohne Auth und ohne Rate-Limit`, { detail: file }));
      }
      if (mutating && /readBody\(/.test(text) && !VALIDATION.test(text)) {
        findings.push(finding(`server-routes:unvalidated-body:${key}`, 'medium', `${key} liest den Body ohne Schema-Validierung`, { detail: file }));
      }
      if (/\bdebug\s*:\s*true\b/.test(text)) {
        findings.push(finding(`server-routes:debug:${key}`, 'medium', `${key} setzt debug: true`, { detail: file }));
      }
    }

    const vanished = [...known].filter((key) => !routes.includes(key));
    return { findings, notes: [`${routes.length} Routen gefunden`, ...vanished.map((key) => `Route nicht mehr vorhanden: ${key} (aus baseline.config.reviewedRoutes entfernen)`)] };
  },
};
