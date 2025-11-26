import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Use hydrateRoot for SSR - this will hydrate the server-rendered HTML
ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


