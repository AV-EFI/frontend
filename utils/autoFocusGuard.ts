/**
 * Programmatic autofocus must not steal focus from a user who has already started
 * navigating by keyboard (e.g. is tabbing through the header while the page hydrates).
 */
export function canAutoFocus(): boolean {
  if (typeof document === 'undefined') return false;
  const active = document.activeElement;
  return !active || active === document.body || active === document.documentElement;
}
