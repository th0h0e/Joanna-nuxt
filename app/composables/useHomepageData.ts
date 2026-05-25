import type { Homepage } from '#shared/types/pocketbase-types'

export function useHomepageData() {
  const { pocketbaseUrl } = useRuntimeConfig().public
  const toast = useToast()

  const { data, status, refresh } = useLazyFetch<Homepage[]>('/api/homepage', {
    key: 'homepage-admin',
    transform: data => {
      // Handle both single-record and array responses
      if (Array.isArray(data)) return data
      if (data && typeof data === 'object' && 'id' in data) return [data as unknown as Homepage]
      return []
    },
    server: false
  })

  const { data: savedOrder } = useLazyFetch<string[]>('/api/tableOrder', {
    key: 'table-order-homepage',
    query: { key: 'homepage' },
    default: () => [],
    server: false
  })

  // ── Image URL helpers ────────────────────────────────────────────────────
  const getThumbnail = (homepage: Homepage) => {
    if (!homepage.heroImage) return null
    return `${pocketbaseUrl}/api/files/Homepage/${homepage.id}/${homepage.heroImage}?thumb=120x80`
  }

  const getImageUrl = (homepage: Homepage, image: string) => {
    return `${pocketbaseUrl}/api/files/Homepage/${homepage.id}/${image}?thumb=400x300`
  }

  const getFullImageUrl = (homepage: Homepage, image: string) => {
    return `${pocketbaseUrl}/api/files/Homepage/${homepage.id}/${image}`
  }

  // ── Persist drag-and-drop order ──────────────────────────────────────────
  async function persistOrder(orderedIds: string[]) {
    try {
      await $fetch('/api/tableOrder', {
        method: 'POST',
        body: { key: 'homepage', orderedIds }
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
    getThumbnail,
    getImageUrl,
    getFullImageUrl,
    persistOrder
  }
}
