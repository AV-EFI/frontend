import { expect, test } from '@playwright/test';

test.describe('Production SMTP connection smoke', () => {
  test('verifies the configured SMTP connection without sending mail', async ({ request }) => {
    const token = process.env.MAIL_TEST_TOKEN;
    test.skip(!token, 'MAIL_TEST_TOKEN is required for production SMTP checks.');

    const response = await request.post('/api/mail/smtp-check', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const responseText = await response.text();
    const responseBody = JSON.parse(responseText);
    console.log(`Production SMTP check response: ${JSON.stringify(responseBody)}`);

    expect(response.ok(), `SMTP check failed: status=${response.status()} body=${responseText}`).toBeTruthy();
    expect(responseBody).toMatchObject({ success: true });
  });
});
