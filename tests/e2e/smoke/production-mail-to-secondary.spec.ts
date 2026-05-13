import { expect, test } from '@playwright/test';

test.describe('Production mail smoke to MAIL_TO_2', () => {
  test('runs the gated secondary-recipient mail smoke check', async ({ request }) => {
    const token = process.env.MAIL_TEST_TOKEN;
    test.skip(!token, 'MAIL_TEST_TOKEN is required for production mail smoke checks.');

    const response = await request.post('/api/mail/test', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const responseText = await response.text();
    const responseBody = JSON.parse(responseText);
    console.log(`Production mail smoke response: ${JSON.stringify(responseBody)}`);
    expect(response.ok(), `mail smoke check failed: status=${response.status()} body=${responseText}`).toBeTruthy();
    expect(responseBody).toMatchObject({ success: true });
    if (process.env.MAIL_TEST_REQUIRE_REAL_SEND === 'true') {
      expect(responseBody).toMatchObject({ mode: 'sent' });
    }
  });
});
