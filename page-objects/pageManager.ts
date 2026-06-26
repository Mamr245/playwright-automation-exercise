import { Page } from "@playwright/test";
import { HomePage } from "./homePage";
import { LoginPage } from "./loginPage";
import { SignUpPage } from "./signUpPage";
import { AccountCreatedPage } from "./accountCreatedPage";
import { AccountDeletedPage } from "./accountDeletedPage";
import { ContactUsPage } from "./contactUsPage";
import { TestCasesPage } from "./testCasesPage";
import { CartPage } from "./cartPage";

export class PageManager {

    private readonly _page: Page
    private readonly _homePage: HomePage
    private readonly _loginPage: LoginPage
    private readonly _signUpPage: SignUpPage
    private readonly _accountCreatedPage: AccountCreatedPage
    private readonly _accountDeletedPage: AccountDeletedPage
    private readonly _contactUsPage: ContactUsPage
    private readonly _testCasesPage: TestCasesPage
    private readonly _cartPage: CartPage
    
    constructor(page: Page) {
        this._page = page
        this._homePage = new HomePage(this._page)
        this._loginPage = new LoginPage(this._page)
        this._signUpPage = new SignUpPage(this._page)
        this._accountCreatedPage = new AccountCreatedPage(this._page)
        this._accountDeletedPage = new AccountDeletedPage(this._page)
        this._contactUsPage = new ContactUsPage(this._page)
        this._testCasesPage = new TestCasesPage(this._page)
        this._cartPage = new CartPage(this._page)

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

    get testCasesPage() {
        return this._testCasesPage
    }

    get cartPage() {
        return this._cartPage
    }
}