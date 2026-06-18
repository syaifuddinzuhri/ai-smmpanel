type Currency = 'IDR' | 'USD'

export const useCurrency = () => {
  const { public: cfg } = useRuntimeConfig()
  const currency = cfg.currency as Currency

  const formatPrice = (price: number): string => {
    if (currency === 'USD') {
      return '$' + price.toFixed(3)
    }
    return 'Rp ' + price.toLocaleString('id-ID')
  }

  const currencySymbol = currency === 'USD' ? '$' : 'Rp'

  return { currency, formatPrice, currencySymbol }
}
