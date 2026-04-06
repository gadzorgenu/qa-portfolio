# Manual Test Cases — Automation Exercise

**Application:** https://automationexercise.com
**Tester:** Georgina Adzorgenu
**Test Date:** April 2026
**Environment:** Chrome (latest), macOS

---

## Registration

---

### TC-001: Successful user registration with valid details

**Preconditions:**
- User is not already registered
- Browser is open on https://automationexercise.com

**Steps:**
1. Click "Signup / Login" in the navigation bar
2. Enter a unique full name in the "Name" field
3. Enter a valid unique email address in the "Email Address" field
4. Click the "Signup" button
5. Fill in all required fields: password, date of birth, address, country, mobile number
6. Click "Create Account"

**Expected Result:**
"Account Created!" confirmation page is displayed. User is redirected to their account page.

**Actual Result:**

**Status:** Pass / Fail

---

### TC-002: Registration with an already registered email

**Preconditions:**
- An account already exists with the email being used
- Browser is open on https://automationexercise.com

**Steps:**
1. Click "Signup / Login" in the navigation bar
2. Enter any name in the "Name" field
3. Enter an email address that is already registered
4. Click the "Signup" button

**Expected Result:**
An error message is displayed: "Email Address already exist!"

**Actual Result:**

**Status:** Pass / Fail

---

### TC-003: Registration with a missing required field

**Preconditions:**
- Browser is open on https://automationexercise.com

**Steps:**
1. Click "Signup / Login" in the navigation bar
2. Enter a unique name and email, click "Signup"
3. On the registration form, fill in all fields except "Mobile Number"
4. Click "Create Account"

**Expected Result:**
A validation error appears highlighting the empty required field. Form does not submit.

**Actual Result:**

**Status:** Pass / Fail

---

## Login

---

### TC-004: Successful login with valid credentials

**Preconditions:**
- User has a registered account
- Browser is open on https://automationexercise.com

**Steps:**
1. Click "Signup / Login" in the navigation bar
2. Under "Login to your account", enter the registered email address
3. Enter the correct password
4. Click the "Login" button

**Expected Result:**
User is logged in and redirected to the homepage. Navigation bar shows "Logged in as [username]"

**Actual Result:**

**Status:** Pass / Fail

---

### TC-005: Login with incorrect password

**Preconditions:**
- User has a registered account
- Browser is open on https://automationexercise.com

**Steps:**
1. Click "Signup / Login" in the navigation bar
2. Enter a valid registered email address
3. Enter an incorrect password
4. Click the "Login" button

**Expected Result:**
An error message is displayed: "Your email or password is incorrect!" User remains on the login page.

**Actual Result:**

**Status:** Pass / Fail

---

### TC-006: Login with empty email and password fields

**Preconditions:**
- Browser is open on https://automationexercise.com

**Steps:**
1. Click "Signup / Login" in the navigation bar
2. Leave the email field empty
3. Leave the password field empty
4. Click the "Login" button

**Expected Result:**
Browser validation prevents form submission. Required field indicators appear on both empty fields.

**Actual Result:**

**Status:** Pass / Fail

---

## Product Search

---

### TC-007: Search for a product that exists

**Preconditions:**
- Browser is open on https://automationexercise.com

**Steps:**
1. Click "Products" in the navigation bar
2. Locate the search bar at the top of the products page
3. Type "dress" in the search field
4. Click the search icon or press Enter

**Expected Result:**
Page displays products related to "dress". Section heading shows "Searched Products". At least one product is returned.

**Actual Result:**

**Status:** Pass / Fail

---

### TC-008: Search for a product that does not exist

**Preconditions:**
- Browser is open on https://automationexercise.com

**Steps:**
1. Click "Products" in the navigation bar
2. Locate the search bar at the top of the products page
3. Type "xyznonexistentproduct123" in the search field
4. Click the search icon or press Enter

**Expected Result:**
Page displays a "no results found" message or an empty product list with a helpful message to the user.

**Actual Result:**

**Status:** Pass / Fail

---

### TC-009: Search using special characters

**Preconditions:**
- Browser is open on https://automationexercise.com

**Steps:**
1. Click "Products" in the navigation bar
2. Locate the search bar at the top of the products page
3. Type `@#$%^&*` in the search field
4. Click the search icon or press Enter

**Expected Result:**
Application handles the input gracefully. Either returns no results with a helpful message or sanitises the input. No crash or server error occurs.

**Actual Result:**

**Status:** Pass / Fail

---

## Cart

---

### TC-010: Add a product to the cart

**Preconditions:**
- Browser is open on https://automationexercise.com

**Steps:**
1. Click "Products" in the navigation bar
2. Hover over any product
3. Click "Add to cart"
4. Click "View Cart" in the confirmation popup

**Expected Result:**
Cart page displays the added product with the correct name, price, quantity (1) and total.

**Actual Result:**

**Status:** Pass / Fail

---

### TC-011: Remove a product from the cart

**Preconditions:**
- At least one product is already in the cart
- User is on the cart page

**Steps:**
1. Click the cart icon in the navigation bar
2. Locate the product in the cart
3. Click the "X" delete button next to the product

**Expected Result:**
Product is removed from the cart immediately. Cart shows updated total. If cart is empty, an appropriate empty cart message is shown.

**Actual Result:**

**Status:** Pass / Fail

---

### TC-012: Update product quantity in the cart

**Preconditions:**
- At least one product is already in the cart
- User is on the cart page

**Steps:**
1. Click the cart icon in the navigation bar
2. Locate the quantity field for a product
3. Change the quantity from 1 to 3
4. Confirm or click update if required

**Expected Result:**
Quantity updates to 3. Total price for that product updates accordingly (unit price × 3).

**Actual Result:**

**Status:** Pass / Fail

---

## Checkout

---

### TC-013: Complete a full purchase as a logged-in user

**Preconditions:**
- User is logged in
- At least one product is in the cart

**Steps:**
1. Click the cart icon in the navigation bar
2. Click "Proceed to Checkout"
3. Review the delivery address and order summary
4. Enter a comment in the message box
5. Click "Place Order"
6. Enter payment details: name on card, card number, CVC, expiry month and year
7. Click "Pay and Confirm Order"

**Expected Result:**
Order confirmation page is displayed with message "Congratulations! Your order has been confirmed!"

**Actual Result:**

**Status:** Pass / Fail

---

### TC-014: Attempt checkout without being logged in

**Preconditions:**
- User is NOT logged in
- At least one product is in the cart

**Steps:**
1. Click the cart icon in the navigation bar
2. Click "Proceed to Checkout"

**Expected Result:**
A prompt appears asking the user to log in or register before proceeding. User is not able to complete checkout without authentication.

**Actual Result:**

**Status:** Pass / Fail

---

### TC-015: Verify order summary matches cart contents

**Preconditions:**
- User is logged in
- At least two different products are in the cart

**Steps:**
1. Note the products, quantities and prices shown in the cart
2. Click "Proceed to Checkout"
3. Review the order summary on the checkout page

**Expected Result:**
Order summary on the checkout page exactly matches the products, quantities and prices from the cart. Total amount is correct.

**Actual Result:**

**Status:** Pass / Fail

---

## Test Summary

| ID | Module | Title | Status |
|---|---|---|---|
| TC-001 | Registration | Successful registration with valid details | |
| TC-002 | Registration | Registration with already registered email | |
| TC-003 | Registration | Registration with missing required field | |
| TC-004 | Login | Successful login with valid credentials | |
| TC-005 | Login | Login with incorrect password | |
| TC-006 | Login | Login with empty fields | |
| TC-007 | Search | Search for a product that exists | |
| TC-008 | Search | Search for a product that does not exist | |
| TC-009 | Search | Search using special characters | |
| TC-010 | Cart | Add a product to the cart | |
| TC-011 | Cart | Remove a product from the cart | |
| TC-012 | Cart | Update product quantity in the cart | |
| TC-013 | Checkout | Complete a full purchase as logged-in user | |
| TC-014 | Checkout | Attempt checkout without being logged in | |
| TC-015 | Checkout | Verify order summary matches cart contents | |

**Total:** 15 | **Pass:** | **Fail:** | **Not Run:** 15