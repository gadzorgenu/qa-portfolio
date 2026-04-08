const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('chromedriver');

const BASE_URL = 'https://automationexercise.com';
const TIMEOUT = 10000;

const waitFor = async (driver, locator) => {
    return await driver.wait(until.elementLocated(locator), TIMEOUT);
};

// -----------------------------------------------
// TC-007: Search for an existing product returns results
// -----------------------------------------------
const testSearchExistingProduct = async () => {
    console.log('Running: TC-007 Search for existing product returns results...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(`${BASE_URL}/products`);
        await driver.wait(until.urlContains('/products'), TIMEOUT);

        // Enter search keyword
        const searchInput = await waitFor(driver, By.id('search_product'));
        await searchInput.sendKeys('dress');

        const searchBtn = await waitFor(driver, By.id('submit_search'));
        await searchBtn.click();

        // Assert "Searched Products" heading is visible
        const heading = await waitFor(driver, By.css('h2.title.text-center'));
        const headingText = await heading.getText();
        const headingVisible = await heading.isDisplayed();

        // Assert at least one product card is returned
        const productCards = await driver.findElements(By.css('.productinfo'));
        const count = productCards.length;

        if (headingText.includes('Searched Products') && headingVisible && count > 0) {
            console.log(`✓ TC-007 PASSED: ${count} product(s) found for "dress"`);
        } else {
            console.log(`✗ TC-007 FAILED: Heading="${headingText}", Products found=${count}`);
        }

    } catch (error) {
        console.log('✗ TC-007 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-008: Clicking a search result navigates to product detail page
// -----------------------------------------------
const testClickSearchResult = async () => {
    console.log('Running: TC-008 Clicking a search result opens product detail page...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(`${BASE_URL}/products`);

        const searchInput = await waitFor(driver, By.id('search_product'));
        await searchInput.sendKeys('top');

        const searchBtn = await waitFor(driver, By.id('submit_search'));
        await searchBtn.click();

        // Click "View Product" on the first result
        const viewProductLink = await waitFor(driver, By.css('.choose a'));
        await viewProductLink.click();

        // Assert URL is a product detail page
        await driver.wait(until.urlMatches(/\/product_details\/\d+/), TIMEOUT);
        const currentUrl = await driver.getCurrentUrl();

        // Assert product name heading is visible
        const productName = await waitFor(driver, By.css('.product-information h2'));
        const isDisplayed = await productName.isDisplayed();

        if (/\/product_details\/\d+/.test(currentUrl) && isDisplayed) {
            console.log('✓ TC-008 PASSED: Product detail page loaded from search result');
        } else {
            console.log(`✗ TC-008 FAILED: URL=${currentUrl}, productName visible=${isDisplayed}`);
        }

    } catch (error) {
        console.log('✗ TC-008 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-009: Search for non-existent product shows no results
// -----------------------------------------------
const testSearchNoResults = async () => {
    console.log('Running: TC-009 Search for non-existent product shows no results...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(`${BASE_URL}/products`);

        const searchInput = await waitFor(driver, By.id('search_product'));
        await searchInput.sendKeys('xyznonexistentproduct12345');

        const searchBtn = await waitFor(driver, By.id('submit_search'));
        await searchBtn.click();

        // Wait for heading to appear
        await waitFor(driver, By.css('h2.title.text-center'));

        // Assert no product cards are rendered
        const productCards = await driver.findElements(By.css('.productinfo'));
        const count = productCards.length;

        if (count === 0) {
            console.log('✓ TC-009 PASSED: No results shown for non-existent product');
        } else {
            console.log(`✗ TC-009 FAILED: Expected 0 results but got ${count}`);
        }

    } catch (error) {
        console.log('✗ TC-009 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// TC-010: Empty search query — page does not crash
// -----------------------------------------------
const testEmptySearch = async () => {
    console.log('Running: TC-010 Search with empty query does not crash...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(`${BASE_URL}/products`);

        // Leave search input blank
        const searchBtn = await waitFor(driver, By.id('submit_search'));
        await searchBtn.click();

        // Page should remain stable
        const currentUrl = await driver.getCurrentUrl();
        const heading = await waitFor(driver, By.css('h2.title.text-center'));
        const isDisplayed = await heading.isDisplayed();

        if (!currentUrl.includes('error') && isDisplayed) {
            console.log('✓ TC-010 PASSED: Empty search handled gracefully');
        } else {
            console.log(`✗ TC-010 FAILED: URL=${currentUrl}`);
        }

    } catch (error) {
        console.log('✗ TC-010 FAILED:', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// EDGE: Search with special characters does not crash
// -----------------------------------------------
const testSpecialCharSearch = async () => {
    console.log('Running: Search with special characters does not crash...');
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(`${BASE_URL}/products`);

        const searchInput = await waitFor(driver, By.id('search_product'));
        await searchInput.sendKeys('!@#$%^&*()');

        const searchBtn = await waitFor(driver, By.id('submit_search'));
        await searchBtn.click();

        const currentUrl = await driver.getCurrentUrl();
        const heading = await waitFor(driver, By.css('h2.title.text-center'));
        const isDisplayed = await heading.isDisplayed();

        if (!currentUrl.includes('error') && isDisplayed) {
            console.log('✓ PASSED: Special characters search handled gracefully');
        } else {
            console.log(`✗ FAILED: URL=${currentUrl}`);
        }

    } catch (error) {
        console.log('✗ FAILED (special characters):', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// EDGE: SQL injection attempt in search
// -----------------------------------------------
const testSqlInjectionSearch = async () => {
    console.log("Running: Search with SQL injection string does not crash...");
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(`${BASE_URL}/products`);

        const searchInput = await waitFor(driver, By.id('search_product'));
        await searchInput.sendKeys("' OR '1'='1");

        const searchBtn = await waitFor(driver, By.id('submit_search'));
        await searchBtn.click();

        const currentUrl = await driver.getCurrentUrl();
        const heading = await waitFor(driver, By.css('h2.title.text-center'));
        const isDisplayed = await heading.isDisplayed();

        if (!currentUrl.includes('error') && isDisplayed) {
            console.log('✓ PASSED: SQL injection string handled gracefully');
        } else {
            console.log(`✗ FAILED: URL=${currentUrl}`);
        }

    } catch (error) {
        console.log('✗ FAILED (SQL injection):', error.message);
    } finally {
        await driver.quit();
    }
};

// -----------------------------------------------
// Runner
// -----------------------------------------------
const runAll = async () => {
    console.log('\n================================');
    console.log('  Selenium Search Test Suite   ');
    console.log('================================\n');

    await testSearchExistingProduct();
    await testClickSearchResult();
    await testSearchNoResults();
    await testEmptySearch();
    await testSpecialCharSearch();
    await testSqlInjectionSearch();

    console.log('\n================================');
    console.log('  All search tests complete');
    console.log('================================\n');
};

runAll();
