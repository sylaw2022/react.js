# GitHub Actions Email Notifications Setup

## Overview

The GitHub Actions CI workflow has been configured to send email notifications to **groklord2@gmail.com** for workflow status updates.

---

## Email Recipient

**Email Address:** `groklord2@gmail.com`

Configured in the workflow:
```yaml
env:
  EMAIL_TO: groklord2@gmail.com
```

---

## Email Notifications

### Per-Job Emails

An email is sent after **each job** completes:

1. ✅ **Test Job** (Node 18.x) - Sent after test job completes
2. ✅ **Test Job** (Node 20.x) - Sent after test job completes
3. ✅ **E2E Tests** - Sent after E2E tests complete
4. ✅ **Final Summary** - Sent after all jobs complete

### Email Content

Each email includes:
- **Subject:** Job name and status
- **Body:** HTML formatted with:
  - Job name and status
  - Repository and branch information
  - Commit details
  - Author and run information
  - Links to workflow run
  - Test results summary

---

## Required GitHub Secrets

To enable email notifications, you need to configure SMTP settings in GitHub Secrets.

### Set Secrets in GitHub

1. Go to your repository on GitHub
2. Click **Settings**
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add the following secrets:

#### Required Secrets:

1. **SMTP_USERNAME**
   - Your email address (e.g., `your-email@gmail.com`)
   - Used for SMTP authentication

2. **SMTP_PASSWORD**
   - Your email password or App Password
   - For Gmail, use an App Password (not your regular password)

#### Optional Secrets (with defaults):

3. **SMTP_SERVER** (default: `smtp.gmail.com`)
   - SMTP server address
   - Default: `smtp.gmail.com` for Gmail

4. **SMTP_PORT** (default: `587`)
   - SMTP server port
   - Default: `587` for Gmail with TLS

---

## Gmail Configuration

### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**

### Step 2: Generate App Password

1. Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and your device
3. Click **Generate**
4. Copy the 16-character password
5. Use this as your `SMTP_PASSWORD` secret

### Gmail SMTP Settings

- **SMTP Server:** `smtp.gmail.com`
- **SMTP Port:** `587` (TLS) or `465` (SSL)
- **Username:** Your Gmail address
- **Password:** App Password (16 characters)

---

## Other Email Providers

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

### Custom SMTP Server

```yaml
SMTP_SERVER: smtp.yourdomain.com
SMTP_PORT: 587
SMTP_USERNAME: your-email@yourdomain.com
SMTP_PASSWORD: your-password
```

---

## Email Frequency

### Per-Job Emails

- **Test Job (Node 18.x):** 1 email
- **Test Job (Node 20.x):** 1 email
- **E2E Tests:** 1 email
- **Final Summary:** 1 email

**Total emails per workflow run:** 4 emails

---

## Email Examples

### Test Job Email

```
Subject: GitHub Actions CI - Test Job (Node 18.x) - success

Body:
- Job: Test (Node 18.x)
- Status: success
- Repository: sylaw2022/react.js
- Branch: main
- Commit: abc123...
- Link to workflow run
```

### Final Summary Email

```
Subject: ✅ GitHub Actions CI - SUCCESS - sylaw2022/react.js

Body:
- Overall Status: SUCCESS
- Test Job: success
- E2E Tests: success
- Links to workflow and repository
```

---

## Troubleshooting

### Emails Not Being Sent

1. **Check Secrets:**
   - Verify `SMTP_USERNAME` is set
   - Verify `SMTP_PASSWORD` is set
   - Check if secrets are correctly named

2. **Check SMTP Settings:**
   - Verify SMTP server address
   - Verify SMTP port
   - Check firewall/network settings

3. **Check Workflow Logs:**
   - Go to Actions tab
   - Click on workflow run
   - Check "Send email notification" step logs
   - Look for error messages

4. **Gmail-Specific Issues:**
   - Ensure 2-Factor Authentication is enabled
   - Use App Password (not regular password)
   - Check if "Less secure app access" is enabled (if not using App Password)

### Authentication Errors

**Error: "Authentication failed"**
- Verify username and password are correct
- For Gmail, ensure you're using App Password
- Check if 2FA is enabled

**Error: "Connection timeout"**
- Check SMTP server address
- Verify SMTP port
- Check firewall settings

### Test Email Configuration

You can test your email configuration by:

1. **Manual Workflow Trigger:**
   - Go to Actions tab
   - Select CI workflow
   - Click "Run workflow"
   - Check if email is received

2. **Check Workflow Logs:**
   - View detailed logs in Actions
   - Look for email sending status

---

## Customization

### Change Email Recipient

Update the workflow file:

```yaml
env:
  EMAIL_TO: your-email@example.com
```

### Add More Recipients

Modify the email action:

```yaml
to: ${{ env.EMAIL_TO }}, another-email@example.com
```

### Customize Email Content

Edit the `body` section in the workflow file to customize email content.

---

## Security Best Practices

1. **Never commit secrets:**
   - Always use GitHub Secrets
   - Never hardcode passwords in workflow files

2. **Use App Passwords:**
   - For Gmail, use App Passwords
   - More secure than regular passwords

3. **Rotate Passwords:**
   - Change SMTP passwords periodically
   - Update secrets when passwords change

4. **Limit Access:**
   - Only grant necessary permissions
   - Use repository secrets (not organization secrets) when possible

---

## Summary

✅ **Email notifications configured**  
✅ **Recipient:** groklord2@gmail.com  
✅ **Frequency:** After each job + final summary  
✅ **Format:** HTML emails with workflow details  
✅ **Status:** Ready to use (requires SMTP secrets)

---

## Next Steps

1. **Set GitHub Secrets:**
   - Go to repository Settings → Secrets
   - Add `SMTP_USERNAME` and `SMTP_PASSWORD`
   - Optionally set `SMTP_SERVER` and `SMTP_PORT`

2. **For Gmail:**
   - Enable 2-Factor Authentication
   - Generate App Password
   - Use App Password as `SMTP_PASSWORD`

3. **Test Workflow:**
   - Push code or manually trigger workflow
   - Check email inbox for notifications

4. **Verify:**
   - Check workflow logs for email sending status
   - Verify emails are received

---

## Workflow File Location

The email notifications are configured in:
- `.github/workflows/ci.yml`

The workflow uses the `dawidd6/action-send-mail@v3` action for sending emails.

