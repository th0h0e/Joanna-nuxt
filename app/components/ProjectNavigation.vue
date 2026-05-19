<script setup lang="ts">
import type { SettingsResponse } from '#shared/types/pocketbase-types'

interface ProjectNavigationProps {
  projectTitles: string[]
  settingsData?: SettingsResponse | null
}

const props = withDefaults(defineProps<ProjectNavigationProps>(), {
  settingsData: null,
})

const emit = defineEmits<{
  navigate: []
}>()

const scrollToProject = (title: string) => {
  const slug = title.replace(/\s+/g, '-').toLowerCase()
  const el = document.getElementById(`project-${slug}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    emit('navigate')
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <UPageList>
      <UPageCard
        v-for="(title, index) in projectTitles"
        :key="index"
        variant="ghost"
        @click="scrollToProject(title)"
      >
        <template #body>
          <span class="text-4xl text-black uppercase cursor-pointer">{{ title }}</span>
        </template>
      </UPageCard>
    </UPageList>
  </div>
</template>
