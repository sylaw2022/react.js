#!/bin/bash
# Start Next.js dev server with stderr redirected to filter module warnings

cd /home/sylaw/react.js

# Start Next.js dev server and filter out module resolution warnings
npm run dev 2>&1 | grep -vE '(Error: Cannot find module.*next/(server|navigation|link)|Did you mean to import)' || npm run dev



