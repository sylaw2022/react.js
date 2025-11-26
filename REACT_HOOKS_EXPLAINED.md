# React Hooks Explained

## What is a Hook?

**Hooks are special functions that let you "hook into" React features from function components.**

Before hooks, you could only use React features (like state, lifecycle methods) in class components. Hooks allow you to use these features in function components.

---

## Why Hooks?

### Before Hooks (Class Components):

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }

  componentDidMount() {
    document.title = `Count: ${this.state.count}`
  }

  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    )
  }
}
```

### With Hooks (Function Components):

```javascript
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `Count: ${count}`
  }, [count])

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

**Much simpler!** ✅

---

## Rules of Hooks

### 1. Only Call Hooks at the Top Level
❌ **Don't call hooks inside:**
- Loops
- Conditions
- Nested functions

✅ **Always call hooks at the top level:**

```javascript
function Component() {
  // ✅ Good - top level
  const [count, setCount] = useState(0)
  
  // ❌ Bad - inside condition
  if (count > 0) {
    const [name, setName] = useState('') // ERROR!
  }
  
  // ✅ Good - top level
  useEffect(() => {
    // ...
  }, [])
  
  return <div>{count}</div>
}
```

### 2. Only Call Hooks from React Functions
✅ Call hooks from:
- Function components
- Custom hooks

❌ Don't call hooks from:
- Regular JavaScript functions
- Class components
- Event handlers

---

## Common Built-in Hooks

### 1. useState - State Management

**Purpose:** Add state to function components

**Syntax:**
```javascript
const [state, setState] = useState(initialValue)
```

**Example:**
```javascript
function Counter() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('John')

  return (
    <div>
      <p>Count: {count}</p>
      <p>Name: {name}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setName('Jane')}>Change Name</button>
    </div>
  )
}
```

**What it returns:**
- `[0]` - Current state value
- `[1]` - Function to update state

---

### 2. useEffect - Side Effects

**Purpose:** Handle side effects (API calls, subscriptions, DOM updates)

**Syntax:**
```javascript
useEffect(() => {
  // Side effect code
}, [dependencies])
```

**Example:**
```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // This runs after component mounts
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
  }, [userId]) // Re-run if userId changes

  if (!user) return <div>Loading...</div>
  
  return <div>{user.name}</div>
}
```

**Common use cases:**
- Fetching data
- Setting up subscriptions
- Updating document title
- Cleaning up resources

---

### 3. useContext - Context API

**Purpose:** Access React Context values

**Syntax:**
```javascript
const value = useContext(MyContext)
```

**Example:**
```javascript
// Create context
const ThemeContext = createContext('light')

// Provide context
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  )
}

// Use context
function ThemedButton() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>Themed Button</button>
}
```

---

### 4. useRef - References

**Purpose:** Access DOM elements or store mutable values

**Syntax:**
```javascript
const ref = useRef(initialValue)
```

**Example:**
```javascript
function TextInput() {
  const inputRef = useRef(null)

  const focusInput = () => {
    inputRef.current.focus()
  }

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  )
}
```

---

### 5. useMemo - Memoization

**Purpose:** Memoize expensive calculations

**Syntax:**
```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
```

**Example:**
```javascript
function ExpensiveComponent({ items, filter }) {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category === filter)
  }, [items, filter]) // Only recalculate if items or filter change

  return <div>{filteredItems.map(item => <div key={item.id}>{item.name}</div>)}</div>
}
```

---

### 6. useCallback - Memoize Functions

**Purpose:** Memoize callback functions

**Syntax:**
```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

**Example:**
```javascript
function Parent({ items }) {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    console.log('Clicked!', items)
  }, [items]) // Only recreate if items change

  return <Child onClick={handleClick} />
}
```

---

## Custom Hooks

**You can create your own hooks!**

**Purpose:** Reuse stateful logic between components

**Example:**
```javascript
// Custom hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(initialValue)

  return { count, increment, decrement, reset }
}

// Use custom hook
function Counter() {
  const { count, increment, decrement, reset } = useCounter(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

**Custom hook naming:** Always start with `use` (e.g., `useCounter`, `useFetch`, `useLocalStorage`)

---

## Complete Example: Using Multiple Hooks

```javascript
function UserDashboard({ userId }) {
  // useState - manage state
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // useRef - reference to input
  const inputRef = useRef(null)

  // useEffect - fetch data
  useEffect(() => {
    setLoading(true)
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [userId])

  // useEffect - focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>No user found</div>

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <input ref={inputRef} placeholder="Search..." />
    </div>
  )
}
```

---

## Hook Flow in Your Component

```javascript
function MyComponent() {
  // 1. useState - Initialize state
  const [count, setCount] = useState(0)
  
  // 2. useRef - Create refs
  const inputRef = useRef(null)
  
  // 3. useEffect - Side effects
  useEffect(() => {
    console.log('Component mounted or count changed')
  }, [count])
  
  // 4. Event handlers
  const handleClick = () => {
    setCount(count + 1)
  }
  
  // 5. Render
  return (
    <div>
      <p>{count}</p>
      <button onClick={handleClick}>Click</button>
    </div>
  )
}
```

---

## Common Hook Patterns

### Pattern 1: Fetching Data

```javascript
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [url])

  return { data, loading, error }
}

// Usage
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(`/api/users/${userId}`)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{data.name}</div>
}
```

### Pattern 2: Local Storage

```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  )
}
```

---

## Hook Dependencies Explained

### useEffect Dependencies

```javascript
// No dependencies - runs once on mount
useEffect(() => {
  console.log('Runs once')
}, [])

// With dependencies - runs when dependencies change
useEffect(() => {
  console.log('Runs when count changes')
}, [count])

// Missing dependency - runs on every render (usually wrong!)
useEffect(() => {
  console.log('Runs every render')
}) // No dependency array
```

---

## Common Mistakes

### ❌ Mistake 1: Calling Hooks Conditionally

```javascript
function Component() {
  if (someCondition) {
    const [count, setCount] = useState(0) // ERROR!
  }
  return <div>...</div>
}
```

### ✅ Correct: Always at Top Level

```javascript
function Component() {
  const [count, setCount] = useState(0) // ✅
  
  if (someCondition) {
    // Use count here
  }
  return <div>...</div>
}
```

### ❌ Mistake 2: Missing Dependencies

```javascript
useEffect(() => {
  fetchData(userId) // Uses userId but not in dependencies
}, []) // Missing userId!
```

### ✅ Correct: Include All Dependencies

```javascript
useEffect(() => {
  fetchData(userId)
}, [userId]) // ✅ Includes userId
```

---

## Summary

### What are Hooks?
- Special functions that let you use React features in function components
- Always start with `use` (useState, useEffect, etc.)

### Why Hooks?
- Simpler code than class components
- Reusable logic with custom hooks
- Better composition

### Key Hooks:
1. **useState** - Manage state
2. **useEffect** - Handle side effects
3. **useContext** - Access context
4. **useRef** - Reference DOM/elements
5. **useMemo** - Memoize values
6. **useCallback** - Memoize functions

### Rules:
1. Only call hooks at top level
2. Only call hooks from React functions
3. Always include dependencies in useEffect

---

## In Your Next.js Project

Your current `app/page.jsx` doesn't use hooks yet, but you can add them:

```javascript
'use client' // Needed for hooks in Next.js App Router

import { useState, useEffect } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `Count: ${count}`
  }, [count])

  return (
    <div style={{ ... }}>
      <h1>Hello World!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

**Note:** In Next.js App Router, components are server components by default. Add `'use client'` at the top to use hooks!


