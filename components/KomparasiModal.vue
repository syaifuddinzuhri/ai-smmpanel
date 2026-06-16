<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')" />

      <!-- Modal -->
      <div
        class="relative w-full sm:max-w-[860px] max-h-[80vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-white dark:bg-[#111827]"
        :style="{ border: '1px solid var(--border)' }"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-5 py-4 flex-shrink-0"
          :style="{ borderBottom: '1px solid var(--border)' }"
        >
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-5 rounded bg-gradient-to-b from-indigo-500 to-violet-600" />
            <span class="text-[15px] font-bold text-slate-900 dark:text-white">{{ t('modal.title') }}</span>
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold">
              {{ selected.length }}
            </span>
          </div>
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            :style="{ background: 'var(--bg-input)', border: '1px solid var(--border)' }"
            @click="$emit('close')"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-auto flex-1">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th
                    class="sticky left-0 z-10 text-left px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-32 bg-slate-50 dark:bg-[#0f1420]"
                    :style="{ borderBottom: '1px solid var(--border)' }"
                  >
                    {{ t('modal.metric') }}
                  </th>
                  <th
                    v-for="svc in selected"
                    :key="svc.service"
                    class="px-5 py-4 min-w-[200px] bg-slate-50 dark:bg-[#0f1420]"
                    :style="{ borderBottom: '1px solid var(--border)' }"
                  >
                    <div class="flex flex-col items-center gap-1.5">
                      <Icon :name="platformIcon(svc.name)" class="w-7 h-7" />
                      <p class="text-[12px] font-semibold text-slate-700 dark:text-white text-center leading-snug line-clamp-2 max-w-[180px]">
                        {{ svc.name }}
                      </p>
                      <span
                        class="text-[10px] text-slate-500 px-1.5 py-0.5 rounded"
                        :style="{ background: 'var(--bg-input)' }"
                      >ID {{ svc.service }}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in rows"
                  :key="row.key"
                  class="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
                  :style="{ borderBottom: '1px solid var(--border-sub)' }"
                >
                  <!-- Metric label -->
                  <td
                    class="sticky left-0 z-10 px-5 py-3.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap bg-white dark:bg-[#111827]"
                  >
                    {{ row.label }}
                  </td>

                  <!-- Cells -->
                  <td
                    v-for="(cell, ci) in row.cells"
                    :key="ci"
                    class="px-5 py-3.5 text-center"
                  >
                    <!-- Boolean -->
                    <template v-if="row.type === 'bool'">
                      <span
                        :class="[
                          'inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold border',
                          cell.value
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-500'
                        ]"
                      >
                        <Icon :name="cell.value ? 'heroicons:check' : 'heroicons:x-mark'" class="w-3 h-3" />
                        {{ cell.value ? t('modal.yes') : t('modal.no') }}
                      </span>
                    </template>

                    <!-- Number -->
                    <template v-else-if="row.type === 'number'">
                      <div class="flex flex-col items-center gap-1">
                        <span
                          :class="[
                            'text-[17px] font-bold tabular-nums',
                            cell.isBest ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                          ]"
                        >{{ cell.display }}</span>
                        <span
                          v-if="cell.isBest"
                          class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 uppercase tracking-wide"
                        >{{ t('modal.best') }}</span>
                      </div>
                    </template>

                    <!-- Health (Sehat/Tidak) -->
                    <template v-else-if="row.type === 'health'">
                      <template v-if="cell.total === 0">
                        <span class="text-slate-400 text-[12px]">{{ t('modal.noData') }}</span>
                      </template>
                      <template v-else>
                        <div class="flex flex-col items-center gap-1">
                          <span
                            :class="[
                              'inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold border',
                              (cell.cancelRate ?? 0) < 5
                                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-500 dark:text-red-400'
                            ]"
                          >
                            <Icon :name="(cell.cancelRate ?? 0) < 5 ? 'heroicons:check-circle' : 'heroicons:exclamation-triangle'" class="w-3 h-3" />
                            {{ (cell.cancelRate ?? 0) < 5 ? t('modal.healthy') : t('modal.attention') }}
                          </span>
                          <span class="text-[10px] text-slate-500">Cancel {{ cell.cancelRate?.toFixed(1) }}%</span>
                        </div>
                      </template>
                    </template>

                    <!-- Popularity (Laris/Tidak) -->
                    <template v-else-if="row.type === 'popular'">
                      <template v-if="cell.total === 0">
                        <span class="text-slate-400 text-[12px]">—</span>
                      </template>
                      <template v-else>
                        <div class="flex flex-col items-center gap-1">
                          <span
                            :class="[
                              'text-[17px] font-bold tabular-nums',
                              cell.isBest ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'
                            ]"
                          >{{ cell.display }}</span>
                          <span
                            v-if="cell.isBest"
                            class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 uppercase tracking-wide"
                          >{{ t('modal.popular') }}</span>
                          <span v-else class="text-[10px] text-slate-400">{{ t('modal.orders') }}</span>
                        </div>
                      </template>
                    </template>

                    <!-- Distribution bar -->
                    <template v-else-if="row.type === 'dist'">
                      <template v-if="!cell.dist || cell.dist.total === 0">
                        <span class="text-slate-400 text-[12px]">—</span>
                      </template>
                      <template v-else>
                        <div class="min-w-[130px]">
                          <div class="flex h-2 rounded-full overflow-hidden gap-px mb-2">
                            <div v-if="cell.dist.completed"  class="bg-emerald-500 transition-all" :style="{ flex: cell.dist.completed }" />
                            <div v-if="cell.dist.partial"    class="bg-yellow-400 transition-all" :style="{ flex: cell.dist.partial }" />
                            <div v-if="cell.dist.processing" class="bg-blue-500 transition-all"   :style="{ flex: cell.dist.processing }" />
                            <div v-if="cell.dist.inProgress" class="bg-violet-500 transition-all" :style="{ flex: cell.dist.inProgress }" />
                            <div v-if="cell.dist.canceled"   class="bg-red-400 transition-all"    :style="{ flex: cell.dist.canceled }" />
                          </div>
                          <div class="flex flex-wrap gap-x-2 gap-y-0.5 justify-center">
                            <span v-if="cell.dist.completed"  class="flex items-center gap-0.5 text-[9px] text-slate-500 dark:text-slate-400">
                              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />{{ pctOf(cell.dist.completed, cell.dist.total) }}%
                            </span>
                            <span v-if="cell.dist.partial"    class="flex items-center gap-0.5 text-[9px] text-slate-500 dark:text-slate-400">
                              <span class="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />{{ pctOf(cell.dist.partial, cell.dist.total) }}%
                            </span>
                            <span v-if="cell.dist.processing" class="flex items-center gap-0.5 text-[9px] text-slate-500 dark:text-slate-400">
                              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />{{ pctOf(cell.dist.processing, cell.dist.total) }}%
                            </span>
                            <span v-if="cell.dist.inProgress" class="flex items-center gap-0.5 text-[9px] text-slate-500 dark:text-slate-400">
                              <span class="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />{{ pctOf(cell.dist.inProgress, cell.dist.total) }}%
                            </span>
                            <span v-if="cell.dist.canceled"   class="flex items-center gap-0.5 text-[9px] text-slate-500 dark:text-slate-400">
                              <span class="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />{{ pctOf(cell.dist.canceled, cell.dist.total) }}%
                            </span>
                          </div>
                        </div>
                      </template>
                    </template>

                    <!-- Text fallback -->
                    <template v-else>
                      <span class="text-[13px] text-slate-700 dark:text-slate-300">{{ cell.display }}</span>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
          :style="{ borderTop: '1px solid var(--border)' }"
        >
          <p class="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Icon name="heroicons:light-bulb" class="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span v-html="t('modal.hint')"></span>
          </p>
          <button
            class="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white"
            :style="{ background: 'var(--bg-input)', border: '1px solid var(--border)' }"
            @click="$emit('close')"
          >
            {{ t('btn.close') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { RawService } from '~/server/api/services.get'
import type { RawOrder } from '~/server/api/orders.get'

const { t } = useLang()

const props = defineProps<{
  allServices: RawService[]
  ids: number[]
  rawOrders: RawOrder[]
}>()

defineEmits<{ close: [] }>()

onMounted(() => { document.body.style.overflow = 'hidden' })
onUnmounted(() => { document.body.style.overflow = '' })

const selected = computed(() =>
  props.ids
    .map(id => props.allServices.find(s => s.service === id))
    .filter((s): s is RawService => !!s)
)

function platformIcon(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('instagram')) return 'logos:instagram-icon'
  if (n.includes('tiktok') || n.includes('tik tok')) return 'logos:tiktok-icon'
  if (n.includes('youtube') || n.includes('you tube')) return 'logos:youtube-icon'
  if (n.includes('facebook') || n.includes('fb ')) return 'logos:facebook'
  if (n.includes('twitter') || n.includes('tweet')) return 'logos:twitter'
  if (n.includes('shopee')) return 'simple-icons:shopee'
  if (n.includes('spotify')) return 'logos:spotify'
  if (n.includes('telegram')) return 'logos:telegram'
  if (n.includes('google')) return 'logos:google'
  if (n.includes('thread')) return 'logos:thread'
  return 'heroicons:archive-box'
}

function fmtRate(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function fmtNum(n: number): string {
  return n.toLocaleString('id-ID')
}

function pctOf(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100)
}

type Dist = { total: number; completed: number; partial: number; processing: number; inProgress: number; canceled: number }
type Cell = {
  value: boolean | number | string
  display: string
  isBest: boolean
  cancelRate?: number
  total?: number
  dist?: Dist
}
type RowType = 'text' | 'number' | 'bool' | 'health' | 'popular' | 'dist'
type Row = { key: string; label: string; type: RowType; cells: Cell[] }

// Per-service order stats from rawOrders
const svcStats = computed(() => {
  const map = new Map<number, Dist>()
  for (const svc of selected.value) {
    const orders = props.rawOrders.filter(o => o.service_id === svc.service)
    const total = orders.length
    const completed  = orders.filter(o => o.status === 'completed').length
    const partial    = orders.filter(o => o.status === 'partial').length
    const processing = orders.filter(o => o.status === 'processing').length
    const inProgress = orders.filter(o => ['inprogress', 'in_progress'].includes(o.status)).length
    const canceled   = orders.filter(o => ['canceled', 'cancelled'].includes(o.status)).length
    map.set(svc.service, { total, completed, partial, processing, inProgress, canceled })
  }
  return map
})

const rows = computed((): Row[] => {
  const svcs = selected.value
  if (svcs.length < 2) return []

  const numRow = (
    key: string, label: string,
    get: (s: RawService) => number,
    fmt: (n: number) => string,
    winner: 'min' | 'max'
  ): Row => {
    const vals = svcs.map(get)
    const best = winner === 'min' ? Math.min(...vals) : Math.max(...vals)
    return { key, label, type: 'number', cells: vals.map(v => ({ value: v, display: fmt(v), isBest: v === best })) }
  }

  const boolRow = (key: string, label: string, get: (s: RawService) => boolean): Row => ({
    key, label, type: 'bool',
    cells: svcs.map(s => ({ value: get(s), display: '', isBest: false }))
  })

  const textRow = (key: string, label: string, get: (s: RawService) => string): Row => ({
    key, label, type: 'text',
    cells: svcs.map(s => ({ value: get(s), display: get(s) || '—', isBest: false }))
  })

  // Health row
  const healthCells: Cell[] = svcs.map(s => {
    const st = svcStats.value.get(s.service)
    const cancelRate = st && st.total > 0 ? (st.canceled / st.total) * 100 : 0
    return { value: cancelRate < 5, display: '', isBest: false, cancelRate, total: st?.total ?? 0 }
  })

  // Popularity row
  const orderCounts = svcs.map(s => svcStats.value.get(s.service)?.total ?? 0)
  const maxOrders = Math.max(...orderCounts, 1)
  const popularCells: Cell[] = orderCounts.map((v, i) => ({
    value: v, display: fmtNum(v), isBest: v === maxOrders && v > 0, total: v
  }))

  // Distribution row
  const distCells: Cell[] = svcs.map(s => {
    const st = svcStats.value.get(s.service)
    return { value: st?.total ?? 0, display: '', isBest: false, total: st?.total ?? 0, dist: st }
  })

  return [
    textRow('kategori', t('modal.colCategory'),    s => s.category),
    numRow('rate',      t('modal.colPrice'),        s => Number(s.rate) / 10, fmtRate, 'min'),
    { key: 'popular',  label: t('modal.colTotalOrder'),    type: 'popular', cells: popularCells },
    { key: 'health',   label: t('modal.colCondition'),     type: 'health',  cells: healthCells },
    boolRow('refill',  t('modal.colRefill'),        s => !!s.refill),
    boolRow('cancel',  t('modal.colCancel'),        s => !!s.cancel),
    numRow('min',      t('modal.colMinOrder'),      s => Number(s.min),  fmtNum,  'min'),
    numRow('max',      t('modal.colMaxOrder'),      s => Number(s.max),  fmtNum,  'max'),
    { key: 'dist',     label: t('modal.colDistribution'),  type: 'dist',    cells: distCells },
  ]
})
</script>
