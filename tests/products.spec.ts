import { test, expect } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"

let pm: PageManager

test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
    await pm.homePage.goTo()
    await expect(pm.homePage.header).toBeVisible()
})

test('Verify All Products and product detail page', async () => {
    
})

test('Search Product', async () => {
    const textToSearch = 'Blue'

    await pm.homePage.clickProductsLink()
    await expect(pm.productsPage.allProductsText).toBeVisible()
    await pm.productsPage.searchProduct(textToSearch)
    await expect(pm.productsPage.searchedProductsText).toBeVisible()

    /* Assert that returned search results have the text used in the search */
    const searchResults = await pm.productsPage.getSearchResults()
    searchResults.forEach(searchResult => {
        expect(searchResult).toMatch(new RegExp(textToSearch, "i")) // "i" means "Ignore Case"
    })
})