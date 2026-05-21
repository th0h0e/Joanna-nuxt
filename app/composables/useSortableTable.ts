import { useSortable } from '@vueuse/integrations/useSortable'
import type { PortfolioProject } from '#shared/types/pocketbase-types'

export function useSortableTable(
  data: Ref<PortfolioProject[] | undefined>,
  savedOrder: Ref<string[] | undefined>,
  persistOrder: (orderedIds: string[]) => Promise<void>
) {
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
          // useSortable targets .sortable-tbody (the <tbody> class set via :ui prop on UTable).
          // It attaches Sortable.js which handles drag-and-drop and splices data.value on reorder.
          nextTick(() => {
            useSortable('.sortable-tbody', data as Ref<PortfolioProject[]>, {
              animation: 150,
              onEnd: () => {
                // 300ms delay ensures the 150ms animation finishes and useSortable
                // has completed splicing data.value to match the new visual order
                setTimeout(() => {
                  const orderedIds = data.value?.map(project => project.id) ?? []
                  persistOrder(orderedIds)
                }, 300)
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
