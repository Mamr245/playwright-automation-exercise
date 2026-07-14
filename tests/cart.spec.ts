import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

let pm: PageManager
  /* 
  * referenceCart => Variable used to perform assertions in some tests.
  * It will contain necessary info about the items added to cart
  * Example:
  * [
  *   { name: 'Blue Top', price: 500, totalQuantity: 1, totalPrice: 500 },
  *   { name: 'Men Tshirt', price: 400, totalQuantity: 1, totalPrice: 400 }
  * ]
  */ 
let referenceCart: object[]

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
    await pm.homePage.goTo()
    await expect(pm.homePage.header).toBeVisible()
    referenceCart = []
  })

  test('Add Products in Cart', async() => {
    // Go to products page
    await pm.homePage.clickProductsLink()

    // Add products to cart amd go to cart after adding the last one
    const itemIndexes = [0, 1]
    for (const [index, itemIndex] of itemIndexes.entries()) {
      const isLast = index === itemIndexes.length - 1;
      await pm.productsPage.addProductToCart(itemIndex, referenceCart)
      if (!isLast) {
        await pm.productsPage.clickContinueShoppingButton();
      } else {
        await pm.productsPage.clickViewCartLink()
      }
    }

    // Go to cart page and check all items are there
    const numberOfItems = await pm.cartPage.getCartNumberOfItems()
    expect(numberOfItems).toEqual(referenceCart.length)

    // For each item in the cart page, ensure the data displayed is equal to what is in the referenceCart array
    for (let i = 0; i < numberOfItems; i++) {
      const itemDescription = await pm.cartPage.getItemDescription(i)
      const referenceItemData = referenceCart.find((item: any) => item.name === itemDescription) as any
      expect(await pm.cartPage.getItemPrice(i)).toContain(`Rs. ${referenceItemData.price}`)
      expect(await pm.cartPage.getItemTotalQuantity(i)).toContain(`${referenceItemData.totalQuantity}`)
      expect(await pm.cartPage.getItemTotalPrice(i)).toContain(`Rs. ${referenceItemData.totalPrice}`)
    }
  })

  test('Verify Product quantity in Cart', async({ page }) => {
    const itemIndex = 2
    const itemQuantity = 4
    const productReference = await pm.productsPage.getProductReference(itemIndex)

    await pm.productsPage.clickViewProduct(itemIndex)
    await expect(page).toHaveURL(productReference!)
    await pm.productDetailsPage.addToCart(itemQuantity)
    await pm.productDetailsPage.clickViewCartLink()
    expect(await pm.cartPage.getItemReference(0)).toContain(productReference) 
    expect(await pm.cartPage.getItemTotalQuantity(0)).toContain(itemQuantity.toString())
  })

  test('Remove products from cart', async() => {
    // Add products to cart
    const itemIndexes = [0, 1]
    for (const itemIndex of itemIndexes) {
      await pm.productsPage.addProductToCart(itemIndex, referenceCart)
      await pm.productsPage.clickContinueShoppingButton()
    }

    // Go to cart page and check all items are there
    await pm.productsPage.clickCartLink()
    const numberOfItems = await pm.cartPage.getCartNumberOfItems()
    expect(numberOfItems).toEqual(referenceCart.length)

    // Remove first item and validate correct item was removed
    const itemToRemoveReference = await pm.cartPage.getItemReference(0)
    console.log(itemToRemoveReference)
    await pm.cartPage.removeItem(0)
    await expect(pm.cartPage.cartTable).not.toContainText(itemToRemoveReference!)
  })
})