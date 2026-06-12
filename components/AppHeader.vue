<template>
  <div>
    <!-- Main nav — selalu sticky di semua ukuran -->
    <header class="sticky top-0 z-50 bg-[#0b0d1a]/95 backdrop-blur-xl border-b border-white/[0.06]">
      <div class="max-w-[1400px] mx-auto flex items-center h-[56px] px-4 sm:px-6 gap-4">
        <!-- Logo -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="relative">
            <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-base shadow-lg shadow-indigo-500/30">
              🤖
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0b0d1a]"
              :class="isLoading ? 'bg-amber-400' : 'bg-emerald-400'"></div>
          </div>
          <div class="hidden sm:block">
            <p class="text-white text-[14px] font-bold leading-none">SmmPanel</p>
            <p class="text-indigo-400 text-[10px] font-medium leading-none mt-0.5">AI Dashboard</p>
          </div>
        </div>

        <!-- Divider -->
        <div class="hidden sm:block w-px h-6 bg-white/10 mx-1"></div>

        <!-- Search -->
        <div class="flex-1 max-w-[500px] relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            :value="searchQuery"
            type="text"
            placeholder="Cari ID atau nama layanan..."
            class="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg py-[7px] pl-9 pr-4 text-[13px] text-slate-200 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.06] placeholder:text-slate-600"
            @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="ml-auto flex items-center gap-2">
          <!-- Update time: hanya desktop -->
          <div v-if="!isLoading" class="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Update terakhir: <span class="text-indigo-400 font-medium">{{ lastUpdate }} WIB</span>
          </div>
          <!-- Resync: semua ukuran (teks hidden di mobile) -->
          <button
            v-if="!isLoading"
            @click="$emit('resync')"
            title="Resync data"
            class="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all duration-200 text-[11px] font-medium"
          >
            <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            <span class="hidden sm:inline">Resync</span>
          </button>
          <!-- Status pill -->
          <div :class="[
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest border uppercase',
            isLoading
              ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
              : apiError
                ? 'bg-red-500/10 border-red-500/25 text-red-400'
                : fromCache
                  ? 'bg-slate-500/10 border-slate-500/25 text-slate-400'
                  : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
          ]">
            <span :class="['w-1.5 h-1.5 rounded-full animate-pulse', isLoading ? 'bg-amber-400' : apiError ? 'bg-red-400' : fromCache ? 'bg-slate-400' : 'bg-emerald-400']"></span>
            {{ isLoading ? 'Updating' : apiError ? 'Error' : fromCache ? 'Cached' : 'Live' }}
          </div>
        </div>
      </div>
    </header>

    <!-- Sub-bar: sticky di sm+ (tablet/desktop), normal flow di mobile -->
    <div class="sm:sticky sm:top-[56px] sm:z-40">
      <!-- Desktop tabs -->
      <div class="hidden sm:block bg-[#0d1020]/90 backdrop-blur-xl border-b border-white/[0.04] overflow-x-auto scrollbar-hide">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center h-10 gap-0.5 min-w-max">
          <button
            v-for="p in platforms"
            :key="p.label"
            :class="[
              'flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium transition-all whitespace-nowrap',
              selectedPlatform === p.label
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
            ]"
            @click="$emit('update:selectedPlatform', p.label)"
          >
            <span v-if="p.icon" class="text-[13px]">{{ p.icon }}</span>
            <svg v-else class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
            {{ p.label }}
          </button>
          <div class="ml-auto flex items-center gap-2 pl-4">
            <div class="h-4 w-px bg-white/10"></div>
            <div class="flex items-center gap-1">
              <button
                v-for="per in periods"
                :key="per"
                :class="[
                  'px-2 py-0.5 rounded text-[11px] font-semibold transition-all',
                  selectedPeriod === per
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                ]"
                @click="$emit('update:selectedPeriod', per)"
              >{{ per }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile: dropdown + update terakhir -->
      <div class="sm:hidden bg-[#0d1020]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <div class="flex items-center gap-2 px-4 h-11">
          <select
            :value="selectedPlatform"
            @change="$emit('update:selectedPlatform', ($event.target as HTMLSelectElement).value)"
            class="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[12px] text-slate-300 outline-none appearance-none cursor-pointer"
          >
            <option v-for="p in platforms" :key="p.label" :value="p.label">
              {{ p.icon ? p.icon + ' ' : '' }}{{ p.label }}
            </option>
          </select>
          <select
            :value="selectedPeriod"
            @change="$emit('update:selectedPeriod', ($event.target as HTMLSelectElement).value)"
            class="bg-white/[0.05] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[12px] text-slate-300 outline-none appearance-none cursor-pointer"
          >
            <option v-for="per in periods" :key="per" :value="per">{{ per }}</option>
          </select>
          <!-- Update terakhir mobile -->
          <div v-if="!isLoading" class="ml-auto flex items-center gap-1 text-[10px] text-slate-600 whitespace-nowrap flex-shrink-0">
            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span class="text-indigo-400/70 font-medium">{{ lastUpdate }} WIB</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchQuery: string
  isLoading: boolean
  lastUpdate: string
  fromCache: boolean
  apiError: string | null
  platforms: Array<{ label: string; icon: string | null }>
  periods: string[]
  selectedPlatform: string
  selectedPeriod: string
}>()
defineEmits(['update:searchQuery', 'update:selectedPlatform', 'update:selectedPeriod', 'resync'])
</script>
