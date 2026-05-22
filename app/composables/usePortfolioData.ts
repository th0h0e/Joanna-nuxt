import type { PortfolioProject } from '#shared/types/pocketbase-types'

export function usePortfolioData() {
  const { pocketbaseUrl } = useRuntimeConfig().public
  const toast = useToast()

  // Fetch portfolio projects from PocketBase (client-only, no SSR).
  // Returns rows in PocketBase's default order (creation date / ID),
  // NOT in our custom sort order — useSortableTable fixes that.
  const { data, status, refresh } = useLazyFetch<PortfolioProject[]>('/api/portfolio', {
    key: 'portfolio-admin',
    transform: data => data ?? [],
    server: false
  })

  // Fetch the saved display order from KV storage.
  // Array of project IDs in the order the admin dragged them into.
  const { data: savedOrder } = useLazyFetch<string[]>('/api/tableOrder', {
    key: 'table-order-admin',
    default: () => [],
    server: false
  })

  // ── Image URL helpers ────────────────────────────────────────────────────
  const getThumbnail = (project: PortfolioProject) => {
    if (!project.images || project.images.length === 0) return null
    return `${pocketbaseUrl}/api/files/Portfolio_Projects/${project.id}/${project.images[0]}?thumb=120x80`
  }

  const getImageUrl = (project: PortfolioProject, image: string) => {
    return `${pocketbaseUrl}/api/files/Portfolio_Projects/${project.id}/${image}?thumb=400x300`
  }

  // ── Persist drag-and-drop order ──────────────────────────────────────────
  async function persistOrder(orderedIds: string[]) {
    try {
      await $fetch('/api/tableOrder', {
        method: 'POST',
        body: { orderedIds }
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
    persistOrder
  }
}
