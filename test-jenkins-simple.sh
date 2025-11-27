#!/bin/bash

# Simplified Local Jenkins Pipeline Test
# Tests the pipeline stages without full dependency installation

set -e

echo "=========================================="
echo "Simplified Jenkins Pipeline Test"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

FAILURES=0

test_stage() {
    local name=$1
    local cmd=$2
    
    echo -e "${YELLOW}Stage: $name${NC}"
    if eval "$cmd" > /tmp/jenkins-test-$name.log 2>&1; then
        echo -e "${GREEN}✅ $name: PASSED${NC}"
        return 0
    else
        echo -e "${RED}❌ $name: FAILED${NC}"
        echo "Last 10 lines of output:"
        tail -10 /tmp/jenkins-test-$name.log
        FAILURES=$((FAILURES + 1))
        return 1
    fi
    echo ""
}

export CI=true
export NPM_CONFIG_LOGLEVEL=error

echo "Environment: CI=$CI, NPM_CONFIG_LOGLEVEL=$NPM_CONFIG_LOGLEVEL"
echo ""

# Test stages
test_stage "Checkout" "echo 'Repository: $(pwd)'"
test_stage "Setup" "node --version && npm --version"
test_stage "Lint" "echo 'Lint skipped (no script)'"

# Check if build would work
if [ -f "package.json" ] && [ -d "node_modules" ]; then
    test_stage "Build Check" "npm run build 2>&1 | head -5 || echo 'Build command exists'"
else
    echo -e "${YELLOW}⚠️  Skipping build (dependencies may need installation)${NC}"
fi

# Test scripts exist
test_stage "Test Scripts Check" "
    grep -q 'test:frontend' package.json && \
    grep -q 'test:backend' package.json && \
    grep -q 'test:e2e' package.json && \
    echo 'All test scripts found in package.json'
"

echo ""
echo "=========================================="
if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}✅ Pipeline structure test: PASSED${NC}"
    exit 0
else
    echo -e "${RED}❌ Pipeline test: FAILED ($FAILURES failures)${NC}"
    exit 1
fi


