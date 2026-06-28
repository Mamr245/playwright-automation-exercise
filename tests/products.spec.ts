import { test, expect } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"

let pm: PageManager

test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
    await pm.homePage.goTo()
    await expect(pm.homePage.header).toBeVisible()
    await pm.homePage.clickProductsLink()
    await expect(pm.productsPage.allProductsText).toBeVisible()
})

test('Verify All Products and product detail page', async ({page}) => {
    /* 
        itemIndex = 0 refers to first item in Products page
        itemIndex = 1 refers to second item in Products page
        And so on... 
    */
    const itemIndex = 0
    const productReference = await pm.productsPage.getProductReference(itemIndex)

    await pm.productsPage.clickViewProduct(itemIndex)
    await expect(page).toHaveURL(productReference!) //The exclamation mark indicates that productReference is surely not null

    await expect(pm.productDetailsPage.productName).toHaveText(/\S+/) // /\S+/ => regex expression to match one or more non-whitespace characters
    await expect(pm.productDetailsPage.productCategory).toBeVisible()
    await expect(pm.productDetailsPage.productPrice).toBeVisible()
    await expect(pm.productDetailsPage.productAvailabilty).toBeVisible()
    await expect(pm.productDetailsPage.productCondition).toBeVisible()
    await expect(pm.productDetailsPage.productBrand).toBeVisible()
})

test('Search Product', async () => {
    const textToSearch = 'Blue'

    await pm.productsPage.searchProduct(textToSearch)
    await expect(pm.productsPage.searchedProductsText).toBeVisible()

    /* Assert that returned search results have the text used in the search */
    const searchResults = await pm.productsPage.getSearchResults()
    searchResults.forEach(searchResult => {
        expect(searchResult).toMatch(new RegExp(textToSearch, "i")) // "i" means "Ignore Case"
    })
})