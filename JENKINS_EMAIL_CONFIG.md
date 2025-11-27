# Jenkins Email Notification Configuration

## Overview

The Jenkinsfile has been configured to send email notifications to **groklord2@gmail.com** after every pipeline stage completes.

---

## Email Recipient

**Email Address:** `groklord2@gmail.com`

Configured in the Jenkinsfile environment:
```groovy
EMAIL_TO = 'groklord2@gmail.com'
```

---

## Email Notifications

### Per-Stage Emails

An email is sent after **each stage** completes, regardless of success or failure:

1. ✅ **Checkout** - Sent after code checkout
2. ✅ **Setup** - Sent after environment setup (includes Node.js/npm versions)
3. ✅ **Install Dependencies** - Sent after dependency installation
4. ✅ **Lint** - Sent after lint stage (currently skipped)
5. ✅ **Build** - Sent after build completion
6. ✅ **Frontend Tests** - Sent after frontend tests
7. ✅ **Backend Tests** - Sent after backend tests
8. ✅ **E2E Tests** - Sent after E2E tests
9. ✅ **Test Summary** - Sent after test summary

### Pipeline-Level Emails

Additional emails are sent at the end of the pipeline:

- ✅ **Success Email** - When entire pipeline succeeds
- ❌ **Failure Email** - When pipeline fails
- ⚠️ **Unstable Email** - When pipeline is unstable (tests failed but pipeline continued)

---

## Email Content

Each email includes:

- **Subject:** Stage name and status
- **Body:** HTML formatted with:
  - Stage name
  - Build status (SUCCESS/FAILURE/UNSTABLE)
  - Build number and job name
  - Timestamp
  - Links to build details (for final pipeline emails)

### Example Email Subject

```
Jenkins Pipeline - Stage: Build - SUCCESS
Jenkins Pipeline - Stage: Frontend Tests - FAILURE
✅ Jenkins Pipeline SUCCESS - react.js #42
```

---

## Required Jenkins Configuration

### 1. Install Email Extension Plugin

The Jenkinsfile uses the `emailext` function which requires:

**Plugin:** Email Extension Plugin (Email Extension)

**Installation:**
1. Go to Jenkins → Manage Jenkins → Manage Plugins
2. Search for "Email Extension"
3. Install and restart Jenkins

### 2. Configure SMTP Settings

Configure email server settings in Jenkins:

1. Go to **Manage Jenkins → Configure System**
2. Scroll to **Extended E-mail Notification**
3. Configure:
   - **SMTP server:** (e.g., smtp.gmail.com for Gmail)
   - **SMTP Port:** 587 (TLS) or 465 (SSL)
   - **Use SSL:** Yes (for Gmail)
   - **Use TLS:** Yes (for Gmail)
   - **Username:** Your email (if authentication required)
   - **Password:** Your email password or app password
   - **Default user e-mail suffix:** @gmail.com (optional)

### 3. Gmail Configuration (if using Gmail SMTP)

For Gmail, you may need to:

1. **Enable 2-Factor Authentication**
2. **Generate App Password:**
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Generate App Password for "Mail"
   - Use this password in Jenkins SMTP config

**Gmail SMTP Settings:**
- SMTP Server: `smtp.gmail.com`
- SMTP Port: `587` (TLS) or `465` (SSL)
- Use SSL: Yes
- Use TLS: Yes (if using port 587)
- Username: Your Gmail address
- Password: App password (not regular password)

---

## Email Frequency

### Per-Stage Emails

- **Frequency:** After every stage
- **Total per pipeline:** 9 emails (one per stage)
- **Timing:** Immediately after stage completion

### Pipeline-Level Emails

- **Frequency:** Once per pipeline run
- **Total per pipeline:** 1 email (success, failure, or unstable)
- **Timing:** At the end of the pipeline

**Total emails per pipeline run:** 10 emails (9 stage emails + 1 pipeline summary)

---

## Customizing Email Recipient

To change the email recipient, update the environment variable:

```groovy
environment {
    EMAIL_TO = 'your-email@example.com'  // Change this
}
```

Or set it in Jenkins job configuration:
1. Go to job configuration
2. Add environment variable: `EMAIL_TO = your-email@example.com`

---

## Testing Email Configuration

### Test in Jenkins

1. Run a pipeline build
2. Check Jenkins console for email sending status
3. Check your email inbox (and spam folder)
4. Verify emails are received for each stage

### Troubleshooting

**No emails received:**
- Check SMTP configuration in Jenkins
- Verify Email Extension plugin is installed
- Check Jenkins logs for email errors
- Verify email address is correct
- Check spam/junk folder

**Emails not formatted correctly:**
- Verify HTML emails are enabled in plugin settings
- Check Jenkins console for errors

---

## Email Template Examples

### Stage Email (Example)
```
Subject: Jenkins Pipeline - Stage: Build - SUCCESS

Body:
Jenkins Pipeline Stage Result
Stage: Build
Status: SUCCESS
Build: react.js #42
Time: Tue Nov 26 2024 14:30:00 GMT+0000
```

### Pipeline Success Email (Example)
```
Subject: ✅ Jenkins Pipeline SUCCESS - react.js #42

Body:
Pipeline Succeeded!
Build: react.js #42
Status: SUCCESS
Duration: 5 min 23 sec
Time: Tue Nov 26 2024 14:35:00 GMT+0000

All pipeline stages completed successfully.
[View Build Details]
```

---

## Summary

✅ **Email notifications configured for all stages**  
✅ **Recipient:** groklord2@gmail.com  
✅ **Frequency:** After every stage + pipeline summary  
✅ **Format:** HTML emails with build details  
✅ **Status:** Ready to use (requires Email Extension plugin)

---

## Next Steps

1. **Install Email Extension Plugin** in Jenkins
2. **Configure SMTP settings** in Jenkins
3. **Test with a pipeline run**
4. **Verify emails are received** at groklord2@gmail.com


