<template>
  <div class="min-h-screen relative overflow-x-hidden" :style="{ background: 'var(--bg-page)' }">
    <!-- Ambient glow -->
    <div class="pointer-events-none fixed top-[-5%] left-[15%] w-[800px] h-[600px] z-0 opacity-50"
      style="background: radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 65%)"></div>
    <div class="pointer-events-none fixed top-[50%] right-[-5%] w-[500px] h-[500px] z-0 opacity-30"
      style="background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)"></div>

    <AppHeader
      v-model:searchQuery="searchQuery"
      :isLoading="isLoading"
      :lastUpdate="lastUpdate"
      :fromCache="fromCache"
      :apiError="apiError"
      :platforms="platforms"
      :periods="periods"
      :selectedPlatform="selectedPlatform"
      :selectedPeriod="selectedPeriod"
      :showPlatformFilter="activeTab !== 'analitik'"
      @update:selectedPlatform="selectedPlatform = $event"
      @update:selectedPeriod="selectedPeriod = $event"
      @resync="resync"
    />

    <main class="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 relative z-[1]">

      <!-- Tabs -->
      <div class="flex overflow-x-auto scrollbar-hide gap-1 rounded-xl p-1 mb-3" :style="{ background: 'var(--bg-a60)', border: '1px solid var(--border)' }">
        <button
          v-for="tab in mainTabs"
          :key="tab.key"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0',
            activeTab === tab.key
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-[var(--row-hover)]'
          ]"
          @click="activeTab = tab.key"
        >
          <Icon :name="tab.icon" class="w-4 h-4 flex-shrink-0" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Search -->
      <div class="relative mb-5 max-w-full">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <input
          :value="searchQuery"
          :disabled="isLoading"
          type="text"
          placeholder="Cari nama atau ID layanan..."
          class="w-full rounded-xl py-2 pl-9 pr-8 text-[13px] text-slate-700 dark:text-slate-200 outline-none transition-all focus:border-indigo-500/40 placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
          :style="{ background: 'var(--bg-a60)', border: '1px solid var(--border)' }"
          @input="searchQuery = ($event.target as HTMLInputElement).value"
        />
        <button
          v-if="searchQuery"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
          @click="searchQuery = ''"
        >
          <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Stat Cards — hanya di tab AI Rekomendasi -->
      <StatCards v-if="activeTab === 'rekomendasi'" :isLoading="isLoading" :stats="stats" />

      <!-- TAB content -->
      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'monitor'" key="monitor">
          <MonitorLayanan
            :services="rawServicesList"
            :isLoading="isLoading"
            :searchQuery="searchQuery"
            :selectedPlatform="selectedPlatform"
            :selectedPeriod="selectedPeriod"
          />
        </div>

        <!-- TAB: Analitik -->
        <div v-else-if="activeTab === 'analitik'" key="analitik">
          <AnalitikPanel
            :rawOrders="rawOrders"
            :rawServicesList="rawServicesList"
            :isLoading="isLoading"
            :selectedPeriod="selectedPeriod"
          />
        </div>

        <!-- TAB: AI Rekomendasi -->
        <div v-else key="rekomendasi">
          <div class="grid grid-cols-1 xl:grid-cols-[1fr_296px] gap-4">
            <ServiceTable
              :services="filteredServices"
              :isLoading="isLoading"
              :lastUpdate="lastUpdate"
              :sortOptions="sortOptions"
              :selectedSort="selectedSort"
              :selectedPeriod="selectedPeriod"
              class="order-2 xl:order-1"
              @update:selectedSort="selectedSort = $event"
            />
            <AiSidebar
              :isLoading="isLoading"
              :aiInsight="aiInsight"
              :aiInsightLoading="aiInsightLoading"
              :topPerformers="topPerformers"
              :riskyServices="riskyServices"
              :trendingServices="trendingServices"
              class="order-1 xl:order-2"
            />
          </div>
        </div>
      </Transition>

      <!-- Footer -->
      <div class="mt-5 pb-5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-700 pt-3" :style="{ borderTop: '1px solid var(--border-sub)' }">
        <span>SmmBuzzer · Dashboard Monitoring</span>
        <span v-if="!isLoading">Update terakhir: <span class="text-indigo-500/70">{{ lastUpdate }} WIB</span></span>
      </div>
    </main>

    <!-- Scroll to top -->
    <Transition name="scroll-top">
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-indigo-600/90 hover:bg-indigo-500 border border-indigo-500/40 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white backdrop-blur-sm transition-colors duration-200"
        aria-label="Scroll to top"
      >
        <Icon name="heroicons:chevron-up" class="w-4 h-4" />
      </button>
    </Transition>

    <!-- Floating comparison bar -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <Transition name="slide-up">
        <div
          v-if="comparisonCount > 0"
          class="pointer-events-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-2xl shadow-2xl shadow-black/30"
          :style="{ background: 'var(--bg-card)', border: '1px solid var(--border)' }"
        >
          <Icon name="heroicons:arrows-right-left" class="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span class="text-[12px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
            {{ comparisonCount }} layanan dipilih
          </span>
          <button
            class="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[12px] font-semibold whitespace-nowrap shadow-lg shadow-indigo-500/25 disabled:opacity-50"
            :disabled="comparisonCount < 2"
            @click="showComparison = true"
          >
            Bandingkan
          </button>
          <button
            class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
            :style="{ background: 'var(--bg-input)', border: '1px solid var(--border)' }"
            @click="clearComparison"
          >
            <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
          </button>
        </div>
      </Transition>
    </div>

    <!-- Comparison Modal -->
    <KomparasiModal
      v-if="showComparison"
      :allServices="rawServicesList"
      :ids="comparisonIds"
      @close="showComparison = false"
    />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Monitoring Layanan - SmmBuzzer',
  meta: [{ name: 'description', content: 'AI-powered SMM panel service recommendation dashboard' }]
})

const {
  isLoading, fromCache, apiError, resync,
  selectedPlatform, selectedPeriod, selectedSort,
  searchQuery, platforms, periods, sortOptions, filteredServices,
  rawOrders, rawServicesList,
  stats, topPerformers, riskyServices, trendingServices,
  aiInsight, aiInsightLoading, lastUpdate
} = useServices()

const activeTab = ref('monitor')

const { ids: comparisonIds, clear: clearComparison, count: comparisonCount } = useComparison()
const showComparison = ref(false)

const showScrollTop = ref(false)

onMounted(() => {
  const onScroll = () => { showScrollTop.value = window.scrollY > 300 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const mainTabs = [
  { key: 'monitor',     icon: 'heroicons:signal',    label: 'Monitoring Layanan' },
  { key: 'rekomendasi', icon: 'heroicons:cpu-chip',  label: 'AI Rekomendasi' },
  { key: 'analitik',   icon: 'heroicons:chart-bar',  label: 'Analitik' },
]
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
