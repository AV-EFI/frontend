import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';
import { CLAIM_VIEWBOX, LOGO_VIEWBOX } from '~/utils/brandLockup';

interface ManifestSection {
  id: string;
  items?: { id: string; files?: { label: string; path: string }[] }[];
}

const publicPath = (path: string) => resolve(process.cwd(), 'public', path.replace(/^\//, ''));
const manifest = JSON.parse(readFileSync(publicPath('/press/manifest.json'), 'utf8')) as { sections: ManifestSection[] };

const sectionFiles = (sectionId: string, label?: string) => manifest.sections
  .filter((section) => section.id === sectionId)
  .flatMap((section) => section.items ?? [])
  .flatMap((item) => item.files ?? [])
  .filter((file) => !label || file.label === label)
  .map((file) => file.path);

/** Press PNGs must hold up in print; matches the monochrome logo exports. */
const MIN_LOGO_PNG_WIDTH = 1600;

const pngSize = (path: string) => {
  const header = readFileSync(publicPath(path)).subarray(0, 24);
  expect(header.subarray(1, 4).toString('ascii'), `${path} is not a PNG`).toBe('PNG');
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
};

describe('Press kit asset contract', () => {
  test('every file listed in the press manifest exists in public/', () => {
    const paths = manifest.sections.flatMap((section) => sectionFiles(section.id));
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(existsSync(publicPath(path)), path).toBe(true);
    }
  });

  test('logo PNGs are print-sized exports with the logo SVG aspect ratio', () => {
    const pngs = sectionFiles('logos', 'PNG');
    expect(pngs.length).toBeGreaterThan(0);
    for (const path of pngs) {
      const { width, height } = pngSize(path);
      expect(width, path).toBeGreaterThanOrEqual(MIN_LOGO_PNG_WIDTH);
      expect(Math.abs(height - width * LOGO_VIEWBOX.height / LOGO_VIEWBOX.width), path).toBeLessThanOrEqual(1);
    }
  });

  test('claim SVGs are outlined, unspaced and keep the structure the lockup generator relies on', () => {
    const claims = sectionFiles('claims');
    expect(claims.length).toBeGreaterThan(0);
    for (const path of claims) {
      const svg = readFileSync(publicPath(path), 'utf8');
      expect(svg, path).toContain(`viewBox="0 0 ${CLAIM_VIEWBOX.width} ${CLAIM_VIEWBOX.height}"`);
      expect(svg, path).not.toMatch(/<text[\s>]/);
      const letterSpacings = [...svg.matchAll(/letter-spacing:\s*(-?[\d.]+)/g)].map((match) => Number.parseFloat(match[1] ?? ''));
      expect(letterSpacings.filter((value) => value !== 0), `${path} letter-spacing`).toEqual([]);
      for (const id of ['claim-background', 'path1', 'path2']) {
        expect(svg, `${path} #${id}`).toContain(`id="${id}"`);
      }
    }
  });
});
