module.exports = {
  apps: [{
    name: 'ibiza-ru-frontend',
    script: 'npm',
    args: 'run preview',
    cwd: '/home/nodejs/ibiza-ru-frontend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      HOST: '0.0.0.0',
      PORT: 3000
    },
    error_file: '/home/nodejs/logs/ibiza-ru-frontend-error.log',
    out_file: '/home/nodejs/logs/ibiza-ru-frontend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
