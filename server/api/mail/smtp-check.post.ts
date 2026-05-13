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
  const diagnostics = getMailRuntimeDiagnostics(mailConfig);

  if (mailConfig.deliveryMode === 'log') {
    console.info('mail.smtp-check.log-mode', diagnostics);
    return { success: true, mode: 'log', diagnostics };
  }

  const transporter = nodemailer.createTransport(createMailTransportOptions(mailConfig));

  try {
    await transporter.verify();
    console.info('mail.smtp-check.ok', diagnostics);
    return { success: true, mode: 'verified', diagnostics };
  } catch (err: unknown) {
    const error = err as {
      message?: string;
      code?: string;
      command?: string;
      responseCode?: number;
      response?: string;
    };
    const failure = {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
      response: error?.response,
      string: String(err),
    };
    console.error('mail.smtp-check.failed', {
      ...failure,
      mailConfig: diagnostics,
    });
    event.node.res.statusCode = 502;
    return { success: false, mode: 'failed', error: 'SMTP verify failed', diagnostics, failure };
  }
});

function getBearerToken(event: H3Event): string | undefined {
  const authorization = getHeader(event, 'authorization');
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
}
