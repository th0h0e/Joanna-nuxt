import type { Setting } from '#shared/types/pocketbase-types'

export function useSettingsData() {
  const { pocketbaseUrl } = useRuntimeConfig().public

  const base = useCmsData<Setting>({
    endpoint: '/api/settings',
    fetchKey: 'settings-admin',
    collectionKey: 'settings'
  })

  // ── Favicon URL helpers ──────────────────────────────────────────────────
  const getFaviconUrl = (setting: Setting) => {
    if (!setting.favicon) return null
    return `${pocketbaseUrl}/api/files/Settings/${setting.id}/${setting.favicon}`
  }

  const getFaviconThumbnail = (setting: Setting) => {
    if (!setting.favicon) return null
    return `${pocketbaseUrl}/api/files/Settings/${setting.id}/${setting.favicon}?thumb=32x32`
  }

  return {
    ...base,
    getFaviconUrl,
    getFaviconThumbnail
  }
}
