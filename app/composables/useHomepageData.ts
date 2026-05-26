/**
 * Composable for the Homepage (Hero) admin ConfigTable.
 *
 * Wraps `useCmsData` for the shared fetch / order / persist logic,
 * then adds helpers specific to the Homepage collection:
 *
 *  - `getThumbnail`    — Small 120×80 thumb of the hero image for the row preview.
 *  - `getImageUrl`     — Medium 400×300 thumb for the expandable row details.
 *  - `getFullImageUrl` — Full-resolution URL (no thumb param) for the drawer/form.
 *
 * Uses a custom `transform` because the homepage endpoint may return either
 * a single record object or an array — this normalises it to always be an array.
 *
 * All image URLs are built against the PocketBase file endpoint:
 *   {pocketbaseUrl}/api/files/Homepage/{recordId}/{filename}
 */
import type { Homepage } from '#shared/types/pocketbase-types'

export function useHomepageData() {
  const { pocketbaseUrl } = useRuntimeConfig().public

  const base = useCmsData<Homepage>({
    endpoint: '/api/homepage',
    fetchKey: 'homepage-admin',
    collectionKey: 'homepage',
    transform: data => {
      // Normalise the response to an array — PocketBase may return a single
      // record object or an array depending on the endpoint used.
      if (Array.isArray(data)) return data
      if (data && typeof data === 'object' && 'id' in data) return [data as unknown as Homepage]
      return []
    }
  })

  // ── Image URL helpers ────────────────────────────────────────────────────

  /** Small thumbnail of the hero image (120×80). */
  const getThumbnail = (homepage: Homepage) => {
    if (!homepage.heroImage) return null
    return `${pocketbaseUrl}/api/files/Homepage/${homepage.id}/${homepage.heroImage}?thumb=120x80`
  }

  /** Medium thumbnail of a specific image file (400×300). */
  const getImageUrl = (homepage: Homepage, image: string) => {
    return `${pocketbaseUrl}/api/files/Homepage/${homepage.id}/${image}?thumb=400x300`
  }

  /** Full-resolution URL (no resizing). Used in the settings drawer/form. */
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
