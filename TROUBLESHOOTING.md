# Troubleshooting: Cannot Access Localhost

## Quick Fixes

### 1. Check Which Port the Server is Using

```bash
# Check what's listening on ports 3000-3002
lsof -i:3000 -i:3001 -i:3002

# Or check all Next.js processes
ps aux | grep "next dev"
```

### 2. Restart the Server

```bash
# Stop all Next.js servers
pkill -f "next dev"

# Start fresh
cd /home/sylaw/react.js
npm run dev
```

**Look for output like:**
```
▲ Next.js 16.0.3 (Turbopack)
- Local:        http://localhost:3000
```

### 3. Try Different URLs

- http://localhost:3000
- http://127.0.0.1:3000
- http://localhost:3001 (if 3000 is busy)

---

## Common Issues

### Issue 1: Port Already in Use

**Symptoms:**
- Server says "Port 3000 is in use"
- Server uses port 3001 instead

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use the port Next.js suggests (3001, 3002, etc.)
```

### Issue 2: Server Not Started

**Symptoms:**
- No response from localhost
- Connection refused

**Solution:**
```bash
# Make sure server is running
cd /home/sylaw/react.js
npm run dev

# Check if it started successfully
# Look for "Ready in XXXms" message
```

### Issue 3: Browser Cache

**Symptoms:**
- Old page shows
- Changes not visible

**Solution:**
- Hard refresh: `Ctrl + Shift + R` (Linux/Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Try incognito/private mode

### Issue 4: Firewall/Network Issues

**Symptoms:**
- Works with curl but not browser
- Connection timeout

**Solution:**
```bash
# Test with curl first
curl http://localhost:3000

# If curl works, it's a browser issue
# Check browser console for errors
```

### Issue 5: Wrong URL

**Symptoms:**
- 404 errors
- Page not found

**Solution:**
- Make sure you're using: `http://localhost:3000` (not `https://`)
- Check the port number in terminal output
- Try `http://127.0.0.1:3000`

---

## Step-by-Step Debugging

### Step 1: Check Server Status

```bash
# Is server running?
ps aux | grep "next dev"

# What port is it using?
lsof -i:3000
```

### Step 2: Test Server Response

```bash
# Test with curl
curl http://localhost:3000

# Should return HTML with "Hello World!"
```

### Step 3: Check Server Logs

```bash
# View server output
tail -f /tmp/nextjs_server.log

# Or check Next.js logs
tail -f .next/dev/logs/next-development.log
```

### Step 4: Restart Server

```bash
# Stop server
pkill -f "next dev"

# Start fresh
cd /home/sylaw/react.js
npm run dev
```

---

## Browser-Specific Issues

### Firefox

- Try: `http://localhost:3000`
- Check: Browser console (F12) for errors
- Clear: Cache and cookies

### Chrome/Chromium

- Try: `http://localhost:3000`
- Check: Developer tools (F12)
- Disable: Extensions temporarily

### Edge

- Try: `http://localhost:3000`
- Check: Network tab in DevTools

---

## Network Troubleshooting

### Test Local Connection

```bash
# Test if localhost resolves
ping localhost

# Test if port is accessible
telnet localhost 3000
# Or
nc -zv localhost 3000
```

### Check Firewall

```bash
# Check if firewall is blocking
sudo ufw status

# If needed, allow port 3000
sudo ufw allow 3000
```

---

## Quick Commands

```bash
# Start server
npm run dev

# Stop server
pkill -f "next dev"

# Check port
lsof -i:3000

# Test server
curl http://localhost:3000

# View logs
tail -f /tmp/nextjs_server.log
```

---

## Still Not Working?

1. **Check Node.js version:**
   ```bash
   node --version
   # Should be v18 or higher
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check for errors:**
   ```bash
   npm run dev
   # Look for error messages
   ```

4. **Try a different port:**
   ```bash
   PORT=3002 npm run dev
   # Then visit http://localhost:3002
   ```

---

## Expected Behavior

When server starts successfully, you should see:

```
▲ Next.js 16.0.3 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in XXXms
```

When you visit http://localhost:3000, you should see:
- "Hello World!" text
- Centered on the page
- No errors in browser console


