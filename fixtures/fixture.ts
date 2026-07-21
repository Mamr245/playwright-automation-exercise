import { test as base, expect } from '@playwright/test';

/*
* Extends Playwright's default test fixture by adding automatic ad blocking,
* ensuring tests run without third-party ads and ad overlays interfering with UI interactions.
*/
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(
      /googlesyndication|doubleclick|googleads|adservice/,
      route => route.abort()
    )
    await use(page)
  }
})

export { expect }