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
        <h1 class="text-3xl font-bold mb-2">
          Portfolio Admin Dashboard
        </h1>
        <p>
          Manage your portfolio projects and content
        </p>
      </div>
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
