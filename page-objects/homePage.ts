import { Page } from "@playwright/test"

export class HomePage {
    constructor(private readonly page: Page) {}

    get header() {
        return this.page.locator('#header')
    }

    get loggedInAsUserText() {
        return this.page.getByRole('listitem').filter({ hasText: 'Logged in as' })
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
}