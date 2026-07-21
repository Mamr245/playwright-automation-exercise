import { test, expect } from "../fixtures/fixture"
import { PageManager } from "../page-objects/pageManager"
import { inquiryData } from "../fixtures/testData"

let pm: PageManager

test('Contact Us Form', async({ page }) => {

    pm = new PageManager(page)
    await pm.homePage.goTo()
    await expect(pm.homePage.header).toBeVisible()
    
    await pm.homePage.clickContactUsLink()
    await expect(pm.contactUsPage.getInTouchText).toBeVisible()
    
    await pm.contactUsPage.fillInquiryInfo(
        inquiryData.name, 
        inquiryData.emailAddress, 
        inquiryData.subject, 
        inquiryData.message)
    await pm.contactUsPage.uploadFile('fixtures/testData_orderDetails.pdf')
    //await page.waitForTimeout(2000) // Wait for 2 seconds to ensure the dialog is handled
    await pm.contactUsPage.submitInquiry()
    await expect(pm.contactUsPage.submissionSuccessMessage).toBeVisible()
    await expect(pm.contactUsPage.submissionSuccessMessage).toHaveText('Success! Your details have been submitted successfully.')
    await pm.contactUsPage.clickHomeButton()
    await expect(page).toHaveURL('/')
})