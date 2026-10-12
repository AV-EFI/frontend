const SAFE_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

/**
 * Returns `value` when it can safely be used as a link target (http, https, mailto or a relative
 * URL), otherwise `undefined`. Blocks `javascript:`, `data:` and similar schemes in backend data.
 */
export function safeHref(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const href = value.trim();
  if (!href) return undefined;
  try {
    // A relative URL resolves against the https base and passes the protocol check.
    return SAFE_LINK_PROTOCOLS.has(new URL(href, 'https://base.invalid').protocol) ? href : undefined;
  } catch {
    return undefined;
  }
}
