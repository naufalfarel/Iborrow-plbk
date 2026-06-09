import type { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'

// Extend Express types
declare global {
  namespace Express {
    interface Request {
      inertia: {
        render: (component: string, props?: Record<string, any>) => void
      }
      user?: {
        id: number
        fullName: string
        email: string
        role: string
        nimNip: string | null
        isActive: boolean
      }
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: number
    flash?: { success?: string; error?: string }
  }
}

let viteDevServer: any = null

export function setViteDevServer(server: any) {
  viteDevServer = server
}

function getFlash(req: Request) {
  const flash = req.session.flash || {}
  req.session.flash = {}
  return {
    success: flash.success || null,
    error: flash.error || null,
  }
}

function flashMessage(req: Request, type: 'success' | 'error', message: string) {
  if (!req.session.flash) req.session.flash = {}
  req.session.flash[type] = message
}

export { flashMessage }

export function inertiaMiddleware(req: Request, res: Response, next: NextFunction) {
  const sharedProps = () => ({
    user: req.user
      ? {
          id: req.user.id,
          fullName: req.user.fullName,
          email: req.user.email,
          role: req.user.role,
          nimNip: req.user.nimNip,
        }
      : null,
    flash: getFlash(req),
  })

  req.inertia = {
    render: (component: string, props: Record<string, any> = {}) => {
      const pageData = {
        component,
        props: { ...sharedProps(), ...props },
        url: req.originalUrl,
        version: '1',
      }

      // If it's an Inertia request, return JSON
      if (req.headers['x-inertia']) {
        res.setHeader('X-Inertia', 'true')
        res.setHeader('Vary', 'X-Inertia')
        return res.json(pageData)
      }

      // Otherwise, return full HTML page
      const pageDataJson = JSON.stringify(pageData)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026')
        .replace(/'/g, '\\u0027')

      if (viteDevServer) {
        // Development: inject Vite client + entry point
        const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IBorrow</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
  <script type="module">
    import RefreshRuntime from "/@react-refresh"
    RefreshRuntime.injectIntoGlobalHook(window)
    window.$RefreshReg$ = () => {}
    window.$RefreshSig$ = () => (type) => type
    window.__vite_plugin_react_preamble_installed__ = true
  </script>
</head>
<body>
  <div id="app" data-page='${pageDataJson}'></div>
  <script type="module" src="/@vite/client"></script>
  <script type="module" src="/inertia/app/app.tsx"></script>
</body>
</html>`
        return res.type('html').send(html)
      } else {
        // Production: read manifest and serve built assets
        const distPath = path.join(process.cwd(), 'dist', 'client')
        const manifestPath = path.join(distPath, '.vite', 'manifest.json')

        let cssTag = ''
        let jsTag = ''

        if (fs.existsSync(manifestPath)) {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
          const entry = manifest['inertia/app/app.tsx']
          if (entry) {
            jsTag = `<script type="module" src="/assets/${entry.file}"></script>`
            if (entry.css) {
              cssTag = entry.css
                .map((cssFile: string) => `<link rel="stylesheet" href="/assets/${cssFile}" />`)
                .join('\n  ')
            }
          }
        }

        const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IBorrow</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
  ${cssTag}
</head>
<body>
  <div id="app" data-page='${pageDataJson}'></div>
  ${jsTag}
</body>
</html>`
        return res.type('html').send(html)
      }
    },
  }

  next()
}
