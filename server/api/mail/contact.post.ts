import { defineEventHandler, readBody } from 'h3';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { createMailTransportOptions, getMailRuntimeDiagnostics, resolveMailRuntimeConfig } from '~/server/utils/mailRuntime';

const BodySchema = z.object({
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(5).max(5000),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    event.node.res.statusCode = 400;
    return { success: false, error: 'Invalid payload', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { email, message } = parsed.data;

  const mailConfig = resolveMailRuntimeConfig();
  const { deliveryMode, from, to, copy } = mailConfig;

  if (deliveryMode === 'log') {
    console.info('contact.mail.log-mode', {
      from,
      to,
      copy: copy || undefined,
      replyTo: email,
      ...getMailRuntimeDiagnostics(mailConfig),
      preview: message.slice(0, 200),
    });
    return { success: true, mode: 'log' };
  }

  const transporter = nodemailer.createTransport(createMailTransportOptions(mailConfig));

  try {
    await transporter.verify();
    await transporter.sendMail({
      from,                  // Gmail: keep equal to MAIL_USER
      to,
      subject: `[AVefi] Contact form from ${email}`,
      text: `From: ${email}\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(email)}</p><pre style="white-space:pre-wrap">${escapeHtml(message)}</pre>`,
      replyTo: email,
      bcc: copy || undefined,
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
      mailConfig: getMailRuntimeDiagnostics(mailConfig),
    };
    console.error('contact.sendMail failed:', diag);
    event.node.res.statusCode = 502;
    return { success: false, error: 'Mailer error' };
  }
});

function escapeHtml(s: string) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

