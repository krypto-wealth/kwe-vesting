import { onClickOutside as onClickOutsideCore, useWindowSize } from '@vueuse/core'
import { onMounted, onUnmounted, ref, computed } from 'vue'

export const useInterval = (callback: () => any, ms: number) => {
  const intervalId = ref<NodeJS.Timer | null>(null)
  onMounted(() => {
    intervalId.value = setInterval(callback, ms)
  })
  onUnmounted(() => {
    if (intervalId.value) clearInterval(intervalId.value)
  })
}

export const onClickOutside = (...args: Parameters<typeof onClickOutsideCore>) => {
  onClickOutsideCore(...args)
  const [r, f, o] = args
  onMounted(() =>
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') f(event as any)
    }),
  )
  onUnmounted(() => window.removeEventListener('keydown', () => 0))
}

export type Size = 'xl' | 'lg' | 'md' | 'sm' | 'xs'

export const useMedia = (breakpoints?: { sm?: number; md?: number; lg?: number }) => {
  const smD = breakpoints?.sm ?? 640
  const mdD = breakpoints?.md ?? 768
  const lgD = breakpoints?.lg ?? 1024

  const { width } = useWindowSize()

  return {
    sm: computed(() => width.value < smD),
    md: computed(() => smD < width.value && width.value < mdD),
    lg: computed(() => mdD < width.value && width.value < lgD),
    xl: computed(() => lgD < width.value),
    currentSize: computed(() => {
      if (width.value < smD) return 'sm'
      if (smD < width.value && width.value < mdD) return 'md'
      if (mdD < width.value && width.value < lgD) return 'lg'
      if (lgD < width.value) return 'lg'
      return 'xl'
    }),
  }
}

export const useBreakpoint = (breakpoint: number) => {
  const { width } = useWindowSize()

  return width.value < breakpoint
}
