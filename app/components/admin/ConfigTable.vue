<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useSortable } from '@vueuse/integrations/useSortable'
import type { PortfolioProject } from '#shared/types/pocketbase-types'

const UButton = resolveComponent('UButton')

const { pocketbaseUrl } = useRuntimeConfig().public

// Fetch portfolio projects from PocketBase (client-only, no SSR).
// Returns rows in PocketBase's default order (creation date / ID),
// NOT in our custom sort order — we fix that below in onMounted.
const { data, status, refresh } = useLazyFetch<PortfolioProject[]>('/api/portfolio', {
  key: 'portfolio-admin',
  transform: (data) => data ?? [],
  server: false
})

// Fetch the saved display order from our KV storage.
// This is an array of project IDs in the order the admin dragged them into.
const { data: savedOrder } = useLazyFetch<string[]>('/api/tableOrder', {
  key: 'table-order-admin',
  default: () => [],
  server: false
})


const getThumbnail = (project: PortfolioProject) => {
  if (!project.images || project.images.length === 0) return null
  return `${pocketbaseUrl}/api/files/Portfolio_Projects/${project.id}/${project.images[0]}?thumb=120x80`
}

const getImageUrl = (project: PortfolioProject, image: string) => {
  return `${pocketbaseUrl}/api/files/Portfolio_Projects/${project.id}/${image}?thumb=400x300`
}

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
      return h('p', { class: 'text-sm truncate max-w-xs' }, desc && desc.length > 60 ? desc.slice(0, 60) + '…' : desc)
    }
  },
  {
    accessorKey: 'responsibility',
    header: 'Responsibilities',
    cell: ({ row }) => {
      const resp = row.original.responsibility
      if (!resp) return h('span', { class: 'text-dimmed text-sm' }, '—')
      const text = typeof resp === 'string' ? resp : JSON.stringify(resp)
      return h('p', { class: 'text-sm truncate max-w-xs' }, text.length > 60 ? text.slice(0, 60) + '…' : text)
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

// DEFERRED INITIALIZATION
// Because useLazyFetch is async (server: false), data arrives after mount.
// We watch both data sources and only proceed once portfolio data is ready.
// stopWatch() ensures this only runs ONCE — multiple useSortable instances
// on the same element cause chaotic behavior (duplicate drag handlers, ghost elements).
onMounted(() => {
  const stopWatch = watch(
    [() => data.value?.length, () => savedOrder.value?.length],
    ([dataLen, orderLen]) => {
      if (dataLen && dataLen > 0) {
        // REORDER: PocketBase returns projects in creation order, not our custom order.
        // We sort data.value IN PLACE to match the saved order from KV storage.
        // This must mutate data.value directly (not use a computed) because:
        //   - useSortable needs a writable ref to splice when the user drags rows
        //   - computed properties are read-only — Sortable.js silently fails to update them
        if (orderLen && orderLen > 0) {
          const order = savedOrder.value ?? []
          const sorted = [...(data.value ?? [])].sort((a, b) => {
            const indexA = order.indexOf(a.id)
            const indexB = order.indexOf(b.id)
            // Projects not in the saved order (e.g. newly added) fall to the bottom
            if (indexA === -1 && indexB === -1) return 0
            if (indexA === -1) return 1
            if (indexB === -1) return -1
            return indexA - indexB
          })
          data.value = sorted
        }

        // ATTACH SORTABLE: Wait one more tick so Vue flushes the reordered rows to the DOM.
        // useSortable targets .sortable-tbody (the <tbody> class set via :ui prop on UTable).
        // It attaches Sortable.js which handles drag-and-drop and splices data.value on reorder.
        nextTick(() => {
          useSortable('.sortable-tbody', data as Ref<PortfolioProject[]>, {
            animation: 150,
            onEnd: () => {
              // 300ms delay ensures the 150ms animation finishes and useSortable
              // has completed splicing data.value to match the new visual order
              setTimeout(() => {
                const orderedIds = data.value?.map(project => project.id) ?? []
                persistOrder(orderedIds)
              }, 300)
            }
          })
        })
        stopWatch()
      }
    },
    { immediate: true }
  )
})

async function persistOrder(orderedIds: string[]) {
  try {
    await $fetch('/api/tableOrder', {
      method: 'POST',
      body: { orderedIds }
    })
    useToast().add({ title: 'Order saved', color: 'success' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    useToast().add({ title: 'Failed to save order', description: message, color: 'error' })
    refresh()
  }
}

const expanded = ref<Record<string, boolean>>({})

const drawerOpen = ref(false)
const selectedProject = ref<PortfolioProject | null>(null)

const openSettings = (project: PortfolioProject) => {
  selectedProject.value = project
  drawerOpen.value = true
}

const onFormSuccess = () => {
  drawerOpen.value = false
  refresh()
}

const onDeleteSuccess = () => {
  drawerOpen.value = false
  refresh()
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
      tbody: 'sortable-tbody',
      tr: 'data-[expanded=true]:bg-elevated/50'
    }"
    class="flex-1"
  >
    <template #expanded="{ row }">
      <div v-if="row.original.images && row.original.images.length" class="flex gap-3 p-4 overflow-x-auto">
        <img
          v-for="image in row.original.images"
          :key="image"
          :src="getImageUrl(row.original, image)"
          :alt="row.original.title"
          loading="lazy"
          class="h-32 w-auto shrink-0 object-cover rounded"
        >
      </div>
      <div v-else class="p-4 text-sm text-dimmed">
        No images
      </div>
    </template>
  </UTable>

  <UDrawer v-model:open="drawerOpen" :title="selectedProject?.title ?? 'Project Settings'">
    <template #body>
      <SettingsForm
        v-if="selectedProject"
        :project="selectedProject"
        @success="onFormSuccess"
        @deleted="onDeleteSuccess"
      />
    </template>
  </UDrawer>
</template>
