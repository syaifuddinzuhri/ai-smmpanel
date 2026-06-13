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
        <div class="flex items-center justify-between px-5 py-3.5" :style="{ borderBottom: '1px solid var(--border)' }">
          <div class="flex items-center gap-2.5">
            <Icon :name="group.icon" class="w-5 h-5 flex-shrink-0" />
            <span class="text-slate-900 dark:text-white font-semibold text-[14px]">{{ group.platform }}</span>
            <span class="text-[11px] px-2 py-0.5 rounded-full text-slate-500" :style="{ background: 'var(--bg-input)', border: '1px solid var(--border-str)' }">
              {{ group.services.length }} layanan
            </span>
          </div>
          <div class="flex items-center gap-3 text-[11px]">
            <span v-if="group.services.filter(s => s.refill).length" class="text-emerald-400 font-medium">
              ● {{ group.services.filter(s => s.refill).length }} refill
            </span>
            <span v-if="group.services.filter(s => s.cancel).length" class="text-blue-400 font-medium">
              ● {{ group.services.filter(s => s.cancel).length }} cancel
            </span>
          </div>
        </div>

        <!-- Column headers (desktop) -->
        <div class="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_148px_140px] gap-3 px-5 py-2" :style="{ borderBottom: '1px solid var(--border-sub)' }">
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
            class="grid grid-cols-[1fr_auto] md:grid-cols-[3fr_1fr_1fr_1fr_148px_140px] items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--row-hover)]">

            <!-- Name + meta -->
            <div class="min-w-0">
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

            <!-- Feature badges + mobile price + mobile Beli -->
            <div class="flex items-center gap-1.5 justify-end">
              <span class="md:hidden text-indigo-400 dark:text-indigo-300 text-[11px] font-semibold tabular-nums">
                Rp&nbsp;{{ Number(svc.rate).toLocaleString('id-ID') }}
              </span>
              <span v-if="svc.refill"
                class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold whitespace-nowrap">
                ↻ Refill
              </span>
              <span v-if="svc.cancel"
                class="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold whitespace-nowrap">
                ✕ Cancel
              </span>
              <!-- Mobile: Beli + Detail -->
              <div class="md:hidden flex items-center gap-1.5">
                <a
                  :href="`${panelUrl}?service=${svc.service}`"
                  target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/40 text-white text-[11px] font-semibold transition-all duration-150"
                >Beli</a>
                <NuxtLink
                  :to="{ path: `/service/${svc.service}`, query: props.selectedPeriod ? { period: props.selectedPeriod } : {} }"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 text-[11px] font-semibold transition-all duration-150"
                  :style="{ background: 'var(--bg-input)', border: '1px solid var(--border)' }"
                >Detail</NuxtLink>
              </div>
            </div>

            <!-- Desktop: Beli + Detail -->
            <div class="hidden md:flex items-center justify-center gap-1.5">
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

  const grouped = new Map<string, { platform: string; icon: string; services: RawService[] }>()
  for (const svc of list) {
    const { platform, icon } = detectPlatform(svc.name)
    if (!grouped.has(platform)) grouped.set(platform, { platform, icon, services: [] })
    grouped.get(platform)!.services.push(svc)
  }

  let groups = PLATFORM_ORDER
    .map(p => grouped.get(p))
    .filter((g): g is { platform: string; icon: string; services: RawService[] } => !!g && g.services.length > 0)

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
