<script setup lang="ts">
import type { SettingsResponse } from '#shared/types/pocketbase-types'

interface ProjectIndexProps {
  projectTitles: string[]
  settingsData?: SettingsResponse | null
}

withDefaults(defineProps<ProjectIndexProps>(), {
  settingsData: null
})
</script>

<template>
  <section
    id="project-index"
    class="flex w-full snap-center items-center justify-center bg-white"
    :style="{ height: '100lvh' }"
  >
    <ProjectNavigation
      :project-titles="projectTitles"
      :settings-data="settingsData"
    />
  </section>
</template>
