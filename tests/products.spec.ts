import { test, expect } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"
import { reviewData } from "../fixtures/testData"

let pm: PageManager
let itemIndex: number
let productReference: string

test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
    await pm.homePage.goTo()
    await expect(pm.homePage.header).toBeVisible()
})

test.describe('Products and Product Details Page', () => {
    test.beforeEach(async () => {
        await pm.homePage.clickProductsLink()
        await expect(pm.productsPage.allProductsText).toBeVisible()
        
        itemIndex = 0 // First item in Products page
        productReference = await pm.productsPage.getProductReference(itemIndex)
    })

    test('Verify All Products and product detail page', async ({page}) => {
        await pm.productsPage.clickViewProduct(itemIndex)
        // The non-null assertion (!) tells TypeScript that productReference cannot be null here.
        await expect(page).toHaveURL(productReference) //The exclamation mark indicates that productReference is surely not null
        // /\S+/ => regex expression to match one or more non-whitespace characters
        await expect(pm.productDetailsPage.productName).toHaveText(/\S+/) 
        await expect(pm.productDetailsPage.productCategory).toBeVisible()
        await expect(pm.productDetailsPage.productPrice).toBeVisible()
        await expect(pm.productDetailsPage.productAvailabilty).toBeVisible()
        await expect(pm.productDetailsPage.productCondition).toBeVisible()
        await expect(pm.productDetailsPage.productBrand).toBeVisible()
    })

    test('Add review on product', async ({page}) => {
        await pm.productsPage.clickViewProduct(itemIndex)
        await expect(page).toHaveURL(productReference!)
        await pm.productDetailsPage.addReview(reviewData.name, reviewData.emailAddress, reviewData.review)
        await expect(pm.productDetailsPage.thankYouForYourReviewMessage).toBeVisible()
    })

    test('Search Product', async () => {
        const textToSearch = 'Blue'
        await pm.productsPage.searchProduct(textToSearch)
        await expect(pm.productsPage.searchedProductsText).toBeVisible()

        // Assert that search results have the text used in the search
        const searchResults = await pm.productsPage.getSearchResults()
        searchResults.forEach(searchResult => {
            // "i" means "Ignore Case"
            expect(searchResult).toMatch(new RegExp(textToSearch, "i")) 
        })
    })

    test('View & Cart Brand Products', async() => {
        let brand = 'Polo'
        let brandProcuts = ['Fancy Green Top', 'Green Side Placket Detail T-Shirt', 'Grunt Blue Slim Fit Jeans']

        await expect(pm.productsPage.brandsText).toBeVisible()
        await pm.homePage.clickBrand(brand)
        await expect(pm.brandProductsPage.brandSectionTitle).toHaveText(`Brand - ${brand} Products`)
        for (const productName of brandProcuts) {
            await expect(pm.brandProductsPage.productCard(productName)).toBeVisible()
        }

        brand = 'Mast & Harbour'
        brandProcuts = ['Winter Top', 'Lace Top For Women', 'GRAPHIC DESIGN MEN T SHIRT - BLUE']
        await pm.brandProductsPage.clickBrand(brand)
        await expect(pm.brandProductsPage.brandSectionTitle).toHaveText(`Brand - ${brand} Products`)
        for (const productName of brandProcuts) {
            await expect(pm.brandProductsPage.productCard(productName)).toBeVisible()
        }
    })
})

test('View Category Products', async() => {
    await expect(pm.homePage.categoryText).toBeVisible()
    await pm.homePage.clickCategory('Women', 'TOPS')
    await expect(pm.categoryProductsPage.womenTopsProductsText).toBeVisible()
    await pm.categoryProductsPage.clickCategory('Men', 'JEANS')
    await expect(pm.categoryProductsPage.menJeansProductsText).toBeVisible()
})
