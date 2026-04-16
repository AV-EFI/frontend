import { beforeEach, describe, expect, test, vi } from 'vitest';

type TestEvent = {
  node: {
    req: { socket: { remoteAddress: string } };
    res: { statusCode: number };
  };
};

type LogClientResponse = { success: boolean; error?: string };

describe('Internal API: /api/log/client', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('returns 400 contract for invalid payload', async () => {
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({ message: '' }),
      getRequestHeader: vi.fn().mockReturnValue(undefined),
    }));
    vi.doMock('#imports', () => ({
      useNitroApp: () => ({ logger: { error: vi.fn() } }),
    }));

    const handler = (await import('~/server/api/log/client.post')).default as (event: TestEvent) => Promise<LogClientResponse>;
    const event: TestEvent = { node: { req: { socket: { remoteAddress: '127.0.0.1' } }, res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(400);
    expect(result).toEqual({ success: false, error: 'Invalid payload' });
  });

  test('logs validated payload and returns success=true', async () => {
    const loggerErrorMock = vi.fn();
    const getHeaderMock = vi.fn().mockReturnValue('203.0.113.42');

    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({
        message: 'Unhandled error',
        type: 'TypeError',
        url: '/search',
      }),
      getRequestHeader: getHeaderMock,
    }));
    vi.doMock('#imports', () => ({
      useNitroApp: () => ({ logger: { error: loggerErrorMock } }),
    }));

    const handler = (await import('~/server/api/log/client.post')).default as (event: TestEvent) => Promise<LogClientResponse>;
    const event: TestEvent = { node: { req: { socket: { remoteAddress: '127.0.0.1' } }, res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(result).toEqual({ success: true });
    expect(getHeaderMock).toHaveBeenCalledWith(event, 'x-forwarded-for');
    expect(loggerErrorMock).toHaveBeenCalledTimes(1);
    expect(loggerErrorMock.mock.calls[0][0]).toMatchObject({
      message: 'Unhandled error',
      type: 'TypeError',
      ip: '203.0.113.42',
    });
  });
});
