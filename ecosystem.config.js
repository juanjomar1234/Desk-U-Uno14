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
        NEXTAUTH_URL: 'https://colaboradores.uno14.trading',
        NEXTAUTH_SECRET: 'hPcKZHLZF9nKhXw6NxZ3TqNJWqB9Yj+5Sh8Ur1h7Qw8=',
        JWT_SECRET: 'kM5BwNmX9pLzRv2qYj4tHc7gFdA3Vn8sKe1Uu6hJ0w=',
        NEXT_PUBLIC_API_URL: 'https://colaboradores.uno14.trading/api',
        LOG_LEVEL: 'info'
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