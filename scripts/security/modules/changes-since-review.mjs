import { finding, run } from '../lib/context.mjs';

const SENSITIVE_PATHS = [
  'server/',
  'plugins/',
  'middleware/',
  'utils/auth/',
  'nuxt.config.ts',
  'Dockerfile',
  '.dockerignore',
  'docker-compose.tmpl',
  '.gitlab-ci.yml',
  '.env.tmpl',
  'package.json',
  'yarn.lock',
];

export default {
  id: 'changes-since-review',
  title: 'Sicherheitsrelevante Änderungen seit dem letzten Review',
  owasp: ['A06', 'A08'],
  devGuide: 'Design › Threat modeling',
  async run({ baseline }) {
    const since = baseline.lastReview;
    const { stdout } = run('git', ['log', `--since=${since}`, '--no-merges', '--format=%h %ad %s', '--date=short', '--', ...SENSITIVE_PATHS], { shell: false });
    const commits = stdout.split('\n').filter(Boolean);
    const findings = commits.length
      ? [finding('changes-since-review:commits', 'info', `${commits.length} Commit(s) seit ${since} berühren sicherheitsrelevante Pfade`, { detail: commits.slice(0, 40).join('\n') })]
      : [];
    return { findings, notes: [`letzter Review: ${since}`] };
  },
};
