<script setup lang="ts">
import type { About } from '#shared/types/pocketbase-types'

defineProps<{
  about: About | null
}>()

const emit = defineEmits<{
  success: []
  deleted: []
}>()

const drawerOpen = defineModel<boolean>('open', { default: false })
</script>

<template>
  <UDrawer
    v-model:open="drawerOpen"
    :title="about?.portfolioTitle ?? 'About Settings'"
  >
    <template #body>
      <AdminAboutForm
        v-if="about"
        :about="about"
        @success="emit('success')"
        @deleted="emit('deleted')"
      />
    </template>
  </UDrawer>
</template>
