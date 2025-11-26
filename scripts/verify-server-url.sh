#!/bin/bash
# Verify that the server URL responds correctly

BASE_URL="${TEST_BASE_URL:-http://localhost:3000}"
echo "[WEBSERVER-VERIFY] Verifying server at: $BASE_URL" >&2

# Check if URL responds
for i in {1..10}; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" 2>/dev/null || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    echo "[WEBSERVER-VERIFY] ✓ Server responding with HTTP 200 at $BASE_URL" >&2
    exit 0
  fi
  echo "[WEBSERVER-VERIFY] Attempt $i: HTTP $HTTP_CODE (waiting...)" >&2
  sleep 2
done

echo "[WEBSERVER-VERIFY] ✗ Server not responding with HTTP 200" >&2
exit 1


