# SmmPanel AI Dashboard

Dashboard AI rekomendasi layanan SMM (Social Media Marketing) berbasis Nuxt 3 dengan tema biru-ungu gelap.

## Stack

- **Nuxt 3.21** — SSR framework
- **Tailwind CSS 3.4** — utility-first styling
- **Vue 3** — Composition API + `<script setup>`
- **TypeScript** — seluruh composable dan komponen

## Menjalankan Project

```bash
npm install
npm run dev        # dev server → http://localhost:3030
npm run build      # production build
npm run preview    # preview production build
```

## Struktur Project

```
smm-panel-ai/
├── assets/css/
│   └── main.css              # Tailwind directives + custom components/utilities
├── components/
│   ├── AppHeader.vue         # Header 2-bar: navbar + sub-bar platform tabs
│   ├── StatCards.vue         # 4 kartu statistik dengan left-border accent
│   ├── ServiceTable.vue      # Tabel layanan utama + toolbar sort
│   └── AiSidebar.vue         # Panel sidebar bertab (Insight/Top/Trend/Risiko)
├── composables/
│   └── useServices.ts        # State global, data mock, filter & sort logic
├── pages/
│   └── index.vue             # Halaman tunggal — menyatukan semua komponen
├── nuxt.config.ts
├── tailwind.config.ts
└── .gitignore
```

## Fitur

### Header (AppHeader.vue)
- **Dua baris:** navbar utama + sub-bar platform tabs
- **Logo** dua baris: nama brand + label "AI Dashboard", dot status online/updating
- **Search bar** realtime — filter layanan berdasarkan nama, ID, atau kategori
- **Timestamp** update terakhir ditampilkan di kanan navbar (hilang saat loading)
- **Status pill** — "Updating" (kuning) saat loading, "Live" (hijau) setelah data siap
- **Sub-bar** platform tabs scrollable horizontal; periode (6J/24J/48J/7 Hari) di ujung kanan

### Stat Cards (StatCards.vue)
- 4 kartu: Total Layanan · Rata-rata AI Score · Avg. Success Rate · Total Order
- Desain left-border accent berwarna per metrik (indigo / violet / emerald / biru/kuning)
- Label uppercase kecil, nilai besar bold, trend label di bawah
- Icon jadi watermark transparan di background kanan
- Skeleton loading animated saat data belum siap

### Filter & Kontrol
- **Platform tabs** (sub-bar header): Semua · Instagram · TikTok · Facebook · YouTube · Twitter/X · Shopee
- **Periode**: 6J · 24J *(default)* · 48J · 7 Hari — tombol di ujung kanan sub-bar
- **Sort dropdown** (inline di toolbar tabel): AI Score · Success Rate · Order Count · Trending · Cancel Rate ↑
- **Search** (header): filter realtime across nama layanan, ID, kategori

### Tabel Layanan (ServiceTable.vue)
- **Toolbar tabel**: judul + badge jumlah layanan + sort dropdown
- **Kolom**: # · Layanan · Score · Success · Orders · Cancel · Trend · Harga
- **Rank** top 3 menggunakan emoji 🥇🥈🥉, sisanya angka biasa
- **AI Score** tampil dengan progress bar indigo-violet di bawah angka
- **Badge HOT / NEW** — merah/violet di samping nama layanan
- **Speed indicator** — warna berbeda: Sangat Cepat (hijau) · Cepat (biru) · Sedang (kuning) · Lambat (merah)
- **Trend cell** — badge berwarna background (emerald naik / red turun)
- **Success/Cancel** — warna otomatis berdasarkan threshold
- **Hover row** — highlight indigo sangat halus
- **Mobile view** — card layout 4-kolom (Score / Success / Cancel / Trend) menggantikan tabel

### Sidebar Bertab (AiSidebar.vue)
Panel sidebar kanan dengan 4 tab:

| Tab | Konten |
|---|---|
| 🧠 **Insight** | Analisis otomatis AI: layanan terbaik, trend tertinggi, jumlah berisiko. Mini stats: Top AI Score + Top Trend % |
| 🏆 **Top** | 5 layanan dengan AI Score tertinggi, tampil dengan medal rank, success rate, jumlah order |
| 📈 **Trend** | Layanan dengan trend naik >8%, diurutkan dari tertinggi, badge hijau persentase |
| ⚠️ **Risiko** | Layanan dengan cancel rate >2% atau success rate <95%. Jika nihil tampil pesan "Tidak ada layanan berisiko!" |

Sidebar sticky (`top-[96px]`) agar tetap terlihat saat scroll tabel panjang.

### Data & State (useServices.ts)
- **26 layanan mock** tersebar di 6 platform: Instagram · TikTok · YouTube · Facebook · Twitter/X · Shopee
- Tiap layanan memiliki: `id`, `name`, `category`, `platform`, `aiScore`, `successRate`, `orderCount`, `cancelRate`, `trend`, `trendPercent`, `price`, `minOrder`, `speed`, `quality`, `isNew?`, `isHot?`
- **Simulasi loading** 1.8 detik saat mount (meniru fetch API asli)
- **Computed filters**: platform + search + sort digabung dalam satu `filteredServices`
- **Computed sidebar**: `topPerformers`, `riskyServices`, `trendingServices`, `aiInsight` string otomatis
- **Stats** dihitung otomatis dari seluruh data

## Desain

- **Background**: `#0b0d1a` dark navy
- **Primary accent**: indigo-500 → violet-600 gradient
- **Cards**: `bg-[#111827]/70` + border `white/7%` + backdrop-blur
- **Font**: Inter (Google Fonts)
- **Ambient glow**: dua radial gradient fixed di background (indigo kiri atas, violet kanan tengah)
- **Responsive**: tabel → card mobile di breakpoint `md` (768px); sub-bar scrollable horizontal di mobile

## Perbedaan dari Referensi Asli (ai.smmpanel.web.id)

| Elemen | Referensi | Versi Ini |
|---|---|---|
| Tema | Putih / hijau | Dark navy / indigo-violet |
| Header | 1 bar | 2 bar (nav + sub-bar tabs) |
| Stat cards | Icon centered | Left-border accent |
| Sidebar | 4 widget terpisah vertikal | 1 panel bertab |
| Rank | Angka dalam lingkaran | Emoji 🥇🥈🥉 |
| Filter periode | Berdiri sendiri | Integrated di ujung sub-bar |
| Sort | Di luar tabel | Inline di toolbar tabel |
