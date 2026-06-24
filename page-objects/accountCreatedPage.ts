import { Page } from "@playwright/test";

export class AccountCreatedPage {
    constructor(private readonly page: Page) {}

    get accountCreatedText() {
        return this.page.getByText('Account Created!')
    }

    async clickContinueButton() {
        await this.page.getByTestId('continue-button').click()
    }
}