import { expect, test } from '@playwright/test';

const routes = [
  ['cash', 'Manage cash'],
  ['investments', 'Manage investments'],
  ['subscriptions', 'Manage subscriptions'],
  ['property', 'Manage property'],
  ['credit', 'Manage credit'],
  ['insurance', 'Manage protection'],
  ['business', 'Manage business'],
] as const;

for (const [route, title] of routes) {
  test(`deep link /manage/${route} renders`, async ({ page }) => {
    await page.goto(`/manage/${route}`);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  });
}

test('subscription cancellation sends a request, stages it, and can be undone', async ({ page }, testInfo) => {
  await page.route('**/api/v1/**', (route) => route.abort('connectionrefused'));
  await page.goto('/manage/subscriptions');
  const adobe = page.getByRole('article', { name: 'Adobe subscription' });
  const requestPromise = page.waitForRequest((request) => request.url().includes('/api/v1/subscriptions/adobe/cancellation-requests'));

  await adobe.getByRole('button', { name: 'Cancel subscription' }).click();
  await page.getByRole('button', { name: 'Request cancellation' }).click();
  const request = await requestPromise;

  expect(request.method()).toBe('POST');
  expect(request.headers()['x-idempotency-key']).toBeTruthy();
  await expect(page.getByText('Demo mode: request staged')).toBeVisible();
  await expect(page.getByText(/Request ID/)).toBeVisible();
  if (testInfo.project.name === 'chromium') {
    await page.screenshot({ path: 'docs/evidence/subscriptions-management.png', fullPage: true, scale: 'css' });
  }
  const undoRequestPromise = page.waitForRequest((nextRequest) => nextRequest.url().includes('/undo'));
  await page.getByRole('button', { name: 'Undo staged cancellation' }).click();
  const undoRequest = await undoRequestPromise;
  expect(undoRequest.method()).toBe('POST');
  await expect(adobe.getByRole('button', { name: 'Cancel subscription' })).toBeEnabled();
});
