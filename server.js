const path = require('path')
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const logger = require('./src/lib/logger').default
const { middleware } = require('./src/middleware')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl
    
    // Log para debug
    logger.info('Server request', { 
      path: pathname,
      method: req.method
    })

    try {
      // Convertir req a NextRequest para el middleware
      const request = new Request(req.url, {
        method: req.method,
        headers: new Headers(req.headers)
      })

      // Ejecutar middleware
      const response = await middleware(request)
      
      // Si el middleware redirecciona o responde, respetar esa respuesta
      if (response) {
        res.writeHead(response.status, response.headers)
        res.end(response.body)
        return
      }

      // Continuar con el manejo normal si el middleware permite
      if (pathname === '/') {
        res.writeHead(302, { Location: '/login' })
        res.end()
        return
      }

      handle(req, res, parsedUrl)
    } catch (error) {
      logger.error('Error en servidor:', error)
      res.writeHead(500)
      res.end('Internal Server Error')
    }
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err
    logger.info('Server started', {
      port: process.env.PORT || 3000,
      env: process.env.NODE_ENV
    })
  })
})