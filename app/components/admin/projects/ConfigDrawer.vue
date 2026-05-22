<script setup lang="ts">
import type { PortfolioProject } from '#shared/types/pocketbase-types'

defineProps<{
  project: PortfolioProject | null
}>()

const emit = defineEmits<{
  success: []
  deleted: []
}>()

const drawerOpen = defineModel<boolean>('open', { default: false })
</script>

<template>
  <UDrawer v-model:open="drawerOpen" :title="project?.title ?? 'Project Settings'">
    <template #body>
      <SettingsForm
        v-if="project"
        :project="project"
        @success="emit('success')"
        @deleted="emit('deleted')"
      />
    </template>
  </UDrawer>
</template>
