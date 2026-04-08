const {Builder, By, until} = require('selenium-webdriver');

const chrome = require('chromedriver');

const BASE_URL = 'https://automationexercise.com';
const VALID_EMAIL = 'g@mi';
const VALID_PASSWORD = 'test@123';
const TIMEOUT = 10000;

const waitFor = async (driver, locator) =>  {
    return await driver.wait(until.elementLocated(locator), TIMEOUT);
};

const testSuccessfulLogin = async () => {
    console.log('Running: TC-004 Successful login...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(BASE_URL);

        const loginLink = await waitFor(driver, By.linkText('Signup / Login'));
        await loginLink.click();

        const emailField = await waitFor(driver, By.css('input[data-qa="login-email"]'));
        await emailField.sendKeys(VALID_EMAIL);

        const passwordField = await waitFor(driver, By.css('input[data-qa="login-password"]'));
        await passwordField.sendKeys(VALID_PASSWORD);

        const loginButton = await waitFor(driver, By.css('button[data-qa="login-button"]'));
        await loginButton.click();

        // Wait for URL to change away from login page
        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return !url.includes('/login');
        }, TIMEOUT);

        // Check logged in by looking for logout link
        const logoutLink = await waitFor(driver, By.css('a[href="/logout"]'));
        const isDisplayed = await logoutLink.isDisplayed();

        if (isDisplayed) {
            console.log('✓ TC-004 PASSED: Successful login');
        } else {
            console.log('✗ TC-004 FAILED: Logout link not visible');
        }

    } catch (error) {
        console.log('✗ TC-004 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TEST 2: Login with wrong password
// -----------------------------------------------
const testWrongPassword = async () => {
    console.log('Running: TC-005 Login with wrong password...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(BASE_URL);

        const loginLink = await waitFor(driver, By.css('a[href="/login"]'));
        await loginLink.click();

        const emailField = await waitFor(driver, By.css('input[data-qa="login-email"]'));
        await emailField.sendKeys(VALID_EMAIL);

        const passwordField = await waitFor(driver, By.css('input[data-qa="login-password"]'));
        await passwordField.sendKeys('WrongPassword999');

        const loginButton = await waitFor(driver, By.css('button[data-qa="login-button"]'));
        await loginButton.click();

        // Wait for error message
        const errorMsg = await waitFor(driver, By.xpath(
            '//*[contains(text(), "Your email or password is incorrect!")]'
        ));
        const isDisplayed = await errorMsg.isDisplayed();

        if (isDisplayed) {
            console.log('✓ TC-005 PASSED: Error message shown for wrong password');
        } else {
            console.log('✗ TC-005 FAILED: Error message not visible');
        }

    } catch (error) {
        console.log('✗ TC-005 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TEST 3: Login with empty fields
// -----------------------------------------------
const testEmptyFields = async () => {
    console.log('Running: TC-006 Login with empty fields...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(BASE_URL);

        const loginLink = await waitFor(driver, By.css('a[href="/login"]'));
        await loginLink.click();

        // Click login without filling anything
        const loginButton = await waitFor(driver, By.css('button[data-qa="login-button"]'));
        await loginButton.click();

        // Assert still on login page
        const currentURL = await driver.getCurrentUrl();

        if (currentURL.includes('/login')) {
            console.log('✓ TC-006 PASSED: User stays on login page with empty fields');
        } else {
            console.log('✗ TC-006 FAILED: User was redirected unexpectedly');
        }

    } catch (error) {
        console.log('✗ TC-006 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

const runAll = async () => {
     console.log('\n=============================');
    console.log('  Selenium Login Test Suite  ');
    console.log('=============================\n');

    await testSuccessfulLogin();
    await testWrongPassword();
    await testEmptyFields();

    console.log('\n=============================');
    console.log('  All tests complete');
    console.log('=============================\n');
};

runAll();