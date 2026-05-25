<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { About } from '#shared/types/pocketbase-types'

const UButton = resolveComponent('UButton')

const { data, status, refresh, savedOrder, persistOrder } = useAboutData()

useSortableTable({
  data,
  savedOrder,
  persistOrder,
  selector: '.about-sortable-tbody'
})

const columns: TableColumn<About>[] = [
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
    accessorKey: 'portfolioTitle',
    header: 'Portfolio Title',
    cell: ({ row }) => {
      return h('p', { class: 'font-medium text-highlighted' }, row.original.portfolioTitle || '—')
    }
  },
  {
    accessorKey: 'contactEmail',
    header: 'Contact Email',
    cell: ({ row }) => {
      return h('p', { class: 'text-sm truncate max-w-xs' }, row.original.contactEmail || '—')
    }
  },
  {
    accessorKey: 'expertiseTitle',
    header: 'Expertise Title',
    cell: ({ row }) => {
      return h('p', { class: 'text-sm truncate max-w-xs' }, row.original.expertiseTitle || '—')
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
const selectedAbout = ref<About | null>(null)

const openSettings = (about: About) => {
  selectedAbout.value = about
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

  if (selectedAbout.value) {
    const updated = data.value?.find(p => p.id === selectedAbout.value!.id)
    if (updated) selectedAbout.value = updated
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
      tbody: 'about-sortable-tbody',
      tr: 'data-[expanded=true]:bg-elevated/50'
    }"
    class="flex-1"
  >
    <template #expanded="{ row }">
      <div class="space-y-3 p-4 text-sm">
        <div>
          <span class="text-highlighted font-medium">About Description:</span>
          <p class="text-dimmed mt-1 whitespace-pre-wrap">
            {{ row.original.aboutDescription || '—' }}
          </p>
        </div>
        <div>
          <span class="text-highlighted font-medium">Expertise Description:</span>
          <p class="text-dimmed mt-1 whitespace-pre-wrap">
            {{ row.original.expertiseDescription || '—' }}
          </p>
        </div>
        <div>
          <span class="text-highlighted font-medium">Contact Message:</span>
          <p class="text-dimmed mt-1 whitespace-pre-wrap">
            {{ row.original.contactMessage || '—' }}
          </p>
        </div>
        <div>
          <span class="text-highlighted font-medium">Selected Clients Title:</span>
          <p class="text-dimmed mt-1">{{ row.original.selectedClientsTitle || '—' }}</p>
        </div>
      </div>
    </template>
  </UTable>

  <AdminAboutConfigDrawer
    v-model:open="drawerOpen"
    :about="selectedAbout"
    @success="onFormSuccess"
    @deleted="onDeleteSuccess"
  />
</template>
