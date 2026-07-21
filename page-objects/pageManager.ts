import { Page } from "@playwright/test";
import { HomePage } from "./homePage";
import { LoginPage } from "./loginPage";
import { SignUpPage } from "./signUpPage";
import { AccountCreatedPage } from "./accountCreatedPage";
import { AccountDeletedPage } from "./accountDeletedPage";
import { ContactUsPage } from "./contactUsPage";
import { CartPage } from "./cartPage";
import { ProductsPage } from "./productsPage";
import { ProductDetailsPage } from "./productDetailPage";
import { CheckoutPage } from "./checkoutPage";
import { PaymentPage } from "./paymentPage";
import { PaymentDonePage } from "./paymentDonePage";
import { CategoryProductsPage } from "./categoryProductsPage";
import { BrandProductsPage } from "./brandProductsPage";

export class PageManager {

    private readonly _page: Page
    private readonly _homePage: HomePage
    private readonly _loginPage: LoginPage
    private readonly _signUpPage: SignUpPage
    private readonly _accountCreatedPage: AccountCreatedPage
    private readonly _accountDeletedPage: AccountDeletedPage
    private readonly _contactUsPage: ContactUsPage
    private readonly _cartPage: CartPage
    private readonly _productsPage: ProductsPage
    private readonly _productDetailsPage: ProductDetailsPage
    private readonly _checkoutPage: CheckoutPage
    private readonly _paymentPage: PaymentPage
    private readonly _paymentDonePage: PaymentDonePage
    private readonly _categoryProductsPage: CategoryProductsPage
    private readonly _brandProductsPage: BrandProductsPage


    constructor(page: Page) {
        this._page = page
        this._homePage = new HomePage(this._page)
        this._loginPage = new LoginPage(this._page)
        this._signUpPage = new SignUpPage(this._page)
        this._accountCreatedPage = new AccountCreatedPage(this._page)
        this._accountDeletedPage = new AccountDeletedPage(this._page)
        this._contactUsPage = new ContactUsPage(this._page)
        this._cartPage = new CartPage(this._page)
        this._productsPage = new ProductsPage(this._page)
        this._productDetailsPage = new ProductDetailsPage(this._page)
        this._checkoutPage = new CheckoutPage(this._page)
        this._paymentPage = new PaymentPage(this._page)
        this._paymentDonePage = new PaymentDonePage(this._page)
        this._categoryProductsPage = new CategoryProductsPage(this._page)
        this._brandProductsPage = new BrandProductsPage(this._page)

    }

    get homePage() {
        return this._homePage
    }

    get loginPage() {
        return this._loginPage
    }

    get signUpPage() {
        return this._signUpPage
    }

    get accountCreatedPage() {
        return this._accountCreatedPage
    }

    get accountDeletedPage() {
        return this._accountDeletedPage
    }

    get contactUsPage() {
        return this._contactUsPage
    }

    get cartPage() {
        return this._cartPage
    }

    get productsPage() {
        return this._productsPage
    }

    get productDetailsPage() {
        return this._productDetailsPage
    }

    get checkoutPage() {
        return this._checkoutPage
    }

    get paymentPage() {
        return this._paymentPage
    }

    get paymentDonePage() {
        return this._paymentDonePage
    }

    get categoryProductsPage() {
        return this._categoryProductsPage
    }

    get brandProductsPage() {
        return this._brandProductsPage
    }
}