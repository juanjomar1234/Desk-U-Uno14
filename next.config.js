const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    return config;
  },
  // Configuración para el entorno de producción
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  },
  // Configuración para rutas dinámicas
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://127.0.0.1:3000/:path*',
      }
    ];
  },
  poweredByHeader: false,
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ]
  },
  compress: true,
  generateEtags: true,
  distDir: '.next',
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ],
      }
    ];
  }
};

module.exports = nextConfig;