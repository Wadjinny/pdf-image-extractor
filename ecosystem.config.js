module.exports = {
    apps: [{
      name: 'backend',
      cwd: './backend',
      script: './backend/run_backend.sh',
      args: 'prod',
      interpreter: '/bin/bash',
      env_production: {
        NODE_ENV: 'production',
        PYTHONUNBUFFERED: '1'
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      combine_logs: true,
      time: true,
      autorestart: true
    }]
  }