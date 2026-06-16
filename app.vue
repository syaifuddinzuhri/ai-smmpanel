<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { isDark, init } = useTheme()
const { init: initLang } = useLang()

useHead(computed(() => ({
  htmlAttrs: { class: isDark.value ? 'dark' : '' }
})))

onMounted(() => {
  init()
  initLang()
})
</script>
