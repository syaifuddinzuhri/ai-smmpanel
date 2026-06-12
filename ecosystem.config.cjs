module.exports = {
  apps: [
    {
      name: 'smm-panel-ai',
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      node_args: '--env-file=.env',
      env: {
        NODE_ENV: 'production',
        PORT: 4731,
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
