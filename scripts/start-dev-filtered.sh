#!/bin/bash
# Start Next.js dev server with filtered output

cd /home/sylaw/react.js

# Start server and filter module resolution warnings
# Use unbuffered output for immediate display
exec npm run dev 2>&1 | \
  stdbuf -oL -eL grep -v "Error: Cannot find module.*next/server" | \
  stdbuf -oL -eL grep -v "Error: Cannot find module.*next/navigation" | \
  stdbuf -oL -eL grep -v "Error: Cannot find module.*next/link" | \
  stdbuf -oL -eL grep -v "Did you mean to import"



