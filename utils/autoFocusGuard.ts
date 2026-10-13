export const SKIP_LINK_ID = 'skip-to-content';

/**
 * Programmatic autofocus must not steal focus from a user who has already started
 * navigating by keyboard (e.g. is tabbing through the header while the page hydrates).
 * The skip link is the first tab stop, so focus resting on it still counts as "not started yet".
 */
export function canAutoFocus(): boolean {
  if (typeof document === 'undefined') return false;
  const active = document.activeElement;
  return !active
    || active === document.body
    || active === document.documentElement
    || active.id === SKIP_LINK_ID;
}
