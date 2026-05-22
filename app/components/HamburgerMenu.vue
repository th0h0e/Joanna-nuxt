<script setup lang="ts">
import type { SettingsResponse } from '#shared/types/pocketbase-types'

interface HamburgerMenuProps {
  projectTitles: string[]
  settingsData?: SettingsResponse | null
}

defineProps<HamburgerMenuProps>()

const isOpen = ref(false)
const showCloseBtn = ref(false)

watch(isOpen, value => {
  if (value) {
    setTimeout(() => {
      showCloseBtn.value = true
    }, 200)
  } else {
    showCloseBtn.value = false
  }
})
</script>

<template>
  <div
    class="fixed top-6 right-6 z-10 size-6 cursor-pointer bg-white transition-colors"
    @click="isOpen = true"
  />

  <UModal
    v-model:open="isOpen"
    :fullscreen="true"
    :overlay="false"
  >
    <template #content>
      <div class="relative flex h-full items-center justify-center bg-white">
        <div
          v-if="showCloseBtn"
          class="absolute top-6 right-6 z-50 size-6 cursor-pointer bg-black transition-colors"
          @click="isOpen = false"
        />
        <ProjectNavigation
          :project-titles="projectTitles"
          @navigate="isOpen = false"
        />
      </div>
    </template>
  </UModal>
</template>
