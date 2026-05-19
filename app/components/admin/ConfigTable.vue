<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

interface PortfolioProject {
  id: string
  title: string
  description: string
  images: string[]
  order: number
  responsibility: unknown
  created: string
  updated: string
}

const { pocketbaseUrl } = useRuntimeConfig().public

const { data, status } = useLazyFetch<PortfolioProject[]>('/api/portfolio', {
  key: 'portfolio-table',
  transform: (data) => data ?? [],
  server: false
})

const getThumbnail = (project: PortfolioProject) => {
  if (!project.images || project.images.length === 0) return null
  return `${pocketbaseUrl}/api/files/Portfolio_Projects/${project.id}/${project.images[0]}?thumb=120x80`
}

const columns: TableColumn<PortfolioProject>[] = [
  {
    accessorKey: 'order',
    header: 'Order'
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
    accessorKey: 'order',
    header: 'Sort Order',
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.order)
  }
]
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    :loading="status === 'pending' || status === 'idle'"
    class="flex-1 h-80"
  />
</template>
