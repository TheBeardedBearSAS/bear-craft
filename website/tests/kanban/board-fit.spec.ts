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

// Dogfooding #299: in a narrow column (Done at 1600 px) the priority pill and the TDD tag were drawn
// outside the right edge of the card. Every descendant must stay inside the card's bounding box.
for (const width of [1280, 1600]) {
  test.describe(`${width} px cards`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('board: card content stays inside the card (Done column included)', async ({ page }) => {
      await openView(page, 'kanban');
      const cards = page.locator('section.column li.card');
      expect(await cards.count()).toBeGreaterThan(0);
      const escapes = await cards.evaluateAll((els) =>
        els.flatMap((card) => {
          const box = card.getBoundingClientRect();
          return [...card.querySelectorAll('.card-top > *, .card-meta > *')]
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter(({ r }) => r.width > 0 && (r.right > box.right + 1 || r.left < box.left - 1))
            .map(
              ({ el, r }) =>
                `${card.querySelector('.card-id')?.textContent} ${el.className} right=${r.right} card=${box.right}`
            );
        })
      );
      expect(escapes).toEqual([]);
    });
  });
}
