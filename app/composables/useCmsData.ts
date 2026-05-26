/**
 * Generic base composable for CMS data collections.
 *
 * Handles the shared boilerplate that every admin ConfigTable needs:
 *  - Client-only lazy fetch of collection records from PocketBase
 *  - Fetching the saved drag-and-drop display order from Nitro KV storage
 *  - Persisting a reordered list back to the server with toast feedback
 *
 * The data fetch uses `useLazyFetch` with `server: false` so it only runs
 * on the client — the admin CMS pages don't need SSR. Records are returned
 * in PocketBase's default order (creation date); the saved order array is
 * applied separately by `useSortableTable` in each ConfigTable.
 *
 * Collection-specific helpers (image URLs, file URLs) live in the thin
 * wrapper composables that call this function (e.g. usePortfolioData).
 *
 * @typeParam T - The API response type for a single record (must have an `id`).
 * @param options.endpoint    - Server API route to fetch, e.g. '/api/portfolio'.
 * @param options.fetchKey    - Unique Nuxt data-fetching cache key, e.g. 'portfolio-admin'.
 * @param options.collectionKey - Key used in the `/api/tableOrder` KV store to identify this collection's sort order.
 * @param options.transform   - Optional transform applied to the raw API response before caching.
 */
export function useCmsData<T extends { id: string }>(options: {
  endpoint: string
  fetchKey: string
  collectionKey: string
  transform?: (data: T[] | null | undefined) => T[]
}) {
  const toast = useToast()

  // Fetch the collection records. `server: false` ensures this only runs
  // client-side — no unnecessary SSR for admin pages.
  const { data, status, refresh } = useLazyFetch<T[]>(options.endpoint, {
    key: options.fetchKey,
    transform: options.transform ?? (data => data ?? []),
    server: false
  })

  // Fetch the persisted drag-and-drop order for this collection.
  // Returns an array of record IDs in the order the admin arranged them.
  // If no order has been saved yet, defaults to an empty array (which
  // causes the table to fall back to PocketBase's natural order).
  const { data: savedOrder } = useLazyFetch<string[]>('/api/tableOrder', {
    key: `table-order-${options.collectionKey}`,
    query: { key: options.collectionKey },
    default: () => [],
    server: false
  })

  // Send the new row order to the server after a drag-and-drop event.
  // On success, shows a green toast. On failure, shows a red toast with
  // the error message and re-fetches the data to reset the UI to the
  // last known good state.
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
