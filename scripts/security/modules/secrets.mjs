import { finding, lineOf, readText, trackedFiles } from '../lib/context.mjs';

const PATTERNS = [
  { key: 'private-key', regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/g, label: 'privater Schlüssel' },
  { key: 'aws-access-key', regex: /\bAKIA[0-9A-Z]{16}\b/g, label: 'AWS-Access-Key' },
  { key: 'gitlab-token', regex: /\bglpat-[0-9A-Za-z_-]{20,}\b/g, label: 'GitLab-Token' },
  { key: 'github-token', regex: /\b(?:ghp|gho|ghs|ghu|github_pat)_[0-9A-Za-z_]{30,}\b/g, label: 'GitHub-Token' },
  { key: 'slack-token', regex: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g, label: 'Slack-Token' },
  {
    key: 'hardcoded-credential',
    regex: /\b(?:api[_-]?key|secret|passw(?:or)?d|token)\w*['"]?\s*[:=]\s*['"][^'"\s${}]{16,}['"]/gi,
    label: 'fest eingetragener Zugangswert',
  },
];

const PLACEHOLDER_VALUE = /^(?:\$\{?[A-Z0-9_]+\}?|your[-_\w]*|change[-_\w]*|example[-_\w]*|<[^>]*>|x{3,})$/i;
const SKIP_PREFIXES = ['yarn.lock', 'public/', 'models/interfaces/', 'server/assets/vocab/', 'assets/data/', 'data/', 'logs/'];
const TEXT_EXTENSIONS = ['.ts', '.mjs', '.js', '.vue', '.json', '.yml', '.yaml', '.tmpl', '.md', '.sh', '.env', '.example', 'Dockerfile'];

export default {
  id: 'secrets',
  title: 'Secrets im Repository',
  owasp: ['A04', 'A02'],
  devGuide: 'Implementation › Secure Libraries / WrongSecrets',
  async run() {
    const findings = [];
    const tracked = trackedFiles({ exclude: SKIP_PREFIXES });

    for (const file of tracked.filter((name) => /(^|\/)\.env(\.|$)/.test(name) && !/\.(tmpl|example)$/.test(name))) {
      const realValues = readText(file)
        .split(/\n/)
        .map((line) => line.match(/^([A-Z0-9_]*(?:SECRET|PASSWORD|API_?KEY|TOKEN)[A-Z0-9_]*)=(.*)$/))
        .filter((match) => match && match[2].trim() && !PLACEHOLDER_VALUE.test(match[2].trim()));
      for (const match of realValues) {
        // Only the key name is reported, never the value.
        findings.push(finding(`secrets:tracked-env:${file}:${match[1]}`, 'high', `Versionierte Env-Datei ${file} enthält einen Wert für ${match[1]}, der kein Platzhalter ist`));
      }
    }

    for (const file of tracked.filter((name) => TEXT_EXTENSIONS.some((ext) => name.endsWith(ext)))) {
      const text = readText(file);
      for (const { key, regex, label } of PATTERNS) {
        regex.lastIndex = 0;
        for (const match of text.matchAll(regex)) {
          // Never print the matched value, only where it is.
          findings.push(
            finding(`secrets:${key}:${file}:${lineOf(text, match.index)}`, key === 'hardcoded-credential' ? 'medium' : 'high', `${label} in ${file}`, {
              detail: `Zeile ${lineOf(text, match.index)}`,
            }),
          );
        }
      }
    }
    return { findings, notes: [`${tracked.length} versionierte Dateien geprüft`] };
  },
};
