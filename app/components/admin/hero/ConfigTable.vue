<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Homepage } from '#shared/types/pocketbase-types'

const UButton = resolveComponent('UButton')

const { data, status, refresh, savedOrder, getThumbnail, getImageUrl, persistOrder } =
  useHomepageData()

useSortableTable({
  data,
  savedOrder,
  persistOrder,
  selector: '.homepage-sortable-tbody'
})

const columns: TableColumn<Homepage>[] = [
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
    accessorKey: 'heroImage',
    header: 'Thumbnail',
    cell: ({ row }) => {
      const src = getThumbnail(row.original)
      if (!src) return h('span', { class: 'text-dimmed text-sm' }, 'No image')
      return h('img', {
        src,
        alt: row.original.heroTitle,
        loading: 'lazy',
        class: 'w-20 h-14 object-cover rounded'
      })
    }
  },
  {
    accessorKey: 'heroTitle',
    header: 'Hero Title',
    cell: ({ row }) => {
      return h('p', { class: 'font-medium text-highlighted' }, row.original.heroTitle || '—')
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
const selectedHomepage = ref<Homepage | null>(null)

const openSettings = (homepage: Homepage) => {
  selectedHomepage.value = homepage
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

  if (selectedHomepage.value) {
    const updated = data.value?.find(p => p.id === selectedHomepage.value!.id)
    if (updated) selectedHomepage.value = updated
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
      tbody: 'homepage-sortable-tbody',
      tr: 'data-[expanded=true]:bg-elevated/50'
    }"
    class="flex-1"
  >
    <template #expanded="{ row }">
      <div class="flex gap-3 overflow-x-auto p-4">
        <div
          v-if="row.original.heroImage"
          class="shrink-0"
        >
          <p class="text-dimmed mb-1 text-xs">Hero Image</p>
          <img
            :src="getImageUrl(row.original, row.original.heroImage)"
            alt="Hero Image"
            loading="lazy"
            class="h-32 w-auto rounded object-cover"
          />
        </div>
        <div
          v-if="row.original.heroImageMobile"
          class="shrink-0"
        >
          <p class="text-dimmed mb-1 text-xs">Mobile Hero Image</p>
          <img
            :src="getImageUrl(row.original, row.original.heroImageMobile)"
            alt="Mobile Hero Image"
            loading="lazy"
            class="h-32 w-auto rounded object-cover"
          />
        </div>
        <div
          v-if="!row.original.heroImage && !row.original.heroImageMobile"
          class="text-dimmed p-4 text-sm"
        >
          No images
        </div>
      </div>
    </template>
  </UTable>

  <AdminHeroConfigDrawer
    v-model:open="drawerOpen"
    :homepage="selectedHomepage"
    @success="onFormSuccess"
    @deleted="onDeleteSuccess"
  />
</template>
