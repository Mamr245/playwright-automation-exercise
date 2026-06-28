import { Page } from "@playwright/test"

export class ProductDetailsPage {
    constructor(private readonly page: Page) {}

    get productName() {
        return this.page.locator('//*[@class="product-information"]/h2')       
    }

    get productCategory() {
        return this.page.getByText('Category:')        
    }

    get productPrice() {
        // /Rs\. \d+/ => Regex expression to match the text Rs. followed by a space and one or more numbers 
        return this.page.getByText(/Rs\. \d+/)                
    }

    get productAvailabilty() {
        return this.page.getByText('Availability:')        
    }

    get productCondition() {
        return this.page.getByText('Condition:')
    }

    get productBrand() {
        return this.page.getByText('Brand:')
    }
}