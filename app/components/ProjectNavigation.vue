<script setup lang="ts">
import type { Settings } from "../config/pocketbase"

interface ProjectNavigationProps {
  projectTitles: string[]
  settingsData?: Settings | null
}

withDefaults(defineProps<ProjectNavigationProps>(), {
  settingsData: null,
})
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <ul class="space-y-4">
      <li
        v-for="(title, index) in projectTitles"
        :key="index"
        class="text-2xl font-semibold text-gray-800 hover:text-gray-600 cursor-pointer transition"
      >
        {{ title }}
      </li>
    </ul>
  </div>
</template>
