# GitHub Secrets Not Showing as Set - Troubleshooting

## Problem

Secrets are configured in GitHub but showing as "NOT SET" during workflow execution.

---

## Common Causes

### 1. **Secret Name Case Sensitivity**

GitHub secrets are **case-sensitive**. Check the exact names:

**Correct:**
- `SMTP_USERNAME`
- `SMTP_PASSWORD`

**Incorrect:**
- `smtp_username` (lowercase)
- `Smtp_Username` (mixed case)
- `smtp-username` (hyphen instead of underscore)

### 2. **Secret Location**

Secrets can be set at different levels:
- **Repository secrets** (recommended): Settings → Secrets and variables → Actions → Repository secrets
- **Organization secrets**: Only accessible if workflow has permission
- **Environment secrets**: Only accessible if workflow uses that environment

**Check:** Make sure secrets are set at the **Repository** level, not just Organization level.

### 3. **Workflow Permissions**

The workflow needs permission to read secrets. Check workflow file:

```yaml
permissions:
  contents: read
  # Secrets are automatically readable if workflow has repository access
```

### 4. **Forked Repository**

If the workflow is running on a **forked repository**, secrets are **NOT** available for security reasons.

**Solution:** Run workflow on the original repository, not a fork.

### 5. **Pull Request from Fork**

Pull requests from forks cannot access repository secrets.

**Solution:** Use `pull_request_target` event or run workflow on the main repository.

---

## How to Verify Secrets Are Set

### Step 1: Check Secret Names

1. Go to: https://github.com/sylaw2022/react.js/settings/secrets/actions
2. Verify secret names are **exactly**:
   - `SMTP_USERNAME`
   - `SMTP_PASSWORD`
   - `SMTP_SERVER` (optional)
   - `SMTP_PORT` (optional)

### Step 2: Check Secret Values

- Click on each secret to view/edit
- Verify values are not empty
- For `SMTP_USERNAME`: Should be full email (e.g., `groklord2@gmail.com`)
- For `SMTP_PASSWORD`: Should be 16-character App Password (no spaces)

### Step 3: Check Workflow File

Verify the workflow uses the correct secret names:

```yaml
username: ${{ secrets.SMTP_USERNAME }}
password: ${{ secrets.SMTP_PASSWORD }}
```

### Step 4: Check Workflow Permissions

Verify the workflow has access:

```yaml
permissions:
  contents: read
```

---

## Debug Steps

### 1. Check Workflow Logs

1. Go to: https://github.com/sylaw2022/react.js/actions
2. Click on the latest workflow run
3. Expand "Debug SMTP Configuration" step
4. Check the output

### 2. Verify Secret Access

The debug step will show:
- `SMTP_USERNAME: ***SET***` if secret exists and has a value
- `SMTP_USERNAME: ***NOT SET***` if secret is missing or empty

### 3. Check for Masking

GitHub automatically masks secret values in logs. If you see `***` in the logs, the secret **is** being read, but GitHub is hiding it for security.

**Important:** If you see the actual secret value (not masked), that means the secret is being read correctly.

---

## Common Mistakes

### ❌ Wrong: Secret Name Typo
```
Secrets set: SMTP_USERNAME, SMTP_PASSWORD
Workflow uses: smtp_username, smtp_password
```

### ✅ Correct: Exact Match
```
Secrets set: SMTP_USERNAME, SMTP_PASSWORD
Workflow uses: SMTP_USERNAME, SMTP_PASSWORD
```

---

### ❌ Wrong: Secret Set at Wrong Level
```
Secret set: Organization level
Workflow: Repository level (no access)
```

### ✅ Correct: Repository Level
```
Secret set: Repository level
Workflow: Repository level (has access)
```

---

### ❌ Wrong: Empty Secret Value
```
SMTP_USERNAME: (empty string)
SMTP_PASSWORD: (empty string)
```

### ✅ Correct: Valid Values
```
SMTP_USERNAME: groklord2@gmail.com
SMTP_PASSWORD: abcdefghijklmnop
```

---

## Testing Secret Access

### Option 1: Use Debug Step

The workflow now includes debug steps that will show:
- Whether secrets are set
- Masked values (GitHub will mask them)
- Server and port configuration

### Option 2: Test with Simple Echo

Add a test step:

```yaml
- name: Test Secret Access
  run: |
    if [ -z "${{ secrets.SMTP_USERNAME }}" ]; then
      echo "ERROR: SMTP_USERNAME is not set!"
      exit 1
    else
      echo "SUCCESS: SMTP_USERNAME is set (masked)"
    fi
```

### Option 3: Check Secret in Workflow

You can also check in the workflow file itself:

```yaml
- name: Check Secrets
  run: |
    echo "Checking secrets..."
    echo "SMTP_USERNAME exists: ${{ secrets.SMTP_USERNAME != '' }}"
    echo "SMTP_PASSWORD exists: ${{ secrets.SMTP_PASSWORD != '' }}"
```

---

## Solutions

### Solution 1: Recreate Secrets

1. Go to: https://github.com/sylaw2022/react.js/settings/secrets/actions
2. Delete existing secrets
3. Create new secrets with **exact** names:
   - `SMTP_USERNAME`
   - `SMTP_PASSWORD`
4. Set values carefully (no extra spaces)

### Solution 2: Check Workflow Triggers

Make sure the workflow is triggered correctly:
- Push to `main` or `develop` branch
- Pull request to `main` or `develop`
- Manual workflow dispatch

### Solution 3: Verify Repository Access

1. Go to: https://github.com/sylaw2022/react.js/settings/actions
2. Check "Workflow permissions"
3. Ensure "Read and write permissions" or "Read repository contents permission" is enabled

---

## Quick Checklist

- [ ] Secrets are set at **Repository** level (not Organization only)
- [ ] Secret names are **exactly** `SMTP_USERNAME` and `SMTP_PASSWORD` (case-sensitive)
- [ ] Secret values are **not empty**
- [ ] Workflow is running on the **main repository** (not a fork)
- [ ] Workflow has **permissions** to read secrets
- [ ] Workflow file uses **correct secret names** (`secrets.SMTP_USERNAME`)
- [ ] Secrets are set in the **correct repository** (`sylaw2022/react.js`)

---

## Still Not Working?

1. **Double-check secret names** - They must match exactly
2. **Recreate secrets** - Delete and recreate with correct names
3. **Check workflow logs** - Look for specific error messages
4. **Verify repository** - Make sure you're checking the right repository
5. **Test with a simple secret** - Create a test secret to verify access works

---

## Summary

If secrets show as "NOT SET" even though they're configured:

1. ✅ Check secret names are **case-sensitive** and match exactly
2. ✅ Verify secrets are at **Repository** level
3. ✅ Ensure secrets have **non-empty values**
4. ✅ Check workflow is running on **main repository** (not fork)
5. ✅ Verify workflow has **permissions** to read secrets

The debug steps in the workflow will help identify which of these is the issue.

