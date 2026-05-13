import { expect, test } from '@playwright/test';

test.describe('Production mail smoke to MAIL_TO_2', () => {
  test('sends a gated test mail only to the secondary recipient', async ({ request }) => {
    const token = process.env.MAIL_TEST_TOKEN;
    test.skip(!token, 'MAIL_TEST_TOKEN is required for production mail smoke checks.');

    const response = await request.post('/api/mail/test', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const responseText = await response.text();
    expect(response.ok(), `mail test failed: status=${response.status()} body=${responseText}`).toBeTruthy();
    expect(JSON.parse(responseText)).toMatchObject({ success: true });
  });
});
