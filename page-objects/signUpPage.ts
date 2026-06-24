import { Page } from "@playwright/test"

export class SignUpPage {
    constructor(private readonly page: Page) {}

    get enterAccountInformationText() {
        return this.page.getByText('ENTER ACCOUNT INFORMATION')
    }
    
    async typeAccountInformation(accountInformation: {
        title: string,
        password: string,
        dayOfBirth: string,
        monthOfBirth: string,
        yearOfBirth: string
    }) {
        accountInformation.title == 'Mr.' ? await this.page.getByRole('radio', {name: 'Mr.'}).click() 
        : await this.page.getByRole('radio', {name: 'Mrs.'}).click() 
        await this.page.locator('[data-qa= "password"]').fill(accountInformation.password)
        await this.page.selectOption('[data-qa="days"]', accountInformation.dayOfBirth)
        await this.page.selectOption('[data-qa="months"]', accountInformation.monthOfBirth)
        await this.page.selectOption('[data-qa="years"]', accountInformation.yearOfBirth)
    }

    async typeAddressInformation(addressInformation: {
        firstName: string,
        lastName: string,
        company: string,
        address: string,
        address2: string,
        country: string,
        state: string,
        city: string,
        zipCode: string,
        mobileNumber: string,
    }) {
        await this.page.locator('[data-qa="first_name"]').fill(addressInformation.firstName)
        await this.page.locator('[data-qa="last_name"]').fill(addressInformation.lastName)
        await this.page.locator('[data-qa="company"]').fill(addressInformation.company)
        await this.page.locator('[data-qa="address"]').fill(addressInformation.address)
        await this.page.locator('[data-qa="address2"]').fill(addressInformation.address2)
        await this.page.selectOption('[data-qa="country"]', addressInformation.country)
        await this.page.locator('[data-qa="state"]').fill(addressInformation.state)
        await this.page.locator('[data-qa="city"]').fill(addressInformation.city) 
        await this.page.locator('[data-qa="zipcode"]').fill(addressInformation.zipCode) 
        await this.page.locator('[data-qa="mobile_number"]').fill(addressInformation.mobileNumber) 

    }

    async checkSignUpForNewsletter() {
        await this.page.locator('#newsletter').check()
    }

    async checkReceiveSpecialOffers() {
        await this.page.locator('#optin').check()
    } 

    async clickCreateAccount() {
        await this.page.getByRole('button', {name: 'Create Account'}).click()
    }
}   