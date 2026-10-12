import { describe, expect, test } from 'vitest';
import { applyBaseline } from '~/scripts/security/lib/baseline.mjs';

type Finding = { id: string; severity: string; title: string };

const finding = (id: string): Finding => ({ id, severity: 'high', title: id });

const baseline = {
  lastReview: '2026-10-12',
  config: {},
  entries: [
    { id: 'dependencies:braces', status: 'accepted', reason: 'kein Fix', reviewBy: '2027-01-12' },
    { id: 'dependencies:old', status: 'accepted', reason: 'abgelaufen', reviewBy: '2026-01-01' },
    { id: 'live-headers:*:referrer-policy', status: 'tracked', reason: 'Entscheidung offen', ref: 'Issue 250' },
    { id: 'dependencies:gone', status: 'accepted', reason: 'nicht mehr vorhanden', reviewBy: '2027-01-12' },
  ],
};

describe('security baseline', () => {
  const result = applyBaseline(
    [finding('dependencies:braces'), finding('dependencies:old'), finding('live-headers:www.av-efi.net:referrer-policy'), finding('xss-sinks:new')],
    baseline,
    '2026-10-12',
  );

  test('keeps documented exceptions out of the open list', () => {
    expect(result.accepted.map((item: Finding) => item.id)).toEqual(['dependencies:braces']);
  });

  test('reports expired acceptances again', () => {
    expect(result.expired.map((item: Finding) => item.id)).toEqual(['dependencies:old']);
  });

  test('matches wildcard entries as tracked', () => {
    expect(result.tracked.map((item: Finding) => item.id)).toEqual(['live-headers:www.av-efi.net:referrer-policy']);
  });

  test('leaves unknown findings open', () => {
    expect(result.open.map((item: Finding) => item.id)).toEqual(['xss-sinks:new']);
  });

  test('lists baseline entries without a matching finding as stale', () => {
    expect(result.stale.map((entry: { id: string }) => entry.id)).toEqual(['dependencies:gone']);
  });
});
