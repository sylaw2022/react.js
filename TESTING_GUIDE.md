# Testing Guide

Complete testing setup for frontend, backend, and E2E tests with support for local development and CI/CD (Jenkins/GitHub Actions).

---

## Test Structure

```
tests/
├── frontend.test.jsx    # Frontend component tests (Vitest + React Testing Library)
├── backend.test.js      # Backend API tests (Vitest)
├── e2e.test.js          # End-to-end tests (Playwright)
└── setup.js             # Test setup configuration
```

---

## Test Types

### 1. Frontend Tests
- **Framework:** Vitest + React Testing Library
- **Location:** `tests/frontend.test.jsx`
- **Coverage:**
  - Component rendering
  - User interactions
  - Form validation
  - State management
  - Navigation

### 2. Backend Tests
- **Framework:** Vitest
- **Location:** `tests/backend.test.js`
- **Coverage:**
  - API endpoints
  - Authentication
  - Registration
  - Token verification
  - Protected routes

### 3. E2E Tests
- **Framework:** Playwright
- **Location:** `tests/e2e.test.js`
- **Coverage:**
  - Complete user flows
  - Registration flow
  - Login flow
  - Navigation
  - Authentication state
  - API integration

---

## Running Tests Locally

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites

#### Frontend Tests Only
```bash
npm run test:frontend
```

#### Backend Tests Only
```bash
npm run test:backend
```

#### E2E Tests Only
```bash
npm run test:e2e
```

### Run All Tests (Frontend + Backend + E2E)
```bash
npm run test:all
```

### Watch Mode (Frontend/Backend)
```bash
npm run test:watch
```

### Test Coverage
```bash
npm run test:coverage
```

### E2E Tests with UI
```bash
npm run test:e2e:ui
```

### E2E Tests in Headed Mode
```bash
npm run test:e2e:headed
```

---

## CI/CD Integration

### Jenkins

#### Prerequisites
1. Jenkins server with Node.js plugin installed
2. Jenkinsfile in project root

#### Pipeline Stages
1. **Checkout** - Get source code
2. **Setup** - Verify Node.js environment
3. **Install Dependencies** - `npm ci`
4. **Lint** - Code quality checks
5. **Build** - Build application
6. **Frontend Tests** - Run frontend test suite
7. **Backend Tests** - Run backend test suite
8. **E2E Tests** - Run E2E tests with Playwright
9. **Test Summary** - Report results

#### Running in Jenkins
1. Create new pipeline job
2. Point to repository with Jenkinsfile
3. Configure Node.js version (18+)
4. Run pipeline

#### Jenkinsfile Location
- `Jenkinsfile` - Main Jenkins pipeline configuration

### GitHub Actions

#### Workflow File
- `.github/workflows/ci.yml` - GitHub Actions CI configuration

#### Triggers
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

#### Features
- Matrix testing (Node.js 18.x and 20.x)
- Automatic test execution
- Test result artifacts

---

## Test Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `npm test` | Run frontend + backend tests |
| `test:frontend` | `npm run test:frontend` | Run frontend tests only |
| `test:backend` | `npm run test:backend` | Run backend tests only |
| `test:e2e` | `npm run test:e2e` | Run E2E tests |
| `test:all` | `npm run test:all` | Run all test suites |
| `test:watch` | `npm run test:watch` | Watch mode for frontend/backend |
| `test:coverage` | `npm run test:coverage` | Generate coverage report |
| `test:ci` | `npm run test:ci` | CI-optimized test run |
| `test:jenkins` | `npm run test:jenkins` | Full Jenkins test pipeline |

---

## Environment Variables

### For E2E Tests
```bash
TEST_BASE_URL=http://localhost:3000  # Default test URL
CI=true                              # Enable CI mode
```

### For Local Development
```bash
# No environment variables needed
# Tests use default localhost:3000
```

---

## Test Configuration Files

### Vitest Config
- `vitest.config.js` - Vitest configuration
- `tests/setup.js` - Test setup file

### Playwright Config
- `playwright.config.js` - Playwright configuration
- Supports multiple browsers (Chromium, Firefox, WebKit)

---

## Writing Tests

### Frontend Test Example
```javascript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Backend Test Example
```javascript
import { describe, it, expect } from 'vitest'

describe('API Endpoint', () => {
  it('should return 200', async () => {
    const response = await fetch('/api/status')
    expect(response.status).toBe(200)
  })
})
```

### E2E Test Example
```javascript
import { test, expect } from '@playwright/test'

test('should load page', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Hello')
})
```

---

## Troubleshooting

### Tests Fail Locally
1. Ensure server is running: `npm run dev`
2. Check Node.js version: `node --version` (should be 18+)
3. Clear cache: `rm -rf node_modules/.cache`
4. Reinstall: `rm -rf node_modules && npm install`

### E2E Tests Fail
1. Install Playwright browsers: `npx playwright install`
2. Check server is running on port 3000
3. Verify `TEST_BASE_URL` environment variable

### Jenkins Pipeline Fails
1. Check Node.js version in Jenkins
2. Verify `npm ci` succeeds
3. Check Playwright browser installation
4. Review Jenkins console logs

---

## Best Practices

1. **Write Tests First** - TDD approach
2. **Keep Tests Isolated** - Each test should be independent
3. **Use Descriptive Names** - Clear test descriptions
4. **Mock External Dependencies** - Don't rely on external services
5. **Clean Up After Tests** - Reset state between tests
6. **Run Tests Frequently** - Catch issues early

---

## Test Coverage Goals

- **Frontend:** >80% component coverage
- **Backend:** >80% API endpoint coverage
- **E2E:** Critical user flows covered

---

## Continuous Integration

### Jenkins
- Automatic test execution on commits
- Test result reporting
- Artifact archiving
- HTML reports

### GitHub Actions
- Matrix testing across Node.js versions
- Automatic PR checks
- Test result artifacts

---

## Summary

✅ **Frontend Tests** - Component and interaction testing  
✅ **Backend Tests** - API endpoint testing  
✅ **E2E Tests** - Complete user flow testing  
✅ **CI/CD Ready** - Jenkins and GitHub Actions support  
✅ **Local Development** - Watch mode and coverage reports  

Your testing infrastructure is complete and ready for both local development and CI/CD! 🎉



