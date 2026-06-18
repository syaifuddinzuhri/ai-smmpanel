<template>
  <div>
    <!-- Main nav — selalu sticky di semua ukuran -->
    <header class="sticky top-0 z-50 backdrop-blur-xl border-b" :style="{ background: 'var(--bg-header)', borderColor: 'var(--border)' }">
      <div class="max-w-[1400px] mx-auto flex items-center h-[56px] px-4 sm:px-6 gap-4">
        <!-- Logo -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="relative">
            <div class="w-8 h-8 p-1 rounded-lg overflow-hidden shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <img :src="`/${cfg.appBrand}/logo.png`" :alt="cfg.appName" class="w-full h-full object-contain" />
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0b0d1a]"
              :class="isLoading ? 'bg-amber-400' : 'bg-emerald-400'"></div>
          </div>
          <div class="block">
            <p class="text-slate-900 dark:text-white text-[14px] font-bold leading-none">{{ cfg.appName }}</p>
            <p class="text-indigo-400 text-[10px] font-medium leading-none mt-0.5">{{ cfg.appTagline }}</p>
          </div>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <!-- Update time + kurs: hanya desktop -->
          <div v-if="!isLoading" class="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
            <div class="flex items-center gap-1.5">
              <Icon name="heroicons:clock" class="w-3 h-3" />
              {{ t('header.lastUpdate') }}: <span class="text-indigo-400 font-medium">{{ lastUpdate }} WIB</span>
            </div>
            <span class="text-slate-600 dark:text-slate-700">·</span>
            <div class="flex items-center gap-1.5">
              <Icon name="heroicons:arrows-right-left" class="w-3 h-3" />
              <span>$1 =</span>
              <span class="text-emerald-400 dark:text-emerald-300 font-semibold tabular-nums">
                Rp {{ kurs.toLocaleString('id-ID') }}
              </span>
            </div>
          </div>
          <!-- Theme toggle -->
          <button
            @click="toggleTheme"
            :title="isDark ? t('header.lightMode') : t('header.darkMode')"
            class="flex items-center justify-center w-7 h-7 rounded-lg border text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200"
            :style="{ background: 'var(--bg-input)', borderColor: 'var(--border)' }"
          >
            <Icon :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" class="w-3.5 h-3.5" />
          </button>
          <!-- Language dropdown -->
          <div class="relative" ref="langRef">
            <button
              @click.stop="showLangDropdown = !showLangDropdown; showCurrencyDropdown = false"
              class="flex items-center gap-1 px-2 h-7 rounded-lg border text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 text-[11px] font-bold"
              :style="{ background: 'var(--bg-input)', borderColor: 'var(--border)' }"
            >
              <Icon name="heroicons:language" class="w-3 h-3 flex-shrink-0" />
              {{ lang.toUpperCase() }}
              <Icon name="heroicons:chevron-down" class="w-2.5 h-2.5 flex-shrink-0 transition-transform duration-150" :class="showLangDropdown ? 'rotate-180' : ''" />
            </button>
            <Transition name="dropdown">
              <div
                v-if="showLangDropdown"
                class="absolute right-0 top-full mt-1.5 z-50 rounded-xl shadow-xl overflow-hidden min-w-[100px]"
                :style="{ background: 'var(--bg-card)', border: '1px solid var(--border-str)' }"
              >
                <button
                  v-for="opt in langOptions"
                  :key="opt.value"
                  @click="setLang(opt.value); showLangDropdown = false"
                  class="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-semibold transition-colors text-left"
                  :class="lang === opt.value
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[var(--row-hover)]'"
                >
                  <span class="text-base leading-none">{{ opt.flag }}</span>
                  <span>{{ opt.label }}</span>
                  <Icon v-if="lang === opt.value" name="heroicons:check" class="w-3 h-3 ml-auto text-indigo-400" />
                </button>
              </div>
            </Transition>
          </div>
          <!-- Currency dropdown -->
          <div class="relative" ref="currencyRef">
            <button
              @click.stop="showCurrencyDropdown = !showCurrencyDropdown; showLangDropdown = false"
              class="flex items-center gap-1 px-2 h-7 rounded-lg border text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 text-[11px] font-bold"
              :style="{ background: 'var(--bg-input)', borderColor: 'var(--border)' }"
            >
              <Icon name="heroicons:currency-dollar" class="w-3 h-3 flex-shrink-0" />
              {{ currency }}
              <Icon name="heroicons:chevron-down" class="w-2.5 h-2.5 flex-shrink-0 transition-transform duration-150" :class="showCurrencyDropdown ? 'rotate-180' : ''" />
            </button>
            <Transition name="dropdown">
              <div
                v-if="showCurrencyDropdown"
                class="absolute right-0 top-full mt-1.5 z-50 rounded-xl shadow-xl overflow-hidden min-w-[150px]"
                :style="{ background: 'var(--bg-card)', border: '1px solid var(--border-str)' }"
              >
                <!-- Kurs live indicator -->
                <div class="flex items-center gap-1.5 px-3 py-2 border-b text-[11px]" :style="{ borderColor: 'var(--border)' }">
                  <Icon name="heroicons:arrows-right-left" class="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span class="text-slate-500">$1 =</span>
                  <span class="text-emerald-400 font-semibold tabular-nums">Rp {{ kurs.toLocaleString('id-ID') }}</span>
                </div>
                <button
                  v-for="opt in currencyOptions"
                  :key="opt.value"
                  @click="setCurrency(opt.value).then(() => { showCurrencyDropdown = false })"
                  class="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-semibold transition-colors text-left"
                  :class="currency === opt.value
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[var(--row-hover)]'"
                >
                  <span class="text-base leading-none">{{ opt.flag }}</span>
                  <span>{{ opt.label }}</span>
                  <Icon v-if="currency === opt.value" name="heroicons:check" class="w-3 h-3 ml-auto text-indigo-400" />
                </button>
              </div>
            </Transition>
          </div>
          <!-- Resync -->
          <button
            v-if="!isLoading && showResync"
            @click="$emit('resync')"
            :title="t('header.resync')"
            class="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all duration-200 text-[11px] font-medium"
          >
            <Icon name="heroicons:arrow-path" class="w-3 h-3 flex-shrink-0" />
            <span class="hidden sm:inline">{{ t('header.resync') }}</span>
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
            {{ isLoading ? t('header.updating') : apiError ? t('header.error') : fromCache ? t('header.cached') : t('header.live') }}
          </div>
        </div>
      </div>
    </header>

    <!-- Sub-bar -->
    <div v-if="showSubBar" class="relative z-40 sm:sticky sm:top-[56px] backdrop-blur-xl border-b" :style="{ background: 'var(--bg-sub)', borderColor: 'var(--border-sub)' }">

      <!-- Desktop sub-bar -->
      <div class="hidden sm:flex max-w-[1400px] mx-auto px-4 sm:px-6 items-center h-10 gap-0.5">

        <!-- Label saat filter platform disembunyikan -->
        <div v-if="!showPlatformFilter" class="flex items-center gap-1.5 px-2 py-1">
          <Icon name="heroicons:chart-bar" class="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span class="text-[12px] font-semibold text-indigo-400">{{ t('header.analytics') }}</span>
        </div>

        <!-- Pinned platform tabs -->
        <button
          v-if="showPlatformFilter"
          v-for="p in pinnedPlatforms"
          :key="p.label"
          :class="[
            'flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium transition-all whitespace-nowrap',
            selectedPlatform === p.label
              ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-[var(--row-hover)]'
          ]"
          @click="$emit('update:selectedPlatform', p.label)"
        >
          <Icon v-if="p.icon" :name="p.icon" class="w-4 h-4 flex-shrink-0" />
          <Icon v-else name="heroicons:squares-2x2" class="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
          {{ platformLabel(p.label) }}
        </button>

        <!-- Overflow dropdown -->
        <div v-if="showPlatformFilter" ref="overflowRef" class="relative">
          <button
            :class="[
              'flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium transition-all whitespace-nowrap',
              overflowActive
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
            ]"
            @click="showOverflow = !showOverflow"
          >
            <Icon v-if="overflowActive && activeOverflow?.icon" :name="activeOverflow!.icon" class="w-4 h-4 flex-shrink-0" />
            {{ overflowActive ? platformLabel(activeOverflow?.label ?? '') : (lang === 'en' ? 'More' : 'Lainnya') }}
            <Icon name="heroicons:chevron-down" :class="['w-3 h-3 transition-transform', showOverflow ? 'rotate-180' : '']" />
          </button>

          <!-- Dropdown panel -->
          <div v-if="showOverflow"
            class="absolute top-[calc(100%+4px)] left-0 z-10 w-52 rounded-xl shadow-xl shadow-black/20 dark:shadow-black/40 overflow-hidden bg-white dark:bg-[#1a1f35]"
            :style="{ border: '1px solid var(--border-str)' }">
            <div class="p-2" :style="{ borderBottom: '1px solid var(--border)' }">
              <div class="flex items-center gap-2 rounded-lg px-2.5 py-1.5" :style="{ background: 'var(--bg-input)' }">
                <Icon name="heroicons:magnifying-glass" class="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <input
                  v-model="overflowSearch"
                  :placeholder="t('header.searchPlatform')"
                  class="bg-transparent text-[12px] text-slate-700 dark:text-slate-300 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 w-full"
                />
              </div>
            </div>
            <div class="max-h-56 overflow-y-auto scrollbar-hide py-1">
              <button
                v-for="p in filteredOverflow"
                :key="p.label"
                :class="[
                  'w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium transition-colors',
                  selectedPlatform === p.label
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-[var(--row-hover)] hover:text-slate-900 dark:hover:text-slate-200'
                ]"
                @click="selectPlatform(p.label)"
              >
                <Icon v-if="p.icon" :name="p.icon" class="w-4 h-4 flex-shrink-0" />
                {{ platformLabel(p.label) }}
              </button>
              <p v-if="!filteredOverflow.length" class="text-center text-slate-500 text-[11px] py-3">{{ lang === 'en' ? 'Not found' : 'Tidak ditemukan' }}</p>
            </div>
          </div>
        </div>

        <!-- Period -->
        <div class="ml-auto flex items-center gap-2 pl-4">
          <div class="h-4 w-px" :style="{ background: 'var(--border-str)' }"></div>
          <div class="flex items-center gap-0.5">
            <button
              v-for="per in periods"
              :key="per"
              :class="[
                'px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all',
                selectedPeriod === per ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              ]"
              @click="$emit('update:selectedPeriod', per)"
            >{{ per }}</button>
          </div>
        </div>
      </div>

      <!-- Mobile sub-bar -->
      <div class="sm:hidden flex items-center gap-2 px-4 h-11">

        <!-- Label analitik mobile -->
        <div v-if="!showPlatformFilter" class="flex items-center gap-1.5 flex-1">
          <Icon name="heroicons:chart-bar" class="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span class="text-[12px] font-semibold text-indigo-400">{{ t('header.analytics') }}</span>
        </div>

        <!-- Custom platform dropdown -->
        <div v-if="showPlatformFilter" ref="mobileRef" class="relative flex-1">
          <button
            class="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] text-slate-600 dark:text-slate-300"
            :style="{ background: 'var(--bg-input)', border: '1px solid var(--border)' }"
            @click="showMobile = !showMobile"
          >
            <Icon v-if="activePlatform?.icon" :name="activePlatform.icon" class="w-4 h-4 flex-shrink-0" />
            <Icon v-else name="heroicons:squares-2x2" class="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span class="flex-1 text-left truncate">{{ platformLabel(selectedPlatform) }}</span>
            <Icon name="heroicons:chevron-down" :class="['w-3.5 h-3.5 flex-shrink-0 text-slate-500 transition-transform', showMobile ? 'rotate-180' : '']" />
          </button>

          <!-- Mobile dropdown -->
          <div v-if="showMobile"
            class="absolute top-[calc(100%+4px)] left-0 z-10 w-full rounded-xl shadow-xl shadow-black/20 dark:shadow-black/40 overflow-hidden bg-white dark:bg-[#1a1f35]"
            :style="{ border: '1px solid var(--border-str)' }">
            <div class="p-2" :style="{ borderBottom: '1px solid var(--border)' }">
              <div class="flex items-center gap-2 rounded-lg px-2.5 py-1.5" :style="{ background: 'var(--bg-input)' }">
                <Icon name="heroicons:magnifying-glass" class="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <input
                  v-model="mobileSearch"
                  :placeholder="t('header.searchPlatform')"
                  class="bg-transparent text-[12px] text-slate-700 dark:text-slate-300 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 w-full"
                />
              </div>
            </div>
            <div class="max-h-64 overflow-y-auto scrollbar-hide py-1">
              <button
                v-for="p in filteredMobile"
                :key="p.label"
                :class="[
                  'w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium transition-colors',
                  selectedPlatform === p.label
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-[var(--row-hover)] hover:text-slate-900 dark:hover:text-slate-200'
                ]"
                @click="selectPlatform(p.label); showMobile = false"
              >
                <Icon v-if="p.icon" :name="p.icon" class="w-4 h-4 flex-shrink-0" />
                <Icon v-else name="heroicons:squares-2x2" class="w-3.5 h-3.5 flex-shrink-0" />
                {{ platformLabel(p.label) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Period buttons mobile -->
        <div class="flex items-center gap-0.5 flex-shrink-0">
          <button
            v-for="per in periods"
            :key="per"
            :class="[
              'px-2 py-1 rounded text-[10px] font-semibold transition-all',
              selectedPeriod === per ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            ]"
            @click="$emit('update:selectedPeriod', per)"
          >{{ per }}</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggle: toggleTheme } = useTheme()
const { lang, setLang, t } = useLang()
const { currency, kurs, setCurrency, init: initCurrency } = useCurrency()

const showLangDropdown = ref(false)
const langRef = ref<HTMLElement | null>(null)
const langOptions = [
  { value: 'id' as const, label: 'Indonesia', flag: '🇮🇩' },
  { value: 'en' as const, label: 'English',   flag: '🇺🇸' },
]

const showCurrencyDropdown = ref(false)
const currencyRef = ref<HTMLElement | null>(null)
const currencyOptions = [
  { value: 'IDR' as const, label: 'IDR — Rupiah', flag: '🇮🇩' },
  { value: 'USD' as const, label: 'USD — Dollar', flag: '🇺🇸' },
]
const { public: cfg } = useRuntimeConfig()
const props = withDefaults(defineProps<{
  searchQuery?: string
  isLoading: boolean
  lastUpdate: string
  fromCache: boolean
  apiError: string | null
  platforms?: Array<{ label: string; icon: string | null }>
  periods?: string[]
  selectedPlatform?: string
  selectedPeriod?: string
  showSubBar?: boolean
  showResync?: boolean
  showPlatformFilter?: boolean
}>(), {
  searchQuery: '',
  platforms: () => [],
  periods: () => [],
  selectedPlatform: '',
  selectedPeriod: '',
  showSubBar: true,
  showResync: true,
  showPlatformFilter: true,
})
const emit = defineEmits(['update:searchQuery', 'update:selectedPlatform', 'update:selectedPeriod', 'resync'])

function platformLabel(label: string): string {
  if (label === 'Semua') return t('platform.all')
  if (label === 'Lain-lain') return t('platform.others')
  return label
}

// Desktop overflow dropdown
const PINNED = ['Semua', 'Instagram', 'TikTok', 'YouTube']
const pinnedPlatforms = computed(() => props.platforms.filter(p => PINNED.includes(p.label)))
const overflowPlatforms = computed(() => props.platforms.filter(p => !PINNED.includes(p.label)))

const showOverflow = ref(false)
const overflowSearch = ref('')
const overflowRef = ref<HTMLElement | null>(null)

const filteredOverflow = computed(() => {
  const q = overflowSearch.value.toLowerCase()
  return q ? overflowPlatforms.value.filter(p => platformLabel(p.label).toLowerCase().includes(q)) : overflowPlatforms.value
})

const overflowActive = computed(() => overflowPlatforms.value.some(p => p.label === props.selectedPlatform))
const activeOverflow = computed(() => overflowPlatforms.value.find(p => p.label === props.selectedPlatform) ?? null)

// Mobile dropdown
const showMobile = ref(false)
const mobileSearch = ref('')
const mobileRef = ref<HTMLElement | null>(null)

const activePlatform = computed(() => props.platforms.find(p => p.label === props.selectedPlatform) ?? null)

const filteredMobile = computed(() => {
  const q = mobileSearch.value.toLowerCase()
  return q ? props.platforms.filter(p => platformLabel(p.label).toLowerCase().includes(q)) : props.platforms
})

function selectPlatform(label: string) {
  emit('update:selectedPlatform', label)
  showOverflow.value = false
  overflowSearch.value = ''
}

function handleDocClick(e: MouseEvent) {
  if (showOverflow.value && overflowRef.value && !overflowRef.value.contains(e.target as Node)) {
    showOverflow.value = false
    overflowSearch.value = ''
  }
  if (showMobile.value && mobileRef.value && !mobileRef.value.contains(e.target as Node)) {
    showMobile.value = false
    mobileSearch.value = ''
  }
  if (showLangDropdown.value && langRef.value && !langRef.value.contains(e.target as Node)) {
    showLangDropdown.value = false
  }
  if (showCurrencyDropdown.value && currencyRef.value && !currencyRef.value.contains(e.target as Node)) {
    showCurrencyDropdown.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleDocClick)
  await initCurrency()
})
onBeforeUnmount(() => document.removeEventListener('click', handleDocClick))
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
</style>
