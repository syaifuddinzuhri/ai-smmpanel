<template>
  <div>
    <!-- Summary bar -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <div v-for="item in summary" :key="item.label"
        class="relative overflow-hidden rounded-xl p-4 hover:border-indigo-500/20 transition-colors"
        :style="{ background: 'var(--bg-a70)', border: '1px solid var(--border)' }">
        <div :class="['absolute left-0 top-3 bottom-3 w-0.5 rounded-r', item.accent]"></div>
        <div class="pl-2">
          <p :class="['text-[11px] font-semibold uppercase tracking-wider mb-1', item.labelColor]">{{ item.label }}</p>
          <template v-if="isLoading">
            <div class="skeleton w-16 h-6 mb-1"></div>
            <div class="skeleton w-20 h-3"></div>
          </template>
          <template v-else>
            <p class="text-slate-900 dark:text-white font-bold text-[22px] leading-tight mb-1">{{ item.value }}</p>
            <div class="flex items-center gap-1">
              <span :class="['w-1.5 h-1.5 rounded-full', item.dotColor]"></span>
              <span :class="['text-[11px] font-medium', item.subColor]">{{ item.sub }}</span>
            </div>
          </template>
        </div>
        <Icon :name="item.icon" class="absolute bottom-2 right-3 w-9 h-9 opacity-[0.06]" />
      </div>
    </div>

    <!-- Filter bar -->
    <div v-if="!isLoading && services.length > 0" class="flex flex-wrap items-center gap-1.5 mb-3">
      <!-- Sort dropdown -->
      <div class="relative flex items-center flex-shrink-0">
        <Icon name="heroicons:bars-arrow-down" class="absolute left-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <select
          v-model="selectedSort"
          class="pl-7 pr-7 py-1.5 rounded-full text-[11px] font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer appearance-none transition-all"
          :style="{ background: 'var(--bg-input)', border: '1px solid var(--border)' }"
        >
          <option v-for="o in sortOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <Icon name="heroicons:chevron-down" class="absolute right-2 w-3 h-3 text-slate-500 pointer-events-none" />
      </div>

      <div class="w-px h-4 bg-slate-300 dark:bg-white/10 flex-shrink-0"></div>

      <!-- Favorit toggle -->
      <button
        :class="[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border',
          onlyWatchlist ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'border-transparent text-slate-500 hover:bg-[var(--row-hover)]'
        ]"
        @click="onlyWatchlist = !onlyWatchlist"
      >
        <Icon name="heroicons:star" class="w-3 h-3" />
        Favorit
        <span v-if="watchlistCount > 0" :class="['text-[10px] font-bold px-1.5 py-0.5 rounded-full', onlyWatchlist ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-200 dark:bg-white/10 text-slate-500']">{{ watchlistCount }}</span>
      </button>

      <div class="w-px h-4 bg-slate-300 dark:bg-white/10 flex-shrink-0"></div>

      <!-- Refill / Cancel toggles -->
      <button
        :class="[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border',
          onlyRefill ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'border-transparent text-slate-500 hover:bg-[var(--row-hover)]'
        ]"
        @click="onlyRefill = !onlyRefill"
      >
        <Icon name="heroicons:arrow-path" class="w-3 h-3" />
        Refill
      </button>
      <button
        :class="[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border',
          onlyCancel ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'border-transparent text-slate-500 hover:bg-[var(--row-hover)]'
        ]"
        @click="onlyCancel = !onlyCancel"
      >
        <Icon name="heroicons:x-mark" class="w-3 h-3" />
        Cancel
      </button>

      <!-- Reset -->
      <button
        v-if="onlyRefill || onlyCancel || onlyWatchlist || selectedSort"
        class="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] text-slate-500 hover:text-red-400 transition-colors"
        @click="onlyRefill = false; onlyCancel = false; onlyWatchlist = false; selectedSort = ''"
      >
        <Icon name="heroicons:x-mark" class="w-3 h-3" />
        Reset
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card p-5 space-y-3">
        <div class="skeleton w-32 h-4"></div>
        <div v-for="j in 4" :key="j" class="flex items-center gap-4">
          <div class="skeleton flex-1 h-3"></div>
          <div class="skeleton w-16 h-3"></div>
          <div class="skeleton w-12 h-3"></div>
          <div class="skeleton w-16 h-5 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!filteredGroups.length" class="card p-12 text-center">
      <Icon name="heroicons:archive-box" class="w-10 h-10 mb-3 opacity-30 text-slate-400 mx-auto" />
      <p class="text-slate-400 text-[14px] font-medium">Tidak ada layanan ditemukan</p>
      <p class="text-slate-600 text-[12px] mt-1">
        {{ services.length === 0 ? 'Katalog layanan belum tersedia' : 'Coba ubah filter atau kata kunci' }}
      </p>
    </div>

    <!-- Platform groups -->
    <div v-else class="space-y-4">
      <div v-for="group in filteredGroups" :key="group.platform" class="card overflow-hidden">
        <!-- Platform header -->
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 md:px-5 py-3" :style="{ borderBottom: '1px solid var(--border)' }">
          <div class="flex items-center gap-2 flex-shrink-0">
            <Icon :name="group.icon" class="w-5 h-5 flex-shrink-0" />
            <span class="text-slate-900 dark:text-white font-semibold text-[14px]">{{ group.platform }}</span>
            <span class="text-[11px] px-2 py-0.5 rounded-full text-slate-500" :style="{ background: 'var(--bg-input)', border: '1px solid var(--border-str)' }">
              {{ group.services.length }} layanan
            </span>
          </div>
          <div class="flex items-center gap-2.5 text-[11px] w-full md:w-auto md:ml-auto pl-7 md:pl-0">
            <span v-if="group.services.filter(s => s.refill).length" class="text-emerald-400 font-medium whitespace-nowrap">
              ● {{ group.services.filter(s => s.refill).length }} refill
            </span>
            <span v-if="group.services.filter(s => s.cancel).length" class="text-blue-400 font-medium whitespace-nowrap">
              ● {{ group.services.filter(s => s.cancel).length }} cancel
            </span>
          </div>
        </div>

        <!-- Column headers (desktop) -->
        <div class="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_148px_180px] gap-3 px-5 py-2" :style="{ borderBottom: '1px solid var(--border-sub)' }">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Layanan</span>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-600 text-center">Harga / 1000</span>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-600 text-center">Min Order</span>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-600 text-center">Max Order</span>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-600 text-right pr-1">Fitur</span>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-600 text-center">Aksi</span>
        </div>

        <!-- Service rows -->
        <div class="divide-y divide-slate-100 dark:divide-white/[0.03]">
          <div v-for="svc in group.services" :key="svc.service"
            class="flex flex-col md:grid md:grid-cols-[3fr_1fr_1fr_1fr_148px_180px] md:items-center px-4 md:px-5 py-3 gap-0 md:gap-3 transition-colors hover:bg-[var(--row-hover)]">

            <!-- Name + meta -->
            <div class="min-w-0 mb-2 md:mb-0">
              <p class="text-slate-800 dark:text-slate-200 text-[13px] font-medium leading-snug">{{ svc.name }}</p>
              <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                <span class="text-slate-600 text-[11px]">ID: {{ svc.service }}</span>
                <span class="text-slate-700">·</span>
                <span class="text-slate-500 text-[11px]">{{ svc.category }}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium leading-none">
                  {{ svc.type }}
                </span>
              </div>
            </div>

            <!-- Harga/1000 -->
            <div class="hidden md:block text-center">
              <p class="text-indigo-400 dark:text-indigo-300 text-[13px] font-semibold tabular-nums">
                {{ Number(svc.rate) > 0 ? 'Rp ' + Number(svc.rate).toLocaleString('id-ID') : '—' }}
              </p>
              <p class="text-slate-700 text-[10px]">per 1000</p>
            </div>

            <!-- Min order -->
            <div class="hidden md:block text-center">
              <p class="text-slate-400 text-[13px] tabular-nums">{{ Number(svc.min).toLocaleString('id-ID') }}</p>
              <p class="text-slate-700 text-[10px]">minimum</p>
            </div>

            <!-- Max order -->
            <div class="hidden md:block text-center">
              <p class="text-slate-400 text-[13px] tabular-nums">{{ Number(svc.max).toLocaleString('id-ID') }}</p>
              <p class="text-slate-700 text-[10px]">maksimum</p>
            </div>

            <!-- Mobile bottom row: harga + badge + aksi -->
            <div class="flex md:contents items-center gap-2">
              <span class="md:hidden text-indigo-400 dark:text-indigo-300 text-[12px] font-bold tabular-nums">
                Rp&nbsp;{{ Number(svc.rate).toLocaleString('id-ID') }}<span class="text-slate-500 font-normal text-[10px]">/1000</span>
              </span>
              <div class="flex items-center gap-1.5 flex-1 md:justify-end">
                <span v-if="svc.refill"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold whitespace-nowrap">
                  ↻ Refill
                </span>
                <span v-if="svc.cancel"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold whitespace-nowrap">
                  ✕ Cancel
                </span>
              </div>
              <!-- Mobile: Favorit + Compare + Beli + Detail -->
              <div class="md:hidden flex items-center gap-1.5 ml-auto">
                <button
                  :class="['w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0', isWatched(svc.service) ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400']"
                  :style="{ background: isWatched(svc.service) ? 'rgba(245,158,11,0.18)' : 'var(--bg-input)', border: `1px solid ${isWatched(svc.service) ? 'rgba(245,158,11,0.3)' : 'var(--border)'}` }"
                  @click.prevent="toggleWatch(svc.service)"
                >
                  <Icon :name="isWatched(svc.service) ? 'heroicons:star-20-solid' : 'heroicons:star'" class="w-3.5 h-3.5" />
                </button>
                <button
                  :class="['w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0',
                    isComparing(svc.service) ? 'text-indigo-400' : (!canCompare && !isComparing(svc.service)) ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-400']"
                  :style="{ background: isComparing(svc.service) ? 'rgba(99,102,241,0.18)' : 'var(--bg-input)', border: `1px solid ${isComparing(svc.service) ? 'rgba(99,102,241,0.3)' : 'var(--border)'}` }"
                  :disabled="!canCompare && !isComparing(svc.service)"
                  title="Tambah ke komparasi (maks. 3)"
                  @click.prevent="toggleCompare(svc.service)"
                >
                  <Icon :name="isComparing(svc.service) ? 'heroicons:check' : 'heroicons:arrows-right-left'" class="w-3.5 h-3.5" />
                </button>
                <a
                  :href="`${panelUrl}?service=${svc.service}`"
                  target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/40 text-white text-[11px] font-semibold transition-all duration-150"
                >Beli</a>
                <NuxtLink
                  :to="{ path: `/service/${svc.service}`, query: props.selectedPeriod ? { period: props.selectedPeriod } : {} }"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 text-[11px] font-semibold transition-all duration-150"
                  :style="{ background: 'var(--bg-input)', border: '1px solid var(--border)' }"
                >Detail</NuxtLink>
              </div>
            </div>

            <!-- Desktop: Favorit + Compare + Beli + Detail -->
            <div class="hidden md:flex items-center justify-center gap-1.5">
              <button
                :class="['w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0', isWatched(svc.service) ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400']"
                :style="{ background: isWatched(svc.service) ? 'rgba(245,158,11,0.18)' : 'var(--bg-input)', border: `1px solid ${isWatched(svc.service) ? 'rgba(245,158,11,0.3)' : 'var(--border)'}` }"
                @click.prevent="toggleWatch(svc.service)"
              >
                <Icon :name="isWatched(svc.service) ? 'heroicons:star-20-solid' : 'heroicons:star'" class="w-3.5 h-3.5" />
              </button>
              <button
                :class="['w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0',
                  isComparing(svc.service) ? 'text-indigo-400' : (!canCompare && !isComparing(svc.service)) ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-400']"
                :style="{ background: isComparing(svc.service) ? 'rgba(99,102,241,0.18)' : 'var(--bg-input)', border: `1px solid ${isComparing(svc.service) ? 'rgba(99,102,241,0.3)' : 'var(--border)'}` }"
                :disabled="!canCompare && !isComparing(svc.service)"
                title="Tambah ke komparasi (maks. 3)"
                @click.prevent="toggleCompare(svc.service)"
              >
                <Icon :name="isComparing(svc.service) ? 'heroicons:check' : 'heroicons:arrows-right-left'" class="w-3.5 h-3.5" />
              </button>
              <a
                :href="`${panelUrl}?service=${svc.service}`"
                target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/40 text-white text-[11px] font-semibold transition-all duration-150 whitespace-nowrap shadow-sm shadow-indigo-500/20"
              >
                Beli
                <Icon name="heroicons:arrow-top-right-on-square" class="w-2.5 h-2.5" />
              </a>
              <NuxtLink
                :to="{ path: `/service/${svc.service}`, query: props.selectedPeriod ? { period: props.selectedPeriod } : {} }"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-[11px] font-semibold transition-all duration-150 whitespace-nowrap"
                :style="{ background: 'var(--bg-input)', border: '1px solid var(--border)' }"
              >
                Detail
                <Icon name="heroicons:chart-bar" class="w-2.5 h-2.5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RawService } from '~/server/api/services.get'

const panelUrl = useRuntimeConfig().public.panelUrl

const props = defineProps<{
  services: RawService[]
  isLoading: boolean
  searchQuery: string
  selectedPlatform: string
  selectedPeriod?: string
}>()

const { toggle: toggleWatch, isWatched, count: watchlistCount } = useWatchlist()
const { toggle: toggleCompare, isSelected: isComparing, canAdd: canCompare } = useComparison()

const onlyRefill = ref(false)
const onlyCancel = ref(false)
const onlyWatchlist = ref(false)
const selectedSort = ref('')

const sortOptions = [
  { value: '',          label: 'Urutan Default' },
  { value: 'name_asc',  label: 'Nama A → Z' },
  { value: 'name_desc', label: 'Nama Z → A' },
  { value: 'price_asc', label: 'Harga Termurah' },
  { value: 'price_desc',label: 'Harga Termahal' },
  { value: 'min_asc',   label: 'Min Order ↑' },
  { value: 'min_desc',  label: 'Min Order ↓' },
  { value: 'max_asc',   label: 'Max Order ↑' },
  { value: 'max_desc',  label: 'Max Order ↓' },
]

function sortServices(list: RawService[]): RawService[] {
  if (!selectedSort.value) return list
  return [...list].sort((a, b) => {
    switch (selectedSort.value) {
      case 'name_asc':   return a.name.localeCompare(b.name)
      case 'name_desc':  return b.name.localeCompare(a.name)
      case 'price_asc':  return Number(a.rate) - Number(b.rate)
      case 'price_desc': return Number(b.rate) - Number(a.rate)
      case 'min_asc':    return Number(a.min) - Number(b.min)
      case 'min_desc':   return Number(b.min) - Number(a.min)
      case 'max_asc':    return Number(a.max) - Number(b.max)
      case 'max_desc':   return Number(b.max) - Number(a.max)
      default:           return 0
    }
  })
}

const PLATFORM_ORDER = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter/X', 'Shopee', 'Spotify', 'Telegram', 'Google', 'Threads', 'Lain-lain']

function detectPlatform(name: string): { platform: string; icon: string } {
  const n = name.toLowerCase()
  if (n.includes('instagram'))                                                          return { platform: 'Instagram', icon: 'logos:instagram-icon' }
  if (n.includes('tiktok') || n.includes('tik tok'))                                   return { platform: 'TikTok',    icon: 'logos:tiktok-icon' }
  if (n.includes('youtube') || n.includes('you tube'))                                 return { platform: 'YouTube',   icon: 'logos:youtube-icon' }
  if (n.includes('facebook') || n.includes('fb '))                                     return { platform: 'Facebook',  icon: 'logos:facebook' }
  if (n.includes('twitter') || n.includes('tweet') || n.includes(' x ') || n.includes('twit')) return { platform: 'Twitter/X', icon: 'logos:twitter' }
  if (n.includes('shopee'))                                                             return { platform: 'Shopee',    icon: 'simple-icons:shopee' }
  if (n.includes('spotify'))                                                            return { platform: 'Spotify',   icon: 'logos:spotify' }
  if (n.includes('telegram'))                                                           return { platform: 'Telegram',  icon: 'logos:telegram' }
  if (n.includes('google') || n.includes('gmail') || n.includes('play store'))         return { platform: 'Google',    icon: 'logos:google' }
  if (n.includes('thread'))                                                             return { platform: 'Threads',   icon: 'logos:thread' }
  return { platform: 'Lain-lain', icon: 'logos:other' }
}

const filteredGroups = computed(() => {
  let list = props.services

  if (props.searchQuery.trim()) {
    const q = props.searchQuery.toLowerCase()
    list = list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.service.toString().includes(q) ||
      s.category.toLowerCase().includes(q)
    )
  }

  if (onlyRefill.value) list = list.filter(s => s.refill)
  if (onlyCancel.value) list = list.filter(s => s.cancel)
  if (onlyWatchlist.value) list = list.filter(s => isWatched(s.service))

  const grouped = new Map<string, { platform: string; icon: string; services: RawService[] }>()
  for (const svc of list) {
    const { platform, icon } = detectPlatform(svc.name)
    if (!grouped.has(platform)) grouped.set(platform, { platform, icon, services: [] })
    grouped.get(platform)!.services.push(svc)
  }

  let groups = PLATFORM_ORDER
    .map(p => grouped.get(p))
    .filter((g): g is { platform: string; icon: string; services: RawService[] } => !!g && g.services.length > 0)
    .map(g => ({ ...g, services: sortServices(g.services) }))

  if (props.selectedPlatform !== 'Semua') {
    groups = groups.filter(g => g.platform === props.selectedPlatform)
  }

  return groups
})

const summary = computed(() => {
  const list = props.services
  const n = list.length
  const refillCount = list.filter(s => s.refill).length
  const cancelCount = list.filter(s => s.cancel).length
  const categoryCount = new Set(list.map(s => s.category)).size

  return [
    {
      icon: 'heroicons:archive-box', accent: 'bg-indigo-500', labelColor: 'text-indigo-400',
      label: 'Total Layanan', dotColor: 'bg-indigo-400',
      value: n.toLocaleString('id-ID'),
      sub: 'Dari katalog aktif', subColor: 'text-slate-400',
    },
    {
      icon: 'heroicons:tag', accent: 'bg-violet-500', labelColor: 'text-violet-400',
      label: 'Kategori', dotColor: 'bg-violet-400',
      value: categoryCount.toLocaleString('id-ID'),
      sub: 'Jenis layanan unik', subColor: 'text-violet-400',
    },
    {
      icon: 'heroicons:arrow-path', accent: 'bg-emerald-500', labelColor: 'text-emerald-400',
      label: 'Support Refill', dotColor: 'bg-emerald-400',
      value: refillCount.toLocaleString('id-ID'),
      sub: n ? `${Math.round((refillCount / n) * 100)}% dari total` : '—', subColor: 'text-emerald-400',
    },
    {
      icon: 'heroicons:x-mark', accent: 'bg-blue-500', labelColor: 'text-blue-400',
      label: 'Support Cancel', dotColor: 'bg-blue-400',
      value: cancelCount.toLocaleString('id-ID'),
      sub: n ? `${Math.round((cancelCount / n) * 100)}% dari total` : '—', subColor: 'text-blue-400',
    },
  ]
})
</script>
