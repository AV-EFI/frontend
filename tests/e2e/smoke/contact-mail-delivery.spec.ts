import { expect, test } from '@playwright/test';

const mailAssertBase = process.env.MAIL_ASSERT_API_BASE;

test.describe('Contact mail delivery e2e', () => {
  test('submits contact payload and message is delivered to inbox sink', async ({ request }) => {
    test.setTimeout(90_000);

    const token = `e2e-contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const payload = {
      email: 'qa-contact-e2e@av-efi.local',
      message: `Automated contact delivery verification ${token}`,
    };

    const submitResponse = await request.post('/api/mail/contact', {
      data: payload,
    });

    expect(submitResponse.ok()).toBeTruthy();
    const submitBody = await submitResponse.json();
    expect(submitBody).toMatchObject({ success: true });

    if (!mailAssertBase) {
      test.info().annotations.push({
        type: 'note',
        description: 'MAIL_ASSERT_API_BASE not set; running submit-only verification without inbox assertion.',
      });
      return;
    }

    let deliveredMessageId = '';
    const deadline = Date.now() + 45_000;

    while (Date.now() < deadline) {
      const listResponse = await request.get(`${mailAssertBase}/api/v1/messages`);
      expect(listResponse.ok()).toBeTruthy();

      const listBody = await listResponse.json();
      const messages = Array.isArray(listBody)
        ? listBody
        : (Array.isArray(listBody?.messages) ? listBody.messages : []);

      const found = messages.find((m: any) => {
        const subject = String(m?.Subject ?? m?.subject ?? '');
        return subject.includes(token);
      });

      if (found) {
        deliveredMessageId = String(found?.ID ?? found?.id ?? '');
        if (deliveredMessageId) {
          break;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    expect(deliveredMessageId).not.toBe('');

    const detailResponse = await request.get(`${mailAssertBase}/api/v1/message/${deliveredMessageId}`);
    expect(detailResponse.ok()).toBeTruthy();

    const detailBody = await detailResponse.json();
    expect(JSON.stringify(detailBody)).toContain(token);
  });
});
