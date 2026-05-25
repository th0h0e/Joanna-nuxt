<script setup lang="ts">
import type { Setting } from '#shared/types/pocketbase-types'

defineProps<{
  setting: Setting | null
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
    title="Site Settings"
  >
    <template #body>
      <AdminSettingsForm
        v-if="setting"
        :setting="setting"
        @success="emit('success')"
        @deleted="emit('deleted')"
      />
    </template>
  </UDrawer>
</template>
