import { defineEventHandler, readBody } from 'h3';
import nodemailer from 'nodemailer';
import { z } from 'zod';

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

  const deliveryMode = resolveDeliveryMode();
  const host = process.env.MAIL_HOST || 'mailer.gwdg.de';
  const port = Number(process.env.MAIL_PORT || 25);
  const secure = process.env.MAIL_SECURE === 'true' || port === 465;
  const requireTLS = process.env.MAIL_REQUIRE_TLS === 'true';
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;
  const from = process.env.MAIL_FROM || user || 'noreply@av-efi.net';
  const to = process.env.MAIL_TO || from;
  const copy = process.env.MAIL_TO_2;

  if (deliveryMode === 'log') {
    console.info('contact.mail.log-mode', {
      from,
      to,
      copy: copy || undefined,
      replyTo: email,
      host,
      port,
      secure,
      preview: message.slice(0, 200),
    });
    return { success: true, mode: 'log' };
  }

  const transportOptions: any = {
    host, port, secure, requireTLS,
  };

  if (user && pass) {
    transportOptions.auth = { user, pass };
  }

  const transporter = nodemailer.createTransport(transportOptions);

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
  } catch (err: any) {
    const diag = {
      message: err?.message,
      code: err?.code,
      command: err?.command,
      responseCode: err?.responseCode,
      response: err?.response,
      string: String(err),
    };
    console.error('contact.sendMail failed:', diag);
    event.node.res.statusCode = 502;
    return { success: false, error: 'Mailer error' };
  }
});

function escapeHtml(s: string) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
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
