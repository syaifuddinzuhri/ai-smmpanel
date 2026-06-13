<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { isDark, init } = useTheme()

useHead(computed(() => ({
  htmlAttrs: { class: isDark.value ? 'dark' : '' }
})))

onMounted(init)
</script>
