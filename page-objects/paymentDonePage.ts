import { Page } from "@playwright/test"

export class PaymentDonePage {
    constructor(private readonly page: Page) {}

    get orderPlacedText() {
        return this.page.getByText('Order Placed!')
    }

    async clickContinueButton() {
        await this.page.getByTestId('continue-button').click()
    }

    async clickDownloadInvoiceButton() {
        await this.page.getByText('Download Invoice').click()
    }
}