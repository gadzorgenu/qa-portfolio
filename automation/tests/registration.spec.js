const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://automationexercise.com';

// Existing account used to test duplicate registration
const EXISTING_EMAIL = 'g@mi';

// Helper to generate a unique email per test run
const uniqueEmail = () => `testuser_${Date.now()}@mailtest.com`;

test.describe('Registration Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
        await page.click('a[href="/login"]');
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

    // ✅ Happy Path — successful account creation
    test('TC-001: Successful registration with valid details', async ({ page }) => {
        const email = uniqueEmail();

        // Fill in name and email in the "New User Signup!" section
        await page.fill('input[data-qa="signup-name"]', 'Test User');
        await page.fill('input[data-qa="signup-email"]', email);
        await page.click('button[data-qa="signup-button"]');

        // Should be redirected to the full account info form
        await expect(page).toHaveURL(`${BASE_URL}/signup`);
        await expect(page.locator('h2.title.text-center b')).toHaveText('Enter Account Information');

        // Select title
        await page.check('#id_gender1');

        // Fill password
        await page.fill('input[data-qa="password"]', 'SecurePass@123');

        // Fill date of birth
        await page.selectOption('select[data-qa="days"]', '15');
        await page.selectOption('select[data-qa="months"]', '6');
        await page.selectOption('select[data-qa="years"]', '1995');

        // Opt-in checkboxes
        await page.check('#newsletter');
        await page.check('#optin');

        // Fill address details
        await page.fill('input[data-qa="first_name"]', 'Test');
        await page.fill('input[data-qa="last_name"]', 'User');
        await page.fill('input[data-qa="company"]', 'QA Corp');
        await page.fill('input[data-qa="address"]', '123 Test Street');
        await page.fill('input[data-qa="address2"]', 'Suite 4');
        await page.selectOption('select[data-qa="country"]', 'United States');
        await page.fill('input[data-qa="state"]', 'California');
        await page.fill('input[data-qa="city"]', 'San Francisco');
        await page.fill('input[data-qa="zipcode"]', '94105');
        await page.fill('input[data-qa="mobile_number"]', '4155550100');

        // Submit form
        await page.click('button[data-qa="create-account"]');

        // Assert account was created
        await expect(page).toHaveURL(`${BASE_URL}/account_created`);
        await expect(page.locator('h2[data-qa="account-created"]')).toBeVisible();
        await expect(page.locator('h2[data-qa="account-created"]')).toHaveText('Account Created!');
    });

    // ❌ Negative Test — email already registered
    test('TC-002: Register with an already registered email', async ({ page }) => {
        await page.fill('input[data-qa="signup-name"]', 'Duplicate User');
        await page.fill('input[data-qa="signup-email"]', EXISTING_EMAIL);
        await page.click('button[data-qa="signup-button"]');

        // Assert inline error message
        await expect(page.locator('p:has-text("Email Address already exist!")')).toBeVisible();

        // Assert user stays on the login/signup page
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

    // ❌ Negative Test — empty name and email
    test('TC-003: Register with empty name and email fields', async ({ page }) => {
        // Click signup without filling any fields
        await page.click('button[data-qa="signup-button"]');

        // Assert user stays on login page — browser validation prevents navigation
        await expect(page).toHaveURL(`${BASE_URL}/login`);

        // Assert fields are still empty
        await expect(page.locator('input[data-qa="signup-name"]')).toBeEmpty();
        await expect(page.locator('input[data-qa="signup-email"]')).toBeEmpty();
    });

    // ❌ Negative Test — name provided but email is empty
    test('Register with name but missing email', async ({ page }) => {
        await page.fill('input[data-qa="signup-name"]', 'Test User');
        // Leave email blank
        await page.click('button[data-qa="signup-button"]');

        // Browser required-field validation keeps user on the page
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

    // ❌ Negative Test — invalid email format
    test('Register with invalid email format', async ({ page }) => {
        await page.fill('input[data-qa="signup-name"]', 'Test User');
        await page.fill('input[data-qa="signup-email"]', 'not-an-email');
        await page.click('button[data-qa="signup-button"]');

        // Browser/server validation keeps user on the page
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

    // ❌ Negative Test — email only, no name
    test('Register with email but missing name', async ({ page }) => {
        const email = uniqueEmail();
        await page.fill('input[data-qa="signup-email"]', email);
        // Leave name blank
        await page.click('button[data-qa="signup-button"]');

        // Browser required-field validation keeps user on the page
        await expect(page).toHaveURL(`${BASE_URL}/login`);
    });
});
