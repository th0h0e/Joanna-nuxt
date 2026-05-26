import type { Homepage } from '#shared/types/pocketbase-types'

export function useHomepageData() {
  const { pocketbaseUrl } = useRuntimeConfig().public

  const base = useCmsData<Homepage>({
    endpoint: '/api/homepage',
    fetchKey: 'homepage-admin',
    collectionKey: 'homepage',
    transform: data => {
      // Handle both single-record and array responses
      if (Array.isArray(data)) return data
      if (data && typeof data === 'object' && 'id' in data) return [data as unknown as Homepage]
      return []
    }
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

  return {
    ...base,
    getThumbnail,
    getImageUrl,
    getFullImageUrl
  }
}
