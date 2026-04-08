const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://automationexercise.com';

const VALID_EMAIL = 'g@mi';
const VALID_PASSWORD = 'test@123';

test.describe('Login Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
        await page.click('a[href="/login"]');
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

     test('TC-004: Successful login with valid credentials', async ({ page }) => {
        await page.fill('input[data-qa="login-email"]', VALID_EMAIL);

         // Fill in password
        await page.fill('input[data-qa="login-password"]', VALID_PASSWORD);

        // Click login button
        await page.click('button[data-qa="login-button"]');

        // Assert user is logged in
        await expect(page).toHaveURL(BASE_URL + '/');
        await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

        // Assert logout button is visible
        await expect(page.locator('a[href="/logout"]')).toBeVisible();
    });

    test('TC-005: Login with incorrect password', async ({ page }) => {
        // Fill in valid email
        await page.fill('input[data-qa="login-email"]', VALID_EMAIL);

        // Fill in wrong password
        await page.fill('input[data-qa="login-password"]', 'WrongPassword999');

        // Click login button
        await page.click('button[data-qa="login-button"]');

        // Assert error message is shown
        await expect(page.locator('p:has-text("Your email or password is incorrect!")')).toBeVisible();

        // Assert user stays on login page
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

    // ❌ Negative Test — empty fields
    test('TC-006: Login with empty email and password', async ({ page }) => {
        // Click login without filling anything
        await page.click('button[data-qa="login-button"]');

        // Assert user stays on login page
        await expect(page).toHaveURL(`${BASE_URL}/login`);

        // Assert email field is still empty
        await expect(page.locator('input[data-qa="login-email"]')).toBeEmpty();
    });

    // ❌ Negative Test — invalid email format
    test('Login with invalid email format', async ({ page }) => {
        // Fill in badly formatted email
        await page.fill('input[data-qa="login-email"]', 'notanemail');

        // Fill in any password
        await page.fill('input[data-qa="login-password"]', 'anypassword');

        // Click login button
        await page.click('button[data-qa="login-button"]');

        // Assert user stays on login page
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

       // ❌ Negative Test — unregistered email
    test('Login with unregistered email', async ({ page }) => {
        // Fill in email that does not exist
        await page.fill('input[data-qa="login-email"]', 'doesnotexist@fake.com');

        // Fill in any password
        await page.fill('input[data-qa="login-password"]', 'anypassword');

        // Click login button
        await page.click('button[data-qa="login-button"]');

        // Assert error message is shown
        await expect(page.locator('p:has-text("Your email or password is incorrect!")')).toBeVisible();

        // Assert user stays on login page
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

});