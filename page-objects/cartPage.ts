import { expect } from "../fixtures/fixture"
import { HomePage } from "./homePage"

export class CartPage extends HomePage {
    get cartTable() {
        return this.page.locator('#cart_info_table')
    }

    get cartDeleteButtons() {
        return this.page.locator('.cart_quantity_delete')
    }
    
    async getCartNumberOfItems() {
        return this.page.locator('tr[id^="product-"]').count()
    }

    async getItemDescription(rowIndex: number) {
        return this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_description a').innerText() 
    }

    async getItemReference(rowIndex: number) {
        return this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_description a').getAttribute('href')
    }

    async getItemTotalQuantity(rowIndex: number) {
        return this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_quantity').innerText() 
    }
    
    async getItemPrice(rowIndex: number) {
        return this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_price p').innerText() 
    }

    async getItemTotalPrice(rowIndex: number) {
        return this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_total_price').innerText() 
    }

    async removeItem(rowIndex: number) {
        await this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_quantity_delete').click()
    }

    async clickProceedToCheckoutLink() {
        await this.page.getByText('Proceed to checkout').click()
    }

    async clickRegisterLoginLink() {
        await this.page.getByRole('link', {name: 'Register / Login'}).click()
    }

    async emptyCart() {
        let count = await this.cartDeleteButtons.count()
        while (count > 0) {
            await this.cartDeleteButtons.first().click()
            await expect(this.cartDeleteButtons).toHaveCount(count - 1)
            count--
        }
    }
}