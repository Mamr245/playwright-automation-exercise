import { Page } from "@playwright/test"

export class ContactUsPage {
    constructor(private readonly page: Page) {}

    get getInTouchText() {
        return this.page.getByText('Get In Touch')
    }

    get submissionSuccessMessage () {
        return this.page.locator('//*[@class="status alert alert-success"]')
    }

    async fillInquiryInfo(name: string, email: string, subject: string, message: string) {
        await this.page.getByTestId('name').fill(name)
        await this.page.getByTestId('email').fill(email)
        await this.page.getByTestId('subject').fill(subject)
        await this.page.getByTestId('message').fill(message)
    }

    async uploadFile(filePath: string) {
        await this.page.locator('input[type="file"]').setInputFiles(filePath)
        /*
        *Automation Exercise processes the file input asynchronously;
        *wait briefly before submitting to avoid a race condition
        */
        await this.page.waitForTimeout(300)
    }

    async submitInquiry () {
        this.page.once('dialog', async dialog => {
            await dialog.accept()
        })
        await this.page.getByTestId('submit-button').click()
    }

    async clickHomeButton() {
        await this.page.locator('//*[@id="form-section"]//span').click()
    }
}