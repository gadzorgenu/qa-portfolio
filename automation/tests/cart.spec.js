const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://automationexercise.com';

const VALID_EMAIL = 'g@mi';
const VALID_PASSWORD = 'test@123';

// Reusable login helper
async function login(page) {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[data-qa="login-email"]', VALID_EMAIL);
    await page.fill('input[data-qa="login-password"]', VALID_PASSWORD);
    await page.click('button[data-qa="login-button"]');
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();
}

test.describe('Cart Flow', () => {

    // ✅ Happy Path — add a product to cart as a guest
    test('TC-011: Add a product to cart as guest and verify it appears in cart', async ({ page }) => {
        await page.goto(`${BASE_URL}/products`);

        // Hover over first product to reveal "Add to cart" button
        await page.locator('.product-image-wrapper').first().hover();
        await page.locator('.product-overlay .add-to-cart').first().click();

        // Dismiss the modal — continue shopping
        await page.locator('button:has-text("Continue Shopping")').click();

        // Navigate to cart
        await page.goto(`${BASE_URL}/view_cart`);
        await expect(page).toHaveURL(`${BASE_URL}/view_cart`);

        // Assert at least one item is in the cart
        const cartRows = page.locator('#cart_info_table tbody tr');
        await expect(cartRows.first()).toBeVisible();
        const count = await cartRows.count();
        expect(count).toBeGreaterThan(0);
    });

    // ✅ Happy Path — add product to cart while logged in
    test('TC-012: Add a product to cart while logged in', async ({ page }) => {
        await login(page);

        await page.goto(`${BASE_URL}/products`);

        // Hover over first product to reveal overlay
        await page.locator('.product-image-wrapper').first().hover();
        await page.locator('.product-overlay .add-to-cart').first().click();

        // Dismiss modal
        await page.locator('button:has-text("Continue Shopping")').click();

        // Verify cart badge/count updated
        await page.goto(`${BASE_URL}/view_cart`);
        const cartRows = page.locator('#cart_info_table tbody tr');
        await expect(cartRows.first()).toBeVisible();
    });

    // ✅ Happy Path — add multiple products and verify count
    test('TC-013: Add two products to cart and verify both appear', async ({ page }) => {
        await page.goto(`${BASE_URL}/products`);

        const products = page.locator('.product-image-wrapper');

        // Add first product
        await products.nth(0).hover();
        await page.locator('.product-overlay .add-to-cart').nth(0).click();
        await page.locator('button:has-text("Continue Shopping")').click();

        // Add second product
        await products.nth(1).hover();
        await page.locator('.product-overlay .add-to-cart').nth(1).click();
        await page.locator('button:has-text("Continue Shopping")').click();

        // Navigate to cart and verify two line items
        await page.goto(`${BASE_URL}/view_cart`);
        const cartRows = page.locator('#cart_info_table tbody tr');
        const count = await cartRows.count();
        expect(count).toBeGreaterThanOrEqual(2);
    });

    // ✅ Happy Path — remove a product from the cart
    test('TC-014: Remove a product from the cart', async ({ page }) => {
        await page.goto(`${BASE_URL}/products`);

        // Add one product
        await page.locator('.product-image-wrapper').first().hover();
        await page.locator('.product-overlay .add-to-cart').first().click();
        await page.locator('button:has-text("Continue Shopping")').click();

        await page.goto(`${BASE_URL}/view_cart`);

        // Confirm item is present before removal
        const cartRows = page.locator('#cart_info_table tbody tr');
        await expect(cartRows.first()).toBeVisible();

        // Click the delete (×) button on the first row
        await page.locator('.cart_quantity_delete').first().click();

        // Assert cart is now empty
        await expect(page.locator('#empty_cart')).toBeVisible();
    });

    // ✅ Happy Path — product detail page "Add to cart" button works
    test('Add to cart from product detail page', async ({ page }) => {
        // Navigate directly to first product detail
        await page.goto(`${BASE_URL}/product_details/1`);

        await page.locator('button:has-text("Add to cart")').click();

        // Dismiss the confirmation modal
        await page.locator('button:has-text("Continue Shopping")').click();

        await page.goto(`${BASE_URL}/view_cart`);
        const cartRows = page.locator('#cart_info_table tbody tr');
        await expect(cartRows.first()).toBeVisible();
    });

    // ✅ Happy Path — update product quantity from product detail page before adding
    test('TC-015: Add product with custom quantity from product detail page', async ({ page }) => {
        await page.goto(`${BASE_URL}/product_details/1`);

        // Set quantity to 3
        await page.fill('input#quantity', '3');
        await page.locator('button:has-text("Add to cart")').click();
        await page.locator('button:has-text("Continue Shopping")').click();

        await page.goto(`${BASE_URL}/view_cart`);

        // Assert the quantity shown in cart is 3
        await expect(page.locator('.cart_quantity button')).toHaveText('3');
    });

    // ❌ Negative Test — cart is empty by default (no items added)
    test('TC-016: View cart without adding any products shows empty cart', async ({ page }) => {
        // Clear cookies/state to ensure a fresh guest session with no cart
        await page.context().clearCookies();
        await page.goto(`${BASE_URL}/view_cart`);

        // Assert empty cart message is displayed
        await expect(page.locator('#empty_cart')).toBeVisible();
    });

    // ❌ Negative Test — quantity set to 0 on product detail page
    test('Add to cart with quantity 0 defaults to 1 or blocks submission', async ({ page }) => {
        await page.goto(`${BASE_URL}/product_details/1`);

        // Attempt to set quantity to 0
        await page.fill('input#quantity', '0');
        await page.locator('button:has-text("Add to cart")').click();

        // Either modal appears (item added with minimum qty) or page stays — no crash
        const modal = page.locator('#cartModal');
        const isVisible = await modal.isVisible().catch(() => false);

        if (isVisible) {
            // If it was accepted, verify quantity in cart is not 0
            await page.locator('button:has-text("View Cart")').click();
            const qty = page.locator('.cart_quantity button');
            await expect(qty).not.toHaveText('0');
        } else {
            // Stayed on product page — browser validation blocked it
            await expect(page).toHaveURL(/\/product_details\/1/);
        }
    });

    // ❌ Negative Test — proceed to checkout from cart without being logged in
    test('TC-017: Checkout from cart as guest prompts login or registration', async ({ page }) => {
        await page.goto(`${BASE_URL}/products`);

        // Add a product to cart
        await page.locator('.product-image-wrapper').first().hover();
        await page.locator('.product-overlay .add-to-cart').first().click();
        await page.locator('button:has-text("Continue Shopping")').click();

        await page.goto(`${BASE_URL}/view_cart`);

        // Click "Proceed To Checkout"
        await page.locator('a:has-text("Proceed To Checkout")').click();

        // Guest should see a modal asking to register/login, or be redirected to login
        const registerLoginModal = page.locator('#checkoutModal');
        const isModalVisible = await registerLoginModal.isVisible().catch(() => false);

        if (isModalVisible) {
            await expect(registerLoginModal).toBeVisible();
            // Modal should contain links to login and register
            await expect(page.locator('#checkoutModal a[href="/login"]')).toBeVisible();
        } else {
            // Redirected straight to login
            await expect(page).toHaveURL(`${BASE_URL}/login`);
        }
    });
});
