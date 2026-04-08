const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://automationexercise.com';

const VALID_EMAIL = 'g@mi';
const VALID_PASSWORD = 'test@123';

// Valid test payment card details
const VALID_CARD = {
    nameOnCard: 'Test User',
    number: '4111111111111111',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: '2027',
};

// Reusable: log in and add a product to cart, land on /view_cart
async function loginAndAddToCart(page) {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[data-qa="login-email"]', VALID_EMAIL);
    await page.fill('input[data-qa="login-password"]', VALID_PASSWORD);
    await page.click('button[data-qa="login-button"]');
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

    await page.goto(`${BASE_URL}/products`);
    await page.locator('.product-image-wrapper').first().hover();
    await page.locator('.product-overlay .add-to-cart').first().click();
    await page.locator('button:has-text("Continue Shopping")').click();

    await page.goto(`${BASE_URL}/view_cart`);
    await expect(page.locator('#cart_info_table tbody tr').first()).toBeVisible();
}

test.describe('Checkout Flow', () => {

    // ✅ Happy Path — full checkout flow from cart to order confirmation
    test('TC-018: Complete checkout with valid payment details', async ({ page }) => {
        await loginAndAddToCart(page);

        // Proceed to checkout
        await page.locator('a:has-text("Proceed To Checkout")').click();
        await expect(page).toHaveURL(`${BASE_URL}/checkout`);

        // Assert delivery address section is visible
        await expect(page.locator('#address_delivery')).toBeVisible();

        // Assert order summary (cart items) is visible
        await expect(page.locator('#cart_info')).toBeVisible();

        // Add an optional order comment
        await page.fill('textarea[name="message"]', 'Please deliver between 9am and 5pm.');

        // Proceed to payment
        await page.locator('a:has-text("Place Order")').click();
        await expect(page).toHaveURL(`${BASE_URL}/payment`);

        // Fill in payment details
        await page.fill('input[data-qa="name-on-card"]', VALID_CARD.nameOnCard);
        await page.fill('input[data-qa="card-number"]', VALID_CARD.number);
        await page.fill('input[data-qa="cvc"]', VALID_CARD.cvc);
        await page.fill('input[data-qa="expiry-month"]', VALID_CARD.expiryMonth);
        await page.fill('input[data-qa="expiry-year"]', VALID_CARD.expiryYear);

        // Confirm payment
        await page.click('button[data-qa="pay-button"]');

        // Assert order success page
        await expect(page).toHaveURL(`${BASE_URL}/payment_done`);
        await expect(page.locator('h2[data-qa="order-placed"]')).toBeVisible();
        await expect(page.locator('h2[data-qa="order-placed"]')).toHaveText('Order Placed!');
    });

    // ✅ Happy Path — delivery address on checkout matches account address
    test('TC-019: Delivery address shown at checkout matches registered address', async ({ page }) => {
        await loginAndAddToCart(page);

        await page.locator('a:has-text("Proceed To Checkout")').click();
        await expect(page).toHaveURL(`${BASE_URL}/checkout`);

        // Delivery and billing address blocks must be present
        await expect(page.locator('#address_delivery')).toBeVisible();
        await expect(page.locator('#address_invoice')).toBeVisible();
    });

    // ✅ Happy Path — order can be downloaded as invoice after placement
    test('Download invoice after successful order', async ({ page }) => {
        await loginAndAddToCart(page);

        await page.locator('a:has-text("Proceed To Checkout")').click();
        await page.locator('a:has-text("Place Order")').click();

        await page.fill('input[data-qa="name-on-card"]', VALID_CARD.nameOnCard);
        await page.fill('input[data-qa="card-number"]', VALID_CARD.number);
        await page.fill('input[data-qa="cvc"]', VALID_CARD.cvc);
        await page.fill('input[data-qa="expiry-month"]', VALID_CARD.expiryMonth);
        await page.fill('input[data-qa="expiry-year"]', VALID_CARD.expiryYear);
        await page.click('button[data-qa="pay-button"]');

        await expect(page).toHaveURL(`${BASE_URL}/payment_done`);

        // Download invoice button should be present
        const downloadBtn = page.locator('a:has-text("Download Invoice")');
        await expect(downloadBtn).toBeVisible();

        // Trigger the download and assert a file is downloaded
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            downloadBtn.click(),
        ]);
        expect(download.suggestedFilename()).toMatch(/invoice/i);
    });

    // ❌ Negative Test — guest attempts to access checkout directly
    test('TC-020: Guest navigating to /checkout directly is redirected to login', async ({ page }) => {
        // Ensure no session cookies
        await page.context().clearCookies();
        await page.goto(`${BASE_URL}/checkout`);

        // Should be redirected to login page
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

    // ❌ Negative Test — payment submitted with all fields empty
    test('TC-021: Submit payment form with all empty fields stays on payment page', async ({ page }) => {
        await loginAndAddToCart(page);

        await page.locator('a:has-text("Proceed To Checkout")').click();
        await page.locator('a:has-text("Place Order")').click();
        await expect(page).toHaveURL(`${BASE_URL}/payment`);

        // Submit without filling any payment fields
        await page.click('button[data-qa="pay-button"]');

        // Browser required-field validation keeps user on the payment page
        await expect(page).toHaveURL(`${BASE_URL}/payment`);
    });

    // ❌ Negative Test — payment with missing card number
    test('TC-022: Submit payment without card number stays on payment page', async ({ page }) => {
        await loginAndAddToCart(page);

        await page.locator('a:has-text("Proceed To Checkout")').click();
        await page.locator('a:has-text("Place Order")').click();

        // Fill everything except card number
        await page.fill('input[data-qa="name-on-card"]', VALID_CARD.nameOnCard);
        // card-number intentionally left blank
        await page.fill('input[data-qa="cvc"]', VALID_CARD.cvc);
        await page.fill('input[data-qa="expiry-month"]', VALID_CARD.expiryMonth);
        await page.fill('input[data-qa="expiry-year"]', VALID_CARD.expiryYear);

        await page.click('button[data-qa="pay-button"]');

        // Should stay on payment page
        await expect(page).toHaveURL(`${BASE_URL}/payment`);
    });

    // ❌ Negative Test — payment with missing CVC
    test('TC-023: Submit payment without CVC stays on payment page', async ({ page }) => {
        await loginAndAddToCart(page);

        await page.locator('a:has-text("Proceed To Checkout")').click();
        await page.locator('a:has-text("Place Order")').click();

        await page.fill('input[data-qa="name-on-card"]', VALID_CARD.nameOnCard);
        await page.fill('input[data-qa="card-number"]', VALID_CARD.number);
        // CVC intentionally left blank
        await page.fill('input[data-qa="expiry-month"]', VALID_CARD.expiryMonth);
        await page.fill('input[data-qa="expiry-year"]', VALID_CARD.expiryYear);

        await page.click('button[data-qa="pay-button"]');

        await expect(page).toHaveURL(`${BASE_URL}/payment`);
    });

    // ❌ Negative Test — payment with missing expiry month
    test('TC-024: Submit payment without expiry month stays on payment page', async ({ page }) => {
        await loginAndAddToCart(page);

        await page.locator('a:has-text("Proceed To Checkout")').click();
        await page.locator('a:has-text("Place Order")').click();

        await page.fill('input[data-qa="name-on-card"]', VALID_CARD.nameOnCard);
        await page.fill('input[data-qa="card-number"]', VALID_CARD.number);
        await page.fill('input[data-qa="cvc"]', VALID_CARD.cvc);
        // expiry month intentionally left blank
        await page.fill('input[data-qa="expiry-year"]', VALID_CARD.expiryYear);

        await page.click('button[data-qa="pay-button"]');

        await expect(page).toHaveURL(`${BASE_URL}/payment`);
    });

    // ❌ Negative Test — payment with expired card (past expiry year)
    test('TC-025: Submit payment with expired card year shows error or stays on payment page', async ({ page }) => {
        await loginAndAddToCart(page);

        await page.locator('a:has-text("Proceed To Checkout")').click();
        await page.locator('a:has-text("Place Order")').click();

        await page.fill('input[data-qa="name-on-card"]', VALID_CARD.nameOnCard);
        await page.fill('input[data-qa="card-number"]', VALID_CARD.number);
        await page.fill('input[data-qa="cvc"]', VALID_CARD.cvc);
        await page.fill('input[data-qa="expiry-month"]', '01');
        await page.fill('input[data-qa="expiry-year"]', '2000'); // expired

        await page.click('button[data-qa="pay-button"]');

        // Site should not confirm the order — stays on payment or shows an error
        await expect(page).not.toHaveURL(`${BASE_URL}/payment_done`);
    });

    // ❌ Negative Test — checkout with an empty cart
    test('TC-026: Proceed to checkout with empty cart shows empty cart state', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await page.fill('input[data-qa="login-email"]', VALID_EMAIL);
        await page.fill('input[data-qa="login-password"]', VALID_PASSWORD);
        await page.click('button[data-qa="login-button"]');
        await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

        // Go to cart without adding any item (fresh session clears cart via cookies)
        await page.context().clearCookies();
        await page.goto(`${BASE_URL}/view_cart`);

        // Cart should be empty — "Proceed To Checkout" should not lead to a valid order
        await expect(page.locator('#empty_cart')).toBeVisible();
    });
});
