const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('chromedriver');

const BASE_URL = 'https://automationexercise.com';
const VALID_EMAIL = 'g@mi';
const VALID_PASSWORD = 'test@123';
const TIMEOUT = 10000;

const waitFor = async (driver, locator) => {
    return await driver.wait(until.elementLocated(locator), TIMEOUT);
};

// Reusable: log in
const login = async (driver) => {
    await driver.get(`${BASE_URL}/login`);
    await driver.wait(until.urlContains('/login'), TIMEOUT);

    const emailField = await waitFor(driver, By.css('input[data-qa="login-email"]'));
    await emailField.sendKeys(VALID_EMAIL);

    const passwordField = await waitFor(driver, By.css('input[data-qa="login-password"]'));
    await passwordField.sendKeys(VALID_PASSWORD);

    const loginButton = await waitFor(driver, By.css('button[data-qa="login-button"]'));
    await loginButton.click();

    await driver.wait(until.elementLocated(By.css('a[href="/logout"]')), TIMEOUT);
};

// Reusable: add first product from the products page to cart
const addFirstProductToCart = async (driver) => {
    await driver.get(`${BASE_URL}/products`);
    await driver.wait(until.urlContains('/products'), TIMEOUT);

    // Hover over first product wrapper to reveal the overlay
    const firstProduct = await waitFor(driver, By.css('.product-image-wrapper'));
    const actions = driver.actions({ async: true });
    await actions.move({ origin: firstProduct }).perform();

    // Click "Add to cart" in the overlay
    const addToCartBtn = await waitFor(driver, By.css('.product-overlay .add-to-cart'));
    await addToCartBtn.click();

    // Continue shopping — dismiss the modal
    const continueBtn = await waitFor(driver, By.xpath('//button[contains(text(),"Continue Shopping")]'));
    await continueBtn.click();
};

// -----------------------------------------------
// TC-011: Add a product to cart as guest
// -----------------------------------------------
const testAddToCartAsGuest = async () => {
    console.log('Running: TC-011 Add product to cart as guest...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await addFirstProductToCart(driver);

        // Navigate to cart
        await driver.get(`${BASE_URL}/view_cart`);
        await driver.wait(until.urlContains('/view_cart'), TIMEOUT);

        // Assert at least one item in cart
        const cartRows = await driver.findElements(By.css('#cart_info_table tbody tr'));
        const count = cartRows.length;

        if (count > 0) {
            console.log(`✓ TC-011 PASSED: ${count} item(s) in cart as guest`);
        } else {
            console.log('✗ TC-011 FAILED: Cart is empty');
        }

    } catch (error) {
        console.log('✗ TC-011 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-012: Add product to cart while logged in
// -----------------------------------------------
const testAddToCartLoggedIn = async () => {
    console.log('Running: TC-012 Add product to cart while logged in...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await login(driver);
        await addFirstProductToCart(driver);

        await driver.get(`${BASE_URL}/view_cart`);
        await driver.wait(until.urlContains('/view_cart'), TIMEOUT);

        const cartRows = await driver.findElements(By.css('#cart_info_table tbody tr'));
        const count = cartRows.length;

        if (count > 0) {
            console.log(`✓ TC-012 PASSED: ${count} item(s) in cart while logged in`);
        } else {
            console.log('✗ TC-012 FAILED: Cart is empty after adding product');
        }

    } catch (error) {
        console.log('✗ TC-012 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-013: Add two products and verify both appear
// -----------------------------------------------
const testAddMultipleProducts = async () => {
    console.log('Running: TC-013 Add two products and verify both appear in cart...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(`${BASE_URL}/products`);
        await driver.wait(until.urlContains('/products'), TIMEOUT);

        const productWrappers = await driver.findElements(By.css('.product-image-wrapper'));
        const actions = driver.actions({ async: true });

        // Add first product
        await actions.move({ origin: productWrappers[0] }).perform();
        const addBtns = await driver.findElements(By.css('.product-overlay .add-to-cart'));
        await addBtns[0].click();
        const continueBtn1 = await waitFor(driver, By.xpath('//button[contains(text(),"Continue Shopping")]'));
        await continueBtn1.click();

        // Add second product
        await actions.move({ origin: productWrappers[1] }).perform();
        const addBtns2 = await driver.findElements(By.css('.product-overlay .add-to-cart'));
        await addBtns2[1].click();
        const continueBtn2 = await waitFor(driver, By.xpath('//button[contains(text(),"Continue Shopping")]'));
        await continueBtn2.click();

        await driver.get(`${BASE_URL}/view_cart`);
        const cartRows = await driver.findElements(By.css('#cart_info_table tbody tr'));
        const count = cartRows.length;

        if (count >= 2) {
            console.log(`✓ TC-013 PASSED: ${count} item(s) in cart after adding two products`);
        } else {
            console.log(`✗ TC-013 FAILED: Expected ≥2 items, got ${count}`);
        }

    } catch (error) {
        console.log('✗ TC-013 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-014: Remove a product from the cart
// -----------------------------------------------
const testRemoveFromCart = async () => {
    console.log('Running: TC-014 Remove a product from the cart...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await addFirstProductToCart(driver);

        await driver.get(`${BASE_URL}/view_cart`);
        await driver.wait(until.urlContains('/view_cart'), TIMEOUT);

        // Confirm item is in cart
        const rowsBefore = await driver.findElements(By.css('#cart_info_table tbody tr'));
        if (rowsBefore.length === 0) throw new Error('Cart is empty before removal');

        // Click the delete (×) button
        const deleteBtn = await waitFor(driver, By.css('.cart_quantity_delete'));
        await deleteBtn.click();

        // Wait for empty cart indicator
        const emptyCart = await waitFor(driver, By.id('empty_cart'));
        const isDisplayed = await emptyCart.isDisplayed();

        if (isDisplayed) {
            console.log('✓ TC-014 PASSED: Cart is empty after removing the item');
        } else {
            console.log('✗ TC-014 FAILED: Empty cart message not shown');
        }

    } catch (error) {
        console.log('✗ TC-014 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-015: Add product with custom quantity from detail page
// -----------------------------------------------
const testCustomQuantity = async () => {
    console.log('Running: TC-015 Add product with quantity 3 from detail page...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(`${BASE_URL}/product_details/1`);

        // Clear default quantity and set to 3
        const qtyInput = await waitFor(driver, By.id('quantity'));
        await qtyInput.clear();
        await qtyInput.sendKeys('3');

        const addToCartBtn = await waitFor(driver, By.xpath('//button[contains(text(),"Add to cart")]'));
        await addToCartBtn.click();

        const continueBtn = await waitFor(driver, By.xpath('//button[contains(text(),"Continue Shopping")]'));
        await continueBtn.click();

        await driver.get(`${BASE_URL}/view_cart`);
        const qtyInCart = await waitFor(driver, By.css('.cart_quantity button'));
        const qtyText = await qtyInCart.getText();

        if (qtyText.trim() === '3') {
            console.log('✓ TC-015 PASSED: Cart shows quantity of 3');
        } else {
            console.log(`✗ TC-015 FAILED: Expected quantity 3, got "${qtyText}"`);
        }

    } catch (error) {
        console.log('✗ TC-015 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-016: View cart with no products shows empty cart
// -----------------------------------------------
const testEmptyCart = async () => {
    console.log('Running: TC-016 View cart with no products shows empty state...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        // Fresh session — no items added
        await driver.get(`${BASE_URL}/view_cart`);
        await driver.wait(until.urlContains('/view_cart'), TIMEOUT);

        const emptyCart = await waitFor(driver, By.id('empty_cart'));
        const isDisplayed = await emptyCart.isDisplayed();

        if (isDisplayed) {
            console.log('✓ TC-016 PASSED: Empty cart message shown');
        } else {
            console.log('✗ TC-016 FAILED: Empty cart message not visible');
        }

    } catch (error) {
        console.log('✗ TC-016 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-017: Guest checkout prompts login/register
// -----------------------------------------------
const testGuestCheckoutPrompt = async () => {
    console.log('Running: TC-017 Guest checkout prompts login or register...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await addFirstProductToCart(driver);

        await driver.get(`${BASE_URL}/view_cart`);
        await driver.wait(until.urlContains('/view_cart'), TIMEOUT);

        const proceedBtn = await waitFor(driver, By.css('a[href="/checkout"]'));
        await proceedBtn.click();

        // Allow short wait for modal or redirect
        await driver.sleep(1500);

        const currentUrl = await driver.getCurrentUrl();

        // Check if modal is present
        const modals = await driver.findElements(By.id('checkoutModal'));
        const modalVisible = modals.length > 0 ? await modals[0].isDisplayed() : false;

        if (modalVisible || currentUrl.includes('/login')) {
            console.log('✓ TC-017 PASSED: Guest prompted to login/register before checkout');
        } else {
            console.log(`✗ TC-017 FAILED: URL=${currentUrl}, modal visible=${modalVisible}`);
        }

    } catch (error) {
        console.log('✗ TC-017 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// Runner
// -----------------------------------------------
const runAll = async () => {
    console.log('\n==============================');
    console.log('  Selenium Cart Test Suite   ');
    console.log('==============================\n');

    await testAddToCartAsGuest();
    await testAddToCartLoggedIn();
    await testAddMultipleProducts();
    await testRemoveFromCart();
    await testCustomQuantity();
    await testEmptyCart();
    await testGuestCheckoutPrompt();

    console.log('\n==============================');
    console.log('  All cart tests complete');
    console.log('==============================\n');
};

runAll();
