const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')
require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.production')
})

const dev = false // Forzar modo producción
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    console.log(`📥 Request to: ${parsedUrl.pathname}`)
    handle(req, res, parsedUrl)
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`)
  })
})