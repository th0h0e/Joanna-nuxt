/**
 * Composable for the Settings admin ConfigTable.
 *
 * Wraps `useCmsData` for the shared fetch / order / persist logic,
 * then adds helpers specific to the Settings collection:
 *
 *  - `getFaviconUrl`       — Full-resolution favicon URL (used in the form/drawer).
 *  - `getFaviconThumbnail` — Tiny 32×32 thumbnail for the row preview in the table.
 *
 * Both build URLs against the PocketBase file endpoint:
 *   {pocketbaseUrl}/api/files/Settings/{recordId}/{favicon}
 */
import type { Setting } from '#shared/types/pocketbase-types'

export function useSettingsData() {
  const { pocketbaseUrl } = useRuntimeConfig().public

  const base = useCmsData<Setting>({
    endpoint: '/api/settings',
    fetchKey: 'settings-admin',
    collectionKey: 'settings'
  })

  // ── Favicon URL helpers ──────────────────────────────────────────────────

  /** Full-resolution favicon URL. Used in the settings form/drawer. */
  const getFaviconUrl = (setting: Setting) => {
    if (!setting.favicon) return null
    return `${pocketbaseUrl}/api/files/Settings/${setting.id}/${setting.favicon}`
  }

  /** Tiny 32×32 favicon thumbnail for the ConfigTable row preview. */
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
