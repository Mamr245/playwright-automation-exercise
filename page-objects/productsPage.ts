import { HomePage } from "./homePage"

export class ProductsPage extends HomePage {
    get allProductsText() {
        return this.page.getByText('All Products')
    }

    get searchedProductsText() {
        return this.page.getByText('Searched Products')
    }

    get brandsText() {
        return this.page.getByText('Brands')
    }

    async getSearchResults() {
        return await this.page.locator('//*[@class="productinfo text-center"]//p').allInnerTexts()
    }

    async searchProduct(textToSearch: string) {
        await this.page.locator('#search_product').fill(textToSearch)
        await this.page.locator('#submit_search').click()
    }
}