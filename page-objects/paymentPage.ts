import { Page } from "@playwright/test"

export class PaymentPage {
    constructor(private readonly page: Page) {}

    async fillPaymentDetails(name: string, 
        cardNumber: string, 
        cvc: string, 
        expirationMonth: string, 
        expirationYear: string) {
        await this.page.getByTestId('name-on-card').fill(name)
        await this.page.getByTestId('card-number').fill(cardNumber)
        await this.page.getByTestId('cvc').fill(cvc)
        await this.page.getByTestId('expiry-month').fill(expirationMonth)
        await this.page.getByTestId('expiry-year').fill(expirationYear)
    }

    async clickPayAndConfirmOrderButton() {
        await this.page.getByTestId('pay-button').click()
    }
}