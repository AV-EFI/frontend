import { existsSync, readFileSync } from 'fs';
import { dirname, join, parse } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const publicDir = join(__dirname, '..', 'public');
export const WEBP_QUALITY = 90;

const CARD_WIDTHS = [240, 320, 360, 480, 720];
const HERO_WIDTHS = [480, 720, 1024, 2040];
const VIDEO_POSTER_WIDTHS = [360, 540, 720, 1024, 1280];

const responsiveJob = (input, widths) => {
  const { dir, name, ext } = parse(input);
  const baseOutput = join(dir, name).replace(/\\/g, '/');

  return {
    kind: 'responsive',
    input,
    baseOutput,
    sourceExt: ext,
    outputs: widths.map((width) => ({
      output: `${baseOutput}-${width}.webp`,
      width,
      format: 'webp',
    })),
  };
};

const fixedHeightLogoJob = (input, output, height = 80) => ({
  kind: 'fixed-height',
  input,
  output,
  height,
  format: 'webp',
});

const primaryImageJobs = [
  responsiveJob('img/avefi_nodes-hero.png', HERO_WIDTHS),
  responsiveJob('img/aktiv_im_dok.jpg', CARD_WIDTHS),
  responsiveJob('img/restaur_kurzfilme.jpg', CARD_WIDTHS),
  responsiveJob('img/Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.webp', CARD_WIDTHS),
  responsiveJob('img/avefi_vid_poster.webp', VIDEO_POSTER_WIDTHS),
  responsiveJob('img/schlenker.jpg', CARD_WIDTHS),
  fixedHeightLogoJob('img/logo_mcdci.png', 'img/logo_mcdci.webp'),
];

const issuerImagesJson = join(__dirname, '..', 'data', 'issuer-images.json');

const getIssuerLogoJobs = () => {
  try {
    const issuerData = JSON.parse(readFileSync(issuerImagesJson, 'utf8'));
    const mappings = Object.values(issuerData.mappings ?? {});

    return mappings
      .filter((entry) => typeof entry.image === 'string' && entry.image.startsWith('/img/'))
      .map((entry) => {
        const output = entry.image.replace(/^\//u, '');
        const pngInput = output.replace(/\.webp$/u, '.png');
        const jpgInput = output.replace(/\.webp$/u, '.jpg');
        const input = existsSync(join(publicDir, pngInput))
          ? pngInput
          : jpgInput;

        return fixedHeightLogoJob(input, output);
      });
  } catch (error) {
    console.warn('Could not read issuer-images.json for image manifest:', error.message);
    return [];
  }
};

export const imageJobs = [...primaryImageJobs, ...getIssuerLogoJobs()];

export const staticRuntimeImages = [
  'img/AV-EFI-Logo.svg',
  'img/AV-EFI-Logo-dark.svg',
  'img/AV-EFI-Logo.png',
  'img/AV-EFI-Logo-dark.png',
  'img/avefi_claim_de.svg',
  'img/avefi_claim_en.svg',
  'img/avefi-og-image.png',
  'img/favicon-96x96.png',
  'img/favicon.svg',
  'img/apple-touch-icon.png',
  'img/site.webmanifest',
  'img/DFG.svg',
  'img/gwdg_logo.min.svg',
  'img/avefi_placeholder.webp',
  'img/placeholder-16x9.svg',
  'img/avefi_diamonds_prim_mobile.webp',
  'img/avefi_diamonds_prim_tablet.webp',
  'img/avefi_diamonds_prim_desktop.webp',
  'img/avefi_diamonds_prim_white.webp',
];

const retiredImagePatterns = [
  /^img\/hermann_schlenker(?:-[^.]+)?\.(?:jpg|webp)$/u,
  /^img\/Bundesarchiv_Bild_Leipzig_Capitol_Nacht(?:-[^.]+)?\.(?:jpg|webp)$/u,
  /^img\/avefi_nodes(?:-[0-9]+)?\.(?:jpg|webp)$/u,
  /^img\/avefi_nodes-og(?:-[^.]+)?\.(?:png|jpg|webp)$/u,
  /^img\/mesh(?:-[0-9]+)?\.(?:png|jpg|webp)$/u,
  /^img\/mesh_grey(?:-[0-9]+)?\.(?:png|jpg|webp)$/u,
  /^img\/network_grayscale\.(?:png|webp)$/u,
  /^img\/banner\.jfif$/u,
  /^img\/logo_(?:fmd|hdf|sdk|tib)-h80\.webp$/u,
  /^img\/logo_mcdci-80\.webp$/u,
];

const familyPrefixForJob = (job) => {
  if (job.kind === 'responsive') {
    return job.baseOutput;
  }
  return job.output.replace(/\.webp$/u, '');
};

export const getJobFamilyPrefix = familyPrefixForJob;

export const getDeclaredOutputs = () =>
  imageJobs.flatMap((job) =>
    job.kind === 'responsive'
      ? job.outputs.map((output) => output.output)
      : [job.output]
  );

export const getManagedKeepSet = () => {
  const keepSet = new Set(staticRuntimeImages);

  for (const job of imageJobs) {
    keepSet.add(job.input);

    if (job.kind === 'responsive') {
      keepSet.add(`${job.baseOutput}.webp`);
      for (const output of job.outputs) {
        keepSet.add(output.output);
      }
      continue;
    }

    keepSet.add(job.output);
  }

  return keepSet;
};

export const getManagedFamilyPrefixes = () =>
  Array.from(new Set(imageJobs.map((job) => familyPrefixForJob(job))));

export const isRetiredImagePath = (relPath) =>
  retiredImagePatterns.some((pattern) => pattern.test(relPath));
