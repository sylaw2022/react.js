#!/bin/bash
# Start Next.js dev server with module resolution warnings filtered

cd /home/sylaw/react.js

# Start server and filter out module resolution warnings
npm run dev 2>&1 | \
  grep -v "Error: Cannot find module.*next/server" | \
  grep -v "Error: Cannot find module.*next/navigation" | \
  grep -v "Error: Cannot find module.*next/link" | \
  grep -v "Did you mean to import" || \
  npm run dev



