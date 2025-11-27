#!/bin/bash
echo "========================================="
echo "Running Frontend Tests"
echo "========================================="
echo ""

cd "$(dirname "$0")"

echo "Checking dependencies..."
npm list vitest @testing-library/react 2>&1 | head -3

echo ""
echo "Running tests..."
npm run test:frontend 2>&1

EXIT_CODE=$?
echo ""
echo "========================================="
echo "Test completed with exit code: $EXIT_CODE"
echo "========================================="

exit $EXIT_CODE



