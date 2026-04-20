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

  test('returns 500 when smtp credentials are missing', async () => {
    delete process.env.MAIL_USER;
    delete process.env.MAIL_PASSWORD;

    vi.doMock('h3', () => ({
      defineEventHandler: <T>(fn: T) => fn,
      readBody: vi.fn().mockResolvedValue({ email: 'user@example.org', message: 'hello world message' }),
    }));
    vi.doMock('nodemailer', () => ({
      default: { createTransport: vi.fn() },
    }));

    const handler = (await import('~/server/api/mail/contact.post')).default as (event: TestEvent) => Promise<ContactResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(500);
    expect(result).toEqual({
      success: false,
      error: 'SMTP env missing (MAIL_USER/MAIL_PASSWORD)',
    });
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
