<template>
  <div
    class="min-h-screen relative overflow-x-hidden"
    :style="{ background: 'var(--bg-page)' }"
  >
    <!-- Ambient glow -->
    <div
      class="pointer-events-none fixed top-[-5%] left-[15%] w-[800px] h-[600px] z-0 opacity-40"
      style="
        background: radial-gradient(
          ellipse,
          rgba(99, 102, 241, 0.07) 0%,
          transparent 65%
        );
      "
    ></div>

    <!-- Header: sama persis dengan halaman utama -->
    <AppHeader
      :isLoading="!!pending"
      :lastUpdate="data?.updatedAt ? formatTime(data.updatedAt) : ''"
      :fromCache="data?.fromCache ?? false"
      :apiError="error?.message ?? null"
      :showSubBar="false"
      :showResync="false"
    />

    <main class="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 relative z-[1]">
      <!-- Page title -->
      <h1
        class="text-slate-600 dark:text-white text-[20px] sm:text-[24px] font-bold mb-4"
      >
        Detail Monitoring Layanan
      </h1>

      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 mb-5 flex-wrap">
        <NuxtLink
          to="/"
          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all text-[12px] font-medium flex-shrink-0"
          :style="{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)'
          }"
        >
          <Icon name="heroicons:arrow-left" class="w-3.5 h-3.5" />
          Kembali
        </NuxtLink>
        <!-- <Icon name="heroicons:chevron-right" class="w-3 h-3 text-slate-700 flex-shrink-0" /> -->
        <div v-if="data" class="flex items-center gap-2 min-w-0">
          <Icon
            :name="platformIcon"
            class="w-4 h-4 flex-shrink-0 text-slate-400"
          />
          <p
            class="text-slate-700 dark:text-slate-300 text-[13px] font-medium truncate"
          >
            {{ data.serviceName }}
          </p>
          <span
            class="text-[10px] px-2 py-0.5 rounded-full text-slate-500 font-medium flex-shrink-0"
            :style="{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)'
            }"
          >
            ID {{ data.serviceId }}
          </span>
          <span
            class="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold flex-shrink-0"
          >
            <Icon name="heroicons:clock" class="w-2.5 h-2.5" />
            {{ period }}
          </span>
        </div>
      </div>

      <!-- Loading -->
      <div
        v-if="pending"
        class="flex flex-col items-center justify-center py-24 gap-4"
      >
        <div class="relative w-12 h-12">
          <div
            class="absolute inset-0 border-2 border-indigo-500/20 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin"
          ></div>
        </div>
        <p class="text-slate-500 text-[13px]">Memuat riwayat transaksi...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="card p-10 text-center">
        <Icon
          name="heroicons:exclamation-triangle"
          class="w-10 h-10 text-red-400 opacity-60 mx-auto mb-3"
        />
        <p class="text-slate-300 font-medium">Gagal memuat data</p>
        <p class="text-slate-600 text-[12px] mt-1">{{ error.message }}</p>
      </div>

      <!-- No data -->
      <div v-else-if="data && data.total === 0" class="card p-12 text-center">
        <Icon
          name="heroicons:archive-box"
          class="w-10 h-10 text-slate-600 mx-auto mb-3"
        />
        <p class="text-slate-400 font-medium">Belum ada transaksi</p>
        <p class="text-slate-600 text-[12px] mt-1">
          Tidak ada order tercatat untuk layanan ini
        </p>
      </div>

      <template v-else-if="data">
        <!-- Hero card -->
        <div class="card p-5 sm:p-6 mb-4">
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <div class="flex-1 min-w-0">
              <p
                class="text-[11px] font-semibold uppercase tracking-widest text-slate-600 mb-1.5"
              >
                Status Layanan
              </p>
              <h1
                class="text-slate-900 dark:text-white text-[17px] sm:text-[19px] font-bold leading-snug mb-3"
              >
                {{ data.serviceName }}
              </h1>
              <div class="flex items-center flex-wrap gap-2">
                <span
                  class="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border font-semibold"
                  :class="
                    data.completionRate >= 90
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                      : data.completionRate >= 70
                        ? 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400'
                        : 'bg-red-500/10 border-red-500/25 text-red-400'
                  "
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full animate-pulse"
                    :class="
                      data.completionRate >= 90
                        ? 'bg-emerald-400'
                        : data.completionRate >= 70
                          ? 'bg-yellow-400'
                          : 'bg-red-400'
                    "
                  ></span>
                  {{
                    data.completionRate >= 90
                      ? "Lancar"
                      : data.completionRate >= 70
                        ? "Normal"
                        : "Perlu Perhatian"
                  }}
                </span>
                <span
                  class="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium"
                >
                  {{ data.serviceType || "Layanan SMM" }}
                </span>
                <span
                  class="flex items-center gap-1 text-[11px] text-slate-600"
                >
                  <Icon name="heroicons:rectangle-stack" class="w-3 h-3" />
                  {{ data.total.toLocaleString("id-ID") }} transaksi
                </span>
              </div>
            </div>
            <!-- Completion rate -->
            <div class="flex-shrink-0 text-right hidden md:block">
              <p
                :class="[
                  'text-[48px] sm:text-[56px] font-black leading-none tabular-nums',
                  data.completionRate >= 90
                    ? 'text-emerald-400'
                    : data.completionRate >= 70
                      ? 'text-yellow-400'
                      : 'text-red-400'
                ]"
              >
                {{ data.completionRate }}%
              </p>
              <p class="text-slate-600 text-[12px] mt-1">
                dari {{ data.total }} transaksi
              </p>
            </div>
          </div>

          <!-- Distribution bar -->
          <div class="mt-5 flex items-center gap-4">
            <div class="w-full">
              <p
                class="text-[11px] font-semibold uppercase tracking-widest text-slate-600 mb-2.5"
              >
                Distribusi Status
              </p>
              <div class="flex h-2.5 rounded-full overflow-hidden gap-0.5">
                <div
                  v-if="data.completed"
                  class="bg-emerald-500 transition-all"
                  :style="{ flex: data.completed }"
                ></div>
                <div
                  v-if="data.partial"
                  class="bg-yellow-500 transition-all"
                  :style="{ flex: data.partial }"
                ></div>
                <div
                  v-if="data.processing"
                  class="bg-blue-500 transition-all"
                  :style="{ flex: data.processing }"
                ></div>
                <div
                  v-if="data.inProgress"
                  class="bg-violet-500 transition-all"
                  :style="{ flex: data.inProgress }"
                ></div>
                <div
                  v-if="data.canceled"
                  class="bg-red-500/70 transition-all"
                  :style="{ flex: data.canceled }"
                ></div>
                <div
                  v-if="data.total === 0"
                  class="bg-slate-200 dark:bg-white/5 flex-1"
                ></div>
              </div>
              <div class="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5">
                <span
                  v-if="data.completed"
                  class="flex items-center gap-1.5 text-[11px] text-slate-500"
                >
                  <span
                    class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"
                  ></span>
                  Completed ({{ pct(data.completed) }}%)
                </span>
                <span
                  v-if="data.partial"
                  class="flex items-center gap-1.5 text-[11px] text-slate-500"
                >
                  <span
                    class="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"
                  ></span>
                  Partial ({{ pct(data.partial) }}%)
                </span>
                <span
                  v-if="data.processing"
                  class="flex items-center gap-1.5 text-[11px] text-slate-500"
                >
                  <span
                    class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"
                  ></span>
                  Processing ({{ pct(data.processing) }}%)
                </span>
                <span
                  v-if="data.inProgress"
                  class="flex items-center gap-1.5 text-[11px] text-slate-500"
                >
                  <span
                    class="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0"
                  ></span>
                  In Progress ({{ pct(data.inProgress) }}%)
                </span>
                <span
                  v-if="data.canceled"
                  class="flex items-center gap-1.5 text-[11px] text-slate-500"
                >
                  <span
                    class="w-2 h-2 rounded-full bg-red-500/70 flex-shrink-0"
                  ></span>
                  Canceled ({{ pct(data.canceled) }}%)
                </span>
              </div>
            </div>
            <div class="flex-shrink-0 text-right block md:hidden">
              <p
                :class="[
                  'text-[36px] sm:text-[56px] font-black leading-none tabular-nums',
                  data.completionRate >= 90
                    ? 'text-emerald-400'
                    : data.completionRate >= 70
                      ? 'text-yellow-400'
                      : 'text-red-400'
                ]"
              >
                {{ data.completionRate }}%
              </p>
              <p class="text-slate-600 text-[12px] mt-1">
                dari {{ data.total }} transaksi
              </p>
            </div>
          </div>
        </div>

        <!-- Status cards -->
        <div class="grid grid-cols-6 lg:grid-cols-5 gap-3 mb-4">
          <div
            v-for="(s, i) in statusCards"
            :key="s.label"
            :class="[
              'relative overflow-hidden rounded-xl p-3.5 lg:p-4 transition-all hover:scale-[1.01]',
              i < 2 ? 'col-span-3 lg:col-span-1' : 'col-span-2 lg:col-span-1'
            ]"
            :style="{ background: 'var(--bg-a70)', border: '1px solid var(--border)' }"
          >
            <!-- Top accent bar -->
            <div :class="['absolute top-0 left-0 right-0 h-0.5', s.barColor]"></div>

            <!-- Watermark icon -->
            <Icon :name="s.icon" :class="['absolute bottom-2 right-2 w-10 h-10 opacity-[0.06]', s.color]" />

            <!-- Icon + percentage -->
            <div class="flex items-center justify-between mb-2.5">
              <div :class="['w-7 h-7 rounded-lg flex items-center justify-center', s.bg]">
                <Icon :name="s.icon" :class="['w-3.5 h-3.5', s.color]" />
              </div>
              <span :class="['text-[10px] font-bold px-1.5 py-0.5 rounded-full', s.bg, s.color]">
                {{ pct(s.count) }}%
              </span>
            </div>

            <!-- Count -->
            <p :class="['text-[24px] lg:text-[28px] font-black leading-none tabular-nums mb-0.5', s.color]">
              {{ s.count.toLocaleString("id-ID") }}
            </p>
            <p class="text-slate-500 dark:text-slate-600 text-[11px] font-medium truncate">{{ s.label }}</p>

            <!-- Progress bar -->
            <div class="mt-3 h-1 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
              <div
                :class="['h-full rounded-full transition-all duration-700', s.barColor]"
                :style="{ width: pct(s.count) + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Transaction history -->
        <div class="card overflow-hidden">
          <!-- Header + filter tabs -->
          <div
            class="px-5 pt-5 pb-3"
            :style="{ borderBottom: '1px solid var(--border)' }"
          >
            <div class="flex items-center justify-between gap-3 mb-4">
              <div class="flex items-center gap-2">
                <div
                  class="w-1.5 h-5 rounded bg-gradient-to-b from-indigo-500 to-violet-600"
                ></div>
                <span
                  class="text-[14px] font-bold text-slate-900 dark:text-white"
                  >Riwayat Transaksi</span
                >
              </div>
              <span class="text-[11px] text-slate-500"
                >{{ filteredOrders.length }} transaksi</span
              >
            </div>
            <!-- Status filter tabs -->
            <div class="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              <button
                v-for="f in statusFilters"
                :key="f.key"
                :class="[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap flex-shrink-0',
                  activeFilter === f.key
                    ? 'bg-indigo-500/20 text-indigo-500 dark:text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-[var(--row-hover)]'
                ]"
                @click="
                  activeFilter = f.key;
                  currentPage = 1;
                "
              >
                {{ f.label }}
                <span
                  v-if="f.count > 0"
                  :class="[
                    'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                    activeFilter === f.key
                      ? 'dark:bg-indigo-500/30 dark:text-indigo-300 text-white bg-indigo-500/60'
                      : 'bg-slate-200 dark:bg-white/[0.06] text-slate-500'
                  ]"
                  >{{ f.count }}</span
                >
              </button>
            </div>
          </div>

          <!-- Table desktop -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr :style="{ background: 'var(--bg-subtle)' }">
                  <th
                    class="text-left px-5 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest w-10"
                  >
                    #
                  </th>
                  <th
                    class="text-left px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest"
                  >
                    Target / Link
                  </th>
                  <th
                    class="text-center px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest w-24"
                  >
                    Jumlah
                  </th>
                  <th
                    class="text-center px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest w-20"
                  >
                    Sisa
                  </th>
                  <th
                    class="text-center px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest w-32"
                  >
                    Waktu
                  </th>
                  <th
                    class="text-center px-3 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest w-28"
                  >
                    Status
                  </th>
                  <th
                    class="text-right px-5 py-2.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest w-32"
                  >
                    Selesai
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-white/[0.03]">
                <tr
                  v-for="(order, i) in paginatedOrders"
                  :key="order.id"
                  class="hover:bg-slate-50 dark:hover:bg-indigo-500/[0.03] transition-colors group"
                >
                  <td class="px-5 py-3 text-slate-600 text-[12px]">
                    {{ (currentPage - 1) * perPage + i + 1 }}
                  </td>
                  <td class="px-3 py-3">
                    <p
                      v-if="order.link"
                      class="text-slate-700 dark:text-slate-300 text-[12px] truncate max-w-[300px]"
                      :title="order.link"
                    >
                      {{ order.link }}
                    </p>
                    <p v-else class="text-slate-600 text-[12px] italic">—</p>
                    <p class="text-slate-600 text-[10px] mt-0.5">
                      ID: {{ order.id }}
                    </p>
                  </td>
                  <td class="px-3 py-3 text-center">
                    <span
                      class="text-slate-800 dark:text-slate-200 text-[13px] font-semibold tabular-nums"
                      >{{
                        Number(order.quantity).toLocaleString("id-ID")
                      }}</span
                    >
                  </td>
                  <td class="px-3 py-3 text-center">
                    <span
                      :class="[
                        'text-[13px] tabular-nums',
                        (order.remains ?? 0) > 0
                          ? 'text-yellow-400'
                          : 'text-slate-600'
                      ]"
                    >
                      {{ (order.remains ?? 0).toLocaleString("id-ID") }}
                    </span>
                  </td>
                  <td class="px-3 py-3 text-center">
                    <span class="text-slate-400 text-[12px]">{{
                      formatDate(order.created_timestamp)
                    }}</span>
                  </td>
                  <td class="px-3 py-3 text-center">
                    <span
                      :class="[
                        'text-[11px] px-2 py-1 rounded-full font-semibold border',
                        statusStyle(order.status).cls
                      ]"
                    >
                      {{ statusStyle(order.status).label }}
                    </span>
                  </td>
                  <td class="px-5 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <div
                        class="w-16 h-1.5 bg-slate-200 dark:bg-white/[0.05] rounded-full overflow-hidden"
                      >
                        <div
                          class="h-full rounded-full transition-all"
                          :class="statusStyle(order.status).barColor"
                          :style="{ width: completionPct(order) + '%' }"
                        ></div>
                      </div>
                      <span
                        :class="[
                          'text-[12px] font-semibold tabular-nums w-10 text-right',
                          statusStyle(order.status).textColor
                        ]"
                      >
                        {{ completionPct(order) }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile cards -->
          <div
            class="md:hidden divide-y divide-slate-100 dark:divide-white/[0.04]"
          >
            <div
              v-for="(order, i) in paginatedOrders"
              :key="order.id"
              class="p-4"
            >
              <div class="flex items-start justify-between gap-3 mb-2">
                <div class="min-w-0 flex-1">
                  <p class="text-slate-600 text-[10px] mb-0.5">
                    ID: {{ order.id }} · #{{
                      (currentPage - 1) * perPage + i + 1
                    }}
                  </p>
                  <p
                    v-if="order.link"
                    class="text-slate-700 dark:text-slate-300 text-[12px] truncate"
                  >
                    {{ order.link }}
                  </p>
                  <p v-else class="text-slate-600 text-[12px] italic">
                    Tidak ada link
                  </p>
                </div>
                <span
                  :class="[
                    'text-[11px] px-2 py-0.5 rounded-full font-semibold border flex-shrink-0',
                    statusStyle(order.status).cls
                  ]"
                >
                  {{ statusStyle(order.status).label }}
                </span>
              </div>
              <div class="flex items-center gap-4 text-[12px]">
                <span class="text-slate-500"
                  >Jumlah:
                  <span
                    class="text-slate-700 dark:text-slate-300 font-semibold"
                    >{{ Number(order.quantity).toLocaleString("id-ID") }}</span
                  ></span
                >
                <span class="text-slate-500"
                  >Sisa:
                  <span
                    :class="
                      (order.remains ?? 0) > 0
                        ? 'text-yellow-400 font-semibold'
                        : 'text-slate-600'
                    "
                    >{{ (order.remains ?? 0).toLocaleString("id-ID") }}</span
                  ></span
                >
                <span class="text-slate-600 ml-auto">{{
                  formatDate(order.created_timestamp)
                }}</span>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <div
                  class="flex-1 h-1.5 bg-slate-200 dark:bg-white/[0.05] rounded-full overflow-hidden"
                >
                  <div
                    class="h-full rounded-full"
                    :class="statusStyle(order.status).barColor"
                    :style="{ width: completionPct(order) + '%' }"
                  ></div>
                </div>
                <span
                  :class="[
                    'text-[11px] font-semibold tabular-nums',
                    statusStyle(order.status).textColor
                  ]"
                  >{{ completionPct(order) }}%</span
                >
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="flex items-center justify-between px-5 py-3.5"
            :style="{ borderTop: '1px solid var(--border-sub)' }"
          >
            <p class="text-[11px] text-slate-600">
              Menampilkan {{ (currentPage - 1) * perPage + 1 }}–{{
                Math.min(currentPage * perPage, filteredOrders.length)
              }}
              dari {{ filteredOrders.length }} transaksi
            </p>
            <div class="flex items-center gap-1">
              <button
                :disabled="currentPage === 1"
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:bg-[var(--btn-hover)] hover:text-slate-900 dark:hover:text-white"
                @click="currentPage--"
              >
                <Icon name="heroicons:chevron-left" class="w-4 h-4" />
              </button>
              <button
                v-for="p in pageNumbers"
                :key="p"
                :class="[
                  'w-8 h-8 rounded-lg text-[12px] font-semibold transition-all',
                  p === currentPage
                    ? 'bg-indigo-600 text-white'
                    : p === '...'
                      ? 'text-slate-600 cursor-default'
                      : 'text-slate-500 hover:bg-[var(--btn-hover)] hover:text-slate-900 dark:hover:text-white'
                ]"
                @click="typeof p === 'number' && (currentPage = p)"
              >
                {{ p }}
              </button>
              <button
                :disabled="currentPage === totalPages"
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 hover:bg-[var(--btn-hover)] hover:text-slate-900 dark:hover:text-white"
                @click="currentPage++"
              >
                <Icon name="heroicons:chevron-right" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Empty filter state -->
          <div v-if="filteredOrders.length === 0" class="py-12 text-center">
            <Icon
              name="heroicons:funnel"
              class="w-8 h-8 text-slate-700 mx-auto mb-2"
            />
            <p class="text-slate-500 text-[13px]">
              Tidak ada transaksi dengan status ini
            </p>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { ServiceOrderStats } from "~/server/api/service-orders.get";
import type { RawOrder } from "~/server/api/orders.get";

const route = useRoute();
const serviceId = Number(route.params.id);

const PERIODS = ["6J", "24J", "48J", "7 Hari"];
const period = ref((route.query.period as string) ?? "7 Hari");

// Deklarasi lebih awal agar bisa direset di watch
const activeFilter = ref("all");
const currentPage = ref(1);

const { data, pending, error, refresh } = await useFetch<ServiceOrderStats>(
  "/api/service-orders",
  {
    query: computed(() => ({ serviceId, period: period.value }))
  }
);

// Ganti period → reset filter & halaman, fetch cache/API baru
watch(period, () => {
  activeFilter.value = "all";
  currentPage.value = 1;
  refresh();
});

const resyncing = ref(false);
async function resyncData() {
  resyncing.value = true;
  try {
    await $fetch("/api/service-orders/resync", {
      method: "POST",
      body: { serviceId, period: period.value }
    });
    await refresh();
  } catch {
    // silently ignore — data tetap tampil dari cache
  } finally {
    resyncing.value = false;
  }
}
const resync = resyncData;

useHead({
  title: computed(() =>
    data.value
      ? `${data.value.serviceName} — SmmBuzzer`
      : "Detail Layanan — SmmBuzzer"
  )
});

// Platform icon detection
const platformIcon = computed(() => {
  if (!data.value) return "heroicons:archive-box";
  const n = data.value.serviceName.toLowerCase();
  if (n.includes("instagram")) return "logos:instagram-icon";
  if (n.includes("tiktok")) return "logos:tiktok-icon";
  if (n.includes("youtube")) return "logos:youtube-icon";
  if (n.includes("facebook")) return "logos:facebook";
  if (n.includes("twitter") || n.includes("tweet")) return "logos:twitter";
  if (n.includes("shopee")) return "simple-icons:shopee";
  if (n.includes("spotify")) return "logos:spotify";
  if (n.includes("telegram")) return "logos:telegram";
  if (n.includes("google")) return "logos:google";
  if (n.includes("thread")) return "logos:thread";
  return "heroicons:archive-box";
});

// Status cards config
const statusCards = computed(() => {
  if (!data.value) return [];
  return [
    { label: "Completed",  count: data.value.completed,  icon: "heroicons:check-circle", bg: "bg-emerald-500/10", color: "text-emerald-400", barColor: "bg-emerald-500" },
    { label: "Partial",    count: data.value.partial,    icon: "heroicons:clock",        bg: "bg-yellow-500/10", color: "text-yellow-400",  barColor: "bg-yellow-500"  },
    { label: "Processing", count: data.value.processing, icon: "heroicons:arrow-path",   bg: "bg-blue-500/10",   color: "text-blue-400",    barColor: "bg-blue-500"    },
    { label: "In Progress",count: data.value.inProgress, icon: "heroicons:play-circle",  bg: "bg-violet-500/10", color: "text-violet-400",  barColor: "bg-violet-500"  },
    { label: "Canceled",   count: data.value.canceled,   icon: "heroicons:x-circle",     bg: "bg-red-500/10",    color: "text-red-400",     barColor: "bg-red-500"     }
  ];
});

// Filters
const statusFilters = computed(() => {
  if (!data.value) return [];
  return [
    { key: "all", label: "Semua", count: data.value.total },
    { key: "completed", label: "Completed", count: data.value.completed },
    { key: "partial", label: "Partial", count: data.value.partial },
    { key: "processing", label: "Processing", count: data.value.processing },
    { key: "inprogress", label: "In Progress", count: data.value.inProgress },
    { key: "canceled", label: "Canceled", count: data.value.canceled }
  ].filter((f) => f.key === "all" || f.count > 0);
});

const filteredOrders = computed(() => {
  if (!data.value) return [];
  if (activeFilter.value === "all") return data.value.orders;
  return data.value.orders.filter((o) => {
    const s = o.status.toLowerCase().replace("_", "");
    if (activeFilter.value === "canceled")
      return s === "canceled" || s === "cancelled";
    if (activeFilter.value === "inprogress")
      return s === "inprogress" || s === "in_progress";
    return s === activeFilter.value;
  });
});

// Pagination
const perPage = 10;
const totalPages = computed(() =>
  Math.ceil(filteredOrders.value.length / perPage)
);
const paginatedOrders = computed(() =>
  filteredOrders.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  )
);

const pageNumbers = computed(() => {
  const total = totalPages.value;
  const cur = currentPage.value;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | string)[] = [1];
  if (cur > 3) pages.push("...");
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++)
    pages.push(i);
  if (cur < total - 2) pages.push("...");
  pages.push(total);
  return pages;
});

// Helpers
function pct(n: number) {
  if (!data.value || data.value.total === 0) return 0;
  return Math.round((n / data.value.total) * 100);
}

function completionPct(order: RawOrder) {
  const qty = Number(order.quantity) || 0;
  const rem = Number(order.remains ?? 0);
  if (qty === 0) return 0;
  const s = order.status.toLowerCase();
  if (s === "completed") return 100;
  if (s === "canceled" || s === "cancelled") return 0;
  return Math.round(((qty - rem) / qty) * 100);
}

function statusStyle(status: string) {
  const s = status.toLowerCase();
  if (s === "completed")
    return {
      label: "Completed",
      cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      barColor: "bg-emerald-500",
      textColor: "text-emerald-400"
    };
  if (s === "partial")
    return {
      label: "Partial",
      cls: "bg-yellow-500/10  border-yellow-500/20  text-yellow-400",
      barColor: "bg-yellow-500",
      textColor: "text-yellow-400"
    };
  if (s === "processing")
    return {
      label: "Processing",
      cls: "bg-blue-500/10    border-blue-500/20    text-blue-400",
      barColor: "bg-blue-500",
      textColor: "text-blue-400"
    };
  if (s === "inprogress" || s === "in_progress")
    return {
      label: "In Progress",
      cls: "bg-violet-500/10 border-violet-500/20 text-violet-400",
      barColor: "bg-violet-500",
      textColor: "text-violet-400"
    };
  if (s === "canceled" || s === "cancelled")
    return {
      label: "Canceled",
      cls: "bg-red-500/10 border-red-500/20 text-red-400",
      barColor: "bg-red-500/70",
      textColor: "text-red-400"
    };
  return {
    label: status,
    cls: "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400",
    barColor: "bg-slate-500",
    textColor: "text-slate-400"
  };
}

function formatDate(ts?: number) {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
</script>
