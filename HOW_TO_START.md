# How to Start the Servers

## Quick Start

### Next.js Server (Recommended)

```bash
npm run dev
```

This starts the Next.js development server with:
- ✅ SSR enabled
- ✅ Hot Module Replacement (HMR)
- ✅ Fast refresh
- ✅ Automatic routing
- ✅ No CommonJS issues

**Default URL:** http://localhost:3000 (or next available port)

---

## Available Commands

### Development Mode

```bash
# Start Next.js development server (SSR enabled)
npm run dev
```

**What it does:**
- Starts Next.js dev server
- Enables SSR automatically
- Hot reloading on file changes
- Development optimizations

**Output:**
```
▲ Next.js 16.0.3 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in XXXms
```

---

### Production Mode

```bash
# Build for production
npm run build

# Start production server
npm start
```

**What it does:**
- Builds optimized production bundle
- Starts production server
- Better performance
- Smaller bundle sizes

---

### Old Custom Server (Optional)

If you want to run the old Express + Vite SSR server:

```bash
npm run dev:old
```

**Note:** This uses the custom `server.js` file. The Next.js server is recommended.

---

## Step-by-Step Instructions

### 1. Start Next.js Development Server

```bash
cd /home/sylaw/react.js
npm run dev
```

### 2. Open in Browser

Visit: **http://localhost:3000**

(If port 3000 is busy, Next.js will use the next available port like 3001)

### 3. Stop the Server

Press `Ctrl + C` in the terminal

---

## Troubleshooting

### Port Already in Use

If you see:
```
⚠ Port 3000 is in use by process XXXX, using available port 3001 instead.
```

**Solutions:**
1. Use the port Next.js suggests (3001)
2. Kill the process using port 3000:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```
3. Specify a different port:
   ```bash
   PORT=3002 npm run dev
   ```

### Server Not Starting

**Check:**
1. Node.js is installed: `node --version`
2. Dependencies are installed: `npm install`
3. No syntax errors in your code

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Server Status

### Check if Server is Running

```bash
# Check for Next.js process
ps aux | grep next

# Check for any Node server
ps aux | grep "node.*server"

# Check what's using port 3000
lsof -i:3000
```

### Stop All Servers

```bash
# Kill Next.js processes
pkill -f "next dev"

# Kill all Node processes (be careful!)
pkill -f "node.*server"
```

---

## Environment Variables

### Development

```bash
# Default (development mode)
npm run dev

# Explicit development
NODE_ENV=development npm run dev
```

### Production

```bash
# Build first
npm run build

# Then start
NODE_ENV=production npm start
```

---

## What Happens When You Start

### `npm run dev` Flow:

```
1. Next.js reads next.config.js
   ↓
2. Scans app/ directory for routes
   ↓
3. Initializes Turbopack bundler
   ↓
4. Starts HTTP server
   ↓
5. Ready to handle requests
```

### Server Capabilities:

- ✅ SSR (Server-Side Rendering)
- ✅ File-based routing
- ✅ Hot Module Replacement
- ✅ Fast refresh
- ✅ Error overlay
- ✅ Source maps

---

## Comparison: Next.js vs Old Server

| Feature | Next.js (`npm run dev`) | Old Server (`npm run dev:old`) |
|---------|------------------------|-------------------------------|
| **SSR** | ✅ Automatic | ⚠️ Manual setup |
| **CommonJS** | ✅ Handled | ❌ Issues |
| **Routing** | ✅ File-based | ⚠️ Manual |
| **HMR** | ✅ Built-in | ⚠️ Via Vite |
| **Configuration** | ✅ Simple | ❌ Complex |

**Recommendation:** Use `npm run dev` (Next.js)

---

## Quick Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run old custom server (not recommended)
npm run dev:old

# Stop server
Ctrl + C

# Check server status
curl http://localhost:3000
```

---

## Next Steps

After starting the server:

1. ✅ Open http://localhost:3000 in your browser
2. ✅ You should see "Hello World!"
3. ✅ Edit `app/page.jsx` to see hot reloading
4. ✅ Check browser console for any errors

---

## Need Help?

- **Server won't start?** Check the error message and ensure dependencies are installed
- **Port in use?** Kill the process or use a different port
- **Module errors?** Run `npm install` again



