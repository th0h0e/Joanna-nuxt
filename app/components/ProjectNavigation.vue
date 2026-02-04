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
    <UPageList>
      <UPageCard
        v-for="(title, index) in projectTitles"
        :key="index"
        variant="ghost"
      >
        <template #body>
          <p class="text-2xl font-semibold text-gray-800 hover:text-gray-600 cursor-pointer transition">
            {{ title }}
          </p>
        </template>
      </UPageCard>
    </UPageList>
  </div>
</template>
