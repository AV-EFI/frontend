export default defineEventHandler((event) => {
  const { public: publicConfig } = useRuntimeConfig();
  const body = publicConfig.disableIndexing
    ? 'User-agent: *\nDisallow: /\n'
    : 'User-agent: *\nAllow: /\n';

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  return body;
});
