import { Page } from "@playwright/test"

export class CheckoutPage {
    constructor(private readonly page: Page) {}

    get deliveryAddress_firstAndLastName() {
        return this.page.locator('#address_delivery .address_firstname.address_lastname')
    }

    get deliveryAddress_CompanyName() {
        return this.page.locator('#address_delivery .address_address1.address_address2').first()
    }

    get deliveryAddress_StreetAndNumber() {
        return this.page.locator('#address_delivery .address_address1.address_address2').nth(1)
    }

    get deliveryAddress_AptInfo() {
        return this.page.locator('#address_delivery .address_address1.address_address2').last()
    }
    
    get deliveryAddress_StateCityZipCode() {
        return this.page.locator('#address_delivery .address_city.address_state_name.address_postcode')
    }

    get deliveryAddress_Country() {
        return this.page.locator('#address_delivery .address_country_name')
    }

    get deliveryAddress_mobileNumber() {
        return this.page.locator('#address_delivery .address_phone')
    }

    get billingAddress_firstAndLastName() {
        return this.page.locator('#address_invoice .address_firstname.address_lastname')
    }

    get billingAddress_CompanyName() {
        return this.page.locator('#address_invoice .address_address1.address_address2').first()
    }

    get billingAddress_StreetAndNumber() {
        return this.page.locator('#address_invoice .address_address1.address_address2').nth(1)
    }

    get billingAddress_AptInfo() {
        return this.page.locator('#address_invoice .address_address1.address_address2').last()
    }
    
    get billingAddress_StateCityZipCode() {
        return this.page.locator('#address_invoice .address_city.address_state_name.address_postcode')
    }

    get billingAddress_Country() {
        return this.page.locator('#address_invoice .address_country_name')
    }

    get billingAddress_mobileNumber() {
        return this.page.locator('#address_invoice .address_phone')
    }

    get totalOrderAmount() {
        return this.page.locator('td').last()
    }

    async typeComment(comment: string) {
        await this.page.locator("//textarea[@name='message']").fill(comment)
    }

    async clickPlaceOrderButton() {
        await this.page.getByText('Place Order').click()
    }

    async getItemDescription(rowIndex: number) {
        return this.page.locator('tr[id^="product-"]').nth(rowIndex).locator('.cart_description a').innerText() 
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
}