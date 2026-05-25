import type { About } from '#shared/types/pocketbase-types'

export function useAboutData() {
  const toast = useToast()

  const { data, status, refresh } = useLazyFetch<About[]>('/api/about', {
    key: 'about-admin',
    transform: data => data ?? [],
    server: false
  })

  const { data: savedOrder } = useLazyFetch<string[]>('/api/tableOrder', {
    key: 'table-order-about',
    query: { key: 'about' },
    default: () => [],
    server: false
  })

  async function persistOrder(orderedIds: string[]) {
    try {
      await $fetch('/api/tableOrder', {
        method: 'POST',
        body: { key: 'about', orderedIds }
      })
      toast.add({ title: 'Order saved', color: 'success' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.add({ title: 'Failed to save order', description: message, color: 'error' })
      refresh()
    }
  }

  return {
    data,
    status,
    refresh,
    savedOrder,
    persistOrder
  }
}
