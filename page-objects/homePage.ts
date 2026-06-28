import { Page } from "@playwright/test"

export class HomePage {
    constructor(protected readonly page: Page) {}

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

    get fullFledgedText() {
        // contains(., 'Full-Fledged') => Looks for text 'Full-Fledged' inside the element (including children)
        return this.page.locator("//*[@class='item active' and contains(., 'Full-Fledged')]")
    }

    async goTo() {
        await this.page.goto("/")
        await this.clickConsentButton()
    }

    async clickSignUpLink() {
        await this.page.getByRole('link', {name: 'Signup / Login'}).click()
    }
 
    async clickDeleteAccountLink() {
        await this.page.getByRole('link', {name: 'Delete Account'}).click()
    }

    async clickLogoutLink() {
        await this.page.getByRole('link', {name: 'Logout'}).click()
    }

    async clickContactUsLink() {
        await this.page.getByRole('link', {name: 'Contact us'}).click()
    }

    async clickCartLink() {
        await this.page.getByRole('link', {name: 'Cart'}).click()
    }

    async clickProductsLink() {
        await this.page.getByRole('link', {name: 'Products'}).click()
    }

    async clickConsentButton() {
        await this.page.getByRole('button', {name: 'Consent'}).click()
    }

    async clickTestCasesButton() {
        await this.page.getByRole('button', {name: 'Test Cases'}).click()
    }

    async clickGoToTopOfPageButton() {
        await this.page.locator('#scrollUp').click()
    }

    async subscribeNewsletter(email: string) {
        await this.page.locator('#susbscribe_email').fill(email)
        await this.page.locator('#subscribe').click()
    }

    async clickCategory(category: string, productType: string) {
        await this.page.locator(`a[href*="#${category}"]`).click();
        await this.page.locator(`#${category}`).getByRole('link', { name: productType }).click();
    }
}