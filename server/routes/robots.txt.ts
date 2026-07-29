export default defineEventHandler((event) => {
  const { public: publicConfig } = useRuntimeConfig();
  const siteUrl = String(publicConfig.siteUrl || publicConfig.origin || 'https://www.av-efi.net').replace(/\/+$/, '');
  const body = publicConfig.disableIndexing
    ? 'User-agent: *\nDisallow: /\n'
    : [
        'User-agent: *',
        'Allow: /',
        'Disallow: /protected/',
        'Disallow: /admin/',
        'Disallow: /login',
        'Disallow: /logout',
        'Disallow: /signout',
        'Disallow: /filmrel/',
        'Disallow: /normdata',
        'Disallow: /explorer-poc',
        '',
        `Sitemap: ${siteUrl}/sitemap.xml`,
        '',
      ].join('\n');

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  return body;
});
