import { test, expect } from "../fixtures/fixture"
import { PageManager } from '../page-objects/pageManager'
import { newUserData, existingUser } from '../fixtures/testData'

let pm: PageManager

test.beforeEach(async ({ page }) => {
  pm = new PageManager(page)
  await pm.homePage.goTo()
  await expect(pm.homePage.header).toBeVisible()
  await pm.homePage.clickSignUpLink()
  await expect(pm.loginPage.newUserSignUpText).toBeVisible()
})

test('Register User', async() => {
  await pm.loginPage.register(newUserData.username, newUserData.emailAddress)
  await expect(pm.signUpPage.enterAccountInformationText).toBeVisible()

  await pm.signUpPage.typeAccountInformation(newUserData.accountInformation)
  await pm.signUpPage.checkSignUpForNewsletter()
  await pm.signUpPage.checkReceiveSpecialOffers()
  await pm.signUpPage.typeAddressInformation(newUserData.addressInformation)
  await pm.signUpPage.clickCreateAccount()

  await expect(pm.accountCreatedPage.accountCreatedText).toBeVisible()
  await pm.accountCreatedPage.clickContinueButton()

  await expect(pm.homePage.loggedInAsUserText).toContainText(newUserData.username)
  await pm.homePage.clickDeleteAccountLink()
  
  await expect(pm.accountDeletedPage.accountDeletedText).toBeVisible()
  await pm.accountDeletedPage.clickContinueButton()
})

test('Register User with existing email', async () => {
  await pm.loginPage.register('someUsername', existingUser.emailAddress)
  await expect(pm.loginPage.emailAlredyExistsText).toBeVisible()
})
