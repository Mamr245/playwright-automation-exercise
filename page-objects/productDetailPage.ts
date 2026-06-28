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

    get thankYouForYourReviewMessage() {
        return this.page.locator('//span[contains(text(), "Thank you for your review.")]')
    }

    async addReview(name: string, email: string, review: string) {
        await this.page.locator("#name").fill(name)
        await this.page.locator("#email").fill(email)
        await this.page.locator("#review").fill(review)
        await this.page.locator('#button-review').click()
    }
}