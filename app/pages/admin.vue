<script setup lang="ts">
definePageMeta({
  layout: 'admin-panel'
})

const { toggle: toggleSidebar } = useAdminSidebar()
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Thin pinned column for the button -->
    <div class="h-screen w-12 flex-shrink-0">
      <div class="fixed top-6">
        <UButton
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          size="lg"
          @click="toggleSidebar"
        />
      </div>
    </div>

    <!-- Main content area -->
    <div class="min-h-screen flex-1 p-6 md:p-8 lg:p-12">
      <!-- Header -->
      <div class="mb-8 flex items-start justify-between">
        <div>
          <h1 class="mb-2 text-3xl font-bold">Portfolio Admin Dashboard</h1>
          <p>Manage your portfolio projects and content</p>
        </div>
      </div>

      <!-- Projects Table -->
      <div
        class="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold">Portfolio Projects</h2>
        </div>
        <AdminProjectsConfigTable />
      </div>
      <!-- Homepage (Hero) Table -->
      <div
        class="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold">Homepage</h2>
        </div>
        <AdminHeroConfigTable />
      </div>

      <!-- About Table -->
      <div
        class="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold">About</h2>
        </div>
        <AdminAboutConfigTable />
      </div>

      <!-- Settings Table -->
      <div
        class="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-semibold">Settings</h2>
        </div>
        <AdminSettingsConfigTable />
      </div>
    </div>
  </div>
</template>
