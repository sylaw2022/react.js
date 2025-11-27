# How to Update GitHub Secrets

## Quick Steps to Update a Secret

### Method 1: Update Existing Secret

1. Go to your repository: https://github.com/sylaw2022/react.js
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions**
4. Find the secret you want to update (e.g., `SMTP_USERNAME`)
5. Click the **pencil icon** (✏️) next to the secret name
6. Update the value
7. Click **Update secret**

### Method 2: Delete and Recreate

If you can't update directly:

1. Go to: https://github.com/sylaw2022/react.js/settings/secrets/actions
2. Click the **trash icon** (🗑️) next to the secret to delete it
3. Click **New repository secret**
4. Enter the name and new value
5. Click **Add secret**

---

## Why You Might Not Be Able to Update Secrets

### 1. **Insufficient Permissions**

**Problem:** You don't have write/admin access to the repository.

**Check your permissions:**
1. Go to: https://github.com/sylaw2022/react.js
2. Click **Settings** → **Collaborators** (or **Access**)
3. Check your role:
   - ✅ **Admin** or **Write** access: Can update secrets
   - ❌ **Read** access: Cannot update secrets

**Solution:**
- Ask repository owner to grant you **Admin** or **Write** access
- Or ask them to update the secrets for you

---

### 2. **Organization Secrets (Not Repository Secrets)**

**Problem:** Secrets are set at Organization level, not Repository level.

**Check:**
1. Go to: https://github.com/sylaw2022/react.js/settings/secrets/actions
2. Look at the tabs:
   - **Repository secrets** - You can manage these
   - **Organization secrets** - Only org admins can manage

**Solution:**
- If secrets are at Organization level, ask an organization admin to update them
- Or create new secrets at Repository level

---

### 3. **Browser/Cache Issues**

**Problem:** Browser cache or session issues preventing updates.

**Solution:**
- Clear browser cache
- Try incognito/private browsing mode
- Log out and log back in
- Try a different browser

---

### 4. **GitHub UI Not Loading**

**Problem:** Settings page or secrets page not loading properly.

**Solution:**
- Refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check internet connection
- Try accessing from different network
- Check if GitHub is experiencing issues: https://www.githubstatus.com

---

### 5. **Two-Factor Authentication Required**

**Problem:** GitHub requires 2FA verification for sensitive operations.

**Solution:**
- Make sure 2FA is enabled on your account
- Complete 2FA verification when prompted
- Use an authenticator app or SMS code

---

### 6. **Repository Settings Locked**

**Problem:** Repository settings are locked or restricted.

**Check:**
1. Go to: https://github.com/sylaw2022/react.js/settings
2. Look for any warnings or restrictions
3. Check if repository is archived or locked

**Solution:**
- Contact repository owner
- Check if repository has any restrictions enabled

---

## Step-by-Step: Updating SMTP Secrets

### Update SMTP_USERNAME

1. **Navigate to Secrets:**
   ```
   Repository → Settings → Secrets and variables → Actions
   ```

2. **Find SMTP_USERNAME:**
   - Look for `SMTP_USERNAME` in the list
   - If you see it, click the **pencil icon** (✏️)

3. **Update Value:**
   - Change to: `groklord2@gmail.com` (or your email)
   - Click **Update secret**

4. **If Secret Doesn't Exist:**
   - Click **New repository secret**
   - Name: `SMTP_USERNAME`
   - Value: `groklord2@gmail.com`
   - Click **Add secret**

### Update SMTP_PASSWORD

1. **Navigate to Secrets:**
   ```
   Repository → Settings → Secrets and variables → Actions
   ```

2. **Find SMTP_PASSWORD:**
   - Look for `SMTP_PASSWORD` in the list
   - Click the **pencil icon** (✏️)

3. **Update Value:**
   - Change to: Your 16-character Gmail App Password (no spaces)
   - Example: `abcdefghijklmnop`
   - Click **Update secret**

4. **If Secret Doesn't Exist:**
   - Click **New repository secret**
   - Name: `SMTP_PASSWORD`
   - Value: Your App Password
   - Click **Add secret**

---

## Alternative: Using GitHub CLI

If the web UI doesn't work, you can use GitHub CLI:

### Install GitHub CLI

```bash
# On Linux
sudo apt-get install gh

# On macOS
brew install gh

# On Windows
winget install GitHub.cli
```

### Authenticate

```bash
gh auth login
```

### Update Secret

```bash
# Update SMTP_USERNAME
echo "groklord2@gmail.com" | gh secret set SMTP_USERNAME --repo sylaw2022/react.js

# Update SMTP_PASSWORD
echo "your-app-password" | gh secret set SMTP_PASSWORD --repo sylaw2022/react.js
```

### View Secrets (Names Only)

```bash
# List all secrets (names only, not values)
gh secret list --repo sylaw2022/react.js
```

**Note:** You cannot view secret values, only their names.

---

## Verification Steps

After updating secrets:

1. **Verify Secret Exists:**
   - Go to: https://github.com/sylaw2022/react.js/settings/secrets/actions
   - Confirm `SMTP_USERNAME` and `SMTP_PASSWORD` are listed

2. **Check Secret Names:**
   - Must be exactly: `SMTP_USERNAME` and `SMTP_PASSWORD`
   - Case-sensitive (all uppercase)

3. **Test in Workflow:**
   - Push a commit or manually trigger workflow
   - Check "Debug SMTP Configuration" step
   - Should show: `***SET***` instead of `***NOT SET***`

---

## Common Issues and Solutions

### Issue: "Update secret" button is grayed out

**Cause:** Insufficient permissions

**Solution:**
- Request Admin or Write access from repository owner
- Or ask them to update the secret

---

### Issue: Can't find the secret

**Cause:** Secret might be at Organization level or doesn't exist

**Solution:**
- Check Organization secrets tab
- Create new secret at Repository level if it doesn't exist

---

### Issue: Secret value is masked (shows dots)

**Cause:** This is normal - GitHub never shows secret values for security

**Solution:**
- This is expected behavior
- You can only update the value, not view it
- To verify it's set, check the workflow debug output

---

### Issue: Changes not taking effect

**Cause:** Workflow might be using cached values or secrets not refreshed

**Solution:**
- Wait a few minutes for GitHub to sync
- Trigger a new workflow run
- Check workflow logs to see if new values are used

---

## Quick Checklist

- [ ] I have **Admin** or **Write** access to the repository
- [ ] I'm looking at **Repository secrets** (not Organization secrets)
- [ ] Secret names are **exactly** `SMTP_USERNAME` and `SMTP_PASSWORD` (case-sensitive)
- [ ] I can see the **pencil icon** (✏️) next to the secret
- [ ] I've cleared browser cache if UI is not loading
- [ ] I've completed 2FA verification if prompted
- [ ] I've tried a different browser if issues persist

---

## Still Can't Update?

1. **Check Repository Access:**
   - Verify you have Admin/Write permissions
   - Contact repository owner if needed

2. **Try GitHub CLI:**
   - Use `gh secret set` command as alternative

3. **Contact Support:**
   - If all else fails, contact GitHub Support
   - Or ask repository owner to update secrets

4. **Verify Secret Location:**
   - Make sure you're in the correct repository
   - Check if secrets are at Organization level

---

## Summary

**To update secrets:**
1. Go to: Repository → Settings → Secrets and variables → Actions
2. Click pencil icon (✏️) next to secret name
3. Update value
4. Click "Update secret"

**If you can't update:**
- Check your repository permissions (need Admin/Write)
- Verify secrets are at Repository level (not Organization)
- Try GitHub CLI as alternative
- Clear browser cache and try again

