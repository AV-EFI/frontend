import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

type TestEvent = {
  node: {
    res: { statusCode: number };
  };
};

type MailTestResponse = {
  success: boolean;
  error?: string;
  mode?: string;
  warning?: string;
};

describe('Internal API: /api/mail/test', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('stays hidden when MAIL_TEST_TOKEN is not configured', async () => {
    delete process.env.MAIL_TEST_TOKEN;

    const createTransportMock = vi.fn();
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      getHeader: vi.fn().mockReturnValue('secret-token'),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: createTransportMock },
    }));

    const handler = (await import('~/server/api/mail/test.post')).default as (event: TestEvent) => Promise<MailTestResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(404);
    expect(result).toEqual({ success: false, error: 'Not found' });
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  test('requires matching bearer token', async () => {
    process.env.MAIL_TEST_TOKEN = 'secret-token';

    const createTransportMock = vi.fn();
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      getHeader: vi.fn().mockReturnValue('Bearer wrong-token'),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: createTransportMock },
    }));

    const handler = (await import('~/server/api/mail/test.post')).default as (event: TestEvent) => Promise<MailTestResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(404);
    expect(result).toEqual({ success: false, error: 'Not found' });
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  test('falls back to simulated log mode when MAIL_TO_2 is not configured', async () => {
    process.env.MAIL_TEST_TOKEN = 'secret-token';
    delete process.env.MAIL_TO_2;

    const createTransportMock = vi.fn();
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      getHeader: vi.fn((_: TestEvent, name: string) => name === 'authorization' ? 'Bearer secret-token' : undefined),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: createTransportMock },
    }));

    const handler = (await import('~/server/api/mail/test.post')).default as (event: TestEvent) => Promise<MailTestResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(200);
    expect(result).toEqual({ success: true, mode: 'simulated' });
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  test('returns success in log mode without sending mail', async () => {
    process.env.MAIL_TEST_TOKEN = 'secret-token';
    process.env.MAIL_TO_2 = 'secondary@example.org';
    process.env.NUXT_BUILD_PROFILE = 'local';

    const createTransportMock = vi.fn();
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      getHeader: vi.fn((_: TestEvent, name: string) => name === 'authorization' ? 'Bearer secret-token' : undefined),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: createTransportMock },
    }));

    const handler = (await import('~/server/api/mail/test.post')).default as (event: TestEvent) => Promise<MailTestResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(200);
    expect(result).toEqual({ success: true, mode: 'log' });
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  test('sends smtp mail only to MAIL_TO_2', async () => {
    process.env.MAIL_TEST_TOKEN = 'secret-token';
    process.env.MAIL_DELIVERY_MODE = 'smtp';
    process.env.MAIL_HOST = 'mailer.gwdg.de';
    process.env.MAIL_PORT = '25';
    process.env.MAIL_FROM = 'noreply@example.org';
    process.env.MAIL_TO = 'primary@example.org';
    process.env.MAIL_TO_2 = 'secondary@example.org';
    delete process.env.MAIL_USER;
    delete process.env.MAIL_PASSWORD;

    const verifyMock = vi.fn().mockResolvedValue(undefined);
    const sendMailMock = vi.fn().mockResolvedValue(undefined);
    const createTransportMock = vi.fn().mockReturnValue({
      verify: verifyMock,
      sendMail: sendMailMock,
    });

    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      getHeader: vi.fn((_: TestEvent, name: string) => name === 'authorization' ? 'Bearer secret-token' : undefined),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: createTransportMock },
    }));

    const handler = (await import('~/server/api/mail/test.post')).default as (event: TestEvent) => Promise<MailTestResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(200);
    expect(result).toEqual({ success: true, mode: 'sent' });
    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock.mock.calls[0]?.[0]).toMatchObject({
      from: 'noreply@example.org',
      to: 'secondary@example.org',
    });
    expect(sendMailMock.mock.calls[0]?.[0]).not.toHaveProperty('bcc');
    expect(sendMailMock.mock.calls[0]?.[0]).not.toHaveProperty('cc');
    expect(JSON.stringify(sendMailMock.mock.calls[0]?.[0])).not.toContain('primary@example.org');
  });

  test('falls back to simulated mode when smtp delivery fails', async () => {
    process.env.MAIL_TEST_TOKEN = 'secret-token';
    process.env.MAIL_DELIVERY_MODE = 'smtp';
    process.env.MAIL_HOST = 'mailer.gwdg.de';
    process.env.MAIL_PORT = '25';
    process.env.MAIL_FROM = 'noreply@example.org';
    process.env.MAIL_TO = 'primary@example.org';
    process.env.MAIL_TO_2 = 'secondary@example.org';
    delete process.env.MAIL_USER;
    delete process.env.MAIL_PASSWORD;

    const verifyMock = vi.fn().mockResolvedValue(undefined);
    const sendMailMock = vi.fn().mockRejectedValue(new Error('relay unavailable'));
    const createTransportMock = vi.fn().mockReturnValue({
      verify: verifyMock,
      sendMail: sendMailMock,
    });

    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      getHeader: vi.fn((_: TestEvent, name: string) => name === 'authorization' ? 'Bearer secret-token' : undefined),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: createTransportMock },
    }));

    const handler = (await import('~/server/api/mail/test.post')).default as (event: TestEvent) => Promise<MailTestResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(200);
    expect(result).toMatchObject({
      success: true,
      mode: 'simulated',
      warning: 'Mailer error',
      diagnostics: {
        host: 'mailer.gwdg.de',
        port: 25,
      },
      failure: {
        message: 'relay unavailable',
      },
    });
    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock.mock.calls[0]?.[0]).toMatchObject({
      from: 'noreply@example.org',
      to: 'secondary@example.org',
    });
    expect(JSON.stringify(sendMailMock.mock.calls[0]?.[0])).not.toContain('primary@example.org');
  });
});
