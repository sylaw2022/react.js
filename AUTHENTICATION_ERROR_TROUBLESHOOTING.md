# Authentication Error Troubleshooting

## Error Message

```
Error: Mail command failed: 530-5.7.0 Authentication Required
```

This error means the SMTP server (Gmail) is rejecting your authentication credentials.

---

## Quick Checklist

- [ ] **2FA is enabled** on your Gmail account
- [ ] **App Password is generated** (16 characters, no spaces)
- [ ] **SMTP_USERNAME** secret is set to full email: `groklord2@gmail.com`
- [ ] **SMTP_PASSWORD** secret is set to App Password (NOT your regular password)
- [ ] Secrets are correctly named (case-sensitive: `SMTP_USERNAME`, `SMTP_PASSWORD`)
- [ ] No extra spaces in secret values

---

## Step-by-Step Fix

### 1. Enable 2-Factor Authentication (Required)

Gmail requires 2FA to generate App Passwords:

1. Go to: https://myaccount.google.com/security
2. Click **2-Step Verification**
3. Follow the setup process
4. **Complete this step first** - you cannot generate App Passwords without 2FA

### 2. Generate Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
   - Enter: "GitHub Actions"
4. Click **Generate**
5. **Copy the 16-character password**
   - Format: `xxxx xxxx xxxx xxxx`
   - Remove spaces when using: `xxxxxxxxxxxxxxxx`

### 3. Set GitHub Secrets

1. Go to your repository: https://github.com/sylaw2022/react.js
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

   **Secret 1: SMTP_USERNAME**
   - Name: `SMTP_USERNAME`
   - Value: `groklord2@gmail.com` (your full email)

   **Secret 2: SMTP_PASSWORD**
   - Name: `SMTP_PASSWORD`
   - Value: `xxxxxxxxxxxxxxxx` (16-character App Password, no spaces)

   **Optional Secret 3: SMTP_SERVER**
   - Name: `SMTP_SERVER`
   - Value: `smtp.gmail.com` (default, can skip)

   **Optional Secret 4: SMTP_PORT**
   - Name: `SMTP_PORT`
   - Value: `587` (default, can skip)

4. Click **Add secret** for each one

### 4. Verify Secrets

Double-check:
- ✅ `SMTP_USERNAME` = full email address (not just username)
- ✅ `SMTP_PASSWORD` = 16-character App Password (not regular password)
- ✅ No spaces in App Password
- ✅ Case-sensitive names: `SMTP_USERNAME` (all caps)

---

## Common Mistakes

### ❌ Wrong: Using Regular Password
```
SMTP_PASSWORD: mypassword123
```
**Why it fails:** Gmail requires App Passwords for SMTP when 2FA is enabled.

### ✅ Correct: Using App Password
```
SMTP_PASSWORD: abcdefghijklmnop
```
**Why it works:** App Passwords are specifically for third-party apps.

---

### ❌ Wrong: Incomplete Email
```
SMTP_USERNAME: groklord2
```
**Why it fails:** Gmail needs the full email address.

### ✅ Correct: Full Email
```
SMTP_USERNAME: groklord2@gmail.com
```
**Why it works:** Full email is required for SMTP authentication.

---

### ❌ Wrong: App Password with Spaces
```
SMTP_PASSWORD: abcd efgh ijkl mnop
```
**Why it fails:** Spaces can cause parsing issues.

### ✅ Correct: App Password without Spaces
```
SMTP_PASSWORD: abcdefghijklmnop
```
**Why it works:** No spaces ensures clean authentication.

---

## Testing Your Configuration

### Option 1: Check Workflow Logs

1. Go to: https://github.com/sylaw2022/react.js/actions
2. Click on the latest workflow run
3. Expand "Send test job notification" step
4. Check for error messages

### Option 2: Manual Workflow Trigger

1. Go to: https://github.com/sylaw2022/react.js/actions
2. Click **CI** workflow
3. Click **Run workflow** → **Run workflow**
4. Check if email is sent

### Option 3: Test Locally (Advanced)

```bash
# Install mailutils
sudo apt-get install mailutils

# Test SMTP (replace with your App Password)
echo "Test email" | mail -s "Test" \
  -S smtp="smtp.gmail.com:587" \
  -S smtp-auth-user="groklord2@gmail.com" \
  -S smtp-auth-password="your-app-password" \
  -S smtp-use-starttls \
  groklord2@gmail.com
```

---

## Workflow Configuration

The workflow has been updated to:
- ✅ Skip email if secrets are not set (prevents errors)
- ✅ Use `secure: false` for port 587 (STARTTLS is automatic)
- ✅ Better error handling

Current configuration:
```yaml
- name: Send email notification
  if: always() && secrets.SMTP_USERNAME != '' && secrets.SMTP_PASSWORD != ''
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: ${{ secrets.SMTP_SERVER || 'smtp.gmail.com' }}
    server_port: ${{ secrets.SMTP_PORT || 587 }}
    secure: false
    username: ${{ secrets.SMTP_USERNAME }}
    password: ${{ secrets.SMTP_PASSWORD }}
```

---

## Still Having Issues?

### Check Gmail Settings

1. **2FA Status:**
   - Go to: https://myaccount.google.com/security
   - Verify "2-Step Verification" is ON

2. **App Passwords:**
   - Go to: https://myaccount.google.com/apppasswords
   - Verify you have an App Password for "Mail"
   - If not, generate a new one

3. **Account Security:**
   - Make sure your account is not locked
   - Check for any security alerts

### Alternative: Use Different Email Provider

If Gmail continues to have issues, consider:

**SendGrid (Recommended for Production):**
1. Sign up at https://sendgrid.com
2. Create API Key
3. Use:
   ```
   SMTP_SERVER: smtp.sendgrid.net
   SMTP_PORT: 587
   SMTP_USERNAME: apikey
   SMTP_PASSWORD: your-sendgrid-api-key
   ```

**Outlook/Hotmail:**
```
SMTP_SERVER: smtp-mail.outlook.com
SMTP_PORT: 587
SMTP_USERNAME: your-email@outlook.com
SMTP_PASSWORD: your-password
```

---

## Summary

The "530-5.7.0 Authentication Required" error means:
- ❌ SMTP authentication failed
- ✅ **Solution:** Use Gmail App Password (not regular password)
- ✅ **Requirement:** 2FA must be enabled
- ✅ **Format:** Full email for username, 16-char App Password for password

Once you:
1. Enable 2FA
2. Generate App Password
3. Set secrets correctly in GitHub

The email notifications should work! 🎉

---

## Need Help?

If you're still getting the error after following these steps:
1. Double-check all secrets are set correctly
2. Verify 2FA is enabled
3. Generate a new App Password
4. Check workflow logs for specific error messages
5. Try a different email provider (SendGrid, Outlook)

