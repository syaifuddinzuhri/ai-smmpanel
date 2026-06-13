export const useComparison = () => {
  const ids = useState<number[]>('comparison', () => [])

  const toggle = (id: number) => {
    if (ids.value.includes(id)) {
      ids.value = ids.value.filter(i => i !== id)
    } else if (ids.value.length < 3) {
      ids.value = [...ids.value, id]
    }
  }

  const isSelected = (id: number) => ids.value.includes(id)
  const canAdd = computed(() => ids.value.length < 3)
  const count = computed(() => ids.value.length)
  const clear = () => { ids.value = [] }

  return { ids, toggle, isSelected, canAdd, count, clear }
}
