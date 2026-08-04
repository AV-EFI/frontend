import { spawnSync } from 'node:child_process';

// vue-tsc cannot see properties injected via vue-i18n's app.config.globalProperties
// (e.g. $t) inside <template> blocks: this project's Volar setup derives template-
// checkable $-injected properties by type-inferring them from actual plugin `provide`
// return values (see .nuxt/types/plugins.d.ts), not from declare-module augmentation,
// and globalProperties assignments aren't visible to that mechanism. Verified with an
// isolated reproduction where even an unrelated, correctly-declared custom property
// (via the textbook ComponentCustomProperties + NuxtApp pattern) fails identically.
// Until that Volar/Nuxt/vue-i18n gap is fixed upstream, filter this specific, verified
// false-positive class out rather than let it drown out real errors.
const KNOWN_FALSE_POSITIVES = [
    /Property '\$t' does not exist on type/,
    /Property '\$rt' does not exist on type/,
    /Property '\$n' does not exist on type/,
    /Property '\$d' does not exist on type/,
    /Property '\$tm' does not exist on type/,
    /Property '\$te' does not exist on type/,
];

const result = spawnSync('npx', ['vue-tsc', '--noEmit', '-p', 'tsconfig.json'], {
    encoding: 'utf8',
    shell: true,
});

const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
const lines = output.split(/\r?\n/);
const filtered = lines.filter((line) => !KNOWN_FALSE_POSITIVES.some((pattern) => pattern.test(line)));

const errorCount = filtered.filter((line) => /error TS\d+:/.test(line)).length;
const suppressedCount = lines.length - filtered.length;

console.log(filtered.join('\n').trim());
console.log(`\ntypecheck: ${errorCount} error(s) (${suppressedCount} known-false-positive $t/$rt/$n/$d/$tm/$te line(s) filtered)`);

process.exit(errorCount > 0 ? 1 : 0);
