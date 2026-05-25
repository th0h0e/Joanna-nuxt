import type { Setting } from '#shared/types/pocketbase-types'

export function useSettingsData() {
  const { pocketbaseUrl } = useRuntimeConfig().public
  const toast = useToast()

  const { data, status, refresh } = useLazyFetch<Setting[]>('/api/settings', {
    key: 'settings-admin',
    transform: data => data ?? [],
    server: false
  })

  const { data: savedOrder } = useLazyFetch<string[]>('/api/tableOrder', {
    key: 'table-order-settings',
    query: { key: 'settings' },
    default: () => [],
    server: false
  })

  // ── Favicon URL helper ───────────────────────────────────────────────────
  const getFaviconUrl = (setting: Setting) => {
    if (!setting.favicon) return null
    return `${pocketbaseUrl}/api/files/Settings/${setting.id}/${setting.favicon}`
  }

  const getFaviconThumbnail = (setting: Setting) => {
    if (!setting.favicon) return null
    return `${pocketbaseUrl}/api/files/Settings/${setting.id}/${setting.favicon}?thumb=32x32`
  }

  // ── Persist drag-and-drop order ──────────────────────────────────────────
  async function persistOrder(orderedIds: string[]) {
    try {
      await $fetch('/api/tableOrder', {
        method: 'POST',
        body: { key: 'settings', orderedIds }
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
    getFaviconUrl,
    getFaviconThumbnail,
    persistOrder
  }
}
