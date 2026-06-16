import { createClient, type Client } from '@libsql/client'
import { mkdirSync } from 'fs'
import { join } from 'path'

let _client: Client | null = null
let _initialized = false

function getClient(): Client {
  if (_client) return _client
  const dir = join(process.cwd(), '.data')
  mkdirSync(dir, { recursive: true })
  const brand = process.env.NUXT_PUBLIC_APP_BRAND || 'smmbuzzer'
  _client = createClient({ url: `file:${join(dir, `${brand}.db`)}` })
  return _client
}

async function ensureTable() {
  if (_initialized) return
  await getClient().execute(`
    CREATE TABLE IF NOT EXISTS cache (
      key           TEXT    PRIMARY KEY,
      data          TEXT    NOT NULL,
      fetched_at    INTEGER NOT NULL,
      record_count  INTEGER NOT NULL DEFAULT 0
    )
  `)
  _initialized = true
}

export async function readCache<T>(key: string): Promise<{ data: T; fetchedAt: string; count: number } | null> {
  await ensureTable()
  const result = await getClient().execute({
    sql: 'SELECT data, fetched_at, record_count FROM cache WHERE key = ?',
    args: [key],
  })
  if (!result.rows.length) return null
  const row = result.rows[0]
  return {
    data: JSON.parse(row.data as string) as T,
    fetchedAt: new Date(Number(row.fetched_at)).toISOString(),
    count: Number(row.record_count),
  }
}

export async function writeCache(key: string, data: unknown): Promise<void> {
  await ensureTable()
  const count = Array.isArray(data) ? data.length : 0
  await getClient().execute({
    sql: 'INSERT OR REPLACE INTO cache (key, data, fetched_at, record_count) VALUES (?, ?, ?, ?)',
    args: [key, JSON.stringify(data), Date.now(), count],
  })
}
