const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('chromedriver');

const BASE_URL = 'https://automationexercise.com';
const VALID_EMAIL = 'g@mi';
const VALID_PASSWORD = 'test@123';
const TIMEOUT = 10000;

const VALID_CARD = {
    nameOnCard: 'Test User',
    number: '4111111111111111',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: '2027',
};

const waitFor = async (driver, locator) => {
    return await driver.wait(until.elementLocated(locator), TIMEOUT);
};

// Reusable: log in and add one product to cart, navigate to /view_cart
const loginAndAddToCart = async (driver) => {
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.urlContains('/login'), TIMEOUT);

    await (await waitFor(driver, By.css('input[data-qa="login-email"]'))).sendKeys(VALID_EMAIL);
    await (await waitFor(driver, By.css('input[data-qa="login-password"]'))).sendKeys(VALID_PASSWORD);
    await (await waitFor(driver, By.css('button[data-qa="login-button"]'))).click();
    await driver.wait(until.elementLocated(By.css('a[href="/logout"]')), TIMEOUT);

    // Add a product from the product detail page (more reliable than hover overlay)
    await driver.get(`${BASE_URL}/product_details/1`);
    const addToCartBtn = await waitFor(driver, By.xpath('//button[contains(text(),"Add to cart")]'));
    await addToCartBtn.click();

    const continueBtn = await waitFor(driver, By.xpath('//button[contains(text(),"Continue Shopping")]'));
    await continueBtn.click();

    await driver.get(`${BASE_URL}/view_cart`);
    await driver.wait(until.urlContains('/view_cart'), TIMEOUT);
    await waitFor(driver, By.css('#cart_info_table tbody tr'));
};

// -----------------------------------------------
// TC-018: Complete checkout with valid payment details
// -----------------------------------------------
const testSuccessfulCheckout = async () => {
    console.log('Running: TC-018 Complete checkout with valid payment details...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await loginAndAddToCart(driver);

        // Proceed to checkout
        const proceedBtn = await waitFor(driver, By.css('a[href="/checkout"]'));
        await proceedBtn.click();
        await driver.wait(until.urlContains('/checkout'), TIMEOUT);

        // Assert delivery address section is present
        await waitFor(driver, By.id('address_delivery'));

        // Add order comment
        const commentBox = await waitFor(driver, By.css('textarea[name="message"]'));
        await commentBox.sendKeys('Please deliver between 9am and 5pm.');

        // Place order
        const placeOrderBtn = await waitFor(driver, By.xpath('//a[contains(text(),"Place Order")]'));
        await placeOrderBtn.click();
        await driver.wait(until.urlContains('/payment'), TIMEOUT);

        // Fill payment details
        await (await waitFor(driver, By.css('input[data-qa="name-on-card"]'))).sendKeys(VALID_CARD.nameOnCard);
        await (await waitFor(driver, By.css('input[data-qa="card-number"]'))).sendKeys(VALID_CARD.number);
        await (await waitFor(driver, By.css('input[data-qa="cvc"]'))).sendKeys(VALID_CARD.cvc);
        await (await waitFor(driver, By.css('input[data-qa="expiry-month"]'))).sendKeys(VALID_CARD.expiryMonth);
        await (await waitFor(driver, By.css('input[data-qa="expiry-year"]'))).sendKeys(VALID_CARD.expiryYear);

        // Confirm payment
        await (await waitFor(driver, By.css('button[data-qa="pay-button"]'))).click();

        // Assert order success page
        await driver.wait(until.urlContains('/payment_done'), TIMEOUT);
        const successHeading = await waitFor(driver, By.css('h2[data-qa="order-placed"]'));
        const isDisplayed = await successHeading.isDisplayed();
        const headingText = await successHeading.getText();

        if (isDisplayed && headingText.includes('Order Placed')) {
            console.log('✓ TC-018 PASSED: Order placed successfully');
        } else {
            console.log(`✗ TC-018 FAILED: heading="${headingText}", visible=${isDisplayed}`);
        }

    } catch (error) {
        console.log('✗ TC-018 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-019: Delivery and billing address shown at checkout
// -----------------------------------------------
const testAddressDisplayed = async () => {
    console.log('Running: TC-019 Delivery and billing address shown at checkout...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await loginAndAddToCart(driver);

        const proceedBtn = await waitFor(driver, By.css('a[href="/checkout"]'));
        await proceedBtn.click();
        await driver.wait(until.urlContains('/checkout'), TIMEOUT);

        const deliveryAddr = await waitFor(driver, By.id('address_delivery'));
        const billingAddr = await waitFor(driver, By.id('address_invoice'));

        const deliveryVisible = await deliveryAddr.isDisplayed();
        const billingVisible = await billingAddr.isDisplayed();

        if (deliveryVisible && billingVisible) {
            console.log('✓ TC-019 PASSED: Delivery and billing addresses are both visible');
        } else {
            console.log(`✗ TC-019 FAILED: delivery=${deliveryVisible}, billing=${billingVisible}`);
        }

    } catch (error) {
        console.log('✗ TC-019 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-020: Guest navigating to /checkout is redirected to login
// -----------------------------------------------
const testGuestCheckoutRedirect = async () => {
    console.log('Running: TC-020 Guest accessing /checkout is redirected to login...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        // No login — navigate directly to checkout
        await driver.get(`${BASE_URL}/checkout`);
        await driver.sleep(1500);

        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('/login')) {
            console.log('✓ TC-020 PASSED: Guest redirected to login from /checkout');
        } else {
            console.log(`✗ TC-020 FAILED: Expected /login redirect but got ${currentUrl}`);
        }

    } catch (error) {
        console.log('✗ TC-020 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-021: Submit payment form with all empty fields
// -----------------------------------------------
const testEmptyPaymentForm = async () => {
    console.log('Running: TC-021 Submit payment form with all empty fields...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await loginAndAddToCart(driver);

        const proceedBtn = await waitFor(driver, By.css('a[href="/checkout"]'));
        await proceedBtn.click();
        await driver.wait(until.urlContains('/checkout'), TIMEOUT);

        const placeOrderBtn = await waitFor(driver, By.xpath('//a[contains(text(),"Place Order")]'));
        await placeOrderBtn.click();
        await driver.wait(until.urlContains('/payment'), TIMEOUT);

        // Click pay without filling anything
        await (await waitFor(driver, By.css('button[data-qa="pay-button"]'))).click();

        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('/payment')) {
            console.log('✓ TC-021 PASSED: Empty payment form stays on payment page');
        } else {
            console.log(`✗ TC-021 FAILED: URL=${currentUrl}`);
        }

    } catch (error) {
        console.log('✗ TC-021 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-022: Submit payment with missing card number
// -----------------------------------------------
const testMissingCardNumber = async () => {
    console.log('Running: TC-022 Submit payment without card number...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await loginAndAddToCart(driver);

        const proceedBtn = await waitFor(driver, By.css('a[href="/checkout"]'));
        await proceedBtn.click();
        await driver.wait(until.urlContains('/checkout'), TIMEOUT);

        const placeOrderBtn = await waitFor(driver, By.xpath('//a[contains(text(),"Place Order")]'));
        await placeOrderBtn.click();
        await driver.wait(until.urlContains('/payment'), TIMEOUT);

        // Fill everything except card number
        await (await waitFor(driver, By.css('input[data-qa="name-on-card"]'))).sendKeys(VALID_CARD.nameOnCard);
        // card-number intentionally left blank
        await (await waitFor(driver, By.css('input[data-qa="cvc"]'))).sendKeys(VALID_CARD.cvc);
        await (await waitFor(driver, By.css('input[data-qa="expiry-month"]'))).sendKeys(VALID_CARD.expiryMonth);
        await (await waitFor(driver, By.css('input[data-qa="expiry-year"]'))).sendKeys(VALID_CARD.expiryYear);

        await (await waitFor(driver, By.css('button[data-qa="pay-button"]'))).click();

        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('/payment')) {
            console.log('✓ TC-022 PASSED: Missing card number keeps user on payment page');
        } else {
            console.log(`✗ TC-022 FAILED: URL=${currentUrl}`);
        }

    } catch (error) {
        console.log('✗ TC-022 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-023: Submit payment with missing CVC
// -----------------------------------------------
const testMissingCvc = async () => {
    console.log('Running: TC-023 Submit payment without CVC...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await loginAndAddToCart(driver);

        const proceedBtn = await waitFor(driver, By.css('a[href="/checkout"]'));
        await proceedBtn.click();
        await driver.wait(until.urlContains('/checkout'), TIMEOUT);

        const placeOrderBtn = await waitFor(driver, By.xpath('//a[contains(text(),"Place Order")]'));
        await placeOrderBtn.click();
        await driver.wait(until.urlContains('/payment'), TIMEOUT);

        await (await waitFor(driver, By.css('input[data-qa="name-on-card"]'))).sendKeys(VALID_CARD.nameOnCard);
        await (await waitFor(driver, By.css('input[data-qa="card-number"]'))).sendKeys(VALID_CARD.number);
        // CVC intentionally left blank
        await (await waitFor(driver, By.css('input[data-qa="expiry-month"]'))).sendKeys(VALID_CARD.expiryMonth);
        await (await waitFor(driver, By.css('input[data-qa="expiry-year"]'))).sendKeys(VALID_CARD.expiryYear);

        await (await waitFor(driver, By.css('button[data-qa="pay-button"]'))).click();

        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('/payment')) {
            console.log('✓ TC-023 PASSED: Missing CVC keeps user on payment page');
        } else {
            console.log(`✗ TC-023 FAILED: URL=${currentUrl}`);
        }

    } catch (error) {
        console.log('✗ TC-023 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-024: Submit payment with expired card year
// -----------------------------------------------
const testExpiredCard = async () => {
    console.log('Running: TC-024 Submit payment with expired card year...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await loginAndAddToCart(driver);

        const proceedBtn = await waitFor(driver, By.css('a[href="/checkout"]'));
        await proceedBtn.click();
        await driver.wait(until.urlContains('/checkout'), TIMEOUT);

        const placeOrderBtn = await waitFor(driver, By.xpath('//a[contains(text(),"Place Order")]'));
        await placeOrderBtn.click();
        await driver.wait(until.urlContains('/payment'), TIMEOUT);

        await (await waitFor(driver, By.css('input[data-qa="name-on-card"]'))).sendKeys(VALID_CARD.nameOnCard);
        await (await waitFor(driver, By.css('input[data-qa="card-number"]'))).sendKeys(VALID_CARD.number);
        await (await waitFor(driver, By.css('input[data-qa="cvc"]'))).sendKeys(VALID_CARD.cvc);
        await (await waitFor(driver, By.css('input[data-qa="expiry-month"]'))).sendKeys('01');
        await (await waitFor(driver, By.css('input[data-qa="expiry-year"]'))).sendKeys('2000'); // expired

        await (await waitFor(driver, By.css('button[data-qa="pay-button"]'))).click();

        await driver.sleep(1500);
        const currentUrl = await driver.getCurrentUrl();

        if (!currentUrl.includes('/payment_done')) {
            console.log('✓ TC-024 PASSED: Expired card did not lead to order confirmation');
        } else {
            console.log('✗ TC-024 FAILED: Order was placed with an expired card');
        }

    } catch (error) {
        console.log('✗ TC-024 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-025: Download invoice after successful order
// -----------------------------------------------
const testDownloadInvoice = async () => {
    console.log('Running: TC-025 Download invoice after successful order...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await loginAndAddToCart(driver);

        const proceedBtn = await waitFor(driver, By.css('a[href="/checkout"]'));
        await proceedBtn.click();
        await driver.wait(until.urlContains('/checkout'), TIMEOUT);

        const placeOrderBtn = await waitFor(driver, By.xpath('//a[contains(text(),"Place Order")]'));
        await placeOrderBtn.click();
        await driver.wait(until.urlContains('/payment'), TIMEOUT);

        await (await waitFor(driver, By.css('input[data-qa="name-on-card"]'))).sendKeys(VALID_CARD.nameOnCard);
        await (await waitFor(driver, By.css('input[data-qa="card-number"]'))).sendKeys(VALID_CARD.number);
        await (await waitFor(driver, By.css('input[data-qa="cvc"]'))).sendKeys(VALID_CARD.cvc);
        await (await waitFor(driver, By.css('input[data-qa="expiry-month"]'))).sendKeys(VALID_CARD.expiryMonth);
        await (await waitFor(driver, By.css('input[data-qa="expiry-year"]'))).sendKeys(VALID_CARD.expiryYear);

        await (await waitFor(driver, By.css('button[data-qa="pay-button"]'))).click();
        await driver.wait(until.urlContains('/payment_done'), TIMEOUT);

        // Assert download invoice button is visible
        const downloadBtn = await waitFor(driver, By.xpath('//a[contains(text(),"Download Invoice")]'));
        const isDisplayed = await downloadBtn.isDisplayed();

        if (isDisplayed) {
            console.log('✓ TC-025 PASSED: Download Invoice button is visible after order placed');
        } else {
            console.log('✗ TC-025 FAILED: Download Invoice button not visible');
        }

    } catch (error) {
        console.log('✗ TC-025 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// Runner
// -----------------------------------------------
const runAll = async () => {
    console.log('\n=================================');
    console.log('  Selenium Checkout Test Suite  ');
    console.log('=================================\n');

    await testSuccessfulCheckout();
    await testAddressDisplayed();
    await testGuestCheckoutRedirect();
    await testEmptyPaymentForm();
    await testMissingCardNumber();
    await testMissingCvc();
    await testExpiredCard();
    await testDownloadInvoice();

    console.log('\n=================================');
    console.log('  All checkout tests complete');
    console.log('=================================\n');
};

runAll();
