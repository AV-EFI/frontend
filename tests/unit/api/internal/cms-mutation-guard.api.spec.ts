import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('CMS mutation guard', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('throws 503 when CMS mutations are disabled', async () => {
    vi.doMock('h3', () => ({
      createError: (payload: any) => payload,
      getRequestHeader: vi.fn(),
      getRequestURL: vi.fn().mockReturnValue(new URL('https://testbed.av-efi.net/admin/user_tooltips')),
    }));
    vi.stubGlobal('useRuntimeConfig', () => ({
      private: {
        CMS_MUTATIONS_ENABLED: 'false',
        CMS_MUTATION_ORIGIN_ALLOWLIST: '',
      },
    }));

    const { requireCmsMutationsEnabled } = await import('~/server/utils/cmsMutationGuard');

    expect(() => requireCmsMutationsEnabled({} as any)).toThrowError(
      expect.objectContaining({ statusCode: 503 }),
    );
  });

  test('allows valid same-origin request when enabled', async () => {
    const getHeaderMock = vi.fn((_: unknown, name: string) => {
      if (name === 'origin') return 'https://testbed.av-efi.net';
      return undefined;
    });

    vi.doMock('h3', () => ({
      createError: (payload: any) => payload,
      getRequestHeader: getHeaderMock,
      getRequestURL: vi.fn().mockReturnValue(new URL('https://testbed.av-efi.net/admin/user_tooltips')),
    }));
    vi.stubGlobal('useRuntimeConfig', () => ({
      private: {
        CMS_MUTATIONS_ENABLED: 'true',
        CMS_MUTATION_ORIGIN_ALLOWLIST: '',
      },
    }));

    const { requireCmsMutationsEnabled } = await import('~/server/utils/cmsMutationGuard');
    expect(() => requireCmsMutationsEnabled({} as any)).not.toThrow();
  });

  test('throws 403 for invalid origin when enabled', async () => {
    const getHeaderMock = vi.fn((_: unknown, name: string) => {
      if (name === 'origin') return 'https://evil.example';
      return undefined;
    });

    vi.doMock('h3', () => ({
      createError: (payload: any) => payload,
      getRequestHeader: getHeaderMock,
      getRequestURL: vi.fn().mockReturnValue(new URL('https://testbed.av-efi.net/admin/user_tooltips')),
    }));
    vi.stubGlobal('useRuntimeConfig', () => ({
      private: {
        CMS_MUTATIONS_ENABLED: 'true',
        CMS_MUTATION_ORIGIN_ALLOWLIST: '',
      },
    }));

    const { requireCmsMutationsEnabled } = await import('~/server/utils/cmsMutationGuard');

    expect(() => requireCmsMutationsEnabled({} as any)).toThrowError(
      expect.objectContaining({ statusCode: 403, statusMessage: 'Invalid request origin' }),
    );
  });

  test('allows referer from allowlist when origin header is missing', async () => {
    const getHeaderMock = vi.fn((_: unknown, name: string) => {
      if (name === 'referer') return 'https://cms-admin.example/internal';
      return undefined;
    });

    vi.doMock('h3', () => ({
      createError: (payload: any) => payload,
      getRequestHeader: getHeaderMock,
      getRequestURL: vi.fn().mockReturnValue(new URL('https://testbed.av-efi.net/admin/user_tooltips')),
    }));
    vi.stubGlobal('useRuntimeConfig', () => ({
      private: {
        CMS_MUTATIONS_ENABLED: 'true',
        CMS_MUTATION_ORIGIN_ALLOWLIST: 'https://cms-admin.example',
      },
    }));

    const { requireCmsMutationsEnabled } = await import('~/server/utils/cmsMutationGuard');
    expect(() => requireCmsMutationsEnabled({} as any)).not.toThrow();
  });
});

