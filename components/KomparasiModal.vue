<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')" />

      <!-- Modal -->
      <div
        class="relative w-full sm:max-w-[820px] max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-white dark:bg-[#111827]"
        :style="{ border: '1px solid var(--border)' }"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-5 py-4 flex-shrink-0"
          :style="{ borderBottom: '1px solid var(--border)' }"
        >
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-5 rounded bg-gradient-to-b from-indigo-500 to-violet-600" />
            <span class="text-[15px] font-bold text-slate-900 dark:text-white">Komparasi Layanan</span>
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
                    Metrik
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
                        {{ cell.value ? 'Ya' : 'Tidak' }}
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
                        >
                          {{ cell.display }}
                        </span>
                        <span
                          v-if="cell.isBest"
                          class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 uppercase tracking-wide"
                        >
                          Terbaik
                        </span>
                      </div>
                    </template>
                    <!-- Text -->
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
            Nilai <span class="text-emerald-400 font-semibold mx-0.5">terbaik</span> per metrik disorot hijau
          </p>
          <button
            class="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white"
            :style="{ background: 'var(--bg-input)', border: '1px solid var(--border)' }"
            @click="$emit('close')"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { RawService } from '~/server/api/services.get'

const props = defineProps<{
  allServices: RawService[]
  ids: number[]
}>()

defineEmits<{ close: [] }>()

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
  return 'Rp ' + n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function fmtNum(n: number): string {
  return n.toLocaleString('id-ID')
}

type Cell = { value: boolean | number | string; display: string; isBest: boolean }
type Row = { key: string; label: string; type: 'text' | 'number' | 'bool'; cells: Cell[] }

const rows = computed((): Row[] => {
  const svcs = selected.value
  if (svcs.length < 2) return []

  const numRow = (
    key: string,
    label: string,
    get: (s: RawService) => number,
    fmt: (n: number) => string,
    winner: 'min' | 'max'
  ): Row => {
    const vals = svcs.map(get)
    const best = winner === 'min' ? Math.min(...vals) : Math.max(...vals)
    return {
      key, label, type: 'number',
      cells: vals.map(v => ({ value: v, display: fmt(v), isBest: v === best }))
    }
  }

  const boolRow = (key: string, label: string, get: (s: RawService) => boolean): Row => ({
    key, label, type: 'bool',
    cells: svcs.map(s => ({ value: get(s), display: '', isBest: false }))
  })

  const textRow = (key: string, label: string, get: (s: RawService) => string): Row => ({
    key, label, type: 'text',
    cells: svcs.map(s => ({ value: get(s), display: get(s) || '—', isBest: false }))
  })

  return [
    textRow('kategori', 'Kategori', s => s.category),
    numRow('rate',  'Harga / 1000', s => Number(s.rate), fmtRate, 'min'),
    numRow('min',   'Min Order',    s => Number(s.min),  fmtNum,  'min'),
    numRow('max',   'Max Order',    s => Number(s.max),  fmtNum,  'max'),
    boolRow('refill', 'Refill',  s => !!s.refill),
    boolRow('cancel', 'Cancel',  s => !!s.cancel),
  ]
})
</script>
