import { Page } from "@playwright/test"

export class ProductsPage {
    constructor(private readonly page: Page) {}

    get allProductsText() {
        return this.page.getByText('All Products')
    }

    get searchedProductsText() {
        return this.page.getByText('Searched Products')
    }

    get productList() {
        return this.page.getByText('Searched Products')
    }

    async getSearchResults() {
        return this.page.locator('//*[@class="productinfo text-center"]//p').allInnerTexts()
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