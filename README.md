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
├── AutomationExcersice API tests.postman_collection.json  # Postman collection export
├── test-cases/
│   └── test-cases.md        # Manual test cases
├── bug-reports/
│   ├── bugs.md              # Bug reports with steps to reproduce
│   └── screenshots/         # Evidence for each bug
├── api-tests/               # API test assets
└── automation/              # Playwright automated test scripts
```

---

## Test Coverage

### Manual Testing
Test cases covering the following flows:

- **User Registration** — valid signup, duplicate email, missing fields
- **Login** — correct credentials, wrong password, empty form
- **Product Search** — valid search, no results, special characters
- **Cart** — add item, remove item, update quantity
- **Checkout** — complete purchase, proceed without login

### API Testing
9 API tests built in Postman covering user authentication, account management, and product data retrieval:

| Method | Endpoint | What It Tests |
|---|---|---|
| GET | /api/productsList | Returns full product list with correct structure |
| GET | /api/brandsList | Returns brand data with status 200 |
| POST | /api/verifyLogin | Valid credentials return success response |
| POST | /api/verifyLogin | Invalid credentials return error response |
| POST | /api/verifyLogin | Missing parameters return appropriate error |
| POST | /api/createAccount | New user created successfully |
| POST | /api/createAccount | Duplicate email edge case handled correctly |
| DELETE | /api/deleteAccount | Account deleted, returns 200 |
| DELETE | /api/deleteAccount | Non-existent account edge case handled |

Each request includes assertions for HTTP status codes, response time (under 3000ms), response body structure, field validation, security checks, and environment variable management.

### UI Automation
Automated test scripts built with Playwright:

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

| ID | Module | Title | Severity | Priority | Status |
|---|---|---|---|---|---|
| BUG-001 | Registration | February date not limited to 28/29 days | Medium | Medium | Open |
| BUG-002 | Registration | Phone number accepts alphabetic characters | High | High | Open |
| BUG-003 | Registration | Email field accepts invalid formats | High | High | Open |
| BUG-004 | Registration | Country dropdown has very limited options | Low | Low | Open |
| BUG-005 | Registration | Form fields lack proper validation | High | High | Open |
| BUG-006 | Products | Filter selection not persisted on navigation | High | High | Open |
| BUG-007 | Products | Product hover state adds no new information | Low | Low | Open |
| BUG-008 | API | Incorrect Content-Type header (text/html vs application/json) | Medium | Medium | Open |
| BUG-009 | API | Internal Django framework details exposed on 404 responses | High | High | Open |

**Total bugs found:** 9 &nbsp;|&nbsp; **High severity:** 5 &nbsp;|&nbsp; **Medium severity:** 2 &nbsp;|&nbsp; **Low severity:** 2

Full bug reports with screenshots are in the `/bug-reports` folder.

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
