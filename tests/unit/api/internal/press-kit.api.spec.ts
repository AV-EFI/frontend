import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('Internal API: /api/press-kit.zip', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('HEAD request returns 200 with headers and empty body', async () => {
    const setHeaderMock = vi.fn();
    const setResponseStatusMock = vi.fn();
    const readFileMock = vi.fn().mockResolvedValue(
      JSON.stringify({
        sections: [{ items: [{ files: [{ path: '/press/logo.svg' }] }] }],
      })
    );
    const accessMock = vi.fn().mockResolvedValue(undefined);

    vi.doMock('h3', () => ({
      defineEventHandler: (fn: any) => fn,
      setHeader: setHeaderMock,
      setResponseStatus: setResponseStatusMock,
      createError: (payload: any) => payload,
    }));
    vi.doMock('node:fs', () => ({
      promises: {
        readFile: readFileMock,
        access: accessMock,
      },
    }));
    vi.doMock('jszip', () => ({
      default: class MockZip {
        file() {}
        async generateAsync() {
          return Buffer.from('zip');
        }
      },
    }));

    const handler = (await import('~/server/api/press-kit.zip.get')).default as (event: any) => Promise<any>;
    const result = await handler({ method: 'HEAD' });

    expect(result).toBe('');
    expect(setResponseStatusMock).toHaveBeenCalledWith({ method: 'HEAD' }, 200);
    expect(setHeaderMock).toHaveBeenCalledWith({ method: 'HEAD' }, 'Content-Type', 'application/zip');
    expect(setHeaderMock).toHaveBeenCalledWith(
      { method: 'HEAD' },
      'Content-Disposition',
      'attachment; filename="AVefi_PressKit.zip"'
    );
  });

  test('GET assembles zip when manifest assets exist', async () => {
    const readFileMock = vi.fn((path: string, encoding?: string) => {
      if (String(path).includes('manifest.json')) {
        return Promise.resolve(
          JSON.stringify({
            sections: [{ items: [{ files: [{ path: '/press/logo.svg' }, { path: '/press/hero.png' }] }] }],
          })
        );
      }
      if (!encoding) {
        return Promise.resolve(Buffer.from('asset'));
      }
      return Promise.reject(new Error('unexpected read'));
    });
    const accessMock = vi.fn().mockResolvedValue(undefined);
    const zippedBuffer = Buffer.from('zipped-content');
    const fileMock = vi.fn();
    const generateAsyncMock = vi.fn().mockResolvedValue(zippedBuffer);

    vi.doMock('h3', () => ({
      defineEventHandler: (fn: any) => fn,
      setHeader: vi.fn(),
      setResponseStatus: vi.fn(),
      createError: (payload: any) => payload,
    }));
    vi.doMock('node:fs', () => ({
      promises: {
        readFile: readFileMock,
        access: accessMock,
      },
    }));
    vi.doMock('jszip', () => ({
      default: class MockZip {
        file = fileMock;
        generateAsync = generateAsyncMock;
      },
    }));

    const handler = (await import('~/server/api/press-kit.zip.get')).default as (event: any) => Promise<any>;
    const result = await handler({ method: 'GET' });

    expect(accessMock).toHaveBeenCalled();
    expect(fileMock).toHaveBeenCalledTimes(2);
    expect(generateAsyncMock).toHaveBeenCalledTimes(1);
    expect(result).toBe(zippedBuffer);
  });

  test('throws 500 when manifest references missing asset', async () => {
    const readFileMock = vi.fn().mockResolvedValue(
      JSON.stringify({
        sections: [{ items: [{ files: [{ path: '/press/missing.png' }] }] }],
      })
    );
    const accessMock = vi.fn().mockRejectedValue(new Error('missing'));

    vi.doMock('h3', () => ({
      defineEventHandler: (fn: any) => fn,
      setHeader: vi.fn(),
      setResponseStatus: vi.fn(),
      createError: (payload: any) => payload,
    }));
    vi.doMock('node:fs', () => ({
      promises: {
        readFile: readFileMock,
        access: accessMock,
      },
    }));
    vi.doMock('jszip', () => ({
      default: class MockZip {
        file() {}
        async generateAsync() {
          return Buffer.from('zip');
        }
      },
    }));

    const handler = (await import('~/server/api/press-kit.zip.get')).default as (event: any) => Promise<any>;
    await expect(handler({ method: 'GET' })).rejects.toMatchObject({
      statusCode: 500,
    });
  });
});
