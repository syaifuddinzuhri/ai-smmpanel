const STORAGE_KEY = 'smm_watchlist'

export const useWatchlist = () => {
  const ids = useState<number[]>('watchlist', () => [])

  const init = () => {
    if (!import.meta.client) return
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) ids.value = JSON.parse(saved)
    } catch {}
  }

  const save = () => {
    if (!import.meta.client) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value))
  }

  const toggle = (id: number) => {
    const set = new Set(ids.value)
    set.has(id) ? set.delete(id) : set.add(id)
    ids.value = [...set]
    save()
  }

  const isWatched = (id: number) => ids.value.includes(id)

  const count = computed(() => ids.value.length)

  onMounted(init)

  return { ids, toggle, isWatched, count }
}
