# API Status Endpoint

## Overview

A Next.js API route that returns the status of the backend server.

## Endpoint

**URL:** `GET /api/status`

**Method:** `GET`

## Response

### Success Response (200 OK)

```json
{
  "status": "online",
  "timestamp": "2024-11-24T09:15:30.123Z",
  "uptime": 1234.56,
  "environment": "development",
  "nodeVersion": "v18.17.0",
  "platform": "linux",
  "memory": {
    "used": 45,
    "total": 128,
    "unit": "MB"
  },
  "server": "Next.js",
  "version": "1.0.0"
}
```

### Error Response (500 Internal Server Error)

```json
{
  "status": "error",
  "message": "Error message here",
  "timestamp": "2024-11-24T09:15:30.123Z"
}
```

## Usage

### Using curl

```bash
curl http://localhost:3000/api/status
```

### Using fetch (JavaScript)

```javascript
const response = await fetch('/api/status')
const data = await response.json()
console.log(data)
```

### Using fetch (Browser)

```javascript
fetch('http://localhost:3000/api/status')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Server status ("online" or "error") |
| `timestamp` | string | Current server time in ISO format |
| `uptime` | number | Server uptime in seconds |
| `environment` | string | Node.js environment (development/production) |
| `nodeVersion` | string | Node.js version |
| `platform` | string | Operating system platform |
| `memory.used` | number | Memory currently used (MB) |
| `memory.total` | number | Total memory allocated (MB) |
| `memory.unit` | string | Memory unit ("MB") |
| `server` | string | Server type ("Next.js") |
| `version` | string | Application version |

## Example Usage

### Check Server Health

```bash
# Simple check
curl http://localhost:3000/api/status

# Pretty print JSON
curl http://localhost:3000/api/status | python3 -m json.tool

# Check only status field
curl http://localhost:3000/api/status | python3 -c "import sys, json; print(json.load(sys.stdin)['status'])"
```

### Monitor Server Status

```bash
# Check status every 5 seconds
watch -n 5 'curl -s http://localhost:3000/api/status | python3 -m json.tool'
```

### Integration Test

```javascript
// tests/api-status.test.js
import { describe, it, expect } from 'vitest'

describe('Status API', () => {
  it('should return server status', async () => {
    const response = await fetch('http://localhost:3000/api/status')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.status).toBe('online')
    expect(data.timestamp).toBeDefined()
    expect(data.uptime).toBeGreaterThan(0)
  })
})
```

## File Location

The API route is located at:
```
app/api/status/route.js
```

## Next.js API Routes

This uses Next.js 13+ App Router API routes:
- File-based routing: `app/api/status/route.js` → `/api/status`
- HTTP methods: Export functions named after HTTP methods (`GET`, `POST`, etc.)
- Response: Use `NextResponse` for proper responses

## Customization

You can extend this endpoint to include:
- Database connection status
- External service health checks
- Custom metrics
- System load information

Example extension:

```javascript
export async function GET() {
  const status = {
    status: 'online',
    timestamp: new Date().toISOString(),
    // ... existing fields ...
    database: {
      connected: await checkDatabase(),
      latency: await measureDatabaseLatency()
    },
    services: {
      redis: await checkRedis(),
      externalApi: await checkExternalAPI()
    }
  }
  
  return NextResponse.json(status)
}
```


