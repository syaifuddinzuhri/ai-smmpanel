<template>
  <div class="card overflow-hidden self-start sticky top-[96px]">
    <!-- Tab header -->
    <div class="flex overflow-x-auto scrollbar-hide" :style="{ borderBottom: '1px solid var(--border)' }">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'flex items-center gap-1 px-3 py-3 text-[11px] font-semibold whitespace-nowrap transition-all border-b-2 flex-1 justify-center',
          activeTab === tab.key
            ? 'text-indigo-400 border-indigo-500 bg-indigo-500/5'
            : 'text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300 hover:bg-[var(--row-hover)]'
        ]"
        @click="activeTab = tab.key"
      >
        <Icon :name="tab.icon" class="w-3.5 h-3.5" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab: AI Insight -->
    <div v-if="activeTab === 'insight'" class="p-4">
      <div v-if="isLoading || (!aiInsight && aiInsightLoading)" class="space-y-2">
        <div class="skeleton w-full h-3"></div>
        <div class="skeleton w-5/6 h-3"></div>
        <div class="skeleton w-4/6 h-3"></div>
        <div class="skeleton w-5/6 h-3"></div>
        <div class="skeleton w-3/6 h-3 mt-2"></div>
      </div>
      <div v-else>
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center">
              <Icon name="heroicons:sparkles" class="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span class="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Analisis AI</span>
          </div>
          <span v-if="aiInsightLoading" class="flex items-center gap-1 text-[10px] text-violet-400">
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block"></span>
            Memperbarui…
          </span>
        </div>
        <p class="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{{ aiInsight }}</p>
        <div class="mt-4 pt-3 grid grid-cols-2 gap-2" :style="{ borderTop: '1px solid var(--border)' }">
          <div class="rounded-lg p-2.5 text-center" :style="{ background: 'var(--bg-subtle)' }">
            <p class="text-indigo-300 font-bold text-sm">{{ topPerformers[0]?.aiScore ?? '—' }}</p>
            <p class="text-slate-600 text-[10px] mt-0.5">Top AI Score</p>
          </div>
          <div class="rounded-lg p-2.5 text-center" :style="{ background: 'var(--bg-subtle)' }">
            <p class="text-emerald-300 font-bold text-sm">{{ trendingServices[0] ? '+' + trendingServices[0].trendPercent + '%' : '—' }}</p>
            <p class="text-slate-600 text-[10px] mt-0.5">Top Trend</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab: Top Performer -->
    <div v-if="activeTab === 'top'">
      <div v-if="isLoading" class="p-4 space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3">
          <div class="skeleton w-5 h-4 flex-shrink-0"></div>
          <div class="flex-1 space-y-1.5">
            <div class="skeleton w-full h-3"></div>
            <div class="skeleton w-16 h-2.5"></div>
          </div>
          <div class="skeleton w-8 h-5 flex-shrink-0"></div>
        </div>
      </div>
      <div v-else class="divide-y divide-slate-100 dark:divide-white/[0.04] max-h-[380px] overflow-y-auto scrollbar-hide">
        <div v-for="(svc, i) in topPerformers" :key="svc.id"
          class="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--row-hover)]">
          <div :class="[
            'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0',
            i === 0 ? 'bg-amber-500/20 dark:text-amber-300 text-amber-500' : i === 1 ? 'bg-slate-400/20 text-slate-500 dark:text-slate-300' : i === 2 ? 'bg-orange-700/20 text-orange-500' : 'bg-white/5 text-slate-500'
          ]">{{ i + 1 }}</div>
          <Icon :name="svc.platformIcon" class="w-5 h-5 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-slate-700 dark:text-slate-300 text-[12px] font-medium truncate">{{ svc.name }}</p>
            <p class="text-slate-500 dark:text-slate-600 text-[11px]">{{ svc.successRate }}% · {{ svc.orderCount.toLocaleString('id-ID') }} orders</p>
          </div>
          <div class="text-right flex-shrink-0">
            <p :class="['text-[13px] font-bold', svc.aiScore >= 95 ? 'text-emerald-400' : 'text-violet-400']">{{ svc.aiScore }}</p>
            <p class="text-slate-500 dark:text-slate-600 text-[10px]">score</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab: Trending -->
    <div v-if="activeTab === 'trending'">
      <div v-if="isLoading" class="p-4 space-y-3">
        <div v-for="i in 4" :key="i" class="flex items-center gap-3">
          <div class="flex-1 space-y-1.5"><div class="skeleton w-full h-3"></div><div class="skeleton w-20 h-2.5"></div></div>
          <div class="skeleton w-12 h-4 flex-shrink-0"></div>
        </div>
      </div>
      <div v-else-if="trendingServices.length === 0" class="px-4 py-6 text-center">
        <p class="text-slate-600 text-[12px]">Tidak ada layanan trending saat ini</p>
      </div>
      <div v-else class="divide-y divide-slate-100 dark:divide-white/[0.04] max-h-[380px] overflow-y-auto scrollbar-hide">
        <div v-for="svc in trendingServices" :key="svc.id"
          class="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--row-hover)]">
          <Icon :name="svc.platformIcon" class="w-5 h-5 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-slate-700 dark:text-slate-300 text-[12px] font-medium truncate">{{ svc.name }}</p>
            <p class="text-slate-500 dark:text-slate-600 text-[11px]">{{ svc.orderCount.toLocaleString('id-ID') }} orders</p>
          </div>
          <div class="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
            <Icon name="heroicons:arrow-trending-up" class="w-3 h-3 text-emerald-400" />
            <span class="text-emerald-400 text-[11px] font-bold">+{{ svc.trendPercent }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab: Berisiko -->
    <div v-if="activeTab === 'risk'">
      <div v-if="isLoading" class="p-4 space-y-3">
        <div class="skeleton w-full h-3"></div><div class="skeleton w-4/5 h-3"></div>
      </div>
      <div v-else-if="riskyServices.length === 0" class="flex items-center gap-2.5 px-4 py-4">
        <Icon name="heroicons:check-circle" class="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <span class="text-[12px] font-medium text-emerald-400">Tidak ada layanan berisiko!</span>
      </div>
      <div v-else class="divide-y divide-slate-100 dark:divide-white/[0.04] max-h-[380px] overflow-y-auto scrollbar-hide">
        <div v-for="svc in riskyServices" :key="svc.id"
          class="flex items-center gap-3 px-4 py-3">
          <Icon :name="svc.platformIcon" class="w-5 h-5 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-slate-700 dark:text-slate-300 text-[12px] font-medium truncate">{{ svc.name }}</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-red-400 text-[11px]">Cancel {{ svc.cancelRate }}%</span>
              <span class="text-slate-600">·</span>
              <span class="text-amber-400 text-[11px]">SR {{ svc.successRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/composables/useServices'

defineProps<{
  isLoading: boolean
  aiInsight: string
  aiInsightLoading: boolean
  topPerformers: Service[]
  riskyServices: Service[]
  trendingServices: Service[]
}>()

const activeTab = ref('insight')

const tabs = [
  { key: 'insight',   icon: 'heroicons:light-bulb',          label: 'Insight' },
  { key: 'top',       icon: 'heroicons:trophy',               label: 'Top' },
  { key: 'trending',  icon: 'heroicons:arrow-trending-up',    label: 'Trend' },
  { key: 'risk',      icon: 'heroicons:exclamation-triangle', label: 'Risiko' },
]
</script>
