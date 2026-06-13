import { readCache, writeCache } from '../utils/db'

export interface RawService {
  service: number
  name: string
  type: string
  category: string
  rate: string
  min: string
  max: string
  refill: boolean
  cancel: boolean
}

function log(level: 'INFO' | 'WARN' | 'ERROR', msg: string, extra?: Record<string, unknown>) {
  const prefix = `[${new Date().toISOString()}] [services] [${level}]`
  const fn = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : console.log
  extra ? fn(prefix, msg, JSON.stringify(extra)) : fn(prefix, msg)
}

export async function fetchServicesFromApi(): Promise<{ list: RawService[]; updatedAt: string }> {
  const config = useRuntimeConfig()
  const apiUrl = `${config.apiBaseUrl}/api/v2`
  log('INFO', `Fetch services dari ${apiUrl}`)

  const res = await $fetch<RawService[]>(apiUrl, {
    method: 'POST',
    body: new URLSearchParams({ key: String(config.apiV2Key), action: 'services' }).toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 15000,
  })

  if (!Array.isArray(res)) throw new Error('Invalid services response format')

  const updatedAt = new Date().toISOString()
  log('INFO', 'Fetch services selesai', { total: res.length })
  await writeCache('services', res)
  return { list: res, updatedAt }
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  if (!config.apiV2Key) {
    const cached = await readCache<RawService[]>('services')
    return {
      data: cached?.data ?? [],
      updatedAt: cached?.fetchedAt ?? null,
      fromCache: true,
      total: cached?.count ?? 0,
      error: 'V2 API key tidak dikonfigurasi',
    }
  }

  // Serve dari SQLite jika sudah ada data
  const cached = await readCache<RawService[]>('services')
  if (cached) {
    log('INFO', `Serve dari SQLite`, { total: cached.count, fetchedAt: cached.fetchedAt })
    return { data: cached.data, updatedAt: cached.fetchedAt, fromCache: true, total: cached.count }
  }

  // Bootstrap: DB kosong, fetch sekali
  log('INFO', 'DB kosong — bootstrap fetch pertama')
  try {
    const { list, updatedAt } = await fetchServicesFromApi()
    return { data: list, updatedAt, fromCache: false, total: list.length }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    log('ERROR', 'Bootstrap fetch gagal', { message: msg })
    return { data: [], updatedAt: null, fromCache: false, total: 0, error: msg }
  }
})
