type Lang = 'id' | 'en'

const dict: Record<Lang, Record<string, string>> = {
  id: {
    // Header
    'header.lastUpdate': 'Update terakhir',
    'header.updating': 'Updating',
    'header.live': 'Live',
    'header.error': 'Error',
    'header.cached': 'Cached',
    'header.resync': 'Sinkron Ulang',
    'header.analytics': 'Analitik Layanan',
    'header.searchPlatform': 'Cari platform...',
    'header.lightMode': 'Mode terang',
    'header.darkMode': 'Mode gelap',
    'header.switchLang': 'Switch to English',

    // Platform labels
    'platform.all': 'Semua',
    'platform.others': 'Lain-lain',

    // Stat Cards
    'stat.totalServices': 'Total Layanan',
    'stat.avgScore': 'Rata-rata AI Score',
    'stat.avgSuccess': 'Avg. Success Rate',
    'stat.totalOrders': 'Total Order',
    'stat.trending': '{n} sedang trending',
    'stat.stable': 'Performa stabil',
    'stat.aboveAvg': 'Di atas rata-rata',
    'stat.risky': '{n} berisiko',
    'stat.allSafe': 'Semua aman',

    // Service Table
    'table.title': 'Rekomendasi Layanan',
    'table.count': '{n} layanan',
    'table.sort': 'Urutkan:',
    'table.loading': 'Mengambil data dari {name}...',
    'table.loadingFetching': 'Fetching services & order statistics',
    'table.loadingHint1': 'Proses ini memakan waktu 10–30 detik pada permintaan pertama.',
    'table.loadingHint2': 'Permintaan berikutnya akan langsung tampil (cached ✓)',
    'table.empty': 'Tidak ada layanan yang cocok dengan pencarian',
    'table.colService': 'Layanan',
    'table.colPrice': 'Harga / 100',
    'table.colAction': 'Aksi',

    // Speed values (from API data)
    'speed.veryFast': 'Sangat Cepat',
    'speed.fast': 'Cepat',
    'speed.medium': 'Sedang',
    'speed.slow': 'Lambat',

    // Buttons
    'btn.buy': 'Beli',
    'btn.detail': 'Detail',
    'btn.close': 'Tutup',
    'btn.back': 'Kembali',

    // Sort options (Service Table)
    'sort.score': 'Urut: AI Score',
    'sort.success': 'Urut: Success Rate',
    'sort.orders': 'Urut: Order Count',
    'sort.trending': 'Urut: Trending',
    'sort.cancel': 'Urut: Cancel Rate ↑',

    // Monitor
    'monitor.totalServices': 'Total Layanan',
    'monitor.categories': 'Kategori',
    'monitor.refillSupport': 'Support Refill',
    'monitor.cancelSupport': 'Support Cancel',
    'monitor.fromCatalog': 'Dari katalog aktif',
    'monitor.uniqueTypes': 'Jenis layanan unik',
    'monitor.ofTotal': '{pct}% dari total',
    'monitor.favorites': 'Favorit',
    'monitor.healthy': 'Sehat',
    'monitor.reset': 'Reset',
    'monitor.noServices': 'Tidak ada layanan ditemukan',
    'monitor.catalogEmpty': 'Katalog layanan belum tersedia',
    'monitor.changeFilter': 'Coba ubah filter atau kata kunci',
    'monitor.colService': 'Layanan',
    'monitor.colPrice': 'Harga / 100',
    'monitor.colMinOrder': 'Min Order',
    'monitor.colMaxOrder': 'Max Order',
    'monitor.colOrders': 'Orders',
    'monitor.colCondition': 'Kondisi',
    'monitor.colFeature': 'Fitur',
    'monitor.colAction': 'Aksi',
    'monitor.per100': 'per 100',
    'monitor.minimum': 'minimum',
    'monitor.maximum': 'maksimum',
    'monitor.transactions': 'transaksi',
    'monitor.condHealthy': 'Sehat',
    'monitor.condWarning': 'Perhatian',
    'monitor.services': 'layanan',
    'monitor.compareTitle': 'Tambah ke komparasi (maks. 3)',
    'monitor.sortDefault': 'Urutan Default',
    'monitor.sortNameAsc': 'Nama A → Z',
    'monitor.sortNameDesc': 'Nama Z → A',
    'monitor.sortPriceAsc': 'Harga Termurah',
    'monitor.sortPriceDesc': 'Harga Termahal',
    'monitor.sortMinAsc': 'Min Order ↑',
    'monitor.sortMinDesc': 'Min Order ↓',
    'monitor.sortMaxAsc': 'Max Order ↑',
    'monitor.sortMaxDesc': 'Max Order ↓',
    'monitor.sortOrdersDesc': 'Order ↓',
    'monitor.sortOrdersAsc': 'Order ↑',
    'monitor.paginationOf': '{from}–{to} dari {total} layanan',

    // Comparison Modal
    'modal.title': 'Komparasi Layanan',
    'modal.metric': 'Metrik',
    'modal.yes': 'Ya',
    'modal.no': 'Tidak',
    'modal.best': 'Terbaik',
    'modal.noData': '— Belum ada data',
    'modal.healthy': 'Sehat',
    'modal.attention': 'Perlu Perhatian',
    'modal.popular': 'Terlaris',
    'modal.orders': 'order',
    'modal.hint': 'Nilai <span class="text-emerald-600 dark:text-emerald-400 font-semibold mx-0.5">terbaik</span> disorot hijau · Sehat jika cancel &lt; 5%',
    'modal.colCategory': 'Kategori',
    'modal.colPrice': 'Harga / 100',
    'modal.colTotalOrder': 'Total Order',
    'modal.colCondition': 'Kondisi',
    'modal.colRefill': 'Refill',
    'modal.colCancel': 'Cancel',
    'modal.colMinOrder': 'Min Order',
    'modal.colMaxOrder': 'Max Order',
    'modal.colDistribution': 'Distribusi Status',

    // Analytics
    'analitik.noData': 'Belum ada data analitik',
    'analitik.syncFirst': 'Sync data order terlebih dahulu untuk melihat analitik',
    'analitik.activity': 'Aktivitas Order',
    'analitik.statusDist': 'Distribusi Status',
    'analitik.topPopular': 'Layanan Terpopuler',
    'analitik.byOrderCount': 'Berdasarkan jumlah order',
    'analitik.noOrderData': 'Tidak ada data order tersedia',
    'analitik.categoryPerf': 'Performa per Kategori',
    'analitik.noCategoryData': 'Tidak ada data kategori tersedia',
    'analitik.totalOrder': 'Total Order',
    'analitik.totalQty': 'Total Kuantitas',
    'analitik.successRate': 'Success Rate',
    'analitik.activeServices': 'Layanan Aktif',
    'analitik.thisPeriod': 'pada periode ini',
    'analitik.unitsProcessed': 'unit diproses',
    'analitik.completedPartial': 'completed + partial',
    'analitik.differentServices': 'layanan berbeda',
    'analitik.heatmap': 'Heatmap Jam Aktif',
    'analitik.orderPerHour': 'Order per jam & hari dalam seminggu',
    'analitik.fewOrders': 'Sedikit',
    'analitik.manyOrders': 'Banyak',
    'analitik.orderUnit': 'order',
    'analitik.thousands': 'rb',
    'analitik.millions': 'jt',

    // Day names (short)
    'day.0': 'Min',
    'day.1': 'Sen',
    'day.2': 'Sel',
    'day.3': 'Rab',
    'day.4': 'Kam',
    'day.5': 'Jum',
    'day.6': 'Sab',

    // Index page tabs
    'tab.monitor': 'Monitoring',
    'tab.rekomendasi': 'Rekomendasi',
    'tab.top': 'Top',
    'tab.trending': 'Trend',
    'tab.risk': 'Risiko',
    'tab.analitik': 'Analitik',

    // Search
    'search.placeholder': 'Cari nama atau ID layanan...',

    // Top tab
    'top.title': 'Top 10 Performer',
    'top.subtitle': 'Layanan dengan Score tertinggi',

    // Trending tab
    'trending.title': 'Trending 10 Teratas',
    'trending.subtitle': 'Layanan dengan pertumbuhan order tertinggi',
    'trending.empty': 'Tidak ada layanan trending saat ini',

    // Risk tab
    'risk.title': '10 Layanan Berisiko Teratas',
    'risk.subtitle': 'Cancel rate tinggi atau success rate rendah',
    'risk.empty': 'Tidak ada layanan berisiko!',

    // AI Insight
    'insight.title': 'AI Insight',
    'insight.updating': 'Memperbarui…',
    'insight.topScore': 'Top AI Score',
    'insight.topTrend': 'Top Trend',

    // Comparison bar
    'compare.selected': '{n} layanan dipilih',
    'compare.btn': 'Bandingkan',

    // Footer
    'footer.dashboard': 'Dashboard Monitoring',
    'footer.lastUpdate': 'Update terakhir',

    // Common labels
    'label.score': 'score',
    'label.orders': 'orders',

    // Service detail page
    'detail.title': 'Detail Monitoring Layanan',
    'detail.loading': 'Memuat riwayat transaksi...',
    'detail.error': 'Gagal memuat data',
    'detail.noTransactions': 'Belum ada transaksi',
    'detail.noTransactionsHint': 'Tidak ada order tercatat untuk layanan ini',
    'detail.serviceStatus': 'Status Layanan',
    'detail.smooth': 'Lancar',
    'detail.normal': 'Normal',
    'detail.needsAttention': 'Perlu Perhatian',
    'detail.smmService': 'Layanan SMM',
    'detail.transactions': 'transaksi',
    'detail.statusDist': 'Distribusi Status',
    'detail.ofTransactions': 'dari {n} transaksi',
    'detail.historyTitle': 'Riwayat Transaksi',
    'detail.historyCount': '{n} transaksi',
    'detail.searchPlaceholder': 'Cari link target atau ID order...',
    'detail.filterAll': 'Semua',
    'detail.colTarget': 'Target / Link',
    'detail.colQty': 'Jumlah',
    'detail.colRemaining': 'Sisa',
    'detail.colTime': 'Waktu',
    'detail.colCompletion': 'Selesai',
    'detail.showingOf': 'Menampilkan {from}–{to} dari {total} transaksi',
    'detail.noStatus': 'Tidak ada transaksi dengan status ini',
    'detail.noLink': 'Tidak ada link',
    'detail.qty': 'Jumlah:',
    'detail.remaining': 'Sisa:',
    'detail.heatmap': 'Heatmap Jam Aktif',
    'detail.heatmapSubtitle': 'Order per jam & hari dalam seminggu',
    'detail.fewOrders': 'Sedikit',
    'detail.manyOrders': 'Banyak',
  },

  en: {
    // Header
    'header.lastUpdate': 'Last updated',
    'header.updating': 'Updating',
    'header.live': 'Live',
    'header.error': 'Error',
    'header.cached': 'Cached',
    'header.resync': 'Resync',
    'header.analytics': 'Service Analytics',
    'header.searchPlatform': 'Search platform...',
    'header.lightMode': 'Light mode',
    'header.darkMode': 'Dark mode',
    'header.switchLang': 'Ganti ke Indonesia',

    // Platform labels
    'platform.all': 'All',
    'platform.others': 'Others',

    // Stat Cards
    'stat.totalServices': 'Total Services',
    'stat.avgScore': 'Avg. AI Score',
    'stat.avgSuccess': 'Avg. Success Rate',
    'stat.totalOrders': 'Total Orders',
    'stat.trending': '{n} trending',
    'stat.stable': 'Stable performance',
    'stat.aboveAvg': 'Above average',
    'stat.risky': '{n} at risk',
    'stat.allSafe': 'All clear',

    // Service Table
    'table.title': 'Service Recommendations',
    'table.count': '{n} services',
    'table.sort': 'Sort:',
    'table.loading': 'Fetching data from {name}...',
    'table.loadingFetching': 'Fetching services & order statistics',
    'table.loadingHint1': 'This may take 10–30 seconds on the first request.',
    'table.loadingHint2': 'Next requests will load instantly (cached ✓)',
    'table.empty': 'No services match your search',
    'table.colService': 'Service',
    'table.colPrice': 'Price / 100',
    'table.colAction': 'Action',

    // Speed values
    'speed.veryFast': 'Super Fast',
    'speed.fast': 'Fast',
    'speed.medium': 'Medium',
    'speed.slow': 'Slow',

    // Buttons
    'btn.buy': 'Buy',
    'btn.detail': 'Detail',
    'btn.close': 'Close',
    'btn.back': 'Back',

    // Sort options
    'sort.score': 'Sort: AI Score',
    'sort.success': 'Sort: Success Rate',
    'sort.orders': 'Sort: Order Count',
    'sort.trending': 'Sort: Trending',
    'sort.cancel': 'Sort: Cancel Rate ↑',

    // Monitor
    'monitor.totalServices': 'Total Services',
    'monitor.categories': 'Categories',
    'monitor.refillSupport': 'Refill Support',
    'monitor.cancelSupport': 'Cancel Support',
    'monitor.fromCatalog': 'From active catalog',
    'monitor.uniqueTypes': 'Unique service types',
    'monitor.ofTotal': '{pct}% of total',
    'monitor.favorites': 'Favorites',
    'monitor.healthy': 'Healthy',
    'monitor.reset': 'Reset',
    'monitor.noServices': 'No services found',
    'monitor.catalogEmpty': 'Service catalog not available',
    'monitor.changeFilter': 'Try changing the filter or keyword',
    'monitor.colService': 'Service',
    'monitor.colPrice': 'Price / 100',
    'monitor.colMinOrder': 'Min Order',
    'monitor.colMaxOrder': 'Max Order',
    'monitor.colOrders': 'Orders',
    'monitor.colCondition': 'Condition',
    'monitor.colFeature': 'Features',
    'monitor.colAction': 'Action',
    'monitor.per100': 'per 100',
    'monitor.minimum': 'minimum',
    'monitor.maximum': 'maximum',
    'monitor.transactions': 'transactions',
    'monitor.condHealthy': 'Healthy',
    'monitor.condWarning': 'Warning',
    'monitor.services': 'services',
    'monitor.compareTitle': 'Add to compare (max 3)',
    'monitor.sortDefault': 'Default Order',
    'monitor.sortNameAsc': 'Name A → Z',
    'monitor.sortNameDesc': 'Name Z → A',
    'monitor.sortPriceAsc': 'Lowest Price',
    'monitor.sortPriceDesc': 'Highest Price',
    'monitor.sortMinAsc': 'Min Order ↑',
    'monitor.sortMinDesc': 'Min Order ↓',
    'monitor.sortMaxAsc': 'Max Order ↑',
    'monitor.sortMaxDesc': 'Max Order ↓',
    'monitor.sortOrdersDesc': 'Orders ↓',
    'monitor.sortOrdersAsc': 'Orders ↑',
    'monitor.paginationOf': '{from}–{to} of {total} services',

    // Comparison Modal
    'modal.title': 'Compare Services',
    'modal.metric': 'Metric',
    'modal.yes': 'Yes',
    'modal.no': 'No',
    'modal.best': 'Best',
    'modal.noData': '— No data yet',
    'modal.healthy': 'Healthy',
    'modal.attention': 'Needs Attention',
    'modal.popular': 'Most Popular',
    'modal.orders': 'orders',
    'modal.hint': '<span class="text-emerald-600 dark:text-emerald-400 font-semibold mx-0.5">Best</span> value highlighted green · Healthy if cancel &lt; 5%',
    'modal.colCategory': 'Category',
    'modal.colPrice': 'Price / 100',
    'modal.colTotalOrder': 'Total Orders',
    'modal.colCondition': 'Condition',
    'modal.colRefill': 'Refill',
    'modal.colCancel': 'Cancel',
    'modal.colMinOrder': 'Min Order',
    'modal.colMaxOrder': 'Max Order',
    'modal.colDistribution': 'Status Distribution',

    // Analytics
    'analitik.noData': 'No analytics data',
    'analitik.syncFirst': 'Sync order data first to view analytics',
    'analitik.activity': 'Order Activity',
    'analitik.statusDist': 'Status Distribution',
    'analitik.topPopular': 'Most Popular Services',
    'analitik.byOrderCount': 'By order count',
    'analitik.noOrderData': 'No order data available',
    'analitik.categoryPerf': 'Performance by Category',
    'analitik.noCategoryData': 'No category data available',
    'analitik.totalOrder': 'Total Orders',
    'analitik.totalQty': 'Total Quantity',
    'analitik.successRate': 'Success Rate',
    'analitik.activeServices': 'Active Services',
    'analitik.thisPeriod': 'in this period',
    'analitik.unitsProcessed': 'units processed',
    'analitik.completedPartial': 'completed + partial',
    'analitik.differentServices': 'different services',
    'analitik.heatmap': 'Active Hours Heatmap',
    'analitik.orderPerHour': 'Orders per hour & day of the week',
    'analitik.fewOrders': 'Low',
    'analitik.manyOrders': 'High',
    'analitik.orderUnit': 'orders',
    'analitik.thousands': 'K',
    'analitik.millions': 'M',

    // Day names (short)
    'day.0': 'Sun',
    'day.1': 'Mon',
    'day.2': 'Tue',
    'day.3': 'Wed',
    'day.4': 'Thu',
    'day.5': 'Fri',
    'day.6': 'Sat',

    // Index page tabs
    'tab.monitor': 'Monitor',
    'tab.rekomendasi': 'Recommendations',
    'tab.top': 'Top',
    'tab.trending': 'Trending',
    'tab.risk': 'Risk',
    'tab.analitik': 'Analytics',

    // Search
    'search.placeholder': 'Search service name or ID...',

    // Top tab
    'top.title': 'Top 10 Performers',
    'top.subtitle': 'Services with the highest score',

    // Trending tab
    'trending.title': 'Top 10 Trending',
    'trending.subtitle': 'Services with the highest order growth',
    'trending.empty': 'No trending services at the moment',

    // Risk tab
    'risk.title': 'Top 10 Risky Services',
    'risk.subtitle': 'High cancel rate or low success rate',
    'risk.empty': 'No risky services!',

    // AI Insight
    'insight.title': 'AI Insight',
    'insight.updating': 'Updating…',
    'insight.topScore': 'Top AI Score',
    'insight.topTrend': 'Top Trend',

    // Comparison bar
    'compare.selected': '{n} services selected',
    'compare.btn': 'Compare',

    // Footer
    'footer.dashboard': 'Monitoring Dashboard',
    'footer.lastUpdate': 'Last updated',

    // Common labels
    'label.score': 'score',
    'label.orders': 'orders',

    // Service detail page
    'detail.title': 'Service Monitoring Detail',
    'detail.loading': 'Loading transaction history...',
    'detail.error': 'Failed to load data',
    'detail.noTransactions': 'No transactions',
    'detail.noTransactionsHint': 'No orders recorded for this service',
    'detail.serviceStatus': 'Service Status',
    'detail.smooth': 'Smooth',
    'detail.normal': 'Normal',
    'detail.needsAttention': 'Needs Attention',
    'detail.smmService': 'SMM Service',
    'detail.transactions': 'transactions',
    'detail.statusDist': 'Status Distribution',
    'detail.ofTransactions': 'of {n} transactions',
    'detail.historyTitle': 'Transaction History',
    'detail.historyCount': '{n} transactions',
    'detail.searchPlaceholder': 'Search target link or order ID...',
    'detail.filterAll': 'All',
    'detail.colTarget': 'Target / Link',
    'detail.colQty': 'Quantity',
    'detail.colRemaining': 'Remaining',
    'detail.colTime': 'Time',
    'detail.colCompletion': 'Completion',
    'detail.showingOf': 'Showing {from}–{to} of {total} transactions',
    'detail.noStatus': 'No transactions with this status',
    'detail.noLink': 'No link',
    'detail.qty': 'Qty:',
    'detail.remaining': 'Remaining:',
    'detail.heatmap': 'Active Hours Heatmap',
    'detail.heatmapSubtitle': 'Orders per hour & day of the week',
    'detail.fewOrders': 'Low',
    'detail.manyOrders': 'High',
  },
}

export const useLang = () => {
  const { public: cfg } = useRuntimeConfig()
  const envDefault: Lang = cfg.defaultLang === 'en' ? 'en' : 'id'
  const lang = useState<Lang>('lang', () => envDefault)

  function init() {
    if (import.meta.client) {
      const saved = localStorage.getItem('lang') as Lang | null
      if (saved === 'id' || saved === 'en') lang.value = saved
      else lang.value = envDefault
    }
  }

  function setLang(l: Lang) {
    lang.value = l
    if (import.meta.client) localStorage.setItem('lang', l)
  }

  function toggle() {
    setLang(lang.value === 'id' ? 'en' : 'id')
  }

  function t(key: string, params?: Record<string, string | number>): string {
    const str = dict[lang.value][key] ?? dict.id[key] ?? key
    if (!params) return str
    return str.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`))
  }

  return { lang, setLang, toggle, t, init }
}
