const path = require('path')
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const logger = require('./src/lib/logger').default

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl
    
    // Log para debug
    logger.info('Server request', { 
      path: pathname,
      method: req.method
    })

    // Permitir acceso directo a /logs
    if (pathname === '/logs' || pathname.startsWith('/api/logs')) {
      logger.info('Acceso a logs', { path: pathname })
      handle(req, res, parsedUrl)
      return
    }
    
    // Redirigir / a /login
    if (pathname === '/') {
      res.writeHead(302, { Location: '/login' })
      res.end()
      return
    }

    handle(req, res, parsedUrl)
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err
    logger.info('Server started', {
      port: process.env.PORT || 3000,
      env: process.env.NODE_ENV
    })
  })
})