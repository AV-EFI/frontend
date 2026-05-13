import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

type TestEvent = {
  node: {
    res: { statusCode: number };
  };
};

type SmtpCheckResponse = {
  success: boolean;
  error?: string;
  mode?: string;
  diagnostics?: Record<string, unknown>;
  failure?: Record<string, unknown>;
};

describe('Internal API: /api/mail/smtp-check', () => {
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

    const handler = (await import('~/server/api/mail/smtp-check.post')).default as (event: TestEvent) => Promise<SmtpCheckResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(404);
    expect(result).toEqual({ success: false, error: 'Not found' });
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  test('verifies smtp connection without sending mail', async () => {
    process.env.MAIL_TEST_TOKEN = 'secret-token';
    process.env.MAIL_DELIVERY_MODE = 'smtp';
    process.env.MAIL_HOST = 'smtp.gmail.com';
    process.env.MAIL_PORT = '587';
    process.env.MAIL_FROM = 'noreply@example.org';
    process.env.MAIL_TO = 'team@example.org';

    const verifyMock = vi.fn().mockResolvedValue(undefined);
    const sendMailMock = vi.fn();
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

    const handler = (await import('~/server/api/mail/smtp-check.post')).default as (event: TestEvent) => Promise<SmtpCheckResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(200);
    expect(result).toMatchObject({ success: true, mode: 'verified' });
    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  test('returns smtp diagnostics when verify fails', async () => {
    process.env.MAIL_TEST_TOKEN = 'secret-token';
    process.env.MAIL_DELIVERY_MODE = 'smtp';
    process.env.MAIL_HOST = 'smtp.gmail.com';
    process.env.MAIL_PORT = '587';
    process.env.MAIL_FROM = 'noreply@example.org';
    process.env.MAIL_TO = 'team@example.org';

    const verifyError = Object.assign(new Error('connect denied'), {
      code: 'ECONNECTION',
      command: 'CONN',
    });
    const verifyMock = vi.fn().mockRejectedValue(verifyError);
    const sendMailMock = vi.fn();
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

    const handler = (await import('~/server/api/mail/smtp-check.post')).default as (event: TestEvent) => Promise<SmtpCheckResponse>;
    const event: TestEvent = { node: { res: { statusCode: 200 } } };
    const result = await handler(event);

    expect(event.node.res.statusCode).toBe(502);
    expect(result).toMatchObject({
      success: false,
      mode: 'failed',
      error: 'SMTP verify failed',
      failure: {
        code: 'ECONNECTION',
        command: 'CONN',
      },
    });
    expect(sendMailMock).not.toHaveBeenCalled();
  });
});
