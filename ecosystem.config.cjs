const fs = require('fs')
const path = require('path')

function loadEnv(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const env = {}
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx).trim()
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
      env[key] = val
    }
    return env
  } catch {
    console.warn('[ecosystem] .env file tidak ditemukan:', filePath)
    return {}
  }
}

const env = loadEnv(path.join(__dirname, '.env'))

module.exports = {
  apps: [
    {
      name: env.PM2_APP_NAME || 'smm-panel-ai',
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        ...env,
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
