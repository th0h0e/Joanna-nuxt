<script setup lang="ts">
definePageMeta({
  title: 'Admin Dashboard'
})
</script>

<template>
  <div class="min-h-screen p-6 md:p-8 lg:p-12">
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
        <h2 class="text-xl font-semibold">All Projects</h2>
      </div>
      <ConfigTable />
    </div>
  </div>
</template>
