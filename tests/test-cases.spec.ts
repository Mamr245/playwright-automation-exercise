import { test, expect } from "../fixtures/fixture"
import { PageManager } from "../page-objects/pageManager"

let pm: PageManager

test('Verify Test Cases Page', async({ page }) => {
    pm = new PageManager(page)
    await pm.homePage.goTo()
    await expect(pm.homePage.header).toBeVisible()
    
    pm.homePage.clickTestCasesButton()
    await expect(page).toHaveURL('/test_cases')
})