import { Page } from "@playwright/test"

export class AccountDeletedPage {
    constructor(private readonly page: Page) {}

    get accountDeletedText() {
        return this.page.getByText('Account Deleted!')
    }
    
    async clickContinueButton() {
        await this.page.getByTestId('continue-button').click()
    }
}