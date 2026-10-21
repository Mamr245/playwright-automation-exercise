import { test, expect } from "../fixtures/fixture"
import { PageManager } from '../page-objects/pageManager'
import { Product } from '../types/product'
import { existingUser } from '../fixtures/testData'

let pm: PageManager
  /* 
  * referenceCart => Variable used to perform assertions in some tests.
  * It will contain necessary info about the items added to cart
  * Example:
  * [
  *   {name: 'Blue Top', productReference: '/product_details/1', price: 500, totalQuantity: 1, totalPrice: 500},
  *   {name: 'Men Tshirt', productReference: '/product_details/2', price: 400, totalQuantity: 1, totalPrice: 400}
  * ]
  */ 
let referenceCart: Product[]

test.beforeEach(async ({ page }) => {
  pm = new PageManager(page)
  await pm.homePage.goTo()
  await expect(pm.homePage.header).toBeVisible()
  referenceCart = []
})

test('Add Products in Cart', async() => {
  // Go to products page
  await pm.homePage.clickProductsLink()

  // Add products to cart and go to cart after adding the last one
  const itemIndexes = [0, 1]
  for (const [index, itemIndex] of itemIndexes.entries()) {
    const isLast = index === itemIndexes.length - 1
    await pm.productsPage.addProductToCart(itemIndex, referenceCart)
    if (!isLast) {
      await pm.productsPage.clickContinueShoppingButton()
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
    const referenceItemData = referenceCart.find((item) => item.name === itemDescription)
    expect(await pm.cartPage.getItemPrice(i)).toContain(`Rs. ${referenceItemData!.price}`)
    expect(await pm.cartPage.getItemTotalQuantity(i)).toContain(`${referenceItemData!.totalQuantity}`)
    expect(await pm.cartPage.getItemTotalPrice(i)).toContain(`Rs. ${referenceItemData!.totalPrice}`)
  }
})

test('Verify Product quantity in Cart', async({ page }) => {
  const itemIndex = 2
  const itemQuantity = 4
  const productReference = await pm.homePage.getProductReference(itemIndex)

  await pm.homePage.clickViewProduct(itemIndex)
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
    await pm.homePage.addProductToCart(itemIndex, referenceCart)
    await pm.homePage.clickContinueShoppingButton()
  }

  // Go to cart page and check all items are there
  await pm.homePage.clickCartLink()
  const numberOfItems = await pm.cartPage.getCartNumberOfItems()
  expect(numberOfItems).toEqual(referenceCart.length)

  // Remove first item and validate correct item was removed
  const itemToRemoveReference = await pm.cartPage.getItemReference(0)
  await pm.cartPage.removeItem(0)
  await expect(pm.cartPage.cartTable).not.toContainText(itemToRemoveReference!)
})

test('Add to cart from Recommended items', async() => {
  // Go to Recommended Items section
  await pm.homePage.footer.scrollIntoViewIfNeeded()
  await expect(pm.homePage.recommendedItemsText).toBeVisible()

  // Add product to cart
  const itemIndex = 1
  await pm.homePage.addProductToCart(itemIndex, referenceCart, 'recommended')
  await pm.homePage.clickViewCartLink()
  expect(await pm.cartPage.getItemReference(0)).toContain(referenceCart[0].productReference) 
})

test('Search Products and Verify Cart After Login', async() => {
  // Go to products page
  await pm.homePage.clickProductsLink()
  await expect(pm.productsPage.allProductsText).toBeVisible()

  // Search items
  const textToSearch = 'Jeans'
  await pm.productsPage.searchProduct(textToSearch)
  await expect(pm.productsPage.searchedProductsText).toBeVisible()

  // Assert that search results have the text used in the search
  const searchResults = await pm.productsPage.getSearchResults()
  searchResults.forEach(searchResult => {
      // "i" means "Ignore Case"
      expect(searchResult).toMatch(new RegExp(textToSearch, "i")) 
  })

  // Add items to cart
  for (let itemIndex = 0; itemIndex < searchResults.length; itemIndex++ ) {
    const isLast = itemIndex === searchResults.length - 1
    await pm.productsPage.addProductToCart(itemIndex, referenceCart)
    if (!isLast) {
      await pm.productsPage.clickContinueShoppingButton()
    } else {
      await pm.productsPage.clickViewCartLink()
    }
  }

  // Go to cart page and check all items are there
  let numberOfItems = await pm.cartPage.getCartNumberOfItems()
  expect(numberOfItems).toEqual(referenceCart.length)

  // For each item in the cart page, ensure the data displayed is equal to what is in the referenceCart array
  for (let i = 0; i < numberOfItems; i++) {
    const itemDescription = await pm.cartPage.getItemDescription(i)
    const referenceItemData = referenceCart.find((item) => item.name === itemDescription)
    expect(await pm.cartPage.getItemPrice(i)).toContain(`Rs. ${referenceItemData!.price}`)
    expect(await pm.cartPage.getItemTotalQuantity(i)).toContain(`${referenceItemData!.totalQuantity}`)
    expect(await pm.cartPage.getItemTotalPrice(i)).toContain(`Rs. ${referenceItemData!.totalPrice}`)
  }

  // Login
  await pm.productsPage.clickSignUpLink()
  await expect(pm.loginPage.loginToYourAccountText).toBeVisible()
  await pm.loginPage.login(existingUser.emailAddress, existingUser.accountInformation.password)
  await expect(pm.homePage.loggedInAsUserText).toContainText(existingUser.username)

  // Go to cart page and check all items are still there
  await pm.homePage.clickCartLink()
  numberOfItems = await pm.cartPage.getCartNumberOfItems()

  // Try catch is used to ensure that the cart is cleaned even if the assertions fail
  try {
    expect(numberOfItems).toEqual(referenceCart.length)
    for (let i = 0; i < numberOfItems; i++) {
      const itemDescription = await pm.cartPage.getItemDescription(i)
      const referenceItemData = referenceCart.find((item) => item.name === itemDescription)
      expect(await pm.cartPage.getItemPrice(i)).toContain(`Rs. ${referenceItemData!.price}`)
      expect(await pm.cartPage.getItemTotalQuantity(i)).toContain(`${referenceItemData!.totalQuantity}`)
      expect(await pm.cartPage.getItemTotalPrice(i)).toContain(`Rs. ${referenceItemData!.totalPrice}`)
    } 
  } finally {
    await pm.cartPage.emptyCart()
  }
})