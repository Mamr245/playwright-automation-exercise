import { test, expect } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager" 
import { existingUser } from "../fixtures/testData"

let pm: PageManager

test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page)
        await pm.homePage.goTo()
        await expect(pm.homePage.header).toBeVisible()
        await pm.homePage.clickSignUpLink()
        await expect(pm.loginPage.loginToYourAccountText).toBeVisible()
    })

    test('Login User with correct email and password', async () => {
        await pm.loginPage.login(existingUser.email, existingUser.password)
        await expect(pm.homePage.loggedInAsUserText).toContainText(existingUser.username)
    })

    test('Login User with incorrect email and password', async () => {
        await pm.loginPage.login('incorrectEmail@email.com','wrongPassword')
        await expect(pm.loginPage.incorrectEmailPasswordText).toBeVisible()   
    })
})