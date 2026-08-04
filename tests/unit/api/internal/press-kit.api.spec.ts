import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { H3Event } from 'h3';

type MockCreateErrorPayload = { statusCode: number; statusMessage: string };
type PressKitHandler = (event: H3Event) => Promise<unknown>;

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
      defineEventHandler: <T>(fn: T) => fn,
      setHeader: setHeaderMock,
      setResponseStatus: setResponseStatusMock,
      createError: (payload: MockCreateErrorPayload) => payload,
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

    const handler = (await import('~/server/api/press-kit.zip.get')).default as PressKitHandler;
    const result = await handler({ method: 'HEAD' } as unknown as H3Event);

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
      defineEventHandler: <T>(fn: T) => fn,
      setHeader: vi.fn(),
      setResponseStatus: vi.fn(),
      createError: (payload: MockCreateErrorPayload) => payload,
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

    const handler = (await import('~/server/api/press-kit.zip.get')).default as PressKitHandler;
    const result = await handler({ method: 'GET' } as unknown as H3Event);

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
      defineEventHandler: <T>(fn: T) => fn,
      setHeader: vi.fn(),
      setResponseStatus: vi.fn(),
      createError: (payload: MockCreateErrorPayload) => payload,
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

    const handler = (await import('~/server/api/press-kit.zip.get')).default as PressKitHandler;
    await expect(handler({ method: 'GET' } as unknown as H3Event)).rejects.toMatchObject({
      statusCode: 500,
    });
  });
});
