const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
};

const ALLOWED_HIGHLIGHT_TAG = /&lt;(\/?)(mark|em)&gt;/gi;
const REGEX_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]!);
}

/**
 * Prepares search highlight output for `v-html`: everything is escaped and only the
 * attribute-free tags `<mark>` and `<em>` are restored.
 */
export function sanitizeHighlightHtml(value: string): string {
  return escapeHtml(value).replace(ALLOWED_HIGHLIGHT_TAG, '<$1$2>');
}

/**
 * Escapes `text` for `v-html` and wraps every case-insensitive occurrence of `query` in `<mark>`.
 */
export function markMatches(text: string, query: string): string {
  const needle = query.trim();
  if (!needle || !text) return escapeHtml(text);

  const pattern = new RegExp(`(${needle.replace(REGEX_SPECIAL_CHARS, '\\$&')})`, 'gi');
  // split() with one capture group puts the matches at the odd indexes
  return text
    .split(pattern)
    .map((part, index) => (index % 2 === 1 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
    .join('');
}
