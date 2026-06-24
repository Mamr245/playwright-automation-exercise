import { test, expect } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"
import { inquiryData } from "../fixtures/testData"

let pm: PageManager

test('Contact Us Form', async({ page }) => {
    pm = new PageManager(page)
    await pm.homePage.goTo()
    await expect(pm.homePage.header).toBeVisible()
    
    await pm.homePage.clickContactUsButton()
    await expect(pm.contactUsPage.getInTouchText).toBeVisible()
    
    await pm.contactUsPage.fillInquiryInfo(
        inquiryData.name, 
        inquiryData.email, 
        inquiryData.subject, 
        inquiryData.message)
    await pm.contactUsPage.uploadFile()
    await pm.contactUsPage.submitInquiry()
    await expect(pm.contactUsPage.submissionSuccessMessage).toBeVisible()

    await pm.contactUsPage.clickHomeButton()
    await expect(page).toHaveURL('/')
})