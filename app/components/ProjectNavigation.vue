<script setup lang="ts">
import type { SettingsResponse } from '#shared/types/pocketbase-types'

interface ProjectNavigationProps {
  projectTitles: string[]
  settingsData?: SettingsResponse | null
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
          <span class="text-4xl text-black uppercase cursor-pointer">{{ title }}</span>
        </template>
      </UPageCard>
    </UPageList>
  </div>
</template>
