import { test, expect } from "../fixtures/fixture";
import { PageManager } from "../page-objects/pageManager"

let pm: PageManager

test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
    await pm.homePage.goTo()
    await expect(pm.homePage.header).toBeVisible()
    await pm.homePage.footer.scrollIntoViewIfNeeded()
    await expect(pm.homePage.subscriptionText).toBeInViewport()
})

test("Verify Scroll Up using 'Arrow' button and Scroll Down functionality", async () => {
    await pm.homePage.clickGoToTopOfPageButton()
    await expect(pm.homePage.fullFledgedText).toBeInViewport()
})

test("Verify Scroll Up without 'Arrow' button and Scroll Down functionality", async () => {
    await pm.homePage.fullFledgedText.scrollIntoViewIfNeeded()
    await expect(pm.homePage.fullFledgedText).toBeInViewport()
})