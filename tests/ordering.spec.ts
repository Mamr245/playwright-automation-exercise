import { test, expect } from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"
import { creditCardData, newUserData } from "../fixtures/testData"
import { existingUser } from "../fixtures/testData"
import { Product } from "../types/product"


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

test('Place Order: Register while Checkout', async() => {
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

  // Start checkout
  await pm.cartPage.clickProceedToCheckoutLink()
  await pm.cartPage.clickRegisterLoginLink()

  // Register
  await pm.loginPage.register(newUserData.username, newUserData.emailAddress)
  await expect(pm.signUpPage.enterAccountInformationText).toBeVisible()
  await pm.signUpPage.typeAccountInformation(newUserData.accountInformation)
  await pm.signUpPage.typeAddressInformation(newUserData.addressInformation)
  await pm.signUpPage.clickCreateAccount()
  await expect(pm.accountCreatedPage.accountCreatedText).toBeVisible()
  await pm.accountCreatedPage.clickContinueButton()
  await expect(pm.homePage.loggedInAsUserText).toContainText(newUserData.username)

  // Continue checkout
  await pm.homePage.clickCartLink()
  await pm.cartPage.clickProceedToCheckoutLink()

  // Validate delivery address details
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.accountInformation.title)
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.addressInformation.firstName)
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.addressInformation.lastName)
  await expect(pm.checkoutPage.deliveryAddress_CompanyName).toContainText(newUserData.addressInformation.company)
  await expect(pm.checkoutPage.deliveryAddress_StreetAndNumber).toContainText(newUserData.addressInformation.address)
  await expect(pm.checkoutPage.deliveryAddress_AptInfo).toContainText(newUserData.addressInformation.address2)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.city)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.state)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.zipCode)
  await expect(pm.checkoutPage.deliveryAddress_Country).toContainText(newUserData.addressInformation.country)
  await expect(pm.checkoutPage.deliveryAddress_mobileNumber).toContainText(newUserData.addressInformation.mobileNumber)

  // Validate billing address details
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.accountInformation.title)
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.addressInformation.firstName)
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.addressInformation.lastName)
  await expect(pm.checkoutPage.billingAddress_CompanyName).toContainText(newUserData.addressInformation.company)
  await expect(pm.checkoutPage.billingAddress_StreetAndNumber).toContainText(newUserData.addressInformation.address)
  await expect(pm.checkoutPage.billingAddress_AptInfo).toContainText(newUserData.addressInformation.address2)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.city)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.state)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.zipCode)
  await expect(pm.checkoutPage.billingAddress_Country).toContainText(newUserData.addressInformation.country)
  await expect(pm.checkoutPage.billingAddress_mobileNumber).toContainText(newUserData.addressInformation.mobileNumber)

  // For each item in the order review table, ensure the data displayed is equal to what is in the referenceCart array
  for (let i = 0; i < numberOfItems; i++) {
    const itemDescription = await pm.checkoutPage.getItemDescription(i)
    const referenceItemData = referenceCart.find((item) => item.name === itemDescription)
    expect(await pm.checkoutPage.getItemPrice(i)).toContain(`Rs. ${referenceItemData!.price}`)
    expect(await pm.checkoutPage.getItemTotalQuantity(i)).toContain(`${referenceItemData!.totalQuantity}`)
    expect(await pm.checkoutPage.getItemTotalPrice(i)).toContain(`Rs. ${referenceItemData!.totalPrice}`)
  }

  // Validate total amount to be charged
  const totalOrderAmount = (referenceCart).reduce((sum, item) => sum + item.totalPrice, 0)
  expect(pm.checkoutPage.totalOrderAmount).toContainText(`Rs. ${totalOrderAmount}`)

  // Enter comment and click "place order"
  await pm.checkoutPage.typeComment('This order MUST arrive on time! Thank you!')
  await pm.checkoutPage.clickPlaceOrderButton()

  // Fill credit card details and confirm order
  await pm.paymentPage.fillPaymentDetails(
    creditCardData.name,
    creditCardData.number,
    creditCardData.cvc,
    creditCardData.expiryMonth,
    creditCardData.expiryYear
  )
  await pm.paymentPage.clickPayAndConfirmOrderButton()
  await expect(pm.paymentDonePage.orderPlacedText).toBeVisible()
  await pm.paymentDonePage.clickContinueButton()

  // Delete account
  await pm.homePage.clickDeleteAccountLink()
  await expect(pm.accountDeletedPage.accountDeletedText).toBeVisible()
  await pm.accountDeletedPage.clickContinueButton()
})

test('Place Order: Register before Checkout', async() => {
  // Register user
  await pm.homePage.clickSignUpLink()
  await expect(pm.loginPage.newUserSignUpText).toBeVisible()
  await pm.loginPage.register(newUserData.username, newUserData.emailAddress)
  await expect(pm.signUpPage.enterAccountInformationText).toBeVisible()
  await pm.signUpPage.typeAccountInformation(newUserData.accountInformation)
  await pm.signUpPage.typeAddressInformation(newUserData.addressInformation)
  await pm.signUpPage.clickCreateAccount()
  await expect(pm.accountCreatedPage.accountCreatedText).toBeVisible()
  await pm.accountCreatedPage.clickContinueButton()
  await expect(pm.homePage.loggedInAsUserText).toContainText(newUserData.username)

  // Add products to cart
  await pm.homePage.clickProductsLink()
  const itemIndexes = [0, 1]
  for (const itemIndex of itemIndexes) {
    await pm.homePage.addProductToCart(itemIndex, referenceCart)
    await pm.homePage.clickContinueShoppingButton()
  }

  // Go to cart page and check all items are there
  await pm.homePage.clickCartLink()
  const numberOfItems = await pm.cartPage.getCartNumberOfItems()
  expect(numberOfItems).toEqual(referenceCart.length)

  // Start Checkout
  await pm.cartPage.clickProceedToCheckoutLink()

  // Validate delivery address details
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.accountInformation.title)
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.addressInformation.firstName)
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.addressInformation.lastName)
  await expect(pm.checkoutPage.deliveryAddress_CompanyName).toContainText(newUserData.addressInformation.company)
  await expect(pm.checkoutPage.deliveryAddress_StreetAndNumber).toContainText(newUserData.addressInformation.address)
  await expect(pm.checkoutPage.deliveryAddress_AptInfo).toContainText(newUserData.addressInformation.address2)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.city)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.state)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.zipCode)
  await expect(pm.checkoutPage.deliveryAddress_Country).toContainText(newUserData.addressInformation.country)
  await expect(pm.checkoutPage.deliveryAddress_mobileNumber).toContainText(newUserData.addressInformation.mobileNumber)

  // Validate billing address details
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.accountInformation.title)
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.addressInformation.firstName)
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.addressInformation.lastName)
  await expect(pm.checkoutPage.billingAddress_CompanyName).toContainText(newUserData.addressInformation.company)
  await expect(pm.checkoutPage.billingAddress_StreetAndNumber).toContainText(newUserData.addressInformation.address)
  await expect(pm.checkoutPage.billingAddress_AptInfo).toContainText(newUserData.addressInformation.address2)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.city)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.state)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.zipCode)
  await expect(pm.checkoutPage.billingAddress_Country).toContainText(newUserData.addressInformation.country)
  await expect(pm.checkoutPage.billingAddress_mobileNumber).toContainText(newUserData.addressInformation.mobileNumber)

  // For each item in the order review table, ensure the data displayed is equal to what is in the referenceCart array
  for (let i = 0; i < numberOfItems; i++) {
    const itemDescription = await pm.checkoutPage.getItemDescription(i)
    const referenceItemData = referenceCart.find((item) => item.name === itemDescription)
    expect(await pm.checkoutPage.getItemPrice(i)).toContain(`Rs. ${referenceItemData!.price}`)
    expect(await pm.checkoutPage.getItemTotalQuantity(i)).toContain(`${referenceItemData!.totalQuantity}`)
    expect(await pm.checkoutPage.getItemTotalPrice(i)).toContain(`Rs. ${referenceItemData!.totalPrice}`)
  }

  // Validate total amount to be charged
  const totalOrderAmount = (referenceCart).reduce((sum, item) => sum + item.totalPrice, 0)
  expect(pm.checkoutPage.totalOrderAmount).toContainText(`Rs. ${totalOrderAmount}`)

  // Enter comment and click "place order"
  await pm.checkoutPage.typeComment('This order MUST arrive on time! Thank you!')
  await pm.checkoutPage.clickPlaceOrderButton()

  // Fill credit card details and confirm order
  await pm.paymentPage.fillPaymentDetails(
    creditCardData.name,
    creditCardData.number,
    creditCardData.cvc,
    creditCardData.expiryMonth,
    creditCardData.expiryYear
  )
  await pm.paymentPage.clickPayAndConfirmOrderButton()
  await expect(pm.paymentDonePage.orderPlacedText).toBeVisible()
  await pm.paymentDonePage.clickContinueButton()

  // Delete account
  await pm.homePage.clickDeleteAccountLink()
  await expect(pm.accountDeletedPage.accountDeletedText).toBeVisible()
  await pm.accountDeletedPage.clickContinueButton()
})

test('Verify address details in checkout page', async() => {
  // Go to Signup/Login page
  await pm.homePage.clickSignUpLink()
  await expect(pm.loginPage.newUserSignUpText).toBeVisible()

  // Fill user details
  await pm.loginPage.register(newUserData.username, newUserData.emailAddress)
  await expect(pm.signUpPage.enterAccountInformationText).toBeVisible()
    
  await pm.signUpPage.typeAccountInformation(newUserData.accountInformation)
  await pm.signUpPage.typeAddressInformation(newUserData.addressInformation)
  await pm.signUpPage.clickCreateAccount()
  await expect(pm.accountCreatedPage.accountCreatedText).toBeVisible()
  await pm.accountCreatedPage.clickContinueButton()
  await expect(pm.homePage.loggedInAsUserText).toContainText(newUserData.username)

  // Go to products page
  await pm.homePage.clickProductsLink()

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

  // Start Checkout
  await pm.cartPage.clickProceedToCheckoutLink()

  // Validate delivery address details
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.accountInformation.title)
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.addressInformation.firstName)
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.addressInformation.lastName)
  await expect(pm.checkoutPage.deliveryAddress_CompanyName).toContainText(newUserData.addressInformation.company)
  await expect(pm.checkoutPage.deliveryAddress_StreetAndNumber).toContainText(newUserData.addressInformation.address)
  await expect(pm.checkoutPage.deliveryAddress_AptInfo).toContainText(newUserData.addressInformation.address2)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.city)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.state)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.zipCode)
  await expect(pm.checkoutPage.deliveryAddress_Country).toContainText(newUserData.addressInformation.country)
  await expect(pm.checkoutPage.deliveryAddress_mobileNumber).toContainText(newUserData.addressInformation.mobileNumber)

  // Validate billing address details
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.accountInformation.title)
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.addressInformation.firstName)
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.addressInformation.lastName)
  await expect(pm.checkoutPage.billingAddress_CompanyName).toContainText(newUserData.addressInformation.company)
  await expect(pm.checkoutPage.billingAddress_StreetAndNumber).toContainText(newUserData.addressInformation.address)
  await expect(pm.checkoutPage.billingAddress_AptInfo).toContainText(newUserData.addressInformation.address2)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.city)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.state)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.zipCode)
  await expect(pm.checkoutPage.billingAddress_Country).toContainText(newUserData.addressInformation.country)
  await expect(pm.checkoutPage.billingAddress_mobileNumber).toContainText(newUserData.addressInformation.mobileNumber)

  // Delete account
  await pm.homePage.clickDeleteAccountLink()
  await expect(pm.accountDeletedPage.accountDeletedText).toBeVisible()
  await pm.accountDeletedPage.clickContinueButton()
})

test('Login before Checkout', async({ page }) => {
  // Login with valid credentials
  await pm.homePage.clickSignUpLink()
  await expect(pm.loginPage.loginToYourAccountText).toBeVisible()
  await pm.loginPage.login(existingUser.emailAddress, existingUser.accountInformation.password)
  await expect(pm.homePage.loggedInAsUserText).toContainText(existingUser.username)

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

  // Start Checkout
  await pm.cartPage.clickProceedToCheckoutLink()

  // Validate delivery address details
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(existingUser.accountInformation.title)
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(existingUser.addressInformation.firstName)
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(existingUser.addressInformation.lastName)
  await expect(pm.checkoutPage.deliveryAddress_CompanyName).toContainText(existingUser.addressInformation.company)
  await expect(pm.checkoutPage.deliveryAddress_StreetAndNumber).toContainText(existingUser.addressInformation.address)
  await expect(pm.checkoutPage.deliveryAddress_AptInfo).toContainText(existingUser.addressInformation.address2)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(existingUser.addressInformation.city)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(existingUser.addressInformation.state)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(existingUser.addressInformation.zipCode)
  await expect(pm.checkoutPage.deliveryAddress_Country).toContainText(existingUser.addressInformation.country)
  await expect(pm.checkoutPage.deliveryAddress_mobileNumber).toContainText(existingUser.addressInformation.mobileNumber)

  // Validate billing address details
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(existingUser.accountInformation.title)
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(existingUser.addressInformation.firstName)
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(existingUser.addressInformation.lastName)
  await expect(pm.checkoutPage.billingAddress_CompanyName).toContainText(existingUser.addressInformation.company)
  await expect(pm.checkoutPage.billingAddress_StreetAndNumber).toContainText(existingUser.addressInformation.address)
  await expect(pm.checkoutPage.billingAddress_AptInfo).toContainText(existingUser.addressInformation.address2)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(existingUser.addressInformation.city)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(existingUser.addressInformation.state)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(existingUser.addressInformation.zipCode)
  await expect(pm.checkoutPage.billingAddress_Country).toContainText(existingUser.addressInformation.country)
  await expect(pm.checkoutPage.billingAddress_mobileNumber).toContainText(existingUser.addressInformation.mobileNumber)

  // For each item in the order review table, ensure the data displayed is equal to what is in the referenceCart array
  for (let i = 0; i < numberOfItems; i++) {
    const itemDescription = await pm.checkoutPage.getItemDescription(i)
    const referenceItemData = referenceCart.find((item) => item.name === itemDescription)
    expect(await pm.checkoutPage.getItemPrice(i)).toContain(`Rs. ${referenceItemData!.price}`)
    expect(await pm.checkoutPage.getItemTotalQuantity(i)).toContain(`${referenceItemData!.totalQuantity}`)
    expect(await pm.checkoutPage.getItemTotalPrice(i)).toContain(`Rs. ${referenceItemData!.totalPrice}`)
  }

  // Validate total amount to be charged
  const totalOrderAmount = (referenceCart).reduce((sum, item) => sum + item.totalPrice, 0)
  expect(pm.checkoutPage.totalOrderAmount).toContainText(`Rs. ${totalOrderAmount}`)

  // Enter comment and click "place order"
  await pm.checkoutPage.typeComment('This order MUST arrive on time! Thank you!')
  await pm.checkoutPage.clickPlaceOrderButton()

  // Fill credit card details and confirm order
  await pm.paymentPage.fillPaymentDetails(
    creditCardData.name,
    creditCardData.number,
    creditCardData.cvc,
    creditCardData.expiryMonth,
    creditCardData.expiryYear
  )
  await pm.paymentPage.clickPayAndConfirmOrderButton()
  await expect(pm.paymentDonePage.orderPlacedText).toBeVisible()
  await pm.paymentDonePage.clickContinueButton()
  await expect(page).toHaveURL('/')
})

test('Download Invoice after purchase order', async({ page }) => {
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

  // Start checkout
  await pm.cartPage.clickProceedToCheckoutLink()
  await pm.cartPage.clickRegisterLoginLink()

  // Register
  await pm.loginPage.register(newUserData.username, newUserData.emailAddress)
  await expect(pm.signUpPage.enterAccountInformationText).toBeVisible()
  await pm.signUpPage.typeAccountInformation(newUserData.accountInformation)
  await pm.signUpPage.typeAddressInformation(newUserData.addressInformation)
  await pm.signUpPage.clickCreateAccount()
  await expect(pm.accountCreatedPage.accountCreatedText).toBeVisible()
  await pm.accountCreatedPage.clickContinueButton()
  await expect(pm.homePage.loggedInAsUserText).toContainText(newUserData.username)

  // Continue checkout
  await pm.homePage.clickCartLink()
  await pm.cartPage.clickProceedToCheckoutLink()

  // Validate delivery address details
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.accountInformation.title)
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.addressInformation.firstName)
  await expect(pm.checkoutPage.deliveryAddress_firstAndLastName).toContainText(newUserData.addressInformation.lastName)
  await expect(pm.checkoutPage.deliveryAddress_CompanyName).toContainText(newUserData.addressInformation.company)
  await expect(pm.checkoutPage.deliveryAddress_StreetAndNumber).toContainText(newUserData.addressInformation.address)
  await expect(pm.checkoutPage.deliveryAddress_AptInfo).toContainText(newUserData.addressInformation.address2)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.city)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.state)
  await expect(pm.checkoutPage.deliveryAddress_StateCityZipCode).toContainText(newUserData.addressInformation.zipCode)
  await expect(pm.checkoutPage.deliveryAddress_Country).toContainText(newUserData.addressInformation.country)
  await expect(pm.checkoutPage.deliveryAddress_mobileNumber).toContainText(newUserData.addressInformation.mobileNumber)

  // Validate billing address details
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.accountInformation.title)
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.addressInformation.firstName)
  await expect(pm.checkoutPage.billingAddress_firstAndLastName).toContainText(newUserData.addressInformation.lastName)
  await expect(pm.checkoutPage.billingAddress_CompanyName).toContainText(newUserData.addressInformation.company)
  await expect(pm.checkoutPage.billingAddress_StreetAndNumber).toContainText(newUserData.addressInformation.address)
  await expect(pm.checkoutPage.billingAddress_AptInfo).toContainText(newUserData.addressInformation.address2)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.city)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.state)
  await expect(pm.checkoutPage.billingAddress_StateCityZipCode).toContainText(newUserData.addressInformation.zipCode)
  await expect(pm.checkoutPage.billingAddress_Country).toContainText(newUserData.addressInformation.country)
  await expect(pm.checkoutPage.billingAddress_mobileNumber).toContainText(newUserData.addressInformation.mobileNumber)

  // For each item in the order review table, ensure the data displayed is equal to what is in the referenceCart array
  for (let i = 0; i < numberOfItems; i++) {
    const itemDescription = await pm.checkoutPage.getItemDescription(i)
    const referenceItemData = referenceCart.find((item) => item.name === itemDescription)
    expect(await pm.checkoutPage.getItemPrice(i)).toContain(`Rs. ${referenceItemData!.price}`)
    expect(await pm.checkoutPage.getItemTotalQuantity(i)).toContain(`${referenceItemData!.totalQuantity}`)
    expect(await pm.checkoutPage.getItemTotalPrice(i)).toContain(`Rs. ${referenceItemData!.totalPrice}`)
  }

  // Validate total amount to be charged
  const totalOrderAmount = (referenceCart).reduce((sum, item) => sum + item.totalPrice, 0)
  expect(pm.checkoutPage.totalOrderAmount).toContainText(`Rs. ${totalOrderAmount}`)

  // Enter comment and click "place order"
  await pm.checkoutPage.typeComment('This order MUST arrive on time! Thank you!')
  await pm.checkoutPage.clickPlaceOrderButton()

  // Fill credit card details and confirm order
  await pm.paymentPage.fillPaymentDetails(
    creditCardData.name,
    creditCardData.number,
    creditCardData.cvc,
    creditCardData.expiryMonth,
    creditCardData.expiryYear
  )
  await pm.paymentPage.clickPayAndConfirmOrderButton()
  await expect(pm.paymentDonePage.orderPlacedText).toBeVisible()

  // Download invoice
  const downloadPromise = page.waitForEvent('download')
  await pm.paymentDonePage.clickDownloadInvoiceButton()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('invoice.txt')

  // Delete account
  await pm.homePage.clickDeleteAccountLink()
  await expect(pm.accountDeletedPage.accountDeletedText).toBeVisible()
  await pm.accountDeletedPage.clickContinueButton()
})
