const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = false
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl
    
    console.log(`📥 Request to: ${pathname}`)

    // Permitir todas las rutas de la API
    if (pathname.startsWith('/api/')) {
      console.log('👉 API request:', pathname)
      handle(req, res, parsedUrl)
      return
    }

    // Para el resto de rutas, usar Next.js
    console.log('👉 Next.js handling:', pathname)
    handle(req, res, parsedUrl)

  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`)
  })
})