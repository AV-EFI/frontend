import { beforeEach, describe, expect, test, vi } from 'vitest';

const setResponseStatusMock = vi.hoisted(() => vi.fn());

vi.mock('h3', () => ({
  defineEventHandler: (handler: unknown) => handler,
  getRequestURL: (event: { url: string }) => new URL(event.url, 'http://localhost:8080'),
  setResponseStatus: setResponseStatusMock,
}));

async function importMiddleware() {
  vi.resetModules();
  return (await import('~/server/middleware/404-status')).default as unknown as (event: { url: string }) => void;
}

describe('404 status middleware', () => {
  beforeEach(() => {
    setResponseStatusMock.mockReset();
  });

  test('does not mark the normdata route as 404', async () => {
    const middleware = await importMiddleware();

    middleware({ url: '/normdata?field=has_genre&page=3' });

    expect(setResponseStatusMock).not.toHaveBeenCalled();
  });

  test('still marks unknown app routes as 404', async () => {
    const middleware = await importMiddleware();

    middleware({ url: '/definitely-missing' });

    expect(setResponseStatusMock).toHaveBeenCalledWith({ url: '/definitely-missing' }, 404);
  });
});
