const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Verificar variables de entorno al inicio
function checkEnvVariables() {
  console.log('🔍 Checking environment...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
}

checkEnvVariables();

const dev = false
const hostname = '127.0.0.1'
const port = parseInt(process.env.PORT || '3000', 10)

console.log('📝 Starting server with config:', { dev, hostname, port });

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  process.exit(1);
});

app.prepare()
  .then(() => {
    console.log('✅ Next.js app prepared');
    
    const server = createServer(async (req, res) => {
      try {
        // Log every request with more details
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const referer = req.headers['referer'];
        
        console.log('📥 Request details:', {
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.url,
          ip,
          userAgent,
          referer,
          headers: req.headers
        });

        // Add CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Handle preflight
        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        // Manejar la redirección de la raíz explícitamente
        if (req.url === '/') {
          res.writeHead(302, { Location: '/login' });
          res.end();
          return;
        }

        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('❌ Request error:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.listen(port, hostname, () => {
      console.log(`🚀 Server running at http://${hostname}:${port}`);
      console.log('Server listening on all interfaces');
      console.log('Try accessing:');
      console.log(` - http://localhost:${port}`);
      console.log(` - http://147.93.54.226:${port}`);
      console.log(` - https://colaboradores.uno14.trading`);
    });

    server.on('error', (err) => {
      console.error('🔥 Server error:', err);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('💥 Failed to prepare Next.js app:', err);
    process.exit(1);
  });