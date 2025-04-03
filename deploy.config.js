module.exports = {
  apps: [
    {
      name: 'gateway-service',
      script: './gateway-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'user-service',
      script: './user-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'message-service',
      script: './message-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    },
    {
      name: 'file-service',
      script: './file-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      }
    },
    {
      name: 'task-service',
      script: './task-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3007
      }
    },
    {
      name: 'schedule-service',
      script: './schedule-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3008
      }
    },
    {
      name: 'billing-service',
      script: './billing-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3009
      }
    },
    {
      name: 'mcp-service',
      script: './mcp-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3010
      }
    },
    {
      name: 'contacts-service',
      script: './contacts-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3011
      }
    },
    {
      name: 'boards-service',
      script: './boards-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3012
      }
    },
    {
      name: 'lists-service',
      script: './lists-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3013
      }
    },
    {
      name: 'cards-service',
      script: './cards-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3014
      }
    },
    {
      name: 'collaboration-service',
      script: './collaboration-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3015
      }
    },
    {
      name: 'branding-service',
      script: './branding-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3016
      }
    },
    {
      name: 'automation-service',
      script: './automation-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3017
      }
    },
    {
      name: 'crm-service',
      script: './crm-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3018
      }
    },
    {
      name: 'dependencies-service',
      script: './dependencies-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3019
      }
    },
    {
      name: 'timeline-service',
      script: './timeline-service/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3020
      }
    },
    {
      name: 'frontend-service',
      cwd: './frontend-service',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3030
      }
    }
  ]
};
