import fs from 'node:fs';
import path from 'node:path';
import { finding, readText, root } from '../lib/context.mjs';

const exists = (file) => fs.existsSync(path.join(root, file));

export default {
  id: 'container-ci',
  title: 'Container, Compose und CI',
  owasp: ['A02', 'A03'],
  devGuide: 'Operations › DevSecOps Guideline',
  async run() {
    const findings = [];

    if (exists('Dockerfile')) {
      const dockerfile = readText('Dockerfile');
      const finalStage = dockerfile.split(/^FROM /m).at(-1);
      if (!/^USER\s+(?!root)/m.test(finalStage)) {
        findings.push(finding('container-ci:dockerfile-user', 'medium', 'Dockerfile: Laufzeit-Stage ohne USER (läuft als root)'));
      }
      if (/yarn set version/.test(dockerfile)) {
        findings.push(finding('container-ci:yarn-set-version', 'low', 'Dockerfile: yarn set version ignoriert packageManager'));
      }
      if (/^FROM\s+\S+:latest\b/m.test(dockerfile)) {
        findings.push(finding('container-ci:image-latest', 'medium', 'Dockerfile: Basis-Image mit Tag latest'));
      }
      if (/curl[^\n|]*\|\s*(?:sh|bash)/.test(dockerfile)) {
        findings.push(finding('container-ci:curl-pipe-shell', 'high', 'Dockerfile: curl | sh'));
      }
    }

    if (exists('.dockerignore')) {
      const ignored = readText('.dockerignore').split('\n').map((line) => line.trim());
      if (!ignored.includes('.git')) findings.push(finding('container-ci:dockerignore-git', 'medium', '.dockerignore schließt .git nicht aus'));
    } else {
      findings.push(finding('container-ci:dockerignore-missing', 'medium', '.dockerignore fehlt'));
    }

    const composeFile = ['docker-compose.tmpl', 'docker-compose.yml'].find(exists);
    if (composeFile) {
      const compose = readText(composeFile);
      if (/privileged:\s*true/.test(compose)) findings.push(finding('container-ci:compose-privileged', 'high', `${composeFile}: privileged: true`));
      if (!/no-new-privileges/.test(compose)) findings.push(finding('container-ci:compose-no-new-privileges', 'low', `${composeFile}: security_opt no-new-privileges fehlt`));
      if (!/cap_drop/.test(compose)) findings.push(finding('container-ci:compose-cap-drop', 'low', `${composeFile}: cap_drop fehlt`));
    }

    if (exists('.gitlab-ci.yml')) {
      const ci = readText('.gitlab-ci.yml');
      if (/docker login(?![^\n]*--password-stdin)[^\n]*(?:-p|--password)\b/.test(ci)) {
        findings.push(finding('container-ci:ci-login-password-arg', 'high', '.gitlab-ci.yml: docker login mit Passwort als Argument'));
      }
      if (/^\s*-\s*echo\s+["']?\$(?:CI_JOB_TOKEN|[A-Z_]*(?:SECRET|PASSWORD|TOKEN)[A-Z_]*)["']?[ \t]*$(?!\n\s*\|)/m.test(ci)) {
        findings.push(finding('container-ci:ci-echo-secret', 'medium', '.gitlab-ci.yml: Secret-Variable wird allein ausgegeben'));
      }
      if (/cat docker-compose\.yml/.test(ci)) {
        findings.push(finding('container-ci:ci-cat-compose', 'low', '.gitlab-ci.yml: gibt die erzeugte docker-compose.yml im Job-Log aus (enthält eingesetzte Variablen)'));
      }
    }
    return { findings, notes: [] };
  },
};
