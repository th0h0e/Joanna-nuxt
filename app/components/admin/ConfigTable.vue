<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { useSortable } from '@vueuse/integrations/useSortable'
import type { PortfolioProject } from '#shared/types/pocketbase-types'

const UButton = resolveComponent('UButton')

const { pocketbaseUrl } = useRuntimeConfig().public

const { data, status, refresh } = await useFetch<PortfolioProject[]>('/api/portfolio', {
  key: 'portfolio'
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

// useSortable requires a writable ref — computed is read-only and won't update on drag
const projects = ref<PortfolioProject[]>(data.value ?? [])

// Sync from useFetch into our writable ref (initial load + refreshes)
watch(data, (newData) => {
  if (newData) projects.value = [...newData]
}, { immediate: true })

const toast = useToast()

const saveOrder = async () => {
  const orders = projects.value.map((project, index) => ({
    id: project.id,
    order: index
  }))

  try {
    await $fetch('/api/portfolio/reorder', {
      method: 'POST',
      body: { orders }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save order'
    toast.add({ title: 'Reorder failed', description: message, color: 'error' })
  }
}

useSortable('.sortable-tbody', projects, {
  animation: 150,
  onEnd: () => {
    saveOrder()
  }
})

const expanded = ref<Record<string, boolean>>({})

const table = useTemplateRef('table')

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
    :data="projects"
    :columns="columns"
    :loading="status === 'pending'"
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
        />
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
