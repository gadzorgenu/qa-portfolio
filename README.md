# QA Portfolio — Automation Exercise

A end-to-end QA portfolio project testing [automationexercise.com](https://automationexercise.com) a full e-commerce web application. This project covers manual test cases, exploratory testing, API testing with Postman, and UI automation with Playwright.

---

## About This Project

This project was built to demonstrate practical QA engineering skills including test planning, manual testing, API validation, and test automation. All testing was performed on a live e-commerce demo application covering core user journeys such as registration, login, product search, cart management, and checkout.

---

## Tools & Technologies

| Tool | Purpose |
|---|---|
| Playwright | UI test automation |
| Postman | API testing |
| GitHub | Version control and portfolio hosting |
| JavaScript | Automation scripting language |
| Markdown | Test case and bug report documentation |

---

## Project Structure

```
qa-portfolio/
├── README.md
├── test-cases/
│   └── test_cases.md        # 15 manual test cases
├── bug-reports/
│   ├── bugs.md              # Bug reports with steps to reproduce
│   └── screenshots/         # Evidence for each bug
├── api-tests/
│   └── collection.json      # Postman collection export
└── automation/
    └── tests/               # Playwright automated test scripts
```

---

## Test Coverage

### Manual Testing
15 test cases covering the following flows:

- **User Registration** — valid signup, duplicate email, missing fields
- **Login** — correct credentials, wrong password, empty form
- **Product Search** — valid search, no results, special characters
- **Cart** — add item, remove item, update quantity
- **Checkout** — complete purchase, proceed without login

### API Testing
6 API tests built in Postman:

| Method | Endpoint | What It Tests |
|---|---|---|
| GET | /api/productsList | Returns full product list with correct structure |
| GET | /api/brandsList | Returns brand data with status 200 |
| POST | /api/login | Valid credentials return success response |
| POST | /api/login | Invalid credentials return error response |
| POST | /api/createAccount | New user created successfully |
| DELETE | /api/deleteAccount | Account deleted, returns 200 |

### UI Automation
5 automated test scripts built with Playwright:

- Successful login
- Failed login with wrong password
- Search for a product
- Add item to cart
- Register a new account

---

## How to Run the Automated Tests

**Prerequisites:**
- Node.js installed (v18 or above)
- Git

**Steps:**

```bash
# Clone the repo
git clone https://github.com/gadzorgenu/qa-portfolio.git
cd qa-portfolio/automation

# Install dependencies
npm install
npx playwright install

# Run all tests
npx playwright test

# Run tests with browser visible
npx playwright test --headed

# View the test report
npx playwright show-report
```

---

## Bug Reports Summary

| ID | Title | Severity | Priority | Status |
|---|---|---|---|---|
| BUG-001 | [Title] | Medium | High | Open |
| BUG-002 | [Title] | Low | Medium | Open |
| BUG-003 | [Title] | Low | Low | Open |

Full bug reports with screenshots are in the `/bug-reports` folder.

---

## API Test Results

![Postman Tests Passing](bug-reports/screenshots/postman-results.png)

---

## Key Learnings

- Practised writing structured test cases with clear preconditions and expected results
- Applied boundary value analysis and equivalence partitioning techniques
- Gained hands-on experience with REST API testing including authentication, status codes and response validation
- Built reusable automated test scripts using Playwright's Page Object Model pattern
- Learned to distinguish between bug severity and priority in real-world scenarios

---

## Author

**Georgina Adzorgenu**
Transitioning from Software Development to QA Engineering

[GitHub](https://github.com/gadzorgenu) • [LinkedIn](https://linkedin.com/in/your-profile)

---

*This project is for portfolio and learning purposes.*
