<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
    <div v-for="stat in statItems" :key="stat.label"
      class="relative overflow-hidden bg-[#111827]/70 border border-white/[0.06] rounded-xl p-4 hover:border-indigo-500/20 transition-colors duration-200 group">
      <!-- Left accent bar -->
      <div :class="['absolute left-0 top-3 bottom-3 w-0.5 rounded-r', stat.accent]"></div>

      <template v-if="isLoading">
        <div class="space-y-2.5 pl-2">
          <div class="skeleton w-20 h-7"></div>
          <div class="skeleton w-28 h-3"></div>
          <div class="skeleton w-16 h-3"></div>
        </div>
      </template>
      <template v-else>
        <div class="pl-2">
          <p :class="['text-[11px] font-semibold uppercase tracking-wider mb-1', stat.labelColor]">{{ stat.label }}</p>
          <p class="text-white font-bold text-[22px] leading-tight mb-1">{{ stat.value }}</p>
          <div class="flex items-center gap-1">
            <span class="text-[12px]">{{ stat.trendIcon }}</span>
            <span :class="['text-[11px] font-medium', stat.trendColor]">{{ stat.trendLabel }}</span>
          </div>
        </div>
        <!-- Subtle bg icon -->
        <div class="absolute bottom-2 right-3 text-3xl opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">{{ stat.icon }}</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isLoading: boolean
  stats: { total: number; avgScore: number; avgSuccess: string; totalOrders: number; risky: number; trending: number }
}>()

const statItems = computed(() => [
  {
    icon: '🔧', accent: 'bg-indigo-500', labelColor: 'text-indigo-400',
    label: 'Total Layanan', value: props.stats.total,
    trendIcon: '📈', trendLabel: `${props.stats.trending} sedang trending`, trendColor: 'text-emerald-400'
  },
  {
    icon: '🤖', accent: 'bg-violet-500', labelColor: 'text-violet-400',
    label: 'Rata-rata AI Score', value: `${props.stats.avgScore}/100`,
    trendIcon: '→', trendLabel: 'Performa stabil', trendColor: 'text-slate-400'
  },
  {
    icon: '✅', accent: 'bg-emerald-500', labelColor: 'text-emerald-400',
    label: 'Avg. Success Rate', value: `${props.stats.avgSuccess}%`,
    trendIcon: '⬆', trendLabel: 'Di atas rata-rata', trendColor: 'text-emerald-400'
  },
  {
    icon: '📦', accent: props.stats.risky > 0 ? 'bg-amber-500' : 'bg-blue-500',
    labelColor: 'text-blue-400',
    label: 'Total Order', value: props.stats.totalOrders.toLocaleString('id-ID'),
    trendIcon: props.stats.risky > 0 ? '⚠️' : '✓',
    trendLabel: props.stats.risky > 0 ? `${props.stats.risky} berisiko` : 'Semua aman',
    trendColor: props.stats.risky > 0 ? 'text-amber-400' : 'text-emerald-400'
  }
])
</script>
