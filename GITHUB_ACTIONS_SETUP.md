# GitHub Actions CI Setup Guide

## Overview

A comprehensive CI/CD workflow has been created for your project using GitHub Actions. This workflow automatically tests your code on every push and pull request.

---

## Workflow File

**Location:** `.github/workflows/ci.yml`

---

## What the Workflow Does

### 1. **Test Job** (Matrix Testing)
- Tests on **Node.js 18.x** and **20.x**
- Runs on **Ubuntu Latest**
- Steps:
  1. ✅ Checkout code
  2. ✅ Setup Node.js with npm cache
  3. ✅ Install dependencies (`npm ci`)
  4. ✅ Build application (`npm run build`)
  5. ✅ Run frontend tests (`npm run test:frontend`)
  6. ✅ Run backend tests (`npm run test:backend`)
  7. ✅ Upload test results as artifacts

### 2. **E2E Tests Job**
- Runs after test job completes
- Steps:
  1. ✅ Checkout code
  2. ✅ Setup Node.js 20.x
  3. ✅ Install dependencies
  4. ✅ Install Playwright browsers
  5. ✅ Build application
  6. ✅ Start Next.js server
  7. ✅ Run E2E tests (`npm run test:e2e`)
  8. ✅ Upload Playwright reports and test results

### 3. **Summary Job**
- Provides CI summary
- Runs after all jobs complete
- Shows results in GitHub Actions UI

---

## Triggers

The workflow runs automatically on:
- ✅ **Push** to `main` or `develop` branches
- ✅ **Pull Requests** to `main` or `develop` branches
- ✅ **Manual trigger** (workflow_dispatch)

---

## Environment Variables

### Required Secrets (GitHub Repository Settings)

Set these in: **Settings → Secrets and variables → Actions → New repository secret**

1. **JWT_SECRET**
   - Secret key for JWT token signing
   - Example: `your-super-secret-jwt-key-here`

2. **ENCRYPTION_KEY**
   - Master encryption key (64-character hex string)
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`

3. **API_KEY_SECRET**
   - Secret for API key hashing
   - Example: `your-api-key-secret-here`

### How to Set Secrets

1. Go to your GitHub repository
2. Click **Settings**
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret:
   - Name: `JWT_SECRET`
   - Value: `your-secret-value`
6. Repeat for `ENCRYPTION_KEY` and `API_KEY_SECRET`

### Fallback Values

If secrets are not set, the workflow uses test values:
- `JWT_SECRET`: `test-jwt-secret-for-ci`
- `ENCRYPTION_KEY`: `test-encryption-key-for-ci-64-characters-long-hex-string-...`
- `API_KEY_SECRET`: `test-api-key-secret-for-ci`

**Note:** These are for CI testing only. Use real secrets for production.

---

## Workflow Features

### ✅ Matrix Testing
- Tests on multiple Node.js versions (18.x, 20.x)
- Ensures compatibility across versions

### ✅ Parallel Execution
- Test jobs run in parallel
- Faster CI execution

### ✅ Artifact Upload
- Test results saved as artifacts
- Playwright reports uploaded
- Coverage reports (if generated)
- Available for 7 days

### ✅ Error Handling
- Tests continue even if some fail
- All results are captured
- Summary shows overall status

### ✅ Caching
- npm dependencies cached
- Faster subsequent runs

---

## Viewing Results

### In GitHub

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select a workflow run
4. View job logs and results
5. Download artifacts if needed

### Artifacts

After each run, you can download:
- `test-results-node-18.x` - Test results for Node 18
- `test-results-node-20.x` - Test results for Node 20
- `playwright-report` - E2E test HTML report
- `e2e-test-results` - E2E test results

---

## Comparison: GitHub Actions vs Jenkins

| Feature | GitHub Actions | Jenkins |
|---------|---------------|---------|
| **Hosting** | GitHub-hosted | Self-hosted |
| **Setup** | Automatic | Manual |
| **Cost** | Free for public repos | Self-hosted (free) |
| **Integration** | Native GitHub | Manual |
| **Configuration** | YAML | Groovy DSL |
| **Email Notifications** | Built-in | Plugin required |

---

## Workflow Status Badge

Add a status badge to your README:

```markdown
![CI](https://github.com/sylaw2022/react.js/workflows/CI/badge.svg)
```

Or:

```markdown
[![CI](https://github.com/sylaw2022/react.js/actions/workflows/ci.yml/badge.svg)](https://github.com/sylaw2022/react.js/actions/workflows/ci.yml)
```

---

## Troubleshooting

### Workflow Not Running

1. **Check file location:**
   - Must be in `.github/workflows/ci.yml`
   - File must be committed to repository

2. **Check triggers:**
   - Verify branch names match (`main`, `develop`)
   - Check if workflow is enabled

3. **Check permissions:**
   - Ensure GitHub Actions is enabled in repository settings

### Tests Failing

1. **Check environment variables:**
   - Verify secrets are set correctly
   - Check if fallback values are sufficient

2. **Check logs:**
   - View detailed logs in GitHub Actions
   - Look for specific error messages

3. **Local testing:**
   - Run tests locally: `npm run test:ci`
   - Verify tests pass before pushing

### E2E Tests Failing

1. **Server startup:**
   - Check if Next.js server starts correctly
   - Verify port 3000 is available

2. **Playwright:**
   - Ensure browsers are installed
   - Check Playwright configuration

3. **Timeouts:**
   - Increase wait time if server takes longer to start
   - Check network connectivity

---

## Customization

### Add More Node Versions

```yaml
matrix:
  node-version: [18.x, 20.x, 22.x]
```

### Add More Operating Systems

```yaml
matrix:
  os: [ubuntu-latest, windows-latest, macos-latest]
  node-version: [18.x, 20.x]
```

### Add Linting

```yaml
- name: Run linter
  run: npm run lint
```

### Add Coverage Reports

```yaml
- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

---

## Next Steps

1. ✅ **Workflow file created** (`.github/workflows/ci.yml`)
2. 📝 **Set GitHub Secrets:**
   - Go to repository Settings → Secrets
   - Add `JWT_SECRET`, `ENCRYPTION_KEY`, `API_KEY_SECRET`
3. 🚀 **Push to GitHub:**
   ```bash
   git add .github/workflows/ci.yml
   git commit -m "Add GitHub Actions CI workflow"
   git push github main
   ```
4. ✅ **Verify workflow runs:**
   - Go to Actions tab on GitHub
   - Check workflow execution

---

## Summary

✅ **GitHub Actions CI workflow created**  
✅ **Matrix testing on Node.js 18.x and 20.x**  
✅ **Frontend, backend, and E2E tests**  
✅ **Artifact upload for test results**  
✅ **Error handling and summary**  

Your project now has both **Jenkins** and **GitHub Actions** CI/CD configured! 🎉

