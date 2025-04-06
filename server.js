const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = false
const hostname = '0.0.0.0'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

      const parsedUrl = parse(req.url, true)
      console.log(`📥 [${new Date().toISOString()}] ${req.method} ${parsedUrl.pathname}`)

      if (req.method === 'OPTIONS') {
        res.writeHead(200)
        res.end()
        return
      }

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('❌ Error:', err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })
  .once('error', (err) => {
    console.error('🔥 Server error:', err)
    process.exit(1)
  })
  .listen(port, hostname, () => {
    console.log(`🚀 Server running at http://${hostname}:${port}`)
  })
})