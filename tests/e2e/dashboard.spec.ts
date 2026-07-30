import { expect, test } from '@playwright/test';

test('dashboard presents every financial domain and accessible card details', async ({ page }, testInfo) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Your financial command center.' })).toBeVisible();
  for (const heading of [
    'Cash & banking',
    'Investments & retirement',
    'Bills & subscriptions',
    'Property & real estate',
    'Credit & debt',
    'Insurance & protection',
    'Business & taxes',
  ]) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }

  const detailsButton = page.getByRole('button', { name: 'Reveal recent activity' }).first();
  await detailsButton.focus();
  await expect(page.getByText('Borough Market')).toBeVisible();

  const cashRail = page.getByRole('list', { name: 'Cash & banking accounts' });
  await page.getByRole('button', { name: 'Next Cash' }).click();
  await expect.poll(() => cashRail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await cashRail.evaluate((element) => { element.scrollLeft = 0; });
  await page.evaluate(() => window.scrollTo(0, 0));

  const screenshotPath = testInfo.project.name === 'mobile'
    ? 'docs/evidence/mobile-dashboard.png'
    : 'docs/evidence/desktop-dashboard.png';
  await page.screenshot({ path: screenshotPath, fullPage: true, scale: 'css' });
});

test('mobile layout uses bottom navigation without horizontal page overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only layout assertion');
  await page.goto('/');

  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeHidden();
  const dimensions = await page.evaluate(() => ({ body: document.body.scrollWidth, viewport: window.innerWidth }));
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
});
