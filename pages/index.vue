<template>
  <div class="min-h-screen bg-[#0b0d1a] relative overflow-x-hidden">
    <!-- Ambient glow -->
    <div class="pointer-events-none fixed top-[-5%] left-[15%] w-[800px] h-[600px] z-0 opacity-50"
      style="background: radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 65%)"></div>
    <div class="pointer-events-none fixed top-[50%] right-[-5%] w-[500px] h-[500px] z-0 opacity-30"
      style="background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)"></div>

    <AppHeader
      v-model:searchQuery="searchQuery"
      :isLoading="isLoading"
      :lastUpdate="lastUpdate"
      :platforms="platforms"
      :periods="periods"
      :selectedPlatform="selectedPlatform"
      :selectedPeriod="selectedPeriod"
      @update:selectedPlatform="selectedPlatform = $event"
      @update:selectedPeriod="selectedPeriod = $event"
    />

    <main class="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 relative z-[1]">

      <!-- Tab Switcher -->
      <div class="flex items-center gap-1 bg-[#111827]/60 border border-white/[0.06] rounded-xl p-1 mb-5 w-fit">
        <button
          v-for="tab in mainTabs"
          :key="tab.key"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200',
            activeTab === tab.key
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
          ]"
          @click="activeTab = tab.key"
        >
          <span>{{ tab.icon }}</span>
          <span class="hidden sm:inline">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Stat Cards — hanya di tab AI Rekomendasi -->
      <StatCards v-if="activeTab === 'rekomendasi'" :isLoading="isLoading" :stats="stats" />

      <!-- TAB: Monitor Layanan -->
      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'monitor'" key="monitor">
          <MonitorLayanan
            :services="filteredServices"
            :isLoading="isLoading"
            :stats="stats"
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
              @update:selectedSort="selectedSort = $event"
            />
            <AiSidebar
              :isLoading="isLoading"
              :aiInsight="aiInsight"
              :topPerformers="topPerformers"
              :riskyServices="riskyServices"
              :trendingServices="trendingServices"
            />
          </div>
        </div>
      </Transition>

      <!-- Footer -->
      <div class="mt-5 pb-5 flex items-center justify-between text-[11px] text-slate-700 border-t border-white/[0.04] pt-3">
        <span>SmmPanel AI · Multi-Factor Scoring Engine v1.0</span>
        <span v-if="!isLoading">Update terakhir: <span class="text-indigo-500/70">{{ lastUpdate }} WIB</span></span>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'AI Rekomendasi Layanan — SmmPanel',
  meta: [{ name: 'description', content: 'AI-powered SMM panel service recommendation dashboard' }]
})

const {
  isLoading, selectedPlatform, selectedPeriod, selectedSort,
  searchQuery, platforms, periods, sortOptions, filteredServices,
  stats, topPerformers, riskyServices, trendingServices, aiInsight, lastUpdate
} = useServices()

const activeTab = ref('rekomendasi')

const mainTabs = [
  { key: 'monitor', icon: '📡', label: 'Monitor Layanan' },
  { key: 'rekomendasi', icon: '🤖', label: 'AI Rekomendasi Layanan' },
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
</style>
