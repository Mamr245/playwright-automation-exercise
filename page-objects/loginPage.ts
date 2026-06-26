import { Page } from "@playwright/test"

export class LoginPage {
    constructor(private readonly page: Page) {}
    
    get newUserSignUpText() {
        return this.page.getByText('New User Signup!')
    }

    get loginToYourAccountText() {
        return this.page.getByText('Login to your account')
    }

    get emailAlredyExistsText () {
        return this.page.getByText('Email Address already exist!')
    }

    get incorrectEmailPasswordText () {
        return this.page.getByText('Your email or password is incorrect!')
    }

    async register(username: string, emailAddress: string) {
        await this.page.getByTestId('signup-name').fill(username)
        await this.page.getByTestId('signup-email').fill(emailAddress)
        await this.page.getByRole('button', {name: 'Signup'}).click()
    }

    async login(emailAddress: string, password: string) {
        await this.page.getByTestId('login-email').fill(emailAddress)
        await this.page.getByTestId('login-password').fill(password)
        await this.page.getByRole('button', {name: 'Login'}).click()
    }
}