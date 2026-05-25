<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Setting } from '#shared/types/pocketbase-types'

const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const { data, status, refresh, savedOrder, getFaviconThumbnail, persistOrder } = useSettingsData()

useSortableTable({
  data,
  savedOrder,
  persistOrder,
  selector: '.settings-sortable-tbody'
})

const columns: TableColumn<Setting>[] = [
  {
    id: 'expand',
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : ''
          ]
        },
        onClick: () => row.toggleExpanded()
      })
  },
  {
    accessorKey: 'favicon',
    header: 'Favicon',
    cell: ({ row }) => {
      const src = getFaviconThumbnail(row.original)
      if (!src) return h('span', { class: 'text-dimmed text-sm' }, 'No favicon')
      return h('img', {
        src,
        alt: 'Favicon',
        loading: 'lazy',
        class: 'w-8 h-8 object-contain rounded'
      })
    }
  },
  {
    accessorKey: 'desktopFontSize',
    header: 'Font Sizes',
    cell: ({ row }) => {
      const s = row.original
      const sizes = [s.mobileFontSize, s.tabletFontSize, s.desktopFontSize, s.largeDesktopFontSize]
        .filter(v => v != null)
        .map(v => `${v}px`)
        .join(' / ')
      return h('p', { class: 'text-sm' }, sizes || '—')
    }
  },
  {
    accessorKey: 'showTopProgressBar',
    header: 'Progress Bar',
    cell: ({ row }) => {
      return h(UBadge, {
        color: row.original.showTopProgressBar ? 'success' : 'neutral',
        variant: 'subtle',
        label: row.original.showTopProgressBar ? 'Visible' : 'Hidden'
      })
    }
  },
  {
    id: 'actions',
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-settings',
        square: true,
        'aria-label': 'Settings',
        onClick: () => openSettings(row.original)
      })
  }
]

const expanded = ref<Record<string, boolean>>({})
const drawerOpen = ref(false)
const selectedSetting = ref<Setting | null>(null)

const openSettings = (setting: Setting) => {
  selectedSetting.value = setting
  drawerOpen.value = true
}

function reSortData() {
  const order = savedOrder.value ?? []
  if (order.length > 0 && data.value) {
    const sorted = [...data.value].sort((a, b) => {
      const indexA = order.indexOf(a.id)
      const indexB = order.indexOf(b.id)
      if (indexA === -1 && indexB === -1) return 0
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
    data.value = sorted
  }
}

const onFormSuccess = async () => {
  drawerOpen.value = false
  await refresh()
  reSortData()

  if (selectedSetting.value) {
    const updated = data.value?.find(p => p.id === selectedSetting.value!.id)
    if (updated) selectedSetting.value = updated
  }
}

const onDeleteSuccess = async () => {
  drawerOpen.value = false
  await refresh()
  reSortData()
}
</script>

<template>
  <UTable
    ref="table"
    v-model:expanded="expanded"
    :data="data"
    :columns="columns"
    :loading="status === 'pending' || status === 'idle'"
    :ui="{
      tbody: 'settings-sortable-tbody',
      tr: 'data-[expanded=true]:bg-elevated/50'
    }"
    class="flex-1"
  >
    <template #expanded="{ row }">
      <div class="space-y-2 p-4 text-sm">
        <p>
          <span class="text-highlighted font-medium">Mobile:</span>
          {{ row.original.mobileFontSize ?? '—' }}px
        </p>
        <p>
          <span class="text-highlighted font-medium">Tablet:</span>
          {{ row.original.tabletFontSize ?? '—' }}px
        </p>
        <p>
          <span class="text-highlighted font-medium">Desktop:</span>
          {{ row.original.desktopFontSize ?? '—' }}px
        </p>
        <p>
          <span class="text-highlighted font-medium">Large Desktop:</span>
          {{ row.original.largeDesktopFontSize ?? '—' }}px
        </p>
        <p>
          <span class="text-highlighted font-medium">Progress Bar:</span>
          {{ row.original.showTopProgressBar ? 'Visible' : 'Hidden' }}
        </p>
      </div>
    </template>
  </UTable>

  <AdminSettingsConfigDrawer
    v-model:open="drawerOpen"
    :setting="selectedSetting"
    @success="onFormSuccess"
    @deleted="onDeleteSuccess"
  />
</template>
