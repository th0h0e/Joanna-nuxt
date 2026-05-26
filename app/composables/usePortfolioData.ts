/**
 * Composable for the Portfolio Projects admin ConfigTable.
 *
 * Wraps `useCmsData` for the shared fetch / order / persist logic,
 * then adds helpers specific to the Portfolio_Projects collection:
 *
 *  - `getThumbnail`  — Returns a small 120×80 thumb URL for the first image
 *                       in a project's image array. Used as the row preview
 *                       thumbnail in the ConfigTable.
 *  - `getImageUrl`   — Returns a medium 400×300 thumb URL for a specific image
 *                       by filename. Used in the expandable row details.
 *
 * Both build URLs against the PocketBase file endpoint:
 *   {pocketbaseUrl}/api/files/Portfolio_Projects/{recordId}/{filename}
 */
import type { PortfolioProject } from '#shared/types/pocketbase-types'

export function usePortfolioData() {
  const { pocketbaseUrl } = useRuntimeConfig().public

  const base = useCmsData<PortfolioProject>({
    endpoint: '/api/portfolio',
    fetchKey: 'portfolio-admin',
    collectionKey: 'portfolio'
  })

  // ── Image URL helpers ────────────────────────────────────────────────────

  /** Small thumbnail of the project's first image (120×80). */
  const getThumbnail = (project: PortfolioProject) => {
    if (!project.images || project.images.length === 0) return null
    return `${pocketbaseUrl}/api/files/Portfolio_Projects/${project.id}/${project.images[0]}?thumb=120x80`
  }

  /** Medium thumbnail of a specific image file (400×300). */
  const getImageUrl = (project: PortfolioProject, image: string) => {
    return `${pocketbaseUrl}/api/files/Portfolio_Projects/${project.id}/${image}?thumb=400x300`
  }

  return {
    ...base,
    getThumbnail,
    getImageUrl
  }
}
