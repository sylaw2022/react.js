#!/bin/bash
# Start Next.js dev server with logging to confirm webServer detection

cd /home/sylaw/react.js

BASE_URL="${TEST_BASE_URL:-http://localhost:3000}"
echo "[WEBSERVER] Starting Next.js dev server..." >&2
echo "[WEBSERVER] Command: npm run dev" >&2
echo "[WEBSERVER] Target URL Playwright will check: $BASE_URL" >&2

# Start the server and monitor output
npm run dev 2>&1 | while IFS= read -r line; do
  echo "$line"
  
  # Log when server is ready - this confirms webServer detected it
  if echo "$line" | grep -q "Ready in"; then
    echo "[WEBSERVER] ✓ Server ready detected: $line" >&2
  fi
  
  # Extract port from "Local: http://localhost:XXXX" or "- Local: http://localhost:XXXX"
  # The port info is in the "Local:" line, not the "Ready in" line
  if echo "$line" | grep -qi "Local:"; then
    echo "[WEBSERVER] ✓ Server URL detected: $line"
    # Try multiple patterns to extract port
    echo $line
    SERVER_PORT=$(echo "$line" | sed -n 's/.*localhost:\([0-9]\+\).*/\1/p' 2>/dev/null)
    echo $SERVER_PORT
    if [ -z "$SERVER_PORT" ]; then
      # Try alternative pattern: extract any number after colon
      SERVER_PORT=$(echo "$line" | grep -oE ':[0-9]+' | grep -oE '[0-9]+' | head -1)
    fi
    if [ -z "$SERVER_PORT" ]; then
      # Try pattern with http:// or https://
      SERVER_PORT=$(echo "$line" | sed -n 's/.*:\/\/[^:]*:\([0-9]\+\).*/\1/p' 2>/dev/null)
    fi
    if [ -n "$SERVER_PORT" ]; then
      echo "[WEBSERVER] ✓ Server running on port: $SERVER_PORT" >&2
      echo "[WEBSERVER] Checking if Playwright URL matches server port..." >&2
      # Extract port from BASE_URL
      EXPECTED_PORT=$(echo "$BASE_URL" | sed -n 's/.*localhost:\([0-9]\+\).*/\1/p' 2>/dev/null)
      if [ -z "$EXPECTED_PORT" ]; then
        EXPECTED_PORT=$(echo "$BASE_URL" | grep -oE ':[0-9]+' | grep -oE '[0-9]+' | head -1)
      fi
      if [ -z "$EXPECTED_PORT" ]; then
        EXPECTED_PORT="3000"  # Default
      fi
      echo "[WEBSERVER] Playwright checking port: $EXPECTED_PORT" >&2
      if [ "$SERVER_PORT" != "$EXPECTED_PORT" ]; then
        echo "[WEBSERVER] ⚠ PORT MISMATCH! Server on $SERVER_PORT but Playwright checks $EXPECTED_PORT" >&2
        echo "[WEBSERVER] ⚠ Tests will NOT run because URL check will fail!" >&2
      else
        echo "[WEBSERVER] ✓ Ports match - Playwright should detect server" >&2
      fi
    else
      echo "[WEBSERVER] ⚠ Could not extract port from line: $line" >&2
      echo "[WEBSERVER] Debug: Trying to find any port pattern..." >&2
      # Show what we found
      echo "[WEBSERVER] Debug: Line contains 'Local:' = $(echo "$line" | grep -q "Local:" && echo "yes" || echo "no")" >&2
    fi
  fi
done
