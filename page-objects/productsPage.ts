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
        itemIndex = 0 clicks "View Product" of first item
        itemIndex = 1 clicks "View Product" of second item
        And so on... 
        */
        await this.page.getByRole('link', {name: 'View product'}).nth(itemIndex).click()
    }

    async getProductReference(itemIndex: number) {
        return this.page.getByRole('link', {name: 'View product'}).nth(itemIndex).getAttribute('href')
    }
}