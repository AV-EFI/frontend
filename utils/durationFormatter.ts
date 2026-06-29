/** Converts an ISO 8601 duration string (e.g. "PT1H23M45S") to HH:MM:SS display format. */
export function formatDuration(hasValue: string): string {
  try {
    const parts = hasValue
      .replace(/^PT/, '')
      .replace(/H/, ':')
      .replace(/M/, ':')
      .replace(/S/, '')
      .split(':');
    return parts.map(p => p.padStart(2, '0')).join(':');
  } catch {
    return hasValue;
  }
}
