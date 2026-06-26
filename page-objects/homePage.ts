import { Page } from "@playwright/test"

export class HomePage {
    constructor(private readonly page: Page) {}

    get header() {
        return this.page.locator('#header')
    }

    get footer() {
        return this.page.locator('#footer')
    }

    get loggedInAsUserText() {
        return this.page.getByRole('listitem').filter({ hasText: 'Logged in as' })
    }

    get subscriptionText() {
        return this.page.getByText('Subscription')
    }

    get subscriptionSuccessMessage() {
        return this.page.getByText('You have been successfully subscribed!')
    }

    async goTo() {
        await this.page.goto("/")
        await this.clickConsentButton()
    }

    async clickSignUpButton() {
        await this.page.getByRole('link', {name: 'Signup / Login'}).click()
    }

    async clickConsentButton() {
        await this.page.getByRole('button', {name: 'Consent'}).click()
    }

    async deleteAccount() {
        await this.page.getByRole('link', {name: 'Delete Account'}).click()
    }

    async clickLogoutButton() {
        await this.page.getByRole('link', {name: 'Logout'}).click()
    }

    async clickContactUsButton() {
        await this.page.getByRole('link', {name: 'Contact us'}).click()
    }

    async clickTestCasesButton() {
        await this.page.getByRole('button', {name: 'Test Cases'}).click()
    }

    async clickCartButton() {
        await this.page.getByRole('link', {name: 'Cart'}).click()
    }

    async subscribeNewsletter(email: string) {
        await this.page.locator('#susbscribe_email').fill(email)
        await this.page.locator('#subscribe').click()
    }
}