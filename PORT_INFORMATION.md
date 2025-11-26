# Server Port Information

## Default Port

**Next.js uses port 3000 by default.**

---

## How Port is Determined

### Priority Order:

1. **PORT environment variable** (highest priority)
   ```bash
   PORT=3002 npm run dev
   # Server runs on port 3002
   ```

2. **Next.js default: 3000**
   ```bash
   npm run dev
   # Server runs on port 3000 (if available)
   ```

3. **Next available port** (if 3000 is busy)
   ```bash
   npm run dev
   # If 3000 is busy → uses 3001
   # If 3001 is busy → uses 3002
   # And so on...
   ```

---

## Check Current Port

### Method 1: Check Process

```bash
ps aux | grep "next dev"
# Look for port in output
```

### Method 2: Check Listening Ports

```bash
lsof -i:3000 -i:3001 -i:3002 | grep LISTEN
# Shows which ports are in use
```

### Method 3: Test Ports

```bash
# Test port 3000
curl http://localhost:3000/api/status

# Test port 3001
curl http://localhost:3001/api/status

# Test port 3002
curl http://localhost:3002/api/status
```

### Method 4: Check Server Output

When you run `npm run dev`, Next.js shows:
```
▲ Next.js 16.0.3 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in XXXms
```

**The port is shown in the output!**

---

## Set Custom Port

### Option 1: Environment Variable

```bash
PORT=3002 npm run dev
```

### Option 2: Update package.json

```json
{
  "scripts": {
    "dev": "PORT=3002 next dev"
  }
}
```

### Option 3: .env.local

```bash
# .env.local
PORT=3002
```

---

## Common Ports

| Port | Common Use |
|------|------------|
| 3000 | Next.js default |
| 3001 | Next.js (if 3000 busy) |
| 5173 | Vite default |
| 4200 | Angular default |
| 8080 | Common backend |
| 8000 | Common backend |

---

## Find Your Server Port

### Quick Check:

```bash
# Check if server is running
ps aux | grep "next dev"

# Check what's listening
lsof -i:3000 -i:3001 -i:3002

# Test common ports
for port in 3000 3001 3002; do
  if curl -s http://localhost:$port/api/status > /dev/null 2>&1; then
    echo "Server is running on port $port"
  fi
done
```

---

## Summary

- **Default:** Port 3000
- **If busy:** Next.js automatically uses 3001, 3002, etc.
- **Check:** Look at server output or test ports
- **Custom:** Set `PORT` environment variable

**Most likely your server is on port 3000!** 🚀


