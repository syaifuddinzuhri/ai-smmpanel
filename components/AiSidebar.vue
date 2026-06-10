<template>
  <div class="card overflow-hidden self-start sticky top-[96px]">
    <!-- Tab header -->
    <div class="flex border-b border-white/[0.06] overflow-x-auto scrollbar-hide">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[
          'flex items-center gap-1 px-3 py-3 text-[11px] font-semibold whitespace-nowrap transition-all border-b-2 flex-1 justify-center',
          activeTab === tab.key
            ? 'text-indigo-300 border-indigo-500 bg-indigo-500/5'
            : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.02]'
        ]"
        @click="activeTab = tab.key"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- Tab: AI Insight -->
    <div v-if="activeTab === 'insight'" class="p-4">
      <div v-if="isLoading" class="space-y-2">
        <div class="skeleton w-full h-3"></div>
        <div class="skeleton w-5/6 h-3"></div>
        <div class="skeleton w-4/6 h-3"></div>
        <div class="skeleton w-5/6 h-3"></div>
        <div class="skeleton w-3/6 h-3 mt-2"></div>
      </div>
      <div v-else>
        <div class="flex items-center gap-2 mb-3">
          <div class="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center text-sm">✦</div>
          <span class="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Analisis Sistem</span>
        </div>
        <p class="text-[12.5px] text-slate-400 leading-relaxed">{{ aiInsight }}</p>
        <div class="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2">
          <div class="bg-white/[0.03] rounded-lg p-2.5 text-center">
            <p class="text-indigo-300 font-bold text-sm">{{ topPerformers[0]?.aiScore ?? '—' }}</p>
            <p class="text-slate-600 text-[10px] mt-0.5">Top AI Score</p>
          </div>
          <div class="bg-white/[0.03] rounded-lg p-2.5 text-center">
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
      <div v-else class="divide-y divide-white/[0.04]">
        <div v-for="(svc, i) in topPerformers" :key="svc.id"
          class="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
          <!-- Medal -->
          <div :class="[
            'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0',
            i === 0 ? 'bg-amber-500/20 text-amber-300' : i === 1 ? 'bg-slate-400/20 text-slate-300' : i === 2 ? 'bg-orange-700/20 text-orange-500' : 'bg-white/5 text-slate-500'
          ]">{{ i + 1 }}</div>
          <span class="text-[15px]">{{ svc.platformIcon }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-slate-300 text-[12px] font-medium truncate">{{ svc.name }}</p>
            <p class="text-slate-600 text-[11px]">{{ svc.successRate }}% · {{ svc.orderCount.toLocaleString('id-ID') }} orders</p>
          </div>
          <div class="text-right flex-shrink-0">
            <p :class="['text-[13px] font-bold', svc.aiScore >= 95 ? 'text-emerald-400' : 'text-violet-400']">{{ svc.aiScore }}</p>
            <p class="text-slate-600 text-[10px]">score</p>
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
      <div v-else class="divide-y divide-white/[0.04]">
        <div v-for="svc in trendingServices" :key="svc.id"
          class="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
          <span class="text-[15px]">{{ svc.platformIcon }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-slate-300 text-[12px] font-medium truncate">{{ svc.name }}</p>
            <p class="text-slate-600 text-[11px]">{{ svc.orderCount.toLocaleString('id-ID') }} orders</p>
          </div>
          <div class="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
            <span class="text-emerald-400 text-[11px] font-bold">▲ +{{ svc.trendPercent }}%</span>
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
        <span class="text-lg">✅</span>
        <span class="text-[12px] font-medium text-emerald-400">Tidak ada layanan berisiko!</span>
      </div>
      <div v-else class="divide-y divide-white/[0.04]">
        <div v-for="svc in riskyServices" :key="svc.id"
          class="flex items-center gap-3 px-4 py-3">
          <span class="text-[15px]">{{ svc.platformIcon }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-slate-300 text-[12px] font-medium truncate">{{ svc.name }}</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-red-400 text-[11px]">Cancel {{ svc.cancelRate }}%</span>
              <span class="text-slate-600">·</span>
              <span class="text-amber-400 text-[11px]">SR {{ svc.successRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-between">
      <span class="text-[10px] text-slate-600">Multi-Factor Scoring Engine v1.0</span>
      <span class="text-[10px] text-indigo-500/60">SmmPanel AI</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Service } from '~/composables/useServices'

defineProps<{
  isLoading: boolean
  aiInsight: string
  topPerformers: Service[]
  riskyServices: Service[]
  trendingServices: Service[]
}>()

const activeTab = ref('insight')

const tabs = [
  { key: 'insight', icon: '🧠', label: 'Insight' },
  { key: 'top', icon: '🏆', label: 'Top' },
  { key: 'trending', icon: '📈', label: 'Trend' },
  { key: 'risk', icon: '⚠️', label: 'Risiko' },
]
</script>
