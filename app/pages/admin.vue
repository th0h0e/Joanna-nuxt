<script setup lang="ts">
definePageMeta({
  title: 'Admin Dashboard'
})

// Sample portfolio stats
const stats = ref([
  { label: 'Total Projects', value: 12, icon: 'i-heroicons-briefcase' },
  { label: 'Published', value: 10, icon: 'i-heroicons-check-circle' },
  { label: 'Drafts', value: 2, icon: 'i-heroicons-document-text' },
  { label: 'Page Views', value: '2.4k', icon: 'i-heroicons-eye' }
])

// Sample recent projects
const projects = ref([
  { id: 1, title: 'E-commerce Platform', status: 'published', date: '2024-01-15' },
  { id: 2, title: 'Mobile App Design', status: 'published', date: '2024-01-10' },
  { id: 3, title: 'Brand Identity', status: 'draft', date: '2024-01-08' },
  { id: 4, title: 'Portfolio Website', status: 'published', date: '2024-01-05' }
])

const getStatusColor = (status: string) => {
  return status === 'published' ? 'success' : 'warning'
}
</script>

<template>
  <div class="min-h-screen p-6 md:p-8 lg:p-12">
    <!-- Header -->
    <div class="mb-8 flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-bold mb-2">
          Portfolio Admin Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Manage your portfolio projects and content
        </p>
      </div>
      <RefreshButton cache-key="portfolio" invalidate-url="/api/portfolio/invalidate" />
    </div>

    <!-- Projects Table -->
    <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold">
          All Projects
        </h2>
      </div>
      <ConfigTable />
    </div>

  </div>
</template>
