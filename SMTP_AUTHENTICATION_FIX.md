# SMTP Authentication Error Fix

## Error Message

```
Error: Mail command failed: 530-5.7.0 Authentication Required
```

This error indicates that the SMTP server (Gmail) is rejecting the authentication attempt.

---

## Common Causes

### 1. **Missing or Incorrect Secrets**
- `SMTP_USERNAME` or `SMTP_PASSWORD` not set in GitHub Secrets
- Secrets are set but contain incorrect values

### 2. **Using Regular Gmail Password**
- Gmail requires **App Passwords** for SMTP authentication
- Regular passwords won't work with 2FA enabled

### 3. **Incorrect SMTP Settings**
- Wrong SMTP server address
- Wrong port number
- Missing TLS/SSL configuration

### 4. **2FA Not Enabled**
- Gmail requires 2FA to generate App Passwords
- App Passwords only work with 2FA enabled

---

## Solution: Gmail App Password Setup

### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click **2-Step Verification**
3. Follow the setup process
4. **Important:** You must complete 2FA setup before generating App Passwords

### Step 2: Generate App Password

1. Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
   - Direct link: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App passwords

2. Select app: **Mail**
3. Select device: **Other (Custom name)**
   - Enter: "GitHub Actions" or "CI/CD"
4. Click **Generate**

5. **Copy the 16-character password**
   - Format: `xxxx xxxx xxxx xxxx` (with spaces)
   - You can remove spaces when using it
   - Example: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

### Step 3: Set GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add/Update secrets:

   **SMTP_USERNAME:**
   - Value: Your full Gmail address
   - Example: `groklord2@gmail.com`

   **SMTP_PASSWORD:**
   - Value: The 16-character App Password (without spaces)
   - Example: `abcdefghijklmnop`
   - **NOT your regular Gmail password!**

   **SMTP_SERVER:** (Optional, default is `smtp.gmail.com`)
   - Value: `smtp.gmail.com`

   **SMTP_PORT:** (Optional, default is `587`)
   - Value: `587`

### Step 4: Verify Secrets

Make sure secrets are:
- ✅ Correctly named (case-sensitive)
- ✅ No extra spaces
- ✅ App Password (not regular password)
- ✅ Full email address for username

---

## Alternative: Using Different Email Provider

If Gmail continues to have issues, you can use other providers:

### Outlook/Hotmail

```yaml
SMTP_SERVER: smtp-mail.outlook.com
SMTP_PORT: 587
SMTP_USERNAME: your-email@outlook.com
SMTP_PASSWORD: your-password
```

### Yahoo Mail

```yaml
SMTP_SERVER: smtp.mail.yahoo.com
SMTP_PORT: 587
SMTP_USERNAME: your-email@yahoo.com
SMTP_PASSWORD: your-app-password
```

### SendGrid (Recommended for Production)

1. Sign up at [SendGrid](https://sendgrid.com)
2. Create API Key
3. Use SMTP settings:

```yaml
SMTP_SERVER: smtp.sendgrid.net
SMTP_PORT: 587
SMTP_USERNAME: apikey
SMTP_PASSWORD: your-sendgrid-api-key
```

---

## Workflow Updates

The workflow has been updated to:
- ✅ Only send emails if secrets are configured
- ✅ Use `secure: true` for TLS encryption
- ✅ Better error handling

### Updated Configuration

```yaml
- name: Send email notification
  if: always() && secrets.SMTP_USERNAME && secrets.SMTP_PASSWORD
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: ${{ secrets.SMTP_SERVER || 'smtp.gmail.com' }}
    server_port: ${{ secrets.SMTP_PORT || 587 }}
    secure: true  # Enable TLS
    username: ${{ secrets.SMTP_USERNAME }}
    password: ${{ secrets.SMTP_PASSWORD }}
```

---

## Troubleshooting Steps

### 1. Verify Secrets Are Set

Check in GitHub:
- Repository → Settings → Secrets and variables → Actions
- Verify `SMTP_USERNAME` and `SMTP_PASSWORD` exist

### 2. Check Secret Values

- **SMTP_USERNAME:** Must be full email (e.g., `groklord2@gmail.com`)
- **SMTP_PASSWORD:** Must be 16-character App Password (not regular password)

### 3. Test SMTP Connection

You can test locally:

```bash
# Install mailutils or similar
sudo apt-get install mailutils

# Test SMTP connection
echo "Test email" | mail -s "Test" -a "From: groklord2@gmail.com" groklord2@gmail.com
```

### 4. Check Gmail Settings

- ✅ 2FA is enabled
- ✅ App Password is generated
- ✅ "Less secure app access" is not needed (App Passwords replace this)

### 5. Review Workflow Logs

1. Go to GitHub Actions tab
2. Click on failed workflow run
3. Expand "Send email notification" step
4. Check error details

---

## Common Mistakes

### ❌ Wrong: Using Regular Password
```
SMTP_PASSWORD: myregularpassword123
```

### ✅ Correct: Using App Password
```
SMTP_PASSWORD: abcd efgh ijkl mnop
```

### ❌ Wrong: Incomplete Email
```
SMTP_USERNAME: groklord2
```

### ✅ Correct: Full Email
```
SMTP_USERNAME: groklord2@gmail.com
```

### ❌ Wrong: App Password with Spaces
```
SMTP_PASSWORD: abcd efgh ijkl mnop
```

### ✅ Correct: App Password without Spaces
```
SMTP_PASSWORD: abcdefghijklmnop
```

---

## Quick Fix Checklist

- [ ] 2FA is enabled on Gmail account
- [ ] App Password is generated (16 characters)
- [ ] `SMTP_USERNAME` secret is set to full email address
- [ ] `SMTP_PASSWORD` secret is set to App Password (no spaces)
- [ ] Secrets are correctly named (case-sensitive)
- [ ] Workflow file uses `secure: true`
- [ ] Workflow checks for secrets before sending

---

## After Fixing

1. **Update secrets in GitHub**
2. **Push updated workflow** (if changes were made)
3. **Trigger workflow** (push code or manual trigger)
4. **Check email** at groklord2@gmail.com
5. **Review workflow logs** if still failing

---

## Summary

The error "530-5.7.0 Authentication Required" means:
- ❌ SMTP authentication failed
- ✅ Solution: Use Gmail App Password (not regular password)
- ✅ Ensure 2FA is enabled
- ✅ Use full email address as username
- ✅ Set secrets correctly in GitHub

Once you set up the App Password and configure the secrets correctly, the email notifications should work! 🎉

