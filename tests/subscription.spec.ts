import { test, expect } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"
import { existingUser } from "../fixtures/testData"

let pm: PageManager

test.describe('Subscription', () => {
    test.beforeEach(async ({ page }) => {
        pm = new PageManager (page)
        await pm.homePage.goTo()
        await expect(pm.homePage.header).toBeVisible()
    })

    test('Verify Subscription in home page', async () => {
        await pm.homePage.footer.scrollIntoViewIfNeeded()
        await expect(pm.homePage.subscriptionText).toBeInViewport()
        await pm.homePage.subscribeNewsletter('aaa@aaa.com')
        await expect(pm.homePage.subscriptionSuccessMessage).toBeVisible()
    })

    test('Verify Subscription in Cart page', async ({page}) => {
        await pm.homePage.clickCartLink()
        await expect(page).toHaveURL('/view_cart')

        await pm.cartPage.footer.scrollIntoViewIfNeeded()
        await expect(pm.cartPage.subscriptionText).toBeInViewport()
        await pm.cartPage.subscribeNewsletter('aaa@aaa.com')
        await expect(pm.cartPage.subscriptionSuccessMessage).toBeVisible()
    })
})