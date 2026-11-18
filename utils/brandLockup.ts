/**
 * Logo + claim lockup as set on projects.tib.eu/av-efi, measured from that page and expressed in
 * units of the logo cap height (top of "AV" to the logo baseline). The last claim baseline sits on
 * the logo baseline; the pink dot and the "fi" ascenders are not alignment references.
 */
export const LOCKUP_CLAIM_CAP_HEIGHT = 0.395;
export const LOCKUP_CLAIM_LINE_PITCH = 0.536;
/** Horizontal gap from the logo's right ink edge (the dot) to the claim. */
export const LOCKUP_CLAIM_GAP = 0.37;

/** Geometry of the outlined artwork in `public/img`, in each SVG's own viewBox units; identical across all logo colour variants and both claim languages. */
export const LOGO_VIEWBOX = { width: 400, height: 155 } as const;
export const LOGO_CAP_TOP = 40.3;
export const LOGO_BASELINE = 151.9;
/** Right edge of the dot. */
export const LOGO_INK_RIGHT = 398.2;

export const CLAIM_VIEWBOX = { width: 230, height: 105 } as const;
export const CLAIM_CAP_HEIGHT = 15.96;
/** Baselines of the claim artwork's two lines; the line paths are `#path1` and `#path2`. */
export const CLAIM_LINE_BASELINES = [46.527, 75.465] as const;

/** Bree Serif cap height relative to its font size. */
const BREE_CAP_HEIGHT_EM = 0.665;

const LOGO_CAP_HEIGHT = LOGO_BASELINE - LOGO_CAP_TOP;

/** Text claim line height in em that reproduces the lockup's line pitch. */
export const CLAIM_LINE_HEIGHT_EM = LOCKUP_CLAIM_LINE_PITCH / LOCKUP_CLAIM_CAP_HEIGHT * BREE_CAP_HEIGHT_EM;

/** Logo cap height in claim font sizes. */
const LOGO_CAP_PER_CLAIM_EM = BREE_CAP_HEIGHT_EM / LOCKUP_CLAIM_CAP_HEIGHT;

/** Logo width in claim font sizes. */
export const LOGO_WIDTH_PER_CLAIM_EM = LOGO_CAP_PER_CLAIM_EM * LOGO_VIEWBOX.width / LOGO_CAP_HEIGHT;

/** Gap between the logo image's right edge and the claim, in claim font sizes. */
export const CLAIM_GAP_PER_CLAIM_EM = LOCKUP_CLAIM_GAP * LOGO_CAP_PER_CLAIM_EM
  - (LOGO_VIEWBOX.width - LOGO_INK_RIGHT) / LOGO_VIEWBOX.width * LOGO_WIDTH_PER_CLAIM_EM;

/** Part of the logo canvas below the baseline, as a fraction of the logo width. */
export const LOGO_DESCENT_PER_WIDTH = (LOGO_VIEWBOX.height - LOGO_BASELINE) / LOGO_VIEWBOX.width;

/** Splits the claim into its sentences, one per lockup line. */
export const splitClaimLines = (claim: string): string[] => {
  const lines = claim.split(/(?<=\.)\s+/).filter(Boolean);
  return lines.length ? lines : [claim];
};
