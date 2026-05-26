import type { About } from '#shared/types/pocketbase-types'

export function useAboutData() {
  return useCmsData<About>({
    endpoint: '/api/about',
    fetchKey: 'about-admin',
    collectionKey: 'about'
  })
}
