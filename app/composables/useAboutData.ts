/**
 * Composable for the About admin ConfigTable.
 *
 * The About collection has no file/image fields, so this is a passthrough
 * to `useCmsData` with no additional helpers — it only provides the shared
 * fetch / order / persist functionality.
 */
import type { About } from '#shared/types/pocketbase-types'

export function useAboutData() {
  return useCmsData<About>({
    endpoint: '/api/about',
    fetchKey: 'about-admin',
    collectionKey: 'about'
  })
}
