import type { H3Event } from 'h3';

const IP_ADDRESS_PATTERN = /^[0-9a-fA-F:.]{2,45}$/;

/**
 * Client address for rate limits and logs. The app only listens behind the reverse proxy, which
 * appends the peer address it saw as the last `X-Forwarded-For` entry. Earlier entries are
 * client-controlled and therefore ignored. Anything that is not an IP literal is reported as
 * `unknown` so header values cannot reach logs or rate-limit keys.
 */
export function getClientIp(event: H3Event): string {
  const req = event.node?.req;
  const forwarded = req?.headers?.['x-forwarded-for'];
  const forwardedList = Array.isArray(forwarded) ? forwarded.join(',') : forwarded;
  const candidate = forwardedList?.split(',').pop()?.trim() || req?.socket?.remoteAddress || '';
  return IP_ADDRESS_PATTERN.test(candidate) ? candidate : 'unknown';
}
