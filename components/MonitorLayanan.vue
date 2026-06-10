<template>
  <div>
    <!-- Summary bar -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <div v-for="item in summary" :key="item.label"
        class="relative overflow-hidden bg-[#111827]/70 border border-white/[0.06] rounded-xl p-4 hover:border-indigo-500/20 transition-colors">
        <div :class="['absolute left-0 top-3 bottom-3 w-0.5 rounded-r', item.accent]"></div>
        <div class="pl-2">
          <p :class="['text-[11px] font-semibold uppercase tracking-wider mb-1', item.labelColor]">{{ item.label }}</p>
          <template v-if="isLoading">
            <div class="skeleton w-16 h-6 mb-1"></div>
            <div class="skeleton w-20 h-3"></div>
          </template>
          <template v-else>
            <p class="text-white font-bold text-[22px] leading-tight mb-1">{{ item.value }}</p>
            <div class="flex items-center gap-1">
              <span :class="['w-1.5 h-1.5 rounded-full', item.dotColor]"></span>
              <span :class="['text-[11px] font-medium', item.subColor]">{{ item.sub }}</span>
            </div>
          </template>
        </div>
        <div class="absolute bottom-2 right-3 text-3xl opacity-[0.06]">{{ item.icon }}</div>
      </div>
    </div>

    <!-- Platform groups -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card p-5 space-y-3">
        <div class="skeleton w-32 h-4"></div>
        <div v-for="j in 3" :key="j" class="flex items-center gap-4">
          <div class="skeleton flex-1 h-3"></div>
          <div class="skeleton w-12 h-3"></div>
          <div class="skeleton w-12 h-3"></div>
          <div class="skeleton w-16 h-5 rounded-full"></div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div v-for="group in platformGroups" :key="group.platform" class="card overflow-hidden">
        <!-- Platform header -->
        <div class="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">{{ group.icon }}</span>
            <span class="text-white font-semibold text-[14px]">{{ group.platform }}</span>
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-500">
              {{ group.services.length }} layanan
            </span>
          </div>
          <div class="flex items-center gap-3 text-[11px]">
            <span class="text-emerald-400 font-medium">
              ● {{ group.services.filter(s => s.successRate >= 95).length }} sehat
            </span>
            <span v-if="group.services.filter(s => s.successRate < 95).length > 0" class="text-red-400 font-medium">
              ● {{ group.services.filter(s => s.successRate < 95).length }} berisiko
            </span>
          </div>
        </div>

        <!-- Service rows -->
        <div class="divide-y divide-white/[0.03]">
          <div v-for="svc in group.services" :key="svc.id"
            class="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">

            <!-- Name -->
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-slate-200 text-[13px] font-medium truncate">{{ svc.name }}</span>
                <span v-if="svc.isHot" class="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-semibold flex-shrink-0">HOT</span>
                <span v-if="svc.isNew" class="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold flex-shrink-0">NEW</span>
              </div>
              <p class="text-slate-600 text-[11px] mt-0.5">ID: {{ svc.id }} · {{ svc.category }} · Min {{ svc.minOrder.toLocaleString('id-ID') }}</p>
            </div>

            <!-- Desktop cols -->
            <div class="hidden md:block text-center">
              <p :class="['text-[13px] font-semibold tabular-nums', svc.successRate >= 98 ? 'text-emerald-400' : svc.successRate >= 95 ? 'text-yellow-400' : 'text-red-400']">
                {{ svc.successRate }}%
              </p>
              <p class="text-slate-700 text-[10px]">success</p>
            </div>

            <div class="hidden md:block text-center">
              <p class="text-slate-300 text-[13px] tabular-nums">{{ svc.orderCount.toLocaleString('id-ID') }}</p>
              <p class="text-slate-700 text-[10px]">orders</p>
            </div>

            <div class="hidden md:block text-center">
              <p :class="['text-[13px] font-medium tabular-nums', svc.cancelRate <= 1 ? 'text-emerald-400' : svc.cancelRate <= 2 ? 'text-yellow-400' : 'text-red-400']">
                {{ svc.cancelRate }}%
              </p>
              <p class="text-slate-700 text-[10px]">cancel</p>
            </div>

            <div class="hidden md:block text-center">
              <p :class="['text-[11px] font-medium', speedColor(svc.speed)]">{{ svc.speed }}</p>
              <p class="text-indigo-300 text-[12px] font-semibold mt-0.5">Rp {{ svc.price.toLocaleString('id-ID') }}</p>
            </div>

            <!-- Status badge -->
            <div class="flex-shrink-0">
              <span :class="['inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border', statusStyle(svc.successRate, svc.cancelRate)]">
                <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(svc.successRate, svc.cancelRate)"></span>
                {{ statusLabel(svc.successRate, svc.cancelRate) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/composables/useServices'

const props = defineProps<{
  services: Service[]
  isLoading: boolean
  stats: { total: number; avgSuccess: string; totalOrders: number; risky: number; trending: number }
}>()

const summary = computed(() => [
  {
    icon: '🟢', accent: 'bg-emerald-500', labelColor: 'text-emerald-400',
    label: 'Layanan Sehat', dotColor: 'bg-emerald-400',
    value: props.services.filter(s => s.successRate >= 95 && s.cancelRate <= 2).length,
    sub: 'Success ≥95%, Cancel ≤2%', subColor: 'text-emerald-400'
  },
  {
    icon: '⚠️', accent: 'bg-amber-500', labelColor: 'text-amber-400',
    label: 'Perlu Perhatian', dotColor: 'bg-amber-400',
    value: props.services.filter(s => s.successRate >= 90 && s.successRate < 95).length,
    sub: 'Success 90–94%', subColor: 'text-amber-400'
  },
  {
    icon: '🔴', accent: 'bg-red-500', labelColor: 'text-red-400',
    label: 'Berisiko', dotColor: 'bg-red-400',
    value: props.stats.risky,
    sub: 'Cancel >2% atau SR <90%', subColor: 'text-red-400'
  },
  {
    icon: '📦', accent: 'bg-indigo-500', labelColor: 'text-indigo-400',
    label: 'Total Order', dotColor: 'bg-indigo-400',
    value: props.stats.totalOrders.toLocaleString('id-ID'),
    sub: 'Semua platform', subColor: 'text-slate-400'
  }
])

const platformOrder = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter/X', 'Shopee']
const platformIcons: Record<string, string> = {
  Instagram: '📸', TikTok: '🎵', YouTube: '▶️', Facebook: '👍', 'Twitter/X': '🐦', Shopee: '🛍️'
}

const platformGroups = computed(() =>
  platformOrder.map(p => ({
    platform: p,
    icon: platformIcons[p],
    services: props.services.filter(s => s.platform === p)
  })).filter(g => g.services.length > 0)
)

const statusStyle = (sr: number, cr: number) => {
  if (sr >= 98 && cr <= 1) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
  if (sr >= 95 && cr <= 2) return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
  if (sr >= 90) return 'bg-amber-500/10 border-amber-500/20 text-amber-400'
  return 'bg-red-500/10 border-red-500/20 text-red-400'
}
const statusDot = (sr: number, cr: number) => {
  if (sr >= 98 && cr <= 1) return 'bg-emerald-400'
  if (sr >= 95 && cr <= 2) return 'bg-blue-400'
  if (sr >= 90) return 'bg-amber-400'
  return 'bg-red-400'
}
const statusLabel = (sr: number, cr: number) => {
  if (sr >= 98 && cr <= 1) return 'Excellent'
  if (sr >= 95 && cr <= 2) return 'Normal'
  if (sr >= 90) return 'Waspada'
  return 'Berisiko'
}
const speedColor = (s: string) =>
  s === 'Sangat Cepat' ? 'text-emerald-400' : s === 'Cepat' ? 'text-blue-400' : s === 'Sedang' ? 'text-yellow-400' : 'text-red-400'
</script>
