module.exports = {
  apps: [
    {
      name: 'smm-panel-ai',
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4731,
        NUXT_API_BASE_URL: '',
        NUXT_API_KEY: '',
        ANTHROPIC_API_KEY: '',
      },
      // Auto-restart jika crash
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      // Log
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
