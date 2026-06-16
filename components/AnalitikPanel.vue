<template>
  <div class="space-y-4">
    <!-- Empty state -->
    <div v-if="!isLoading && rawOrders.length === 0" class="card p-12 text-center">
      <Icon name="heroicons:chart-bar" class="w-10 h-10 text-slate-600 mx-auto mb-3" />
      <p class="text-slate-400 font-medium">{{ t('analitik.noData') }}</p>
      <p class="text-slate-600 text-[12px] mt-1">{{ t('analitik.syncFirst') }}</p>
    </div>

    <template v-else>
      <!-- Summary cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="s in summaryCards"
          :key="s.label"
          class="relative overflow-hidden rounded-xl p-4"
          :style="{ background: 'var(--bg-a70)', border: '1px solid var(--border)' }"
        >
          <div :class="['absolute top-0 left-0 right-0 h-0.5', s.bar]"></div>
          <Icon :name="s.icon" :class="['absolute bottom-2 right-2 w-9 h-9 opacity-[0.06]', s.color]" />
          <div class="flex items-center gap-2 mb-2">
            <div :class="['w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', s.bg]">
              <Icon :name="s.icon" :class="['w-3.5 h-3.5', s.color]" />
            </div>
            <span :class="['text-[10px] font-bold uppercase tracking-wider', s.color]">{{ s.label }}</span>
          </div>
          <div v-if="isLoading" class="skeleton w-20 h-6 mb-1"></div>
          <p v-else :class="['text-[22px] font-black leading-none tabular-nums', s.color]">{{ s.value }}</p>
          <p class="text-slate-500 dark:text-slate-600 text-[10px] mt-1">{{ s.sub }}</p>
        </div>
      </div>

      <!-- Row 2: Volume chart + Status dist -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">

        <!-- Period bar chart -->
        <div class="card p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-4 rounded bg-gradient-to-b from-indigo-500 to-violet-600"></div>
              <span class="text-[13px] font-bold text-slate-900 dark:text-white">{{ t('analitik.activity') }}</span>
            </div>
            <span class="text-[11px] text-slate-500">{{ rawOrders.length.toLocaleString('id-ID') }} {{ t('analitik.orderUnit') }} · {{ selectedPeriod }}</span>
          </div>
          <div v-if="isLoading" class="skeleton w-full h-[80px]"></div>
          <template v-else>
            <div class="flex items-end gap-px h-[80px] mb-2">
              <div
                v-for="(bar, i) in chartBars"
                :key="i"
                class="flex-1 rounded-t-[2px] transition-all duration-500 cursor-default group relative"
                :class="bar.count > 0 ? 'bg-gradient-to-t from-indigo-600 to-violet-500' : 'bg-slate-200 dark:bg-white/[0.04]'"
                :style="{ height: bar.count > 0 ? Math.max(6, Math.round(bar.count / chartMax * 100)) + '%' : '4px' }"
              >
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap z-10 shadow-lg"
                  :style="{ background: 'var(--bg-card)', border: '1px solid var(--border-str)' }">
                  <span class="text-slate-500">{{ bar.label }}</span>
                  <span class="text-indigo-400">{{ bar.count }}</span>
                </div>
              </div>
            </div>
            <div class="flex justify-between text-[9px] text-slate-500">
              <span v-for="(label, i) in chartXLabels" :key="i" class="truncate" :style="{ visibility: label ? 'visible' : 'hidden' }">{{ label || '·' }}</span>
            </div>
          </template>
        </div>

        <!-- Status distribution -->
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-1.5 h-4 rounded bg-gradient-to-b from-emerald-500 to-blue-500"></div>
            <span class="text-[13px] font-bold text-slate-900 dark:text-white">{{ t('analitik.statusDist') }}</span>
          </div>
          <div v-if="!isLoading" class="flex h-2 rounded-full overflow-hidden gap-px mb-4">
            <div
              v-for="s in statusDist.filter(s => s.count > 0)"
              :key="s.label"
              :class="[s.color, 'transition-all duration-700']"
              :style="{ width: s.pct + '%' }"
            ></div>
          </div>
          <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 4" :key="i" class="skeleton w-full h-5"></div>
          </div>
          <div v-else class="space-y-2.5">
            <div v-for="s in statusDist.filter(s => s.count > 0)" :key="s.label" class="flex items-center gap-2">
              <div :class="['w-2 h-2 rounded-full flex-shrink-0', s.color]"></div>
              <span class="text-slate-600 dark:text-slate-400 text-[11px] flex-1">{{ s.label }}</span>
              <span class="text-slate-500 text-[11px] tabular-nums">{{ s.count.toLocaleString('id-ID') }}</span>
              <span :class="['text-[11px] font-bold tabular-nums w-9 text-right', s.textColor]">{{ s.pct }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 3: Top Volume + Category -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

        <!-- Top Volume -->
        <div class="card p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-4 rounded bg-gradient-to-b from-indigo-500 to-violet-600"></div>
              <span class="text-[13px] font-bold text-slate-900 dark:text-white">{{ t('analitik.topPopular') }}</span>
            </div>
            <span class="text-[11px] text-slate-500">{{ t('analitik.byOrderCount') }}</span>
          </div>
          <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 5" :key="i" class="skeleton w-full h-7"></div>
          </div>
          <div v-else-if="topVolume.length === 0" class="text-center py-6">
            <p class="text-slate-500 text-[12px]">{{ t('analitik.noOrderData') }}</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="(s, i) in topVolume" :key="s.serviceId" class="flex items-center gap-2.5">
              <span class="text-[13px] flex-shrink-0">{{ ['🥇','🥈','🥉'][i] ?? '' }}</span>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between text-[11px] mb-1 gap-2">
                  <span class="text-slate-700 dark:text-slate-300 truncate">{{ s.name }}</span>
                  <span class="text-indigo-400 font-bold tabular-nums whitespace-nowrap flex-shrink-0">{{ s.count.toLocaleString('id-ID') }} {{ t('analitik.orderUnit') }}</span>
                </div>
                <div class="text-[10px] text-slate-500 mb-1">ID: {{ s.serviceId }}</div>
                <div class="h-1.5 rounded-full overflow-hidden" :style="{ background: 'var(--bg-subtle)' }">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                    :style="{ width: (s.count / maxVolume * 100) + '%' }"
                  ></div>
                </div>
              </div>
              <a
                :href="`${panelUrl}?service=${s.serviceId}`"
                target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/40 text-white text-[10px] font-semibold transition-colors flex-shrink-0"
              >{{ t('btn.buy') }}</a>
            </div>
          </div>
        </div>

        <!-- Category performance -->
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-1.5 h-4 rounded bg-gradient-to-b from-indigo-500 to-cyan-500"></div>
            <span class="text-[13px] font-bold text-slate-900 dark:text-white">{{ t('analitik.categoryPerf') }}</span>
          </div>
          <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 5" :key="i" class="skeleton w-full h-7"></div>
          </div>
          <div v-else-if="categoryPerf.length === 0" class="text-center py-6">
            <p class="text-slate-500 text-[12px]">{{ t('analitik.noCategoryData') }}</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="cat in categoryPerf" :key="cat.label" class="flex items-center gap-2.5">
              <div class="flex-1 min-w-0">
                <div class="flex justify-between text-[11px] mb-1 gap-2">
                  <span class="text-slate-700 dark:text-slate-300 truncate">{{ cat.label }}</span>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <span class="text-slate-500 tabular-nums">{{ cat.total.toLocaleString('id-ID') }}</span>
                    <span :class="[
                      'font-bold tabular-nums',
                      cat.successRate >= 90 ? 'text-emerald-400' : cat.successRate >= 75 ? 'text-yellow-400' : 'text-red-400'
                    ]">{{ cat.successRate }}%</span>
                  </div>
                </div>
                <div class="h-1.5 rounded-full overflow-hidden" :style="{ background: 'var(--bg-subtle)' }">
                  <div
                    :class="[
                      'h-full rounded-full transition-all duration-700',
                      cat.successRate >= 90 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                      cat.successRate >= 75 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
                      'bg-gradient-to-r from-red-500 to-red-400'
                    ]"
                    :style="{ width: cat.successRate + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { RawOrder } from '~/server/api/orders.get'
import type { RawService } from '~/server/api/services.get'

const { t, lang } = useLang()
const panelUrl = useRuntimeConfig().public.panelUrl

const props = defineProps<{
  rawOrders: RawOrder[]
  rawServicesList: RawService[]
  isLoading: boolean
  selectedPeriod: string
}>()

const fmtNum = (v: number) => {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + t('analitik.millions')
  if (v >= 1_000) return (v / 1_000).toFixed(0) + t('analitik.thousands')
  return v.toLocaleString('id-ID')
}

const dayNames = computed(() => [0,1,2,3,4,5,6].map(i => t(`day.${i}`)))

const chartBars = computed(() => {
  const now = Date.now() / 1000
  let intervalSec: number
  let totalBars: number

  if (props.selectedPeriod === '6J')           { intervalSec = 1800;  totalBars = 12 }
  else if (props.selectedPeriod === '48J')     { intervalSec = 7200;  totalBars = 24 }
  else if (props.selectedPeriod === '7 Hari') { intervalSec = 86400; totalBars = 7 }
  else                                          { intervalSec = 3600;  totalBars = 24 }

  const bars: { label: string; count: number; from: number; to: number }[] = []
  for (let i = totalBars - 1; i >= 0; i--) {
    const to   = now - i * intervalSec
    const from = to - intervalSec
    let label: string
    if (intervalSec === 86400) {
      label = dayNames.value[new Date(to * 1000).getDay()]
    } else {
      const d = new Date(to * 1000)
      label = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
    }
    bars.push({ label, count: 0, from, to })
  }

  for (const o of props.rawOrders) {
    if (!o.created_timestamp) continue
    const ts = o.created_timestamp
    for (const bar of bars) {
      if (ts >= bar.from && ts < bar.to) { bar.count++; break }
    }
  }

  return bars
})

const chartMax = computed(() => Math.max(...chartBars.value.map(b => b.count), 1))

const chartXLabels = computed(() => {
  const n = chartBars.value.length
  const step = Math.max(1, Math.floor(n / 6))
  return chartBars.value.map((b, i) => (i % step === 0 || i === n - 1 ? b.label : ''))
})

const svcMap = computed(() => {
  const m = new Map<number, RawService>()
  for (const s of props.rawServicesList) m.set(s.service, s)
  return m
})

const topVolume = computed(() => {
  const map = new Map<number, { serviceId: number; name: string; count: number }>()
  for (const o of props.rawOrders) {
    if (!map.has(o.service_id)) {
      const svc = svcMap.value.get(o.service_id)
      map.set(o.service_id, { serviceId: o.service_id, name: svc?.name ?? o.service_name, count: 0 })
    }
    map.get(o.service_id)!.count++
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 8)
})

const maxVolume = computed(() => Math.max(...topVolume.value.map(s => s.count), 1))

const statusDist = computed(() => {
  const total = props.rawOrders.length || 1
  const cnt = (fn: (o: RawOrder) => boolean) => props.rawOrders.filter(fn).length
  return [
    { label: 'Completed',   count: cnt(o => o.status === 'completed'),                                  color: 'bg-emerald-500', textColor: 'text-emerald-400' },
    { label: 'Partial',     count: cnt(o => o.status === 'partial'),                                     color: 'bg-yellow-500',  textColor: 'text-yellow-400'  },
    { label: 'Processing',  count: cnt(o => o.status === 'processing'),                                  color: 'bg-blue-500',    textColor: 'text-blue-400'    },
    { label: 'In Progress', count: cnt(o => ['inprogress', 'in_progress'].includes(o.status)),           color: 'bg-violet-500',  textColor: 'text-violet-400'  },
    { label: 'Canceled',    count: cnt(o => ['canceled', 'cancelled'].includes(o.status)),               color: 'bg-red-500',     textColor: 'text-red-400'     },
  ].map(s => ({ ...s, pct: Math.round(s.count / total * 100) }))
})

const categoryPerf = computed(() => {
  const map = new Map<string, { total: number; success: number }>()
  for (const o of props.rawOrders) {
    const cat = svcMap.value.get(o.service_id)?.category ?? 'Lainnya'
    if (!map.has(cat)) map.set(cat, { total: 0, success: 0 })
    const e = map.get(cat)!
    e.total++
    if (['completed', 'partial'].includes(o.status)) e.success++
  }
  return [...map.entries()]
    .map(([label, { total, success }]) => ({
      label, total,
      successRate: total > 0 ? Math.round(success / total * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)
})

const summaryCards = computed(() => {
  const total = props.rawOrders.length
  const totalQty = props.rawOrders.reduce((s, o) => s + (Number(o.quantity) || 0), 0)
  const uniqueSvc = new Set(props.rawOrders.map(o => o.service_id)).size
  const completed = props.rawOrders.filter(o => ['completed', 'partial'].includes(o.status)).length
  const successRate = total > 0 ? Math.round(completed / total * 100) : 0
  return [
    { label: t('analitik.totalOrder'),    value: fmtNum(total),    sub: t('analitik.thisPeriod'),         icon: 'heroicons:rectangle-stack',  bg: 'bg-indigo-500/10',  color: 'text-indigo-400',  bar: 'bg-indigo-500'  },
    { label: t('analitik.totalQty'),      value: fmtNum(totalQty), sub: t('analitik.unitsProcessed'),    icon: 'heroicons:arrow-trending-up', bg: 'bg-emerald-500/10', color: 'text-emerald-400', bar: 'bg-emerald-500' },
    { label: t('analitik.successRate'),   value: successRate + '%',sub: t('analitik.completedPartial'),   icon: 'heroicons:check-circle',     bg: 'bg-teal-500/10',    color: 'text-teal-400',    bar: 'bg-teal-500'    },
    { label: t('analitik.activeServices'),value: String(uniqueSvc),sub: t('analitik.differentServices'), icon: 'heroicons:archive-box',       bg: 'bg-violet-500/10',  color: 'text-violet-400',  bar: 'bg-violet-500'  },
  ]
})
</script>
