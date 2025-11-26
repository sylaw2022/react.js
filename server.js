import express from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { renderToString } from 'react-dom/server'
import React from 'react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const isProduction = process.env.NODE_ENV === 'production'

async function createServer() {
  const app = express()
  let vite

  if (!isProduction) {
    // In development, create Vite server for SSR
    const { createServer: createViteServer } = await import('vite')
    const { fileURLToPath } = await import('url')
    const { dirname, join } = await import('path')
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: __dirname,
      // Ensure config is loaded
      configFile: join(__dirname, 'vite.config.js'),
    })
    // Use Vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    // In production, serve static files from dist
    app.use(express.static(join(__dirname, 'dist')))
  }

  // Catch-all route for SSR (Express 5 compatible)
  app.use(async (req, res, next) => {
    // Skip if it's a static asset request (handled by Vite middleware)
    if (req.path.startsWith('/src/') || req.path.startsWith('/node_modules/') || req.path.includes('.')) {
      return next()
    }

    try {
      let html
      let appHtml

      if (isProduction) {
        // Read the built HTML file
        html = readFileSync(join(__dirname, 'dist/index.html'), 'utf-8')
        // In production, import the built App
        const appPath = join(__dirname, 'dist', 'server', 'App.js')
        const { default: App } = await import(appPath)
        appHtml = renderToString(React.createElement(App))
      } else {
        // In development, use Vite's HTML transform and load module
        html = readFileSync(join(__dirname, 'index.html'), 'utf-8')
        html = await vite.transformIndexHtml(req.url, html)
        
        // Load the App component through Vite's SSR
        const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
        appHtml = renderToString(React.createElement(App))
      }

      // Inject the server-rendered HTML into the template
      html = html.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`
      )

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (error) {
      console.error(error)
      res.status(500).end(error.message)
    }
  })

  return app
}

// Export createServer for testing
export { createServer }

// Start the server only if not in test environment
if (!process.env.VITEST && !process.env.NODE_ENV?.includes('test')) {
  createServer().then(app => {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
      console.log(`SSR enabled - React is rendered on the server!`)
    })
  })
}

