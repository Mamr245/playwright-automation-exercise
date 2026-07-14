import { test, expect } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager" 
import { existingUser } from "../fixtures/testData"

let pm: PageManager

test('User can logout successfully', async ({ page }) => {
        pm = new PageManager(page)

        await pm.homePage.goTo()
        await expect(pm.homePage.header).toBeVisible()

        await pm.homePage.clickSignUpLink()
        await expect(pm.loginPage.loginToYourAccountText).toBeVisible()
        
        await pm.loginPage.login(existingUser.emailAddress, existingUser.accountInformation.password)
        await expect(pm.homePage.loggedInAsUserText).toContainText(existingUser.username)

        await pm.homePage.clickLogoutLink()
        await expect(page).toHaveURL('/login')
    })