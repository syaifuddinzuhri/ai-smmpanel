type Currency = 'IDR' | 'USD'

const FALLBACK_KURS = 17_500

export const useCurrency = () => {
  const { public: cfg } = useRuntimeConfig()
  const configCurrency = cfg.currency as Currency

  const currency = useState<Currency>('currency', () => configCurrency)
  const kurs     = useState<number>('kurs', () => FALLBACK_KURS)

  async function init() {
    if (!import.meta.client) return

    // Restore saved currency preference
    const saved = localStorage.getItem('currency') as Currency | null
    currency.value = (saved === 'IDR' || saved === 'USD') ? saved : configCurrency

    // Fetch live exchange rate (only if not already fetched this session)
    if (kurs.value === FALLBACK_KURS) {
      try {
        const res = await $fetch<{ rate: number }>('/api/kurs')
        if (res.rate) kurs.value = res.rate
      } catch {
        // keep fallback
      }
    }
  }

  async function setCurrency(c: Currency) {
    currency.value = c
    if (import.meta.client) localStorage.setItem('currency', c)

    if (c === 'USD') {
      try {
        const res = await $fetch<{ rate: number }>('/api/kurs')
        if (res.rate) kurs.value = res.rate
      } catch {
        // keep current kurs
      }
    }
  }

  const currencySymbol = computed(() => currency.value === 'USD' ? '$' : 'Rp')

  // formatPrice reads reactive kurs.value and currency.value —
  // Vue tracks these as dependencies when called inside templates or computed
  function formatPrice(price: number): string {
    const selected = currency.value
    const rate     = kurs.value

    if (selected === configCurrency) {
      if (selected === 'USD') return '$' + price.toFixed(4)
      return 'Rp ' + price.toLocaleString('id-ID')
    }

    // Brand IDR → user wants USD: price is IDR per 100 → USD per 100
    if (configCurrency === 'IDR' && selected === 'USD') {
      return '$' + (price / rate).toFixed(4)
    }

    // Brand USD → user wants IDR: price is USD per 100 → IDR per 100
    if (configCurrency === 'USD' && selected === 'IDR') {
      return 'Rp ' + Math.round(price * rate).toLocaleString('id-ID')
    }

    // fallback
    if (selected === 'USD') return '$' + price.toFixed(4)
    return 'Rp ' + price.toLocaleString('id-ID')
  }

  return { currency, configCurrency, kurs, currencySymbol, formatPrice, setCurrency, init }
}
