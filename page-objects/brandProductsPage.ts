import { HomePage } from "./homePage"

export class BrandProductsPage extends HomePage {
    get brandSectionTitle() {
        return this.page.locator('.title.text-center')
    }

    productCard(productName: string) {
        return this.page.locator('.productinfo.text-center', { hasText: productName })
    }
}