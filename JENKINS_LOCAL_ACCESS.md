# Jenkins Local Access Guide

## Jenkins Status

✅ **Jenkins is running locally**

### Service Information
- **Status:** Active (running)
- **Port:** 8081
- **Home Directory:** `/var/lib/jenkins`
- **Java Version:** OpenJDK 17
- **Memory Usage:** ~1.0GB

---

## Access Jenkins

### Web Interface

**Local Access:**
```
http://localhost:8081
```

**Network Access:**
```
http://<your-ip>:8081
```

To find your IP address:
```bash
hostname -I
```

### Initial Setup

If Jenkins is not yet configured:

1. **Get Initial Admin Password:**
   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```

2. **Access Jenkins:**
   - Open browser: `http://localhost:8081`
   - Enter the initial admin password
   - Follow the setup wizard

---

## Service Management

### Start Jenkins
```bash
sudo systemctl start jenkins
```

### Stop Jenkins
```bash
sudo systemctl stop jenkins
```

### Restart Jenkins
```bash
sudo systemctl restart jenkins
```

### Check Status
```bash
sudo systemctl status jenkins
```

### View Logs
```bash
sudo journalctl -u jenkins -f
# Or
sudo tail -f /var/log/jenkins/jenkins.log
```

---

## Create Pipeline Job

### Option 1: Using Jenkinsfile from Repository

1. **Open Jenkins:** `http://localhost:8081`

2. **Create New Item:**
   - Click "New Item"
   - Enter job name (e.g., "react.js")
   - Select "Pipeline"
   - Click "OK"

3. **Configure Pipeline:**
   - Scroll to "Pipeline" section
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** `/home/sylaw/react.js` (or your Git repo URL)
   - **Script Path:** `Jenkinsfile`
   - Click "Save"

4. **Run Build:**
   - Click "Build Now"
   - View progress in console output

### Option 2: Using Local Directory

1. **Create Pipeline Job:**
   - New Item → Pipeline
   - Name: "react.js-local"

2. **Pipeline Configuration:**
   - **Definition:** Pipeline script
   - **Script:** Copy contents from `/home/sylaw/react.js/Jenkinsfile`
   - Click "Save"

3. **Set Environment Variables:**
   - Go to job configuration
   - Add environment variables:
     - `JWT_SECRET`
     - `ENCRYPTION_KEY`
     - `API_KEY_SECRET`
     - `EMAIL_TO=groklord2@gmail.com`

---

## Required Plugins

Ensure these plugins are installed:

1. **Pipeline Plugin** (usually pre-installed)
2. **Git Plugin** (for SCM)
3. **Email Extension Plugin** (for email notifications)
4. **NodeJS Plugin** (for Node.js builds)
5. **HTML Publisher Plugin** (for test reports)
6. **JUnit Plugin** (for test results)

### Install Plugins:
1. Go to: **Manage Jenkins → Manage Plugins**
2. Search for plugin name
3. Install and restart Jenkins

---

## Environment Variables

Set these in Jenkins job configuration:

### Required Variables:
- `JWT_SECRET` - Secret for JWT token signing
- `ENCRYPTION_KEY` - Master encryption key (64-char hex)
- `API_KEY_SECRET` - Secret for API key hashing

### Optional Variables:
- `EMAIL_TO` - Email recipient (default: groklord2@gmail.com)
- `TEST_BASE_URL` - E2E test base URL (default: http://localhost:3000)

### How to Set:
1. Go to job configuration
2. Scroll to "Build Environment"
3. Check "Use secret text(s) or file(s)"
4. Add bindings for each variable
   - Or use "Environment variables" section

---

## Test Pipeline

### Quick Test:
```bash
# From your project directory
cd /home/sylaw/react.js

# Test Jenkinsfile syntax (if groovy is installed)
groovy -e "new groovy.text.SimpleTemplateEngine().createTemplate(new File('Jenkinsfile').text)"
```

### Run Build:
1. Go to Jenkins web interface
2. Select your pipeline job
3. Click "Build Now"
4. View console output for progress

---

## Troubleshooting

### Jenkins Not Accessible
```bash
# Check if service is running
sudo systemctl status jenkins

# Check port
sudo netstat -tlnp | grep 8081

# Check firewall
sudo ufw status
```

### Permission Issues
```bash
# Jenkins runs as 'jenkins' user
# Check permissions
ls -la /var/lib/jenkins

# Fix permissions if needed
sudo chown -R jenkins:jenkins /var/lib/jenkins
```

### View Logs
```bash
# System logs
sudo journalctl -u jenkins -n 50

# Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log
```

### Reset Jenkins (if needed)
```bash
# Stop Jenkins
sudo systemctl stop jenkins

# Backup current config
sudo cp -r /var/lib/jenkins /var/lib/jenkins.backup

# Remove config (will reset to initial setup)
sudo rm -rf /var/lib/jenkins/*
```

---

## Quick Commands

```bash
# Start Jenkins
sudo systemctl start jenkins

# Stop Jenkins
sudo systemctl stop jenkins

# Restart Jenkins
sudo systemctl restart jenkins

# Check status
sudo systemctl status jenkins

# View logs
sudo journalctl -u jenkins -f

# Get admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

## Next Steps

1. ✅ **Access Jenkins:** `http://localhost:8081`
2. ✅ **Create Pipeline Job** using Jenkinsfile
3. ✅ **Set Environment Variables** (JWT_SECRET, ENCRYPTION_KEY, etc.)
4. ✅ **Install Required Plugins** (Email Extension, etc.)
5. ✅ **Run First Build** and verify email notifications

---

## Summary

- **Jenkins URL:** http://localhost:8081
- **Status:** ✅ Running
- **Port:** 8081
- **Ready to use:** Yes

Your Jenkinsfile is configured and ready to use. Just create a pipeline job in Jenkins and point it to your repository or copy the Jenkinsfile content.

