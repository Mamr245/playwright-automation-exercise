import { HomePage } from "./homePage"

export class CartPage extends HomePage {
    async getCartNumberOfItems() {
        return await this.page.locator("#cart_info_table tbody tr").count()
    }

    async getItemDescription(rowIndex: number) {
        return await this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_description a').innerText() 
    }

    async getItemReference(rowIndex: number) {
        return await this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_description a').getAttribute('href')
    }

    async getItemTotalQuantity(rowIndex: number) {
        return await this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_quantity').innerText() 
    }
    
    async getItemPrice(rowIndex: number) {
        return await this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_price p').innerText() 
    }

    async getItemTotalPrice(rowIndex: number) {
        return await this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_total_price').innerText() 
    }
}