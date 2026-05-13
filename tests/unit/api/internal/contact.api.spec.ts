import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

type TestEvent = {
  node: {
    res: { statusCode: number };
  };
};

type ContactResponse = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, unknown>;
};

describe('Internal API: /api/mail/contact', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('returns 400 validation contract for invalid payload', async () => {
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({ email: 'not-an-email', message: 'x' }),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: vi.fn() },
    }));

    const handler = (await import('~/server/api/mail/contact.post')).default as (event: TestEvent) => Promise<ContactResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid payload');
    expect(result.fieldErrors).toBeTypeOf('object');
  });

  test('returns success in log mode for local/testbed profiles', async () => {
    process.env.NUXT_BUILD_PROFILE = 'local';
    delete process.env.MAIL_USER;
    delete process.env.MAIL_PASSWORD;
    process.env.MAIL_HOST = 'smtp.gmail.com';
    process.env.MAIL_PORT = '587';

    const createTransportMock = vi.fn();
    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({ email: 'user@example.org', message: 'hello world message' }),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: createTransportMock },
    }));

    const handler = (await import('~/server/api/mail/contact.post')).default as (event: TestEvent) => Promise<ContactResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(200);
    expect(result).toMatchObject({ success: true, mode: 'log' });
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  test('uses smtp without auth when credentials are not provided in smtp mode', async () => {
    process.env.MAIL_DELIVERY_MODE = 'smtp';
    process.env.MAIL_HOST = 'smtp.gmail.com';
    process.env.MAIL_PORT = '587';
    process.env.MAIL_FROM = 'noreply@example.org';
    process.env.MAIL_TO = 'team@example.org';
    process.env.MAIL_REQUIRE_TLS = 'false';
    delete process.env.NUXT_NODEMAILER_REQUIRE_TLS;
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
      readBody: vi.fn().mockResolvedValue({ email: 'user@example.org', message: 'hello world message' }),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: createTransportMock },
    }));

    const handler = (await import('~/server/api/mail/contact.post')).default as (event: TestEvent) => Promise<ContactResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(result).toEqual({ success: true });
    expect(createTransportMock).toHaveBeenCalledTimes(1);
    expect(createTransportMock.mock.calls[0]?.[0]).toMatchObject({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: false,
    });
    expect(createTransportMock.mock.calls[0]?.[0]?.auth).toBeUndefined();
    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  test('uses NUXT_NODEMAILER fallback config when MAIL_* transport keys are unset', async () => {
    process.env.MAIL_DELIVERY_MODE = 'smtp';
    delete process.env.MAIL_HOST;
    delete process.env.MAIL_PORT;
    delete process.env.MAIL_SECURE;
    delete process.env.MAIL_REQUIRE_TLS;
    delete process.env.MAIL_FROM;
    process.env.NUXT_NODEMAILER_HOST = 'smtp.example.org';
    process.env.NUXT_NODEMAILER_PORT = '587';
    process.env.NUXT_NODEMAILER_SECURE = 'false';
    process.env.NUXT_NODEMAILER_REQUIRE_TLS = 'true';
    process.env.NUXT_NODEMAILER_FROM = 'AVefi Mailer <noreply@example.org>';
    process.env.MAIL_TO = 'team@example.org';
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
      readBody: vi.fn().mockResolvedValue({ email: 'user@example.org', message: 'hello world message' }),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: createTransportMock },
    }));

    const handler = (await import('~/server/api/mail/contact.post')).default as (event: TestEvent) => Promise<ContactResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(result).toEqual({ success: true });
    expect(createTransportMock.mock.calls[0]?.[0]).toMatchObject({
      host: 'smtp.example.org',
      port: 587,
      secure: false,
      requireTLS: true,
    });
    expect(sendMailMock.mock.calls[0]?.[0]).toMatchObject({
      from: 'AVefi Mailer <noreply@example.org>',
      to: 'team@example.org',
    });
  });

  test('enables requireTLS when MAIL_REQUIRE_TLS is explicitly set', async () => {
    process.env.MAIL_DELIVERY_MODE = 'smtp';
    process.env.MAIL_HOST = 'smtp.gmail.com';
    process.env.MAIL_PORT = '587';
    process.env.MAIL_FROM = 'noreply@example.org';
    process.env.MAIL_TO = 'team@example.org';
    process.env.MAIL_REQUIRE_TLS = 'true';
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
      readBody: vi.fn().mockResolvedValue({ email: 'user@example.org', message: 'hello world message' }),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: createTransportMock },
    }));

    const handler = (await import('~/server/api/mail/contact.post')).default as (event: TestEvent) => Promise<ContactResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(result).toEqual({ success: true });
    expect(createTransportMock).toHaveBeenCalledTimes(1);
    expect(createTransportMock.mock.calls[0]?.[0]).toMatchObject({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
    });
    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  test('returns success=true after transporter verify + sendMail', async () => {
    process.env.MAIL_USER = 'smtp-user';
    process.env.MAIL_PASSWORD = 'smtp-pass';
    process.env.MAIL_FROM = 'noreply@example.org';
    process.env.MAIL_TO = 'team@example.org';

    const verifyMock = vi.fn().mockResolvedValue(undefined);
    const sendMailMock = vi.fn().mockResolvedValue(undefined);
    const createTransportMock = vi.fn().mockReturnValue({
      verify: verifyMock,
      sendMail: sendMailMock,
    });

    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({ email: 'user@example.org', message: 'hello world message' }),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: createTransportMock },
    }));

    const handler = (await import('~/server/api/mail/contact.post')).default as (event: TestEvent) => Promise<ContactResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(result).toEqual({ success: true });
    expect(createTransportMock).toHaveBeenCalledTimes(1);
    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });
});
