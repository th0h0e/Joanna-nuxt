<script setup lang="ts">
import type { SettingsResponse } from '#shared/types/pocketbase-types'

interface ProjectNavigationProps {
  projectTitles: string[]
  settingsData?: SettingsResponse | null
}

withDefaults(defineProps<ProjectNavigationProps>(), {
  settingsData: null
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
  <div class="flex h-full w-full flex-col items-center justify-center">
    <UPageList>
      <UPageCard
        v-for="(title, index) in projectTitles"
        :key="index"
        variant="ghost"
        @click="scrollToProject(title)"
      >
        <template #body>
          <span class="cursor-pointer text-4xl text-black uppercase">{{ title }}</span>
        </template>
      </UPageCard>
    </UPageList>
  </div>
</template>
