# Next.js Transformed Code - What Gets Sent to Browser

## Overview

This document shows the actual transformed code that Next.js sends to the browser, comparing your source code with what the browser receives.

---

## 1. Your Source Code

### `app/page.jsx` (Original):

```jsx
export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Hello World!</h1>
    </div>
  )
}
```

### `app/layout.jsx` (Original):

```jsx
export const metadata = {
  title: 'React Hello World',
  description: 'A simple React.js hello world application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

---

## 2. HTML Response (What Browser Receives First)

### Complete HTML Response:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charSet="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  
  <!-- Preload scripts for performance -->
  <link rel="preload" as="script" href="/_next/static/chunks/...hmr-client...js"/>
  
  <!-- Next.js client bundles (loaded asynchronously) -->
  <script src="/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js" async></script>
  <script src="/_next/static/chunks/node_modules_next_dist_compiled_react-server-dom-turbopack_9212ccad._.js" async></script>
  <script src="/_next/static/chunks/node_modules_next_dist_client_aaee43fe._.js" async></script>
  <script src="/_next/static/chunks/node_modules_next_dist_094231d7._.js" async></script>
  <!-- ... more scripts ... -->
  
  <!-- Metadata from layout.jsx -->
  <title>React Hello World</title>
  <meta name="description" content="A simple React.js hello world application"/>
</head>
<body>
  <!-- SSR Content (from page.jsx) -->
  <div style="display:flex;justify-content:center;align-items:center;height:100vh;font-size:2rem;font-family:Arial, sans-serif">
    <h1>Hello World!</h1>
  </div>
  
  <!-- Next.js React Server Components Payload -->
  <script id="_R_">self.__next_r="oFZxzz4LQI92C7A5Y8kjW"</script>
  
  <!-- HMR Client -->
  <script src="/_next/static/chunks/[turbopack]_browser_dev_hmr-client_hmr-client_ts_bae88007._.js" async></script>
  
  <!-- React Server Components Payload (serialized component tree) -->
  <script>
    self.__next_f.push([1,"27:{\"name\":\"Home\",\"key\":null,\"env\":\"Server\",\"stack\":[],\"props\":{\"params\":\"$@28\",\"searchParams\":\"$@29\"}}\n26:[\"$\",\"div\",null,{\"style\":{\"display\":\"flex\",\"justifyContent\":\"center\",\"alignItems\":\"center\",\"height\":\"100vh\",\"fontSize\":\"2rem\",\"fontFamily\":\"Arial, sans-serif\"},\"children\":[\"$\",\"h1\",null,{\"children\":\"Hello World!\"},\"$27\",\"$2b\",1]},\"$27\",\"$2a\",1]\n..."])
  </script>
</body>
</html>
```

**Key Points:**
- ✅ SSR content is in the HTML (visible immediately)
- ✅ Styles are inlined (from your JSX)
- ✅ Metadata is in `<head>`
- ✅ Scripts load asynchronously

---

## 3. Server-Side Transformed Code

### What Next.js Transforms on Server:

**Your code:**
```jsx
export default function Home() {
  return (
    <div style={{ display: 'flex', ... }}>
      <h1>Hello World!</h1>
    </div>
  )
}
```

**Next.js transforms to (server-side):**
```javascript
// Simplified representation of what Next.js does internally
import { jsxDEV } from "react/jsx-dev-runtime";

export default function Home() {
  return jsxDEV("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "2rem",
      fontFamily: "Arial, sans-serif"
    },
    children: jsxDEV("h1", {
      children: "Hello World!"
    }, void 0, false, {
      fileName: "/home/sylaw/react.js/app/page.jsx",
      lineNumber: 11,
      columnNumber: 7
    }, this)
  }, void 0, false, {
    fileName: "/home/sylaw/react.js/app/page.jsx",
    lineNumber: 3,
    columnNumber: 5
  }, this);
}
```

**Then renders to HTML:**
```html
<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-size:2rem;font-family:Arial, sans-serif">
  <h1>Hello World!</h1>
</div>
```

---

## 4. Client-Side JavaScript Bundles

### Bundle Structure:

Next.js creates multiple bundles:

1. **React Runtime Bundle**
   - `node_modules_next_dist_compiled_react-dom_*.js`
   - Contains React DOM code

2. **Next.js Client Bundle**
   - `node_modules_next_dist_client_*.js`
   - Contains Next.js client-side code

3. **Your Page Component Bundle**
   - `_a0ff3932._.js` (or similar)
   - Contains your transformed page component

4. **HMR Client** (Development)
   - `[turbopack]_browser_dev_hmr-client_*.js`
   - Hot Module Replacement

### Your Page Component (Client Bundle):

**What gets bundled for client:**

```javascript
// Simplified - actual bundle is minified and optimized
(function() {
  'use strict';
  
  // Your component transformed
  function Home() {
    return React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '2rem',
        fontFamily: 'Arial, sans-serif'
      }
    }, React.createElement('h1', null, 'Hello World!'));
  }
  
  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Home;
  } else {
    window.Home = Home;
  }
})();
```

**Note:** In production, this is minified and optimized further.

---

## 5. React Server Components Payload

### Serialized Component Tree:

Next.js uses React Server Components, which sends a serialized representation:

```javascript
// Embedded in HTML as <script> tag
self.__next_f.push([1,"
  27:{\"name\":\"Home\",\"key\":null,\"env\":\"Server\",\"stack\":[],\"props\":{\"params\":\"$@28\",\"searchParams\":\"$@29\"}}
  26:[\"$\",\"div\",null,{\"style\":{\"display\":\"flex\",\"justifyContent\":\"center\",\"alignItems\":\"center\",\"height\":\"100vh\",\"fontSize\":\"2rem\",\"fontFamily\":\"Arial, sans-serif\"},\"children\":[\"$\",\"h1\",null,{\"children\":\"Hello World!\"},\"$27\",\"$2b\",1]},\"$27\",\"$2a\",1]
"])
```

This is a **serialized React component tree** that the client uses for hydration.

---

## 6. Transformation Comparison

### Source Code → Transformed Code:

```
YOUR CODE:                    NEXT.JS TRANSFORMS TO:
─────────────────            ────────────────────────

JSX:                          JavaScript:
<div>                        React.createElement('div', ...)
  <h1>Hello</h1>             React.createElement('h1', null, 'Hello')
</div>                       

OR (modern JSX runtime):
<div>                        jsxDEV('div', { children: ... })
  <h1>Hello</h1>             jsxDEV('h1', { children: 'Hello' })
</div>                       

Style Object:                Inline Style String:
style={{                     style="display:flex;
  display: 'flex'            justify-content:center;
}}                           align-items:center;..."

Component:                   Function:
export default function      function Home() {
  Home() { ... }               return React.createElement(...)
}                            }
```

---

## 7. What Gets Sent in Each Request

### Initial HTML Request:

```
GET http://localhost:3000/
  ↓
Response:
  • HTML with SSR content
  • Embedded React Server Components payload
  • Script tags for client bundles
```

### JavaScript Bundle Requests:

```
GET /_next/static/chunks/node_modules_next_dist_compiled_react-dom_*.js
  ↓
Response: React DOM library (transformed, optimized)

GET /_next/static/chunks/node_modules_next_dist_client_*.js
  ↓
Response: Next.js client runtime

GET /_next/static/chunks/_a0ff3932._.js
  ↓
Response: Your page component (transformed)
```

---

## 8. Development vs Production

### Development Mode:

**HTML:**
- Includes source maps references
- Unminified JavaScript
- HMR scripts
- Development error overlays

**JavaScript:**
- Readable (not minified)
- Source maps available
- Fast refresh code included

### Production Mode:

**HTML:**
- Minified
- Optimized
- No HMR
- Smaller bundle sizes

**JavaScript:**
- Minified and optimized
- Tree-shaken (removed unused code)
- Code splitting
- Smaller file sizes

---

## 9. Actual HTML Breakdown

### What You See in Browser (View Source):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Metadata -->
  <title>React Hello World</title>
  <meta name="description" content="A simple React.js hello world application"/>
  
  <!-- Scripts (loaded async) -->
  <script src="/_next/static/chunks/node_modules_next_dist_compiled_react-dom_1e674e59._.js" async></script>
  <!-- ... more scripts ... -->
</head>
<body>
  <!-- SSR Content (visible immediately) -->
  <div style="display:flex;justify-content:center;align-items:center;height:100vh;font-size:2rem;font-family:Arial, sans-serif">
    <h1>Hello World!</h1>
  </div>
  
  <!-- React Server Components Payload -->
  <script id="_R_">self.__next_r="..."</script>
  <script>self.__next_f.push([...])</script>
  
  <!-- Client bundles -->
  <script src="/_next/static/chunks/...hmr-client...js" async></script>
</body>
</html>
```

---

## 10. Key Transformations

### 1. JSX → JavaScript

**Source:**
```jsx
<div><h1>Hello</h1></div>
```

**Transformed:**
```javascript
jsxDEV('div', {
  children: jsxDEV('h1', { children: 'Hello' }, ...)
}, ...)
```

### 2. Style Object → Inline CSS

**Source:**
```jsx
style={{ display: 'flex', justifyContent: 'center' }}
```

**Transformed (in HTML):**
```html
style="display:flex;justify-content:center;..."
```

### 3. Component → Function

**Source:**
```jsx
export default function Home() { ... }
```

**Transformed:**
```javascript
function Home() { ... }
// Exported via module system
```

---

## 11. Bundle Analysis

### What's in Each Bundle:

**React Bundle:**
- React core library
- React DOM
- React hooks
- React Server Components runtime

**Next.js Bundle:**
- Next.js router
- Client-side navigation
- Page rendering
- Error boundaries

**Your Component Bundle:**
- Your page component
- Dependencies (if any)
- Transformed JSX

**HMR Bundle (Dev only):**
- Hot Module Replacement
- Fast refresh
- Development tools

---

## 12. Summary

### What Gets Sent:

1. **HTML Response:**
   - SSR content (your "Hello World!")
   - Metadata
   - Script tags

2. **JavaScript Bundles:**
   - React runtime
   - Next.js client
   - Your component (transformed)
   - HMR (development)

3. **React Server Components Payload:**
   - Serialized component tree
   - Used for hydration

### Key Points:

- ✅ JSX is transformed to JavaScript
- ✅ Styles are inlined in HTML
- ✅ Components are bundled and optimized
- ✅ Code is split for performance
- ✅ Everything is transformed before sending

The browser receives **optimized, transformed code** ready to execute!



