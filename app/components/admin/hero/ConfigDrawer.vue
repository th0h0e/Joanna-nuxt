<script setup lang="ts">
import type { Homepage } from '#shared/types/pocketbase-types'

defineProps<{
  homepage: Homepage | null
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
    :title="homepage?.heroTitle ?? 'Homepage Settings'"
  >
    <template #body>
      <AdminHeroFormHomepageForm
        v-if="homepage"
        :homepage="homepage"
        @success="emit('success')"
        @deleted="emit('deleted')"
      />
    </template>
  </UDrawer>
</template>
