# Commands to Kill All npm/Node.js Servers

## Quick Commands

### Kill All Next.js Servers
```bash
pkill -f "next dev"
pkill -f "next start"
```

### Kill All Node.js Processes
```bash
pkill -f node
# OR
killall node
```

### Kill All npm Processes
```bash
pkill -f npm
# OR
killall npm
```

### Kill Everything (Node.js, npm, Next.js)
```bash
pkill -f "next"
pkill -f "node"
pkill -f "npm"
```

## More Specific Commands

### Kill Process on Specific Port
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill processes on multiple ports
lsof -ti:3000,3001,3002 | xargs kill -9
```

### Kill by Process Name Pattern
```bash
# Kill all processes matching "next"
pkill -f "next"

# Kill all processes matching "react"
pkill -f "react"

# Kill all processes matching "vite"
pkill -f "vite"
```

## Force Kill (if normal kill doesn't work)

### Force Kill All Node.js
```bash
pkill -9 -f node
# OR
killall -9 node
```

### Force Kill All npm
```bash
pkill -9 -f npm
# OR
killall -9 npm
```

### Force Kill on Specific Port
```bash
lsof -ti:3000 | xargs kill -9
```

## Check What's Running First

### List All Node.js Processes
```bash
ps aux | grep node
```

### List All npm Processes
```bash
ps aux | grep npm
```

### List All Next.js Processes
```bash
ps aux | grep next
```

### Check What's Using Ports
```bash
# Check port 3000
lsof -i:3000

# Check multiple ports
lsof -i:3000,3001,3002

# Check all listening ports
lsof -i -P -n | grep LISTEN
```

## One-Liner to Kill Everything

### Kill All Node.js Related Processes
```bash
pkill -f "next" && pkill -f "node" && pkill -f "npm" && echo "All Node.js processes killed"
```

### Kill All Processes on Common Ports
```bash
for port in 3000 3001 3002 3003 5173; do lsof -ti:$port | xargs kill -9 2>/dev/null; done && echo "All processes on common ports killed"
```

## Safe Kill (Recommended)

### Kill Only Next.js Dev Servers
```bash
# This is safer - only kills Next.js dev servers
pkill -f "next dev"
```

### Kill Only This Project's Server
```bash
# From project directory
pkill -f "next dev" && pkill -f "react.js"
```

## Verify Processes Are Killed

```bash
# Check if anything is still running
ps aux | grep -E "(next|node|npm)" | grep -v grep

# Check if ports are free
lsof -i:3000,3001,3002
```

## Common Use Cases

### Before Starting Tests
```bash
# Kill any existing servers before running tests
pkill -f "next dev" && pkill -f "next start"
npm run test:e2e
```

### Clean Slate
```bash
# Kill everything and start fresh
pkill -f "next" && pkill -f "node" && pkill -f "npm"
npm run dev
```

### Kill Stuck Processes
```bash
# If processes are stuck, force kill
pkill -9 -f "next"
pkill -9 -f "node"
```

## Notes

- `pkill -f` searches the full command line, not just process name
- `kill -9` is a force kill (SIGKILL) - use when normal kill doesn't work
- `xargs kill -9` passes PIDs from lsof to kill command
- `2>/dev/null` suppresses error messages for ports that aren't in use
- Always check what's running first with `ps aux | grep` before killing



