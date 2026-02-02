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
  return status === 'published' ? 'green' : 'yellow'
}
</script>

<template>
  <div class="min-h-screen p-6 md:p-8 lg:p-12">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">
        Portfolio Admin Dashboard
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Manage your portfolio projects and content
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</span>
          <UIcon
            :name="stat.icon"
            class="w-5 h-5 text-gray-400"
          />
        </div>
        <div class="text-2xl font-bold">
          {{ stat.value }}
        </div>
      </div>
    </div>

    <!-- Recent Projects Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold">
          Recent Projects
        </h2>
        <UButton
          color="primary"
          size="sm"
        >
          Add New Project
        </UButton>
      </div>

      <div class="space-y-3">
        <div
          v-for="project in projects"
          :key="project.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 transition-colors"
        >
          <div class="flex-1">
            <h3 class="font-medium mb-1">
              {{ project.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ new Date(project.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <UBadge
              :color="getStatusColor(project.status)"
              variant="subtle"
            >
              {{ project.status }}
            </UBadge>
            <div class="flex gap-2">
              <UButton
                color="gray"
                variant="ghost"
                size="xs"
                icon="i-heroicons-pencil"
              />
              <UButton
                color="gray"
                variant="ghost"
                size="xs"
                icon="i-heroicons-trash"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <UButton
        color="white"
        size="lg"
        block
        icon="i-heroicons-document-plus"
        class="justify-start"
      >
        Create New Project
      </UButton>
      <UButton
        color="white"
        size="lg"
        block
        icon="i-heroicons-cog-6-tooth"
        class="justify-start"
      >
        Settings
      </UButton>
      <UButton
        color="white"
        size="lg"
        block
        icon="i-heroicons-chart-bar"
        class="justify-start"
      >
        View Analytics
      </UButton>
    </div>
  </div>
</template>
