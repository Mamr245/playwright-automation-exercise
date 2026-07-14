export const newUserData = {
    username: `jd${Date.now()}`,
    emailAddress: `jd${Date.now()}@example.com`,
    accountInformation: {
        title: 'Mr.',
        password: '123456fg!.',
        dayOfBirth: '24',
        monthOfBirth: 'December',
        yearOfBirth: '1990'
    },
    addressInformation: {
        firstName: 'John',
        lastName: 'Doe',
        company: 'EEW',
        address: '4693 Charter Street',
        address2: 'Apt 4B',
        country: 'United States',
        state: 'Kansas',
        city: 'Linwood',
        zipCode: '66052',
        mobileNumber: '913-723-7193',
    }
}

export const existingUser = {
    username: 'validUser',
    emailAddress: 'anotherValidEmail@example.com',
    accountInformation: {
        title: 'Mrs.',
        password: '123456fg!.',
        dayOfBirth: '5',
        monthOfBirth: 'May',
        yearOfBirth: '1992'
    },
    addressInformation: {
        firstName: 'Special',
        lastName: 'Someone',
        company: 'Special Company',
        address: '524 Washington Blvd',
        address2: 'Apt 10D',
        country: 'United States',
        state: 'Connecticut',
        city: 'Stamford',
        zipCode: '36987',
        mobileNumber: '123-456-7890',
    }
}
/*
export const existingUser = {
    username: 'validUser',
    emailAddress: 'validEmail@example.com',
    password: '123456fg!.'
}  */

export const emailToSubscribe = 'randyOrton@example.com'

export const inquiryData = {
    name: 'Wilson Smith',
    emailAddress: 'wilsmith1984@example.com',
    subject: 'Shipping price',
    message: 'Greetings! I would like to know why I\'m being charged this amount to have my order delivered. You can find my order information attached to this message'
}

export const reviewData = {
    name: 'Special One',
    emailAddress: 'special1@example.com',
    review: 'Looks good and fits my body nicely. Delivery was super fast too!'
} 

export const creditCardData = {
    name: 'John Doe',
    number: '5105 1051 0510 5100',
    cvc: '845',
    expiryMonth: '10',
    expiryYear: '2028'
}