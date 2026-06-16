<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
    <div v-for="stat in statItems" :key="stat.label"
      class="relative overflow-hidden rounded-xl p-4 hover:border-indigo-500/20 transition-colors duration-200 group"
      :style="{ background: 'var(--bg-a70)', border: '1px solid var(--border)' }">
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
          <p class="text-slate-900 dark:text-white font-bold text-[22px] leading-tight mb-1">{{ stat.value }}</p>
          <div class="flex items-center gap-1">
            <Icon :name="stat.trendIcon" class="w-3.5 h-3.5 flex-shrink-0" :class="stat.trendColor" />
            <span :class="['text-[11px] font-medium', stat.trendColor]">{{ stat.trendLabel }}</span>
          </div>
        </div>
        <Icon :name="stat.icon" class="absolute bottom-2 right-3 w-9 h-9 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useLang()

const props = defineProps<{
  isLoading: boolean
  stats: { total: number; avgScore: number; avgSuccess: string; totalOrders: number; risky: number; trending: number }
}>()

const statItems = computed(() => [
  {
    icon: 'heroicons:wrench-screwdriver',
    accent: 'bg-indigo-500', labelColor: 'text-indigo-400',
    label: t('stat.totalServices'), value: props.stats.total,
    trendIcon: 'heroicons:arrow-trending-up',
    trendLabel: t('stat.trending', { n: props.stats.trending }),
    trendColor: 'text-emerald-400',
  },
  {
    icon: 'heroicons:cpu-chip',
    accent: 'bg-violet-500', labelColor: 'text-violet-400',
    label: t('stat.avgScore'), value: `${props.stats.avgScore}/100`,
    trendIcon: 'heroicons:arrow-right',
    trendLabel: t('stat.stable'),
    trendColor: 'text-slate-400',
  },
  {
    icon: 'heroicons:check-circle',
    accent: 'bg-emerald-500', labelColor: 'text-emerald-400',
    label: t('stat.avgSuccess'), value: `${props.stats.avgSuccess}%`,
    trendIcon: 'heroicons:arrow-up',
    trendLabel: t('stat.aboveAvg'),
    trendColor: 'text-emerald-400',
  },
  {
    icon: 'heroicons:archive-box',
    accent: props.stats.risky > 0 ? 'bg-amber-500' : 'bg-blue-500',
    labelColor: 'text-blue-400',
    label: t('stat.totalOrders'), value: props.stats.totalOrders.toLocaleString('id-ID'),
    trendIcon: props.stats.risky > 0 ? 'heroicons:exclamation-triangle' : 'heroicons:check',
    trendLabel: props.stats.risky > 0 ? t('stat.risky', { n: props.stats.risky }) : t('stat.allSafe'),
    trendColor: props.stats.risky > 0 ? 'text-amber-400' : 'text-emerald-400',
  },
])
</script>
