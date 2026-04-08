const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://automationexercise.com';

test.describe('Product Search Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/products`);
        await expect(page).toHaveURL(`${BASE_URL}/products`);
        await expect(page.locator('h2.title.text-center')).toContainText('All Products');
    });

    // ✅ Happy Path — search returns matching results
    test('TC-007: Search for an existing product returns results', async ({ page }) => {
        // Enter a known product keyword
        await page.fill('input#search_product', 'dress');
        await page.click('button#submit_search');

        // Assert URL reflects the search query
        await expect(page).toHaveURL(`${BASE_URL}/products?search=dress`);

        // Assert searched products heading is shown
        await expect(page.locator('h2.title.text-center')).toContainText('Searched Products');

        // Assert at least one product card is returned
        const productCards = page.locator('.productinfo');
        await expect(productCards.first()).toBeVisible();
        const count = await productCards.count();
        expect(count).toBeGreaterThan(0);
    });

    // ✅ Happy Path — search is case-insensitive
    test('Search with uppercase keyword returns results', async ({ page }) => {
        await page.fill('input#search_product', 'SHIRT');
        await page.click('button#submit_search');

        await expect(page.locator('h2.title.text-center')).toContainText('Searched Products');

        const productCards = page.locator('.productinfo');
        const count = await productCards.count();
        expect(count).toBeGreaterThan(0);
    });

    // ✅ Happy Path — clicking a product from search opens its detail page
    test('TC-008: Clicking a search result navigates to the product detail page', async ({ page }) => {
        await page.fill('input#search_product', 'top');
        await page.click('button#submit_search');

        // Click "View Product" on the first result
        await page.locator('.choose a').first().click();

        // Assert the URL changed to a product detail page
        await expect(page).toHaveURL(/\/product_details\/\d+/);

        // Assert product name heading is visible
        await expect(page.locator('.product-information h2')).toBeVisible();
    });

    // ❌ Negative Test — search for a term with no matching products
    test('TC-009: Search for non-existent product shows no results', async ({ page }) => {
        await page.fill('input#search_product', 'xyznonexistentproduct12345');
        await page.click('button#submit_search');

        await expect(page.locator('h2.title.text-center')).toContainText('Searched Products');

        // Assert no product cards are rendered
        const productCards = page.locator('.productinfo');
        const count = await productCards.count();
        expect(count).toBe(0);
    });

    // ❌ Negative Test — empty search query
    test('TC-010: Search with empty query shows all or searched products section', async ({ page }) => {
        // Leave search input blank and submit
        await page.fill('input#search_product', '');
        await page.click('button#submit_search');

        // Page should either show all products or the searched section without crashing
        await expect(page.locator('h2.title.text-center')).toBeVisible();
        await expect(page).not.toHaveURL(/error/);
    });

    // ❌ Negative Test — special characters in search
    test('Search with special characters does not crash the page', async ({ page }) => {
        await page.fill('input#search_product', '!@#$%^&*()');
        await page.click('button#submit_search');

        // Page should remain stable — no server error
        await expect(page).not.toHaveURL(/error/);
        await expect(page.locator('h2.title.text-center')).toBeVisible();
    });

    // ❌ Negative Test — very long search string
    test('Search with very long string does not crash the page', async ({ page }) => {
        const longString = 'a'.repeat(500);
        await page.fill('input#search_product', longString);
        await page.click('button#submit_search');

        // Page should remain stable
        await expect(page).not.toHaveURL(/error/);
        await expect(page.locator('h2.title.text-center')).toBeVisible();
    });

    // ❌ Negative Test — SQL injection attempt in search
    test('Search with SQL injection string does not crash the page', async ({ page }) => {
        await page.fill('input#search_product', "' OR '1'='1");
        await page.click('button#submit_search');

        // Page should remain stable — no database error exposed
        await expect(page).not.toHaveURL(/error/);
        await expect(page.locator('h2.title.text-center')).toBeVisible();
    });
});
