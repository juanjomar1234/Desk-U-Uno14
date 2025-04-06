module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://colaboradores.uno14.trading/api'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      time: true,
      node_args: '--max-old-space-size=2048'
    }
  ]
} 