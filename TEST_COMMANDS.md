# Test Commands - Capture Clean Output

## Commands to Run Tests and Capture Output Without Special Characters

### Option 1: Simple Redirect (Removes Colors)
```bash
npm run test:frontend 2>&1 | sed 's/\x1b\[[0-9;]*m//g' > test-output.log
cat test-output.log
```

### Option 2: See Output AND Save to File
```bash
npm run test:frontend 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee test-output.log
```

### Option 3: Remove All ANSI Escape Sequences
```bash
npm run test:frontend 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g' > test-output.log
```

### Option 4: Using `script` Command (Most Reliable)
```bash
script -q -c "npm run test:frontend" test-output.log
cat test-output.log
```

### Option 5: Using `col -b` (Removes Backspaces and Special Chars)
```bash
npm run test:frontend 2>&1 | col -b > test-output.log
cat test-output.log
```

### Option 6: Disable Colors in Vitest
```bash
NO_COLOR=1 npm run test:frontend > test-output.log 2>&1
cat test-output.log
```

### Option 7: Comprehensive (Best for Jenkins/CI)
```bash
npm run test:frontend 2>&1 | \
  sed 's/\x1b\[[0-9;]*m//g' | \
  sed 's/\x1b\[[0-9;]*[a-zA-Z]//g' | \
  sed 's/\r//g' | \
  tee test-output.log
```

### Option 8: Using the Script File
```bash
chmod +x run-tests-with-log.sh
./run-tests-with-log.sh
```

---

## Recommended Commands

### For Local Testing (See Output + Save):
```bash
npm run test:frontend 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee test-output.log
```

### For CI/Jenkins (Save Only):
```bash
NO_COLOR=1 npm run test:frontend > test-output.log 2>&1
```

### For Both Frontend and Backend:
```bash
npm test 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee test-output.log
```

---

## What Each Command Does

| Command | Purpose |
|---------|---------|
| `2>&1` | Redirects stderr to stdout |
| `sed 's/\x1b\[[0-9;]*m//g'` | Removes ANSI color codes |
| `tee` | Shows output AND saves to file |
| `>` | Redirects output to file only |
| `NO_COLOR=1` | Disables colors in the application |
| `col -b` | Removes backspaces and control characters |

---

## Example Usage

### Quick Test with Clean Output:
```bash
npm run test:frontend 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee test-output.log
```

### View the Log:
```bash
cat test-output.log
```

### Search for Errors:
```bash
grep -i "error\|fail" test-output.log
```

### Count Test Results:
```bash
grep -E "passed|failed" test-output.log
```

---

## For All Test Types

### Frontend Only:
```bash
npm run test:frontend 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee frontend-test.log
```

### Backend Only:
```bash
npm run test:backend 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee backend-test.log
```

### All Tests:
```bash
npm test 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee all-tests.log
```

### E2E Tests:
```bash
npm run test:e2e 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee e2e-test.log
```

---

## Clean Output Examples

### Before (with colors):
```
✓ tests/frontend.test.jsx (13)
  ✓ Frontend Tests (13)
    ✓ Home Page (4)
```

### After (clean):
```
tests/frontend.test.jsx (13)
  Frontend Tests (13)
    Home Page (4)
```

---

## Best Practice Command

**Recommended for most use cases:**
```bash
npm run test:frontend 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee test-output.log
```

This command:
- ✅ Runs the tests
- ✅ Shows output in terminal
- ✅ Saves to file
- ✅ Removes color codes
- ✅ Easy to read



