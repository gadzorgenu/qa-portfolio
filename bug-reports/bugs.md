# Bug Reports — Automation Exercise

**Application:** https://automationexercise.com
**Tester:** Georgina Adzorgenu
**Test Date:** April 2026
**Environment:** Chrome (latest), macOS

---

## Registration Module

---

### BUG-001: February date of birth not limited to 28/29 days

**Module:** Registration
**Severity:** Medium
**Priority:** Medium

**Description:**
The date of birth dropdown for the month of February allows users to select dates up to 31, which are invalid dates. February should be limited to 28 days in a standard year and 29 days in a leap year.

**Steps to Reproduce:**
1. Go to https://automationexercise.com
2. Click "Signup / Login"
3. Enter a name and email, click "Signup"
4. On the registration form, locate the Date of Birth section
5. Select "February" from the month dropdown
6. Click the day dropdown

**Expected Result:**
Day dropdown should only show values up to 28 (or 29 in a leap year)

**Actual Result:**
Day dropdown shows values up to 31, allowing selection of invalid dates such as February 30 and February 31

**Impact:**
Users can submit invalid dates of birth, leading to bad data in the system and potential downstream errors.

---

### BUG-002: Phone number field accepts alphabetic characters

**Module:** Registration
**Severity:** High
**Priority:** High

**Description:**
The phone number input field on the registration form does not validate against non-numeric input. Users can type letters and special characters into the field and successfully submit the form.

**Steps to Reproduce:**
1. Go to https://automationexercise.com
2. Click "Signup / Login"
3. Enter a name and email, click "Signup"
4. On the registration form, locate the "Mobile Number" field
5. Type alphabetic characters e.g. `abcdefghij`
6. Fill in remaining required fields and click "Create Account"

**Expected Result:**
Field should reject non-numeric input, either by preventing typing of letters or displaying a validation error on submit

**Actual Result:**
Letters are accepted without any error. Form submits successfully with an invalid phone number.

**Impact:**
Invalid phone numbers stored in the database. Could cause failures in SMS notifications, account recovery, or downstream integrations.

---

### BUG-003: Email field accepts invalid email formats

**Module:** Registration
**Severity:** High
**Priority:** High

**Description:**
The email input field on the registration form accepts incorrectly formatted email addresses. Emails that do not conform to standard format (e.g. missing TLD, single character domain) are accepted without validation errors.

**Steps to Reproduce:**
1. Go to https://automationexercise.com
2. Click "Signup / Login"
3. In the email field, enter an invalid email such as `adss@m`
4. Click "Signup"

**Expected Result:**
An inline validation error should appear stating the email format is invalid. Form should not proceed.

**Actual Result:**
The form accepts `adss@m` as a valid email and proceeds to the registration page without any error.

**Impact:**
Users can register with unreachable email addresses. This breaks email verification, password reset, and all communication flows.

---

### BUG-004: Country dropdown contains very limited options

**Module:** Registration
**Severity:** Low
**Priority:** Low

**Description:**
The country selection dropdown on the registration form contains a very limited number of countries, excluding the majority of countries in the world. This restricts the application's usability for a global audience.

**Steps to Reproduce:**
1. Go to https://automationexercise.com
2. Click "Signup / Login"
3. Enter name and email, click "Signup"
4. On the registration form, click the "Country" dropdown

**Expected Result:**
Dropdown should contain a comprehensive list of countries (195 countries as recognised internationally)

**Actual Result:**
Only a small subset of countries is available for selection. Most countries are missing.

**Impact:**
International users cannot accurately complete their profile. Limits the application's reach to a global market.

---

### BUG-005: Registration form fields lack proper validation

**Module:** Registration
**Severity:** High
**Priority:** High

**Description:**
Multiple form fields on the registration page do not perform adequate input validation. Fields accept inputs that should be rejected, and error messages are either absent or insufficient to guide the user.

**Steps to Reproduce:**
1. Go to https://automationexercise.com
2. Click "Signup / Login"
3. Enter name and email, click "Signup"
4. On the registration form, leave required fields empty or enter invalid data
5. Click "Create Account"

**Expected Result:**
Each invalid or empty required field should display a clear, specific inline validation message explaining what is wrong and what is expected.

**Actual Result:**
Form either submits without validation or shows generic errors that do not help the user correct their input.

**Impact:**
Poor user experience. Invalid data enters the system, causing potential errors in downstream processes and data integrity issues.

---

## Products Module

---

### BUG-006: Filter selection not persisted on page navigation

**Module:** Products
**Severity:** High
**Priority:** High

**Description:**
When a user selects a category filter from the sidebar (e.g. "Tops" under "Women"), the filter is cleared when navigating to the resulting page. The selection does not persist, meaning the user lands on a page with no active filter applied.

**Steps to Reproduce:**
1. Go to https://automationexercise.com
2. Click "Products" in the navigation bar
3. In the left sidebar, click "Women" to expand the category
4. Click "Tops"
5. Observe the page and the sidebar filter state

**Expected Result:**
Page should display only products in the "Tops" category under "Women". The selected filter should remain highlighted/active in the sidebar.

**Actual Result:**
The filter selection resets upon navigation. The sidebar no longer shows "Tops" as selected, and the page may not correctly reflect the filtered results.

**Impact:**
Users cannot reliably filter products. This is a core e-commerce feature and its failure significantly degrades the shopping experience and could lead to lost sales.

---

### BUG-007: Product hover state shows no additional information

**Module:** Products
**Severity:** Low
**Priority:** Low

**Description:**
When hovering over a product card on the products listing page, an overlay appears but does not provide any information beyond what is already visible on the card. The hover interaction adds no value to the user experience.

**Steps to Reproduce:**
1. Go to https://automationexercise.com
2. Click "Products" in the navigation bar
3. Hover the mouse cursor over any product card

**Expected Result:**
The hover state should reveal additional useful information such as available sizes, colours, a quick-add-to-cart option, or a product preview — information not already shown on the card.

**Actual Result:**
The hover overlay appears but only shows the same product name and price already visible on the card. No additional information is displayed.

**Impact:**
Missed opportunity to improve user experience and conversion. The hover interaction takes up development effort but delivers no user value in its current state.

---

## Bug Summary

| ID | Module | Title | Severity | Priority |
|---|---|---|---|---|
| BUG-001 | Registration | February date not limited to 28/29 days | Medium | Medium |
| BUG-002 | Registration | Phone number accepts alphabetic characters | High | High |
| BUG-003 | Registration | Email field accepts invalid formats | High | High |
| BUG-004 | Registration | Country dropdown has very limited options | Low | Low |
| BUG-005 | Registration | Form fields lack proper validation | High | High |
| BUG-006 | Products | Filter selection not persisted on navigation | High | High |
| BUG-007 | Products | Product hover state adds no new information | Low | Low |

**Total bugs found:** 7
**High severity:** 4
**Medium severity:** 1
**Low severity:** 2