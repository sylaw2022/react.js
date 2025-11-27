#!/bin/bash
# Check if server is ready by making HTTP request to BASE_URL

BASE_URL="${TEST_BASE_URL:-http://localhost:3000}"
echo "[WEBSERVER-CHECK] Checking if server is ready at: $BASE_URL" >&2

# Try to check if server responds
for i in {1..30}; do
  if curl -s -f -o /dev/null "$BASE_URL/api/status" 2>/dev/null; then
    echo "[WEBSERVER-CHECK] ✓ Server is ready and responding!" >&2
    exit 0
  fi
  sleep 1
done

echo "[WEBSERVER-CHECK] ✗ Server check timeout" >&2
exit 1



