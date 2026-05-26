import type { PortfolioProject } from '#shared/types/pocketbase-types'

export function usePortfolioData() {
  const { pocketbaseUrl } = useRuntimeConfig().public

  const base = useCmsData<PortfolioProject>({
    endpoint: '/api/portfolio',
    fetchKey: 'portfolio-admin',
    collectionKey: 'portfolio'
  })

  // ── Image URL helpers ────────────────────────────────────────────────────
  const getThumbnail = (project: PortfolioProject) => {
    if (!project.images || project.images.length === 0) return null
    return `${pocketbaseUrl}/api/files/Portfolio_Projects/${project.id}/${project.images[0]}?thumb=120x80`
  }

  const getImageUrl = (project: PortfolioProject, image: string) => {
    return `${pocketbaseUrl}/api/files/Portfolio_Projects/${project.id}/${image}?thumb=400x300`
  }

  return {
    ...base,
    getThumbnail,
    getImageUrl
  }
}
