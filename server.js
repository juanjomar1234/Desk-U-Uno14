const path = require('path')
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    
    // Log para debug
    console.log(`Request to: ${parsedUrl.pathname}`)
    
    // Redirigir / a /login
    if (parsedUrl.pathname === '/') {
      res.writeHead(302, { Location: '/login' })
      res.end()
      return
    }

    handle(req, res, parsedUrl)
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`)
  })
})