import { test, expect } from '@playwright/test';
import { openView } from './helpers';

// Dogfooding #273: at 1600 px the six columns overflowed the board and "Done" was cut off.
// Below that width the board may scroll inside itself, but the page never scrolls horizontally.

test.describe('1600 px', () => {
  test.use({ viewport: { width: 1600, height: 900 } });

  test('board: every column fits without horizontal scroll', async ({ page }) => {
    await openView(page, 'kanban');
    const board = page.locator('.board');
    const { scrollWidth, clientWidth } = await board.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

    const done = await page.locator('section.column', { has: page.locator('#col-done') }).boundingBox();
    expect(done).not.toBeNull();
    expect(done!.x + done!.width).toBeLessThanOrEqual(1600);
  });
});

test.describe('1280 px', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('board: no page-level horizontal scroll, columns keep a readable width', async ({ page }) => {
    await openView(page, 'kanban');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
    const widths = await page
      .locator('section.column')
      .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
    for (const w of widths) expect(w).toBeGreaterThanOrEqual(200);
  });
});
