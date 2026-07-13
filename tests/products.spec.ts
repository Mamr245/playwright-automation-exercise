import { test, expect } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"
import { reviewData } from "../fixtures/testData"

let pm: PageManager
let itemIndex: number
let productReference: string | null

test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
    await pm.homePage.goTo()
    await expect(pm.homePage.header).toBeVisible()
})

test.describe('Product Details Page', () => {
    test.beforeEach(async () => {
        await pm.homePage.clickProductsLink()
        await expect(pm.productsPage.allProductsText).toBeVisible()

        itemIndex = 0 // itemIndex = 0 refers to first item in Products page
        productReference = await pm.productsPage.getProductReference(itemIndex)
    })

    test('Verify All Products and product detail page', async ({page}) => {
        await pm.productsPage.clickViewProduct(itemIndex)
        await expect(page).toHaveURL(productReference!) //The exclamation mark indicates that productReference is surely not null
        await expect(pm.productDetailsPage.productName).toHaveText(/\S+/) // /\S+/ => regex expression to match one or more non-whitespace characters
        await expect(pm.productDetailsPage.productCategory).toBeVisible()
        await expect(pm.productDetailsPage.productPrice).toBeVisible()
        await expect(pm.productDetailsPage.productAvailabilty).toBeVisible()
        await expect(pm.productDetailsPage.productCondition).toBeVisible()
        await expect(pm.productDetailsPage.productBrand).toBeVisible()
    })

    test('Add review on product', async ({page}) => {
        await pm.productsPage.clickViewProduct(itemIndex)
        await expect(page).toHaveURL(productReference!)
        await pm.productDetailsPage.addReview(reviewData.name, reviewData.email, reviewData.review)
        await expect(pm.productDetailsPage.thankYouForYourReviewMessage).toBeVisible()
    })

    test('Search Product', async () => {
        const textToSearch = 'Blue'

        await pm.productsPage.searchProduct(textToSearch)
        await expect(pm.productsPage.searchedProductsText).toBeVisible()

        // Assert that search results have the text used in the search
        const searchResults = await pm.productsPage.getSearchResults()
        searchResults.forEach(searchResult => {
            expect(searchResult).toMatch(new RegExp(textToSearch, "i")) // "i" means "Ignore Case"
        })
    })
})

test('View Category Products', async () => {
    await pm.homePage.clickCategory('Women', 'TOPS')
    await expect(pm.productsPage.womenTopsProductsText).toBeVisible()
    await pm.productsPage.clickCategory('Men', 'JEANS')
    await expect(pm.productsPage.menJeansProductsText).toBeVisible()
})