import { HomePage } from "./homePage"

export class ProductsPage extends HomePage {
    get allProductsText() {
        return this.page.getByText('All Products')
    }

    get searchedProductsText() {
        return this.page.getByText('Searched Products')
    }

    get womenTopsProductsText() {
        return this.page.getByText('Women - Tops Products')
    }
    
    get menJeansProductsText() {
        return this.page.getByText('Men - Jeans Products')
    }

    async getSearchResults() {
        return await this.page.locator('//*[@class="productinfo text-center"]//p').allInnerTexts()
    }

    async searchProduct(textToSearch: string) {
        await this.page.locator('#search_product').fill(textToSearch)
        await this.page.locator('#submit_search').click()
    }

    async clickViewProduct(itemIndex: number) {
        /* 
        * itemIndex = 0 clicks "View Product" of first item
        * itemIndex = 1 clicks "View Product" of second item
        * And so on... 
        */
        await this.page.getByRole('link', {name: 'View product'}).nth(itemIndex).click()
    }

    async getProductReference(itemIndex: number) {
        return this.page.getByRole('link', {name: 'View product'}).nth(itemIndex).getAttribute('href')
    }

    async addProductToCart(itemIndex: number, cart: Array<object>) {
        await this.page.locator('//div[@class="features_items"]/div[@class="col-sm-4"]').nth(itemIndex).hover()
        await this.page.locator('//div[@class="features_items"]/div[@class="col-sm-4"]//div[@class="product-overlay"]//a').nth(itemIndex).click()
        await this.updateCartArray(itemIndex, cart)

    }

    async clickContinueShoppingButton() {
        await this.page.getByRole('button', {name: 'Continue Shopping'}).click()
    }

    async clickViewCartLink() {
        await this.page.getByRole('link', {name: 'View Cart'}).click()
    }

    protected async updateCartArray(itemIndex: number, cart: Array<object>) {
        /* Steps to update the cart object to perform assertions later:
        *    1 - Get item name and price
        *    2 - Check if item is already in the cart 
        *        - If yes => Increase it's quantity by 1
        *        - If not => Add it to the cart with quantity equal to 1
        */
        const itemName = await this.page.locator('//div[@class="features_items"]/div[@class="col-sm-4"]//div[@class="product-overlay"]//p').nth(itemIndex).innerText()
        const itemPrice = await this.page.locator('//div[@class="features_items"]/div[@class="col-sm-4"]//div[@class="product-overlay"]//h2').nth(itemIndex).innerText()
        const priceValue = Number(itemPrice.replace("Rs. ", ""))
        const product = {name: itemName, price: priceValue, totalQuantity: 1, totalPrice: priceValue}
        const itemAlreadyInCart = cart.find((item: any) => item.name === itemName) as any;

        Number(itemPrice.replace("Rs. ", ""));

        if (itemAlreadyInCart) {
            itemAlreadyInCart.totalQuantity++
            itemAlreadyInCart.totalPrice = priceValue * itemAlreadyInCart.totalQuantity
        } else {
            cart.push(product);
        }
    } 
}
