# Test Suite Documentation

## Overview

This project includes comprehensive tests for both frontend (React components) and backend (SSR server) functionality.

## Test Structure

```
tests/
├── setup.js           # Test configuration and setup
├── frontend.test.jsx   # React component tests
└── backend.test.js     # Server-side rendering tests
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Frontend Tests Only
```bash
npm run test:frontend
```

### Run Backend Tests Only
```bash
npm run test:backend
```

### Watch Mode (Auto-run on file changes)
```bash
npm run test:watch
```

### Test UI (Interactive)
```bash
npm run test:ui
```

## Test Coverage

### Frontend Tests (`frontend.test.jsx`)
- ✅ Renders "Hello World!" text
- ✅ Renders h1 element correctly
- ✅ Applies correct styling
- ✅ Renders component structure correctly
- ✅ Verifies component is a function

### Backend Tests (`backend.test.js`)
- ✅ Renders App component to string (SSR)
- ✅ Includes "Hello World!" in SSR output
- ✅ Includes div and h1 elements in SSR output
- ✅ Renders complete component structure
- ✅ Exports createServer function
- ✅ Handles NODE_ENV correctly

## Test Results

All tests should pass:
```
✓ tests/backend.test.js (6 tests)
✓ tests/frontend.test.jsx (5 tests)

Test Files  2 passed (2)
Tests  11 passed (11)
```

## Technologies Used

- **Vitest**: Fast test runner (Vite-powered)
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: DOM matchers for Jest/Vitest
- **jsdom**: DOM environment for testing

## Writing New Tests

### Frontend Test Example
```javascript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import YourComponent from '../src/YourComponent.jsx'

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Backend Test Example
```javascript
import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import YourComponent from '../src/YourComponent.jsx'

describe('SSR Rendering', () => {
  it('should render component to string', () => {
    const html = renderToString(React.createElement(YourComponent))
    expect(html).toContain('Expected Content')
  })
})
```

## Troubleshooting

### Tests fail with "module is not defined"
- Ensure `package.json` has `"type": "module"`
- Check that all imports use ES module syntax

### Frontend tests fail
- Verify `vitest.config.js` has `environment: 'jsdom'`
- Check that `@testing-library/jest-dom` is imported in setup.js

### Backend tests fail
- Ensure NODE_ENV is set correctly
- Check that server.js exports createServer function




