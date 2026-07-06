import { HomePage } from "./homePage"

export class CartPage extends HomePage {
    async getCartNumberOfItems() {
        return await this.page.locator("#cart_info_table tbody tr").count();
    }

    async getItemDescription(rowIndex: number) {
        return await this.page.locator(`//tr[@id="product-${rowIndex}"]/td[@class="cart_description"]//a`).innerText()
    }

    async getItemTotalQuantity(rowIndex: number) {
        return await this.page.locator(`//tr[@id="product-${rowIndex}"]/td[@class="cart_quantity"]`).innerText()
    }
    
    async getItemPrice(rowIndex: number) {
        return await this.page.locator(`//tr[@id="product-${rowIndex}"]/td[@class="cart_price"]//p`).innerText()
    }

    async getItemTotalPrice(rowIndex: number) {
        return await this.page.locator(`//tr[@id="product-${rowIndex}"]//p[@class="cart_total_price"]`).innerText()
    }
}
