<template>
  <component v-if="heroComponent" :is="heroComponent" v-bind="$attrs" aria-hidden="true" />
  <img v-else-if="platformImage" :src="platformImage" v-bind="$attrs" alt="" aria-hidden="true" />
  <svg v-else-if="svgIcon" :viewBox="svgIcon.viewBox" xmlns="http://www.w3.org/2000/svg" v-bind="$attrs" v-html="svgIcon.body" aria-hidden="true" fill="none" />
</template>

<script setup lang="ts">
import * as HeroOutline from '@heroicons/vue/24/outline'
import imgInstagram from '~/assets/icon/instagram.png'
import imgTiktok from '~/assets/icon/tiktok.png'
import imgYoutube from '~/assets/icon/youtube.png'
import imgFacebook from '~/assets/icon/facebook.png'
import imgTwitter from '~/assets/icon/twitter.png'
import imgShopee from '~/assets/icon/shopee.png'
import imgSpotify from '~/assets/icon/spotify.png'
import imgTelegram from '~/assets/icon/telegram.png'
import imgGoogle from '~/assets/icon/google.png'
import imgThread from '~/assets/icon/thread.png'
import imgOther from '~/assets/icon/other.png'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ name: string }>()

function toComponentName(kebab: string) {
  return kebab.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('') + 'Icon'
}

const heroComponent = computed(() => {
  if (!props.name.startsWith('heroicons:')) return null
  const key = toComponentName(props.name.slice('heroicons:'.length))
  return (HeroOutline as Record<string, unknown>)[key] ?? null
})

/* Platform icons tersedia sebagai file asset */
const platformImages: Record<string, string> = {
  'logos:instagram-icon': imgInstagram,
  'logos:tiktok-icon':    imgTiktok,
  'logos:youtube-icon':   imgYoutube,
  'logos:facebook':       imgFacebook,
  'logos:telegram':        imgTelegram,
  'logos:google':        imgGoogle,
  'logos:other':        imgOther,
  'logos:twitter':        imgTwitter,
  'logos:thread':        imgThread,
  'simple-icons:shopee':  imgShopee,
  'logos:spotify':        imgSpotify,
}

const platformImage = computed(() => platformImages[props.name] ?? null)

/* Platform icons tanpa file asset → inline SVG */
const svgIcons: Record<string, { viewBox: string; body: string }> = {
  // 'logos:telegram': {
  //   viewBox: '0 0 256 256',
  //   body: '<defs><linearGradient id="tg-grad" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stop-color="#2aabee"/><stop offset="100%" stop-color="#229ed9"/></linearGradient></defs><path fill="url(#tg-grad)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.04 128.04 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51s-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0"/><path fill="#fff" d="M57.94 126.648q55.98-24.384 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072"/>',
  // },
  // 'logos:google-icon': {
  //   viewBox: '0 0 256 262',
  //   body: '<path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/><path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/><path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"/><path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/>',
  // },
}

const svgIcon = computed(() => {
  if (heroComponent.value || platformImage.value) return null
  return svgIcons[props.name] ?? null
})
</script>
