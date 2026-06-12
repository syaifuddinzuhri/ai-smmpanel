<template>
  <div class="card overflow-hidden">
    <!-- Table toolbar -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] gap-3 flex-wrap">
      <div class="flex items-center gap-2">
        <div class="w-1.5 h-5 rounded bg-gradient-to-b from-indigo-500 to-violet-600"></div>
        <span class="text-[13px] font-bold text-white">Rekomendasi Layanan</span>
        <span v-if="!isLoading" class="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium">
          {{ services.length }} layanan
        </span>
      </div>
      <div class="flex items-center gap-2 ml-auto">
        <span class="text-[11px] text-slate-600 hidden sm:inline">Urutkan:</span>
        <select
          :value="selectedSort"
          @change="$emit('update:selectedSort', ($event.target as HTMLSelectElement).value)"
          class="bg-white/[0.04] border border-white/[0.07] rounded-lg px-2.5 py-1.5 text-[12px] text-slate-400 outline-none cursor-pointer hover:border-indigo-500/30 transition-colors"
        >
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 gap-4">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
        <div class="absolute inset-0 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
        <div class="absolute inset-2 border-2 border-transparent border-t-violet-500 rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 0.8s"></div>
      </div>
      <div class="text-center space-y-1.5">
        <p class="text-slate-300 text-[13px] font-medium">Mengambil data dari SmmBuzzer...</p>
        <p class="text-slate-600 text-[11px]">Fetching services &amp; order statistics</p>
        <p class="text-slate-700 text-[11px]">Proses ini memakan waktu 10–30 detik pada permintaan pertama.</p>
        <p class="text-indigo-400/70 text-[11px] font-medium mt-1">Permintaan berikutnya akan langsung tampil (cached ✓)</p>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="services.length === 0" class="flex flex-col items-center justify-center py-12 gap-3">
      <span class="text-3xl opacity-30">🔍</span>
      <p class="text-slate-500 text-sm">Tidak ada layanan yang cocok dengan pencarian</p>
    </div>

    <!-- Desktop table -->
    <div v-else class="hidden md:block overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-white/[0.02]">
            <th class="text-left px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest w-9">#</th>
            <th class="text-left px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Layanan</th>
            <th class="text-center px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Score</th>
            <th class="text-center px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Success</th>
            <th class="text-center px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Orders</th>
            <th class="text-center px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Cancel</th>
            <th class="text-center px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Trend</th>
            <th class="text-right px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Harga</th>
            <th class="text-center px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/[0.03]">
          <tr
            v-for="(svc, i) in services"
            :key="svc.id"
            class="hover:bg-indigo-500/[0.03] transition-colors group"
          >
            <!-- Rank -->
            <td class="px-3 py-3 text-center">
              <span v-if="i === 0" class="text-base">🥇</span>
              <span v-else-if="i === 1" class="text-base">🥈</span>
              <span v-else-if="i === 2" class="text-base">🥉</span>
              <span v-else class="text-slate-600 text-[12px]">{{ i + 1 }}</span>
            </td>

            <!-- Name -->
            <td class="px-3 py-3">
              <div class="flex items-start gap-2.5">
                <span class="text-[17px] mt-0.5 flex-shrink-0">{{ svc.platformIcon }}</span>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span class="text-slate-200 text-[13px] font-medium leading-tight">{{ svc.name }}</span>
                    <span v-if="svc.isHot" class="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">HOT</span>
                    <span v-if="svc.isNew" class="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold">NEW</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span>ID: {{ svc.id }}</span>
                    <span class="opacity-30">·</span>
                    <span>{{ svc.category }}</span>
                    <span class="opacity-30">·</span>
                    <span :class="speedColor(svc.speed)">{{ svc.speed }}</span>
                  </div>
                </div>
              </div>
            </td>

            <!-- Score with mini ring -->
            <td class="px-3 py-3 text-center">
              <div class="inline-flex flex-col items-center gap-1">
                <span :class="['text-[14px] font-bold tabular-nums', scoreColor(svc.aiScore)]">{{ svc.aiScore }}</span>
                <div class="w-14 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    :style="{ width: svc.aiScore + '%' }"></div>
                </div>
              </div>
            </td>

            <!-- Success -->
            <td class="px-3 py-3 text-center">
              <span :class="['text-[13px] font-semibold tabular-nums', svc.successRate >= 98 ? 'text-emerald-400' : svc.successRate >= 95 ? 'text-yellow-400' : 'text-red-400']">
                {{ svc.successRate }}%
              </span>
            </td>

            <!-- Orders -->
            <td class="px-3 py-3 text-center">
              <span class="text-slate-300 text-[13px] tabular-nums">{{ svc.orderCount.toLocaleString('id-ID') }}</span>
            </td>

            <!-- Cancel -->
            <td class="px-3 py-3 text-center">
              <span :class="['text-[13px] font-medium tabular-nums', svc.cancelRate <= 1 ? 'text-emerald-400' : svc.cancelRate <= 2 ? 'text-yellow-400' : 'text-red-400']">
                {{ svc.cancelRate }}%
              </span>
            </td>

            <!-- Trend -->
            <td class="px-3 py-3 text-center">
              <div :class="[
                'inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded',
                svc.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : svc.trend === 'down' ? 'text-red-400 bg-red-500/10' : 'text-slate-500'
              ]">
                {{ svc.trend === 'up' ? '▲' : svc.trend === 'down' ? '▼' : '–' }}
                {{ svc.trendPercent > 0 ? '+' : '' }}{{ svc.trendPercent }}%
              </div>
            </td>

            <!-- Price -->
            <td class="px-3 py-3 text-right">
              <span class="text-[13px] font-semibold text-indigo-300 tabular-nums">Rp {{ svc.price.toLocaleString('id-ID') }}</span>
            </td>

            <!-- Beli -->
            <td class="px-3 py-3 text-center">
              <a
                :href="`${panelUrl}?service=${svc.id}`"
                target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/40 text-white text-[11px] font-semibold transition-all duration-150 whitespace-nowrap shadow-sm shadow-indigo-500/20"
              >
                Beli
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <div v-if="!isLoading && services.length > 0" class="md:hidden divide-y divide-white/[0.04]">
      <div v-for="(svc, i) in services" :key="svc.id" class="p-4 hover:bg-white/[0.02] transition-colors">
        <div class="flex items-start gap-3 mb-3">
          <span class="text-xl flex-shrink-0 mt-0.5">{{ svc.platformIcon }}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span v-if="i === 0">🥇</span>
              <span v-else-if="i === 1">🥈</span>
              <span v-else-if="i === 2">🥉</span>
              <span v-else class="text-slate-600 text-[11px]">#{{ i + 1 }}</span>
              <span class="text-slate-200 text-[13px] font-medium leading-tight">{{ svc.name }}</span>
              <span v-if="svc.isHot" class="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">HOT</span>
              <span v-if="svc.isNew" class="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold">NEW</span>
            </div>
            <p class="text-slate-600 text-[11px]">ID: {{ svc.id }} · {{ svc.category }}</p>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-2 mb-2.5">
          <div class="bg-white/[0.03] rounded-lg p-2 text-center">
            <p :class="['text-[13px] font-bold', scoreColor(svc.aiScore)]">{{ svc.aiScore }}</p>
            <p class="text-slate-600 text-[10px]">Score</p>
          </div>
          <div class="bg-white/[0.03] rounded-lg p-2 text-center">
            <p :class="['text-[13px] font-semibold', svc.successRate >= 98 ? 'text-emerald-400' : 'text-yellow-400']">{{ svc.successRate }}%</p>
            <p class="text-slate-600 text-[10px]">Success</p>
          </div>
          <div class="bg-white/[0.03] rounded-lg p-2 text-center">
            <p :class="['text-[13px] font-semibold', svc.cancelRate <= 1 ? 'text-emerald-400' : 'text-red-400']">{{ svc.cancelRate }}%</p>
            <p class="text-slate-600 text-[10px]">Cancel</p>
          </div>
          <div class="bg-white/[0.03] rounded-lg p-2 text-center">
            <p :class="['text-[11px] font-bold', svc.trend === 'up' ? 'text-emerald-400' : svc.trend === 'down' ? 'text-red-400' : 'text-slate-500']">
              {{ svc.trend === 'up' ? '▲' : svc.trend === 'down' ? '▼' : '–' }}{{ Math.abs(svc.trendPercent) }}%
            </p>
            <p class="text-slate-600 text-[10px]">Trend</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-indigo-300 text-[13px] font-semibold tabular-nums">Rp {{ svc.price.toLocaleString('id-ID') }}</span>
          <a
            :href="`${panelUrl}?service=${svc.id}`"
            target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/40 text-white text-[12px] font-semibold transition-all duration-150 shadow-sm shadow-indigo-500/20"
          >
            Beli
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/composables/useServices'

defineProps<{
  services: Service[]
  isLoading: boolean
  lastUpdate: string
  sortOptions: Array<{ value: string; label: string }>
  selectedSort: string
}>()
defineEmits(['update:selectedSort'])

const panelUrl = useRuntimeConfig().public.panelUrl

const scoreColor = (s: number) => s >= 95 ? 'text-emerald-400' : s >= 85 ? 'text-violet-400' : s >= 75 ? 'text-yellow-400' : 'text-red-400'
const speedColor = (s: string) => s === 'Sangat Cepat' ? 'text-emerald-400' : s === 'Cepat' ? 'text-blue-400' : s === 'Sedang' ? 'text-yellow-400' : 'text-red-400'
</script>
