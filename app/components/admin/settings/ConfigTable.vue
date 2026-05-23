<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { PortfolioProject } from '#shared/types/pocketbase-types'

const UButton = resolveComponent('UButton')

const { data, status, refresh, savedOrder, getThumbnail, getImageUrl, persistOrder } =
  usePortfolioData()

useSortableTable({
  data,
  savedOrder,
  persistOrder,
  selector: '.portfolio-sortable-tbody'
})

const columns: TableColumn<PortfolioProject>[] = [
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
    accessorKey: 'images',
    header: 'Thumbnail',
    cell: ({ row }) => {
      const src = getThumbnail(row.original)
      if (!src) return h('span', { class: 'text-dimmed text-sm' }, 'No image')
      return h('img', {
        src,
        alt: row.original.title,
        loading: 'lazy',
        class: 'w-20 h-14 object-cover rounded'
      })
    }
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      return h('p', { class: 'font-medium text-highlighted' }, row.original.title)
    }
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const desc = row.original.description
      return h(
        'p',
        { class: 'text-sm truncate max-w-xs' },
        desc && desc.length > 60 ? desc.slice(0, 60) + '…' : desc
      )
    }
  },
  {
    accessorKey: 'responsibility',
    header: 'Responsibilities',
    cell: ({ row }) => {
      const resp = row.original.responsibility
      if (!resp || resp.length === 0) return h('span', { class: 'text-dimmed text-sm' }, '—')
      const text = resp.join(', ')
      return h(
        'p',
        { class: 'text-sm truncate max-w-xs' },
        text.length > 60 ? text.slice(0, 60) + '…' : text
      )
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
const selectedProject = ref<PortfolioProject | null>(null)

const openSettings = (project: PortfolioProject) => {
  selectedProject.value = project
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

  // Sync selectedProject with fresh data
  if (selectedProject.value) {
    const updated = data.value?.find(p => p.id === selectedProject.value!.id)
    if (updated) selectedProject.value = updated
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
      tbody: 'portfolio-sortable-tbody',
      tr: 'data-[expanded=true]:bg-elevated/50'
    }"
    class="flex-1"
  >
    <template #expanded="{ row }">
      <div
        v-if="row.original.images && row.original.images.length"
        class="flex gap-3 overflow-x-auto p-4"
      >
        <img
          v-for="image in row.original.images"
          :key="image"
          :src="getImageUrl(row.original, image)"
          :alt="row.original.title"
          loading="lazy"
          class="h-32 w-auto shrink-0 rounded object-cover"
        />
      </div>
      <div
        v-else
        class="text-dimmed p-4 text-sm"
      >
        No images
      </div>
    </template>
  </UTable>

  <ConfigDrawer
    v-model:open="drawerOpen"
    :project="selectedProject"
    @success="onFormSuccess"
    @deleted="onDeleteSuccess"
  />
</template>
