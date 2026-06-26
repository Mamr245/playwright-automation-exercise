import { Page } from "@playwright/test"

export class CartPage {
    constructor(private readonly page: Page) {}
    
    get footer() {
        return this.page.locator('#footer')
    }

    get subscriptionText() {
        return this.page.getByText('Subscription')
    }

    get subscriptionSuccessMessage() {
        return this.page.getByText('You have been successfully subscribed!')
    }

    async subscribeNewsletter(email: string) {
        await this.page.locator('#susbscribe_email').fill(email)
        await this.page.locator('#subscribe').click()
    }
}