import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('Internal API: CMS tooltip mutations', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubGlobal('defineEventHandler', <T>(fn: T) => fn);
    vi.stubGlobal('readBody', vi.fn().mockResolvedValue({}));
  });

  test('PUT /api/cms/usertooltips returns 503 when mutation guard blocks', async () => {
    const guardMock = vi.fn(() => {
      throw { statusCode: 503, statusMessage: 'CMS mutations are disabled' };
    });
    const authMock = vi.fn();

    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({ entries: [] }),
    }));
    vi.doMock('~/server/utils/cmsMutationGuard', () => ({
      requireCmsMutationsEnabled: guardMock,
    }));
    vi.doMock('~/server/utils/requireAuthenticatedUser', () => ({
      requireAuthenticatedUser: authMock,
    }));
    vi.doMock('~/server/utils/userGlossaryStore', () => ({
      readUserGlossary: vi.fn(),
      writeUserGlossary: vi.fn(),
    }));

    const handler = (await import('~/server/api/cms/usertooltips.put')).default as (event: any) => Promise<any>;
    await expect(handler({})).rejects.toMatchObject({ statusCode: 503 });
    expect(guardMock).toHaveBeenCalledTimes(1);
    expect(authMock).not.toHaveBeenCalled();
  });

  test('PUT /api/cms/usertooltips returns 401 when guard passes but auth fails', async () => {
    const guardMock = vi.fn();
    const authMock = vi.fn(async () => {
      throw { statusCode: 401, statusMessage: 'Authentication required' };
    });

    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({ entries: [] }),
    }));
    vi.doMock('~/server/utils/cmsMutationGuard', () => ({
      requireCmsMutationsEnabled: guardMock,
    }));
    vi.doMock('~/server/utils/requireAuthenticatedUser', () => ({
      requireAuthenticatedUser: authMock,
    }));
    vi.doMock('~/server/utils/userGlossaryStore', () => ({
      readUserGlossary: vi.fn(),
      writeUserGlossary: vi.fn(),
    }));

    const handler = (await import('~/server/api/cms/usertooltips.put')).default as (event: any) => Promise<any>;
    await expect(handler({})).rejects.toMatchObject({ statusCode: 401 });
    expect(guardMock).toHaveBeenCalledTimes(1);
    expect(authMock).toHaveBeenCalledTimes(1);
  });

  test('POST /api/cms/usertooltips_seed returns 503 when mutation guard blocks', async () => {
    const guardMock = vi.fn(() => {
      throw { statusCode: 503, statusMessage: 'CMS mutations are disabled' };
    });
    const authMock = vi.fn();

    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({}),
    }));
    vi.doMock('~/server/utils/cmsMutationGuard', () => ({
      requireCmsMutationsEnabled: guardMock,
    }));
    vi.doMock('~/server/utils/requireAuthenticatedUser', () => ({
      requireAuthenticatedUser: authMock,
    }));
    vi.doMock('~/server/utils/userGlossaryStore', () => ({
      readUserGlossary: vi.fn().mockResolvedValue({ entries: {}, updatedAt: null }),
      writeUserGlossary: vi.fn().mockResolvedValue(undefined),
    }));
    vi.doMock('node:fs', () => ({
      promises: {
        readFile: vi.fn().mockResolvedValue('[]'),
      },
    }));

    const handler = (await import('~/server/api/cms/usertooltips_seed.post')).default as (event: any) => Promise<any>;
    await expect(handler({})).rejects.toMatchObject({ statusCode: 503 });
    expect(guardMock).toHaveBeenCalledTimes(1);
    expect(authMock).not.toHaveBeenCalled();
  });

  test('POST /api/cms/usertooltips_seed returns 401 when guard passes but auth fails', async () => {
    const guardMock = vi.fn();
    const authMock = vi.fn(async () => {
      throw { statusCode: 401, statusMessage: 'Authentication required' };
    });

    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({}),
    }));
    vi.doMock('~/server/utils/cmsMutationGuard', () => ({
      requireCmsMutationsEnabled: guardMock,
    }));
    vi.doMock('~/server/utils/requireAuthenticatedUser', () => ({
      requireAuthenticatedUser: authMock,
    }));
    vi.doMock('~/server/utils/userGlossaryStore', () => ({
      readUserGlossary: vi.fn().mockResolvedValue({ entries: {}, updatedAt: null }),
      writeUserGlossary: vi.fn().mockResolvedValue(undefined),
    }));
    vi.doMock('node:fs', () => ({
      promises: {
        readFile: vi.fn().mockResolvedValue('[]'),
      },
    }));

    const handler = (await import('~/server/api/cms/usertooltips_seed.post')).default as (event: any) => Promise<any>;
    await expect(handler({})).rejects.toMatchObject({ statusCode: 401 });
    expect(guardMock).toHaveBeenCalledTimes(1);
    expect(authMock).toHaveBeenCalledTimes(1);
  });
});

