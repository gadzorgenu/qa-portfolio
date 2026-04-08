const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('chromedriver');

const BASE_URL = 'https://automationexercise.com';
const EXISTING_EMAIL = 'g@mi';
const TIMEOUT = 10000;

const uniqueEmail = () => `testuser_${Date.now()}@mailtest.com`;

const waitFor = async (driver, locator) => {
    return await driver.wait(until.elementLocated(locator), TIMEOUT);
};

// -----------------------------------------------
// TC-001: Successful registration with valid details
// -----------------------------------------------
const testSuccessfulRegistration = async () => {
    console.log('Running: TC-001 Successful registration with valid details...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(BASE_URL);

        // Navigate to login/signup page
        const loginLink = await waitFor(driver, By.css('a[href="/login"]'));
        await loginLink.click();
        await driver.wait(until.urlContains('/login'), TIMEOUT);

        // Fill in the "New User Signup!" section
        const nameField = await waitFor(driver, By.css('input[data-qa="signup-name"]'));
        await nameField.sendKeys('Test User');

        const emailField = await waitFor(driver, By.css('input[data-qa="signup-email"]'));
        await emailField.sendKeys(uniqueEmail());

        const signupButton = await waitFor(driver, By.css('button[data-qa="signup-button"]'));
        await signupButton.click();

        // Should land on the full account info form
        await driver.wait(until.urlContains('/signup'), TIMEOUT);

        // Select title (Mr)
        const titleRadio = await waitFor(driver, By.id('id_gender1'));
        await titleRadio.click();

        // Fill password
        const passwordField = await waitFor(driver, By.css('input[data-qa="password"]'));
        await passwordField.sendKeys('SecurePass@123');

        // Fill date of birth
        const daysSelect = await waitFor(driver, By.css('select[data-qa="days"]'));
        await daysSelect.sendKeys('15');

        const monthsSelect = await waitFor(driver, By.css('select[data-qa="months"]'));
        await monthsSelect.sendKeys('June');

        const yearsSelect = await waitFor(driver, By.css('select[data-qa="years"]'));
        await yearsSelect.sendKeys('1995');

        // Opt-in checkboxes
        const newsletter = await waitFor(driver, By.id('newsletter'));
        await newsletter.click();

        const optin = await waitFor(driver, By.id('optin'));
        await optin.click();

        // Fill address details
        await (await waitFor(driver, By.css('input[data-qa="first_name"]'))).sendKeys('Test');
        await (await waitFor(driver, By.css('input[data-qa="last_name"]'))).sendKeys('User');
        await (await waitFor(driver, By.css('input[data-qa="company"]'))).sendKeys('QA Corp');
        await (await waitFor(driver, By.css('input[data-qa="address"]'))).sendKeys('123 Test Street');
        await (await waitFor(driver, By.css('input[data-qa="address2"]'))).sendKeys('Suite 4');

        const countrySelect = await waitFor(driver, By.css('select[data-qa="country"]'));
        await countrySelect.sendKeys('United States');

        await (await waitFor(driver, By.css('input[data-qa="state"]'))).sendKeys('California');
        await (await waitFor(driver, By.css('input[data-qa="city"]'))).sendKeys('San Francisco');
        await (await waitFor(driver, By.css('input[data-qa="zipcode"]'))).sendKeys('94105');
        await (await waitFor(driver, By.css('input[data-qa="mobile_number"]'))).sendKeys('4155550100');

        // Submit
        const createBtn = await waitFor(driver, By.css('button[data-qa="create-account"]'));
        await createBtn.click();

        // Assert Account Created page
        await driver.wait(until.urlContains('/account_created'), TIMEOUT);
        const successHeading = await waitFor(driver, By.css('h2[data-qa="account-created"]'));
        const isDisplayed = await successHeading.isDisplayed();

        if (isDisplayed) {
            console.log('✓ TC-001 PASSED: Account Created! page shown');
        } else {
            console.log('✗ TC-001 FAILED: Account Created heading not visible');
        }

    } catch (error) {
        console.log('✗ TC-001 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-002: Register with an already registered email
// -----------------------------------------------
const testDuplicateEmail = async () => {
    console.log('Running: TC-002 Register with already registered email...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(BASE_URL);

        const loginLink = await waitFor(driver, By.css('a[href="/login"]'));
        await loginLink.click();
        await driver.wait(until.urlContains('/login'), TIMEOUT);

        const nameField = await waitFor(driver, By.css('input[data-qa="signup-name"]'));
        await nameField.sendKeys('Duplicate User');

        const emailField = await waitFor(driver, By.css('input[data-qa="signup-email"]'));
        await emailField.sendKeys(EXISTING_EMAIL);

        const signupButton = await waitFor(driver, By.css('button[data-qa="signup-button"]'));
        await signupButton.click();

        // Assert inline error message
        const errorMsg = await waitFor(driver, By.xpath(
            '//*[contains(text(), "Email Address already exist!")]'
        ));
        const isDisplayed = await errorMsg.isDisplayed();

        const currentUrl = await driver.getCurrentUrl();
        const staysOnPage = currentUrl.includes('/login');

        if (isDisplayed && staysOnPage) {
            console.log('✓ TC-002 PASSED: Duplicate email error shown, user stays on login page');
        } else {
            console.log('✗ TC-002 FAILED: Expected error message or URL mismatch');
        }

    } catch (error) {
        console.log('✗ TC-002 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-003: Register with empty name and email
// -----------------------------------------------
const testEmptySignupFields = async () => {
    console.log('Running: TC-003 Register with empty name and email...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(BASE_URL);

        const loginLink = await waitFor(driver, By.css('a[href="/login"]'));
        await loginLink.click();
        await driver.wait(until.urlContains('/login'), TIMEOUT);

        // Click signup without filling anything
        const signupButton = await waitFor(driver, By.css('button[data-qa="signup-button"]'));
        await signupButton.click();

        // Assert user stays on login page
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('/login')) {
            console.log('✓ TC-003 PASSED: User stays on login page with empty fields');
        } else {
            console.log('✗ TC-003 FAILED: User was redirected unexpectedly');
        }

    } catch (error) {
        console.log('✗ TC-003 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// EDGE: Register with invalid email format
// -----------------------------------------------
const testInvalidEmailFormat = async () => {
    console.log('Running: Register with invalid email format...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(BASE_URL);

        const loginLink = await waitFor(driver, By.css('a[href="/login"]'));
        await loginLink.click();
        await driver.wait(until.urlContains('/login'), TIMEOUT);

        const nameField = await waitFor(driver, By.css('input[data-qa="signup-name"]'));
        await nameField.sendKeys('Test User');

        const emailField = await waitFor(driver, By.css('input[data-qa="signup-email"]'));
        await emailField.sendKeys('not-an-email');

        const signupButton = await waitFor(driver, By.css('button[data-qa="signup-button"]'));
        await signupButton.click();

        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('/login')) {
            console.log('✓ PASSED: Invalid email format blocked, user stays on login page');
        } else {
            console.log('✗ FAILED: User was redirected with invalid email format');
        }

    } catch (error) {
        console.log('✗ FAILED (invalid email format):', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// EDGE: Register with name but no email
// -----------------------------------------------
const testMissingEmail = async () => {
    console.log('Running: Register with name but no email...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(BASE_URL);

        const loginLink = await waitFor(driver, By.css('a[href="/login"]'));
        await loginLink.click();
        await driver.wait(until.urlContains('/login'), TIMEOUT);

        const nameField = await waitFor(driver, By.css('input[data-qa="signup-name"]'));
        await nameField.sendKeys('Test User');
        // Email left blank

        const signupButton = await waitFor(driver, By.css('button[data-qa="signup-button"]'));
        await signupButton.click();

        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('/login')) {
            console.log('✓ PASSED: Missing email blocked, user stays on login page');
        } else {
            console.log('✗ FAILED: User was redirected with missing email');
        }

    } catch (error) {
        console.log('✗ FAILED (missing email):', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// Runner
// -----------------------------------------------
const runAll = async () => {
    console.log('\n===================================');
    console.log('  Selenium Registration Test Suite  ');
    console.log('===================================\n');

    await testSuccessfulRegistration();
    await testDuplicateEmail();
    await testEmptySignupFields();
    await testInvalidEmailFormat();
    await testMissingEmail();

    console.log('\n===================================');
    console.log('  All registration tests complete');
    console.log('===================================\n');
};

runAll();
