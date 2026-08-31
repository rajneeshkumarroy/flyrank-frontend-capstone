import { test, expect } from '@playwright/test';

test('primary user flow: open, type, send, receive AI response', async ({ page }) => {
  await page.route('**/api/chat', async (route) => {
    // Delay to allow 'Generating' state to render
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Proper UIMessageStream protocol chunks
    const sse = `data: {"type":"start"}\n\n` +
                `data: {"type":"start-step"}\n\n` +
                `data: {"type":"text-start","id":"msg-1"}\n\n` +
                `data: {"type":"text-delta","id":"msg-1","delta":"This is a mocked response from the AI."}\n\n` +
                `data: {"type":"text-end","id":"msg-1"}\n\n` +
                `data: {"type":"finish-step"}\n\n` +
                `data: {"type":"finish","finishReason":"stop"}\n\n` +
                `data: [DONE]\n\n`;
                
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      headers: {
        'x-vercel-ai-ui-message-stream': 'v1',
      },
      body: sse,
    });
  });

  await page.goto('/');

  const heading = page.getByRole('heading', { name: /FlyRank Frontend Assistant/i });
  await expect(heading).toBeVisible();

  const messageInput = page.getByRole('textbox', { name: /Message/i });
  await expect(messageInput).toBeVisible();

  await messageInput.fill('What is React?');

  const sendButton = page.getByRole('button', { name: /^Send$/i });
  await expect(sendButton).toBeEnabled();
  await sendButton.click();

  const stopButton = page.getByRole('button', { name: /Stop generating response/i });
  await expect(stopButton).toBeVisible();

  const generatingText = page.getByText('Generating');
  await expect(generatingText).toBeVisible();

  const assistantResponse = page.getByText('This is a mocked response from the AI.');
  await expect(assistantResponse).toBeVisible();
});
