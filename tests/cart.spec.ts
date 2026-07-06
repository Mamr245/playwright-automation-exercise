import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

let pm: PageManager
let itemIndexes: Array<number>
let referenceCart: Array<object>

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
    await pm.homePage.goTo()
    await expect(pm.homePage.header).toBeVisible()
  })

  test('Add Products in Cart', async() => {
    /* 
    * Variable used to perform assertions later in the test.
    * Will have all items' names, prices and quantities 
    */ 
    referenceCart = [] 

    /* 
    * Variable used to define which items to add to cart
    * itemIndex = 0 refers to first item in Products page
    * itemIndex = 1 refers to second item in Products page
    * And so on... 
    */
    itemIndexes = [0, 1]
    await pm.homePage.clickProductsLink()

    // Add products to cart
    for (const itemIndex of itemIndexes) {
      await pm.productsPage.addProductToCart(itemIndex, referenceCart)
      await pm.productsPage.clickContinueShoppingButton()
    }

    // Go to cart page and check all items are there
    await pm.productsPage.clickCartLink()
    const numberOfItems = await pm.cartPage.getCartNumberOfItems()
    expect(numberOfItems).toEqual(referenceCart.length)

    // For each item in the cart page, ensure the data displayed is equal to what is in the referenceCart array
    for (let i = 1; i <= numberOfItems; i++) {
      const itemDescription = await pm.cartPage.getItemDescription(i)
      const referenceItemData = referenceCart.find((item: any) => item.name === itemDescription) as any;
      expect(await pm.cartPage.getItemPrice(i)).toContain(`Rs. ${referenceItemData.price}`)
      expect(await pm.cartPage.getItemTotalQuantity(i)).toContain(`${referenceItemData.totalQuantity}`)
      expect(await pm.cartPage.getItemTotalPrice(i)).toContain(`Rs. ${referenceItemData.totalPrice}`)
    }
  })
});
