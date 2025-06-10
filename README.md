# Test Automation Framework

A comprehensive test automation framework using TypeScript, Playwright, Cucumber, and Bruno API collections. This framework implements the Page Object Model (POM) pattern combined with a service-oriented approach.

## Features

- Cucumber BDD for human-readable test scenarios
- Playwright for browser automation with multi-browser support
- Page Object Model for UI component abstraction
- Service-oriented approach for API testing
- Bruno API collections for powerful API testing
- Comprehensive reporting with screenshots and videos
- Environment configuration management
- Parallel test execution
- TypeScript for strong typing and improved code quality

## 📂 Project Structure

```
├── features/               # Cucumber feature files
├── src/
│   ├── config/             # Environment configuration
│   ├── page-objects/       # Page Object Model classes
│   ├── services/           # Service layer for API interactions
│   ├── step-definitions/   # Cucumber step definitions
│   ├── support/            # Support files (hooks, world)
│   ├── utils/              # Utility functions and helpers
│   └── reporters/          # Test reporting
├── bruno/                  # Bruno API collections
│   └── collections/        # API request collections
├── reports/                # Test reports output
│   ├── screenshots/        # Failure screenshots
│   ├── videos/             # Test execution videos
│   └── logs/               # Test logs
├── .env.example            # Environment variables example
└── cucumber.js            # Cucumber configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Copy the environment example file

```bash
cp .env.example .env
```

4. Customize the environment variables in the `.env` file

### Running Tests

Run all tests:

```bash
npm test
```

Run specific test types:

```bash
# Run UI tests only
npm run test:ui

# Run API tests only
npm run test:api

# Run tests in parallel
npm run test:parallel

# Generate HTML report
npm run test:report
```

### API Testing with Bruno

```bash
# Run all Bruno collections
npm run bruno:run

# Export Bruno collections for use in the framework
npm run bruno:export
```

## 📊 Reporting

The framework generates comprehensive reports:

- Cucumber JSON reports
- HTML reports with screenshots for failed tests
- Console output with test progress

To generate an HTML report after test execution:

```bash
npm run test:report
```

## 🔧 Configuration

The framework supports multiple environments and browsers:

- Environments: dev, staging, production
- Browsers: chromium, firefox, webkit
- Headless mode: true/false

Configure these in the `.env` file or pass as environment variables:

```bash
# Run tests in Firefox browser
BROWSER=firefox npm test

# Run tests against staging
TEST_ENV=staging npm test

# Run tests in headed mode
HEADLESS=false npm test
```

## 📝 Writing Tests

### Feature Files

Create feature files in the `features/` directory using Gherkin syntax:

```gherkin
Feature: User Login
  As a user of the application
  I want to be able to login
  So that I can access my account

  @ui
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid username and password
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message
```

### Page Objects

Create page objects in the `src/page-objects/` directory:

```typescript
export class LoginPage extends BasePage {
  // UI Selectors
  private selectors = {
    usernameInput: '#username',
    passwordInput: '#password',
    loginButton: 'button[type="submit"]'
  };

  constructor(world: CustomWorld) {
    super(world, '/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.typeText(this.selectors.usernameInput, username);
    await this.typeText(this.selectors.passwordInput, password);
    await this.click(this.selectors.loginButton);
  }
}
```

### API Services

Create service classes in the `src/services/` directory:

```typescript
export class AuthService extends BaseService {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.post<LoginResponse>('/auth/login', {
        username,
        password
      });
      this.setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
```

## 🧩 Extending the Framework

### Adding New Page Objects

1. Create a new class in `src/page-objects/` that extends `BasePage`
2. Define selectors and methods for the page
3. Use it in step definitions

### Adding New API Services

1. Create a new class in `src/services/` that extends `BaseService`
2. Add methods for API endpoints
3. Use it in step definitions

### Adding New Bruno Collections

1. Create new collections in the Bruno app
2. Export them to the `bruno/collections/` directory
3. Create service classes that use these API endpoints

## 📜 License

This project is licensed under the MIT License.