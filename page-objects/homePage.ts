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
        await this.page.locator('//header[@id="header"]//a[@href="/view_cart"]').click()
    }

    async clickViewCartLink() {
        await this.page.getByRole('link', {name: 'View Cart'}).click()
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
        await this.page.locator(`a[href*="#${category}"]`).click()
        await this.page.locator(`#${category}`).getByRole('link', { name: productType }).click()
    }

    async clickViewProduct(itemIndex: number) {
        /* 
        * itemIndex = 0 clicks "View Product" of first item
        * itemIndex = 1 clicks "View Product" of second item
        * And so on... 
        */
        await this.page.getByRole('link', {name: 'View product'}).nth(itemIndex).click()
    }

    async clickContinueShoppingButton() {
        await this.page.getByRole('button', {name: 'Continue Shopping'}).click()
    }

    async getProductReference(itemIndex: number) {
        return this.page.getByRole('link', {name: 'View product'}).nth(itemIndex).getAttribute('href')
    }

    async addProductToCart(itemIndex: number, cart: object[]) {
        await this.page.locator('//div[@class="features_items"]/div[@class="col-sm-4"]').nth(itemIndex).hover()
        await this.page.locator('//div[@class="features_items"]/div[@class="col-sm-4"]//div[@class="product-overlay"]//a').nth(itemIndex).click()
        await this.updateCartArray(itemIndex, cart)
    }

    protected async updateCartArray(itemIndex: number, cart: object[]) {
        /* Steps to update the cart object to perform assertions later:
        *    1 - Get item name and price
        *    2 - Check if item is already in the cart 
        *        - If yes => Increase it's quantity by 1
        *        - If not => Add it to the cart with quantity equal to 1
        */
        const itemName = await this.page.locator('//div[@class="features_items"]/div[@class="col-sm-4"]//div[@class="product-overlay"]//p').nth(itemIndex).innerText()
        const itemPrice = await this.page.locator('//div[@class="features_items"]/div[@class="col-sm-4"]//div[@class="product-overlay"]//h2').nth(itemIndex).innerText()
        const priceValue = Number(itemPrice.replace("Rs. ", ""))
        const productReference = await this.getProductReference(itemIndex)
        const product = {name: itemName, productReference: productReference, price: priceValue, totalQuantity: 1, totalPrice: priceValue}
        const itemAlreadyInCart = cart.find((item: any) => item.name === itemName) as any

        if (itemAlreadyInCart) {
            itemAlreadyInCart.totalQuantity++
            itemAlreadyInCart.totalPrice = priceValue * itemAlreadyInCart.totalQuantity
        } else {
            cart.push(product)
        }
    } 
}