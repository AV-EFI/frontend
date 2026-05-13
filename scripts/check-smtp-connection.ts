import nodemailer from 'nodemailer';
import { createMailTransportOptions, getMailRuntimeDiagnostics, resolveMailRuntimeConfig } from '../server/utils/mailRuntime';

async function main() {
  const config = resolveMailRuntimeConfig();
  const diagnostics = getMailRuntimeDiagnostics(config);

  console.info('smtp.connection.config', diagnostics);

  if (config.deliveryMode === 'log') {
    console.info('smtp.connection.skipped', {
      reason: 'MAIL_DELIVERY_MODE resolved to log',
    });
    return;
  }

  const transporter = nodemailer.createTransport(createMailTransportOptions(config));

  try {
    await transporter.verify();
    console.info('smtp.connection.ok', diagnostics);
  } catch (err: unknown) {
    const error = err as {
      message?: string;
      code?: string;
      command?: string;
      responseCode?: number;
      response?: string;
    };

    console.error('smtp.connection.failed', {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
      response: error?.response,
      string: String(err),
      mailConfig: diagnostics,
    });
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('smtp.connection.unhandled', {
    message: err?.message,
    string: String(err),
  });
  process.exitCode = 1;
});
