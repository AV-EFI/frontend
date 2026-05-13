export type MailDeliveryMode = 'smtp' | 'log';

export type MailRuntimeConfig = {
  deliveryMode: MailDeliveryMode;
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  user?: string;
  pass?: string;
  from: string;
  to: string;
  copy?: string;
};

export function resolveMailRuntimeConfig(): MailRuntimeConfig {
  const host = readEnv('MAIL_HOST', 'NUXT_NODEMAILER_HOST') || 'mailer.gwdg.de';
  const port = Number(readEnv('MAIL_PORT', 'NUXT_NODEMAILER_PORT') || 25);
  const secure = readBooleanEnv(['MAIL_SECURE', 'NUXT_NODEMAILER_SECURE'], port === 465);
  const requireTLS = readBooleanEnv(['MAIL_REQUIRE_TLS', 'NUXT_NODEMAILER_REQUIRE_TLS'], false);
  const user = readEnv('MAIL_USER');
  const pass = readEnv('MAIL_PASSWORD');
  const from = readEnv('MAIL_FROM', 'NUXT_NODEMAILER_FROM') || user || 'noreply@av-efi.net';
  const to = readEnv('MAIL_TO') || from;
  const copy = readEnv('MAIL_TO_2');

  return {
    deliveryMode: resolveDeliveryMode(),
    host,
    port,
    secure,
    requireTLS,
    user,
    pass,
    from,
    to,
    copy,
  };
}

export function createMailTransportOptions(config: MailRuntimeConfig) {
  const transportOptions: {
    host: string;
    port: number;
    secure: boolean;
    requireTLS: boolean;
    auth?: { user: string; pass: string };
  } = {
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
  };

  if (config.user && config.pass) {
    transportOptions.auth = { user: config.user, pass: config.pass };
  }

  return transportOptions;
}

export function getMailRuntimeDiagnostics(config: MailRuntimeConfig) {
  return {
    deliveryMode: config.deliveryMode,
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    auth: config.user && config.pass ? 'configured' : (config.user || config.pass ? 'partial' : 'none'),
    fromDomain: getEmailDomain(config.from),
    toConfigured: Boolean(config.to),
    toDomain: getEmailDomain(config.to),
    copyConfigured: Boolean(config.copy),
    copyDomain: config.copy ? getEmailDomain(config.copy) : undefined,
    hasLegacyNuxtNodemailerHost: Boolean(readEnv('NUXT_NODEMAILER_HOST')),
    hasMailHost: Boolean(readEnv('MAIL_HOST')),
  };
}

export function resolveDeliveryMode(): MailDeliveryMode {
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

function readEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
}

function readBooleanEnv(names: string[], fallback: boolean): boolean {
  const value = readEnv(...names);
  if (value === undefined) {
    return fallback;
  }
  return value.toLowerCase() === 'true';
}

function getEmailDomain(value: string): string | undefined {
  const match = value.match(/@([^>\s]+)>?$/);
  return match?.[1]?.toLowerCase();
}
