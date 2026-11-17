// OpenSearch description: lets browsers offer AVefi search from the address bar.
export default defineEventHandler((event) => {
  const { public: publicConfig } = useRuntimeConfig();
  const siteUrl = String(publicConfig.siteUrl || publicConfig.origin || 'https://www.av-efi.net').replace(/\/+$/, '');

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">',
    '  <ShortName>AVefi</ShortName>',
    '  <Description>Durchsuchen Sie Filmwerke, Manifestationen und audiovisuelle Materialien aus Filmarchiven.</Description>',
    '  <InputEncoding>UTF-8</InputEncoding>',
    `  <Image width="32" height="32" type="image/x-icon">${siteUrl}/favicon.ico</Image>`,
    `  <Url type="text/html" method="get" template="${siteUrl}/search?query={searchTerms}"/>`,
    `  <Url type="application/opensearchdescription+xml" rel="self" template="${siteUrl}/opensearch.xml"/>`,
    `  <moz:SearchForm>${siteUrl}/search</moz:SearchForm>`,
    '</OpenSearchDescription>',
    '',
  ].join('\n');

  setResponseHeader(event, 'Content-Type', 'application/opensearchdescription+xml; charset=utf-8');
  return body;
});
