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
      <!-- Stats -->
      <StatCards :isLoading="isLoading" :stats="stats" />

      <!-- Main 2-col grid -->
      <div class="grid grid-cols-1 xl:grid-cols-[1fr_296px] gap-4">
        <!-- Left: Table with inline sort -->
        <ServiceTable
          :services="filteredServices"
          :isLoading="isLoading"
          :lastUpdate="lastUpdate"
          :sortOptions="sortOptions"
          :selectedSort="selectedSort"
          @update:selectedSort="selectedSort = $event"
        />

        <!-- Right: Tabbed sidebar -->
        <AiSidebar
          :isLoading="isLoading"
          :aiInsight="aiInsight"
          :topPerformers="topPerformers"
          :riskyServices="riskyServices"
          :trendingServices="trendingServices"
        />
      </div>

      <!-- Footer bar -->
      <div class="mt-4 pb-5 flex items-center justify-between text-[11px] text-slate-700 border-t border-white/[0.04] pt-3">
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
</script>
