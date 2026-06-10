# IndoSMM AI Dashboard

Dashboard AI rekomendasi layanan SMM (Social Media Marketing) dengan tema dark biru-ungu. Dibangun dengan Nuxt 3 + Tailwind CSS, terinspirasi dari [ai.indosmm.web.id](https://ai.indosmm.web.id/) dengan redesign visual yang berbeda.

![Nuxt](https://img.shields.io/badge/Nuxt-3.21-00DC82?style=flat&logo=nuxt.js)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat&logo=tailwindcss)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=flat&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)

---

## Screenshot

> Dashboard menampilkan rekomendasi layanan SMM berdasarkan AI Score, Success Rate, dan tren order secara real-time.

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 IndoSMM  │  Cari ID atau nama layanan...  │  🕐 16:13  ● Live │
│  AI Dashboard│                                │                   │
├──────────────────────────────────────────────────────────────────┤
│  ≡ Semua  📸 Instagram  🎵 TikTok  👍 Facebook  ▶️ YouTube  ...  │
├──────────────────────────────────────────────────────────────────┤
│  ▌ TOTAL LAYANAN   ▌ AI SCORE    ▌ SUCCESS RATE  ▌ TOTAL ORDER  │
│    26                90/100        96.9%           676.030        │
│    📈 14 trending    → Stabil      ⬆ Di atas avg  ✓ Semua aman  │
├─────────────────────────────────────────┬────────────────────────┤
│  Rekomendasi Layanan  [26 layanan]      │  🧠 🏆 📈 ⚠️           │
│  Urutkan: [Sort: AI Score ▾]           │                        │
│  ─────────────────────────────────────  │  ✦ ANALISIS SISTEM    │
│  🥇 Instagram Followers Indonesia [HQ] │  Berdasarkan analisis  │
│  🥈 TikTok Followers [Garanted]        │  26 layanan...         │
│  🥉 Instagram Likes Real [Aktif]       │                        │
│   4  YouTube Subscribers [Non Drop]    │  97        +34.2%      │
│   5  TikTok Views [Mix Real]           │  Top Score  Top Trend  │
└─────────────────────────────────────────┴────────────────────────┘
```

---

## Fitur Utama

- **AI Scoring** — setiap layanan dinilai berdasarkan multi-faktor (success rate, cancel rate, volume order, tren)
- **Filter Platform** — Instagram, TikTok, YouTube, Facebook, Twitter/X, Shopee
- **Filter Periode** — 6J / 24J / 48J / 7 Hari
- **Sort Dinamis** — AI Score, Success Rate, Order Count, Trending, Cancel Rate
- **Search Realtime** — cari berdasarkan nama, ID, atau kategori layanan
- **Sidebar Bertab** — AI Insight / Top Performer / Trending Naik / Layanan Berisiko
- **Loading Skeleton** — animasi loading meniru proses fetch API nyata
- **Responsive** — tabel di desktop, card layout di mobile

---

## Instalasi

### Prasyarat

- Node.js >= 18
- npm >= 9

### Clone & Jalankan

```bash
# Clone repo
git clone <repo-url>
cd smm-panel-ai

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## Script

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Dev server dengan hot-reload |
| `npm run build` | Build production |
| `npm run preview` | Preview hasil build production |
| `npm run postinstall` | Generate Nuxt types (auto) |

---

## Struktur Folder

```
smm-panel-ai/
├── assets/
│   └── css/
│       └── main.css          # Tailwind + custom component classes
├── components/
│   ├── AppHeader.vue         # Header 2-bar: navbar + sub-bar platform tabs
│   ├── StatCards.vue         # 4 kartu statistik ringkasan
│   ├── ServiceTable.vue      # Tabel utama daftar layanan
│   └── AiSidebar.vue         # Panel sidebar bertab
├── composables/
│   └── useServices.ts        # State, data mock, logika filter & sort
├── pages/
│   └── index.vue             # Root page
├── nuxt.config.ts
├── tailwind.config.ts
├── CLAUDE.md                 # Dokumentasi teknis untuk Claude Code
└── README.md
```

---

## Komponen

### `AppHeader`
Header dua baris — navbar utama (logo, search, status) + sub-bar (platform tabs, periode). Platform tabs scrollable horizontal di mobile.

### `StatCards`
Empat kartu ringkasan dengan desain left-border accent berwarna: Total Layanan, AI Score rata-rata, Success Rate, dan Total Order.

### `ServiceTable`
Tabel layanan dengan kolom: Rank · Layanan · AI Score · Success Rate · Orders · Cancel Rate · Trend · Harga. Top 3 ditampilkan dengan emoji 🥇🥈🥉. Di mobile tampil sebagai card grid.

### `AiSidebar`
Panel sidebar kanan dengan 4 tab:
- **🧠 Insight** — ringkasan analisis AI otomatis
- **🏆 Top** — 5 layanan dengan skor tertinggi
- **📈 Trend** — layanan dengan tren naik signifikan
- **⚠️ Risiko** — layanan dengan cancel rate tinggi atau success rate rendah

### `useServices` composable
Sumber data dan logika utama:
- 26 layanan mock tersebar di 6 platform
- Reactive filter: platform, periode, search, sort
- Computed: `filteredServices`, `stats`, `topPerformers`, `riskyServices`, `trendingServices`, `aiInsight`
- Simulasi loading 1.8 detik saat pertama mount

---

## Teknologi

| Teknologi | Versi | Fungsi |
|---|---|---|
| [Nuxt](https://nuxt.com) | 3.21 | SSR framework |
| [Vue](https://vuejs.org) | 3 | UI framework (Composition API) |
| [Tailwind CSS](https://tailwindcss.com) | 3.4 | Utility-first styling |
| [TypeScript](https://typescriptlang.org) | 5 | Type safety |
| [@nuxtjs/tailwindcss](https://tailwindcss.nuxtjs.org) | 6.x | Integrasi Tailwind ke Nuxt |

---

## Desain

| Elemen | Nilai |
|---|---|
| Background | `#0b0d1a` (dark navy) |
| Accent utama | Indigo 500 → Violet 600 gradient |
| Card background | `#111827` / 70% opacity + backdrop-blur |
| Font | Inter (Google Fonts) |
| Border | `rgba(255,255,255,0.07)` |
| Glow | Radial gradient ambient: indigo (kiri atas) + violet (kanan tengah) |

---

## Lisensi

MIT
