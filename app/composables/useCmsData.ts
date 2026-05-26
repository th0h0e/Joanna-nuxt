/**
 * Generic base composable for CMS data collections.
 *
 * Handles the shared boilerplate that every admin ConfigTable needs:
 *  - Client-only lazy fetch of collection records
 *  - Fetching the saved drag-and-drop display order from KV storage
 *  - Persisting a reordered list back to the server with toast feedback
 *
 * Collection-specific helpers (image URLs, etc.) live in the thin
 * wrapper composables that call this function.
 */
export function useCmsData<T extends { id: string }>(options: {
  /** API endpoint for the collection, e.g. '/api/portfolio' */
  endpoint: string
  /** Cache key for the main data fetch */
  fetchKey: string
  /** KV storage key used by /api/tableOrder, e.g. 'portfolio' */
  collectionKey: string
  /** Optional transform for the useLazyFetch response */
  transform?: (data: T[] | null | undefined) => T[]
}) {
  const toast = useToast()

  const { data, status, refresh } = useLazyFetch<T[]>(options.endpoint, {
    key: options.fetchKey,
    transform: options.transform ?? (data => data ?? []),
    server: false
  })

  const { data: savedOrder } = useLazyFetch<string[]>('/api/tableOrder', {
    key: `table-order-${options.collectionKey}`,
    query: { key: options.collectionKey },
    default: () => [],
    server: false
  })

  async function persistOrder(orderedIds: string[]) {
    try {
      await $fetch('/api/tableOrder', {
        method: 'POST',
        body: { key: options.collectionKey, orderedIds }
      })
      toast.add({ title: 'Order saved', color: 'success' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.add({ title: 'Failed to save order', description: message, color: 'error' })
      refresh()
    }
  }

  return { data, status, refresh, savedOrder, persistOrder }
}
