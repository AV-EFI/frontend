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

    const host = process.env.MAIL_HOST || 'smtp.gmail.com';
    const port = Number(process.env.MAIL_PORT || 587);
    const secure = port === 465;
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASSWORD;
    const from = process.env.MAIL_FROM || user;
    const to = process.env.MAIL_TO || from;
    const copy = process.env.MAIL_TO_2;

    console.log('MAIL_USER:', process.env.MAIL_USER);
    console.log('MAIL_PASSWORD:', process.env.MAIL_PASSWORD);

    if (!user || !pass) {
        event.node.res.statusCode = 500;
        return { success: false, error: 'SMTP env missing (MAIL_USER/MAIL_PASSWORD)' };
    }

    const transporter = nodemailer.createTransport({
        host, port, secure, requireTLS: !secure,
        auth: { user, pass },
    });

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
        return { success: false, error: 'Mailer error', diag };
    }
});

function escapeHtml(s: string) {
    return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
