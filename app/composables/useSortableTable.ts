import { useSortable } from '@vueuse/integrations/useSortable'

interface UseSortableTableOptions<T extends { id: string }> {
  /** The reactive data array to sort */
  data: Ref<T[] | undefined>
  /** The saved order (array of IDs) to restore on load */
  savedOrder: Ref<string[] | undefined>
  /** Called after a drag-and-drop reorder with the new ID order */
  persistOrder: (orderedIds: string[]) => Promise<void>
  /** CSS selector for the sortable container — must match the class on your <tbody> */
  selector: string
  /** Sortable.js animation duration in ms (default: 150) */
  animation?: number
  /** Delay after drop before persisting, in ms (default: 300) */
  persistDelay?: number
}

/**
 * Initializes drag-and-drop sorting on a table once data is available.
 *
 * On mount, watches `data` and `savedOrder` until data arrives, then:
 *   1. Reorders data in-place to match the saved order
 *   2. Attaches Sortable.js to the target element via CSS selector
 *
 * After each drag-and-drop, calls `persistOrder` with the new ID sequence.
 * Runs only once — the watcher is stopped after initialization.
 */
export function useSortableTable<T extends { id: string }>(options: UseSortableTableOptions<T>) {
  const { data, savedOrder, persistOrder, selector, animation = 150, persistDelay = 300 } = options

  // DEFERRED INITIALIZATION
  // Because useLazyFetch is async (server: false), data arrives after mount.
  // We watch both data sources and only proceed once portfolio data is ready.
  // stopWatch() ensures this only runs ONCE — multiple useSortable instances
  // on the same element cause chaotic behavior (duplicate drag handlers, ghost elements).
  onMounted(() => {
    const stopWatch = watch(
      [() => data.value?.length, () => savedOrder.value?.length],
      ([dataLen, orderLen]) => {
        if (dataLen && dataLen > 0) {
          // REORDER: PocketBase returns projects in creation order, not our custom order.
          // Sort data.value IN PLACE to match the saved order from KV storage.
          // This must mutate data.value directly (not use a computed) because:
          //   - useSortable needs a writable ref to splice when the user drags rows
          //   - computed properties are read-only — Sortable.js silently fails to update them
          if (orderLen && orderLen > 0) {
            const order = savedOrder.value ?? []
            const sorted = [...(data.value ?? [])].sort((a, b) => {
              const indexA = order.indexOf(a.id)
              const indexB = order.indexOf(b.id)
              // Projects not in the saved order (e.g. newly added) fall to the bottom
              if (indexA === -1 && indexB === -1) return 0
              if (indexA === -1) return 1
              if (indexB === -1) return -1
              return indexA - indexB
            })
            data.value = sorted
          }

          // ATTACH SORTABLE: Wait one tick so Vue flushes the reordered rows to the DOM.
          // useSortable targets the selector (e.g. '.portfolio-sortable-tbody') which is
          // the <tbody> class set via :ui prop on UTable.
          // It attaches Sortable.js which handles drag-and-drop and splices data.value on reorder.
          nextTick(() => {
            useSortable(selector, data as Ref<T[]>, {
              animation,
              onEnd: () => {
                // Delay ensures the animation finishes and useSortable
                // has completed splicing data.value to match the new visual order
                setTimeout(() => {
                  const orderedIds = data.value?.map(item => item.id) ?? []
                  persistOrder(orderedIds)
                }, persistDelay)
              }
            })
          })
          stopWatch()
        }
      },
      { immediate: true }
    )
  })
}
