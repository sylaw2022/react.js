# Fix for Vite SSR jsx-dev-runtime Error

## Error
```
[vite] Error when evaluating SSR module /node_modules/react/jsx-dev-runtime.js
```

## Root Cause

This error occurs when Vite's SSR tries to load React's JSX runtime but:
1. React modules are being externalized (not bundled) for SSR
2. The JSX runtime resolution isn't properly configured
3. There's a mismatch between client and server module resolution

## Solution Applied

### Updated `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    // Use automatic JSX runtime (default)
    jsxRuntime: 'automatic',
  })],
  ssr: {
    // Don't externalize React - bundle it for SSR
    noExternal: ['react', 'react-dom'],
  },
  resolve: {
    // Ensure proper resolution for SSR
    dedupe: ['react', 'react-dom'],
  },
})
```

## Key Changes

1. **`noExternal: ['react', 'react-dom']`**
   - Forces Vite to bundle React for SSR instead of trying to load it from node_modules
   - Prevents the jsx-dev-runtime resolution error

2. **`dedupe: ['react', 'react-dom']`**
   - Ensures only one version of React is used
   - Prevents duplicate React instances

3. **Explicit `jsxRuntime: 'automatic'`**
   - Ensures consistent JSX runtime usage
   - Uses the modern automatic JSX transform

## Why This Works

When `noExternal` includes React:
- Vite bundles React code for SSR
- JSX runtime is properly resolved during bundling
- No need to dynamically import from node_modules
- Consistent module resolution between client and server

## Testing

After applying the fix:
1. Server should start without jsx-dev-runtime errors
2. SSR should work correctly
3. React components should render on the server

## Additional Notes

- The "module is not defined" error is a separate client-side issue
- This fix specifically addresses the SSR jsx-dev-runtime error
- For production builds, ensure the same configuration is used




