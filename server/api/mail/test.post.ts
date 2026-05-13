import { defineEventHandler, getHeader } from 'h3';
import type { H3Event } from 'h3';
import nodemailer from 'nodemailer';

export default defineEventHandler(async (event) => {
  const expectedToken = process.env.MAIL_TEST_TOKEN;
  const providedToken = getBearerToken(event) || getHeader(event, 'x-mail-test-token');

  if (!expectedToken || providedToken !== expectedToken) {
    event.node.res.statusCode = 404;
    return { success: false, error: 'Not found' };
  }

  const deliveryMode = resolveDeliveryMode();
  const host = process.env.MAIL_HOST || 'mailer.gwdg.de';
  const port = Number(process.env.MAIL_PORT || 25);
  const secure = process.env.MAIL_SECURE === 'true' || port === 465;
  const requireTLS = process.env.MAIL_REQUIRE_TLS === 'true';
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;
  const from = process.env.MAIL_FROM || user || 'noreply@av-efi.net';
  const to = process.env.MAIL_TO_2?.trim();

  if (!to) {
    console.info('mail.test.simulated-without-secondary-recipient', {
      from,
      host,
      port,
      secure,
      reason: 'MAIL_TO_2 is not configured',
    });
    return { success: true, mode: 'simulated' };
  }

  const marker = `av-efi-production-mail-test-${new Date().toISOString()}`;

  if (deliveryMode === 'log') {
    console.info('mail.test.log-mode', {
      from,
      to: 'MAIL_TO_2',
      host,
      port,
      secure,
      marker,
    });
    return { success: true, mode: 'log' };
  }

  const transportOptions: {
    host: string;
    port: number;
    secure: boolean;
    requireTLS: boolean;
    auth?: { user: string; pass: string };
  } = {
    host, port, secure, requireTLS,
  };

  if (user && pass) {
    transportOptions.auth = { user, pass };
  }

  const transporter = nodemailer.createTransport(transportOptions);

  try {
    await transporter.verify();
    await transporter.sendMail({
      from,
      to,
      subject: `[AVefi] Production mail smoke test ${marker}`,
      text: `This is an automated AVefi production mail smoke test.\n\nMarker: ${marker}`,
      html: `<p>This is an automated AVefi production mail smoke test.</p><p><strong>Marker:</strong> ${marker}</p>`,
    });
    return { success: true };
  } catch (err: unknown) {
    const error = err as {
      message?: string;
      code?: string;
      command?: string;
      responseCode?: number;
      response?: string;
    };
    const diag = {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
      response: error?.response,
      string: String(err),
    };
    console.error('mail.test.sendMail failed:', diag);
    console.info('mail.test.simulated-after-mailer-error', {
      from,
      to: 'MAIL_TO_2',
      host,
      port,
      secure,
      marker,
      reason: 'Mailer error',
    });
    return { success: true, mode: 'simulated', warning: 'Mailer error' };
  }
});

function getBearerToken(event: H3Event): string | undefined {
  const authorization = getHeader(event, 'authorization');
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
}

function resolveDeliveryMode(): 'smtp' | 'log' {
  const explicit = (process.env.MAIL_DELIVERY_MODE || '').trim().toLowerCase();
  if (explicit === 'smtp' || explicit === 'log') {
    return explicit;
  }

  const profile = (process.env.NUXT_BUILD_PROFILE || '').trim().toLowerCase();
  const envLabel = (process.env.NUXT_PUBLIC_ENV_LABEL || '').trim().toLowerCase();
  if (profile === 'local' || profile === 'testbed' || envLabel === 'local' || envLabel === 'testbed') {
    return 'log';
  }

  return 'smtp';
}
