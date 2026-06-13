export const useTheme = () => {
  const isDark = useState('theme', () => true)

  const apply = (dark: boolean) => {
    if (!import.meta.client) return
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    // html class is managed reactively via useHead in app.vue
  }

  const toggle = () => {
    isDark.value = !isDark.value
    apply(isDark.value)
  }

  const init = () => {
    if (!import.meta.client) return
    const saved = localStorage.getItem('theme')
    const dark = saved !== 'light'
    isDark.value = dark
    apply(dark)
  }

  return { isDark, toggle, init }
}
