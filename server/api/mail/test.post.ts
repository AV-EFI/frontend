import { defineEventHandler, getHeader } from 'h3';
import type { H3Event } from 'h3';
import nodemailer from 'nodemailer';
import { createMailTransportOptions, getMailRuntimeDiagnostics, resolveMailRuntimeConfig } from '~/server/utils/mailRuntime';

export default defineEventHandler(async (event) => {
  const expectedToken = process.env.MAIL_TEST_TOKEN;
  const providedToken = getBearerToken(event) || getHeader(event, 'x-mail-test-token');

  if (!expectedToken || providedToken !== expectedToken) {
    event.node.res.statusCode = 404;
    return { success: false, error: 'Not found' };
  }

  const mailConfig = resolveMailRuntimeConfig();
  const { deliveryMode, from, copy: to } = mailConfig;

  if (!to) {
    console.info('mail.test.simulated-without-secondary-recipient', {
      from,
      ...getMailRuntimeDiagnostics(mailConfig),
      reason: 'MAIL_TO_2 is not configured',
    });
    return { success: true, mode: 'simulated' };
  }

  const marker = `av-efi-production-mail-test-${new Date().toISOString()}`;

  if (deliveryMode === 'log') {
    console.info('mail.test.log-mode', {
      from,
      to: 'MAIL_TO_2',
      ...getMailRuntimeDiagnostics(mailConfig),
      marker,
    });
    return { success: true, mode: 'log' };
  }

  const transporter = nodemailer.createTransport(createMailTransportOptions(mailConfig));

  try {
    await transporter.verify();
    await transporter.sendMail({
      from,
      to,
      subject: `[AVefi] Production mail smoke test ${marker}`,
      text: `This is an automated AVefi production mail smoke test.\n\nMarker: ${marker}`,
      html: `<p>This is an automated AVefi production mail smoke test.</p><p><strong>Marker:</strong> ${marker}</p>`,
    });
    return { success: true, mode: 'sent' };
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
      mailConfig: getMailRuntimeDiagnostics(mailConfig),
    };
    console.error('mail.test.sendMail failed:', diag);
    console.info('mail.test.simulated-after-mailer-error', {
      from,
      to: 'MAIL_TO_2',
      ...getMailRuntimeDiagnostics(mailConfig),
      marker,
      reason: 'Mailer error',
    });
    return {
      success: true,
      mode: 'simulated',
      warning: 'Mailer error',
      diagnostics: getMailRuntimeDiagnostics(mailConfig),
      failure: diag,
    };
  }
});

function getBearerToken(event: H3Event): string | undefined {
  const authorization = getHeader(event, 'authorization');
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
}

