export default defineNuxtPlugin(() => {
  const isDebug = () => new URLSearchParams(window.location.search).has('debug')

  document.addEventListener('contextmenu', (e) => {
    if (!isDebug()) e.preventDefault()
  })

  document.addEventListener('keydown', (e) => {
    if (isDebug()) return

    // F12
    if (e.key === 'F12') {
      e.preventDefault()
      return
    }

    // Ctrl+Shift+I / Cmd+Option+I
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
      e.preventDefault()
      return
    }

    // Ctrl+Shift+J / Cmd+Option+J
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
      e.preventDefault()
      return
    }

    // Ctrl+Shift+C / Cmd+Option+C
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault()
      return
    }

    // Ctrl+U (view source)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault()
    }
  })
})
