const baseUrl = process.env.PLAYWRIGHT_BASE_URL;

if (!baseUrl) {
  console.error('PLAYWRIGHT_BASE_URL is required for remote Playwright checks.');
  process.exit(1);
}

const paths = ['/', '/faq', '/search', '/press'];
const failureMarkers = [
  'This page is temporarily unavailable',
  '<h1>500</h1>',
  '>500<',
];

function compact(text) {
  return text.replace(/\s+/g, ' ').trim().slice(0, 500);
}

async function checkPath(path) {
  const url = new URL(path, baseUrl).toString();
  const response = await fetch(url, {
    headers: {
      'user-agent': 'AVefi CI remote health check',
      accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
    },
  });
  const text = await response.text();
  const marker = failureMarkers.find((candidate) => text.includes(candidate));

  if (!response.ok || response.status >= 500 || marker) {
    throw new Error(
      `${url} failed remote health check: status=${response.status}` +
      `${marker ? ` marker="${marker}"` : ''} body="${compact(text)}"`,
    );
  }
}

for (const path of paths) {
  await checkPath(path);
}

console.log(`Remote Playwright base URL passed health check: ${baseUrl}`);
