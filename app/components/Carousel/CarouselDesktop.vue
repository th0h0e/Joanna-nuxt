<script setup lang="ts">
interface Props {
  images: string[]
  projectTitle?: string
  projectDescription?: string
  projectResponsibility?: unknown
  alt?: string
}

withDefaults(defineProps<Props>(), {
  projectTitle: 'Project',
  projectDescription: '',
  projectResponsibility: undefined,
  alt: 'Image'
})

const isPopupOpen = ref(false)
</script>

<template>
  <div class="relative h-dvh w-screen">
    <div class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div class="pointer-events-auto">
        <UModal
          v-model:open="isPopupOpen"
          :title="projectTitle"
          :description="projectDescription"
          :overlay="false"
          :close="false"
        >
          <span
            class="cursor-pointer text-4xl tracking-tight text-pretty text-white uppercase transition-opacity duration-300"
            :class="isPopupOpen ? 'opacity-0' : 'opacity-100'"
            >{{ projectTitle }}</span
          >

          <template #body>
            <div
              v-if="projectResponsibility"
              class="space-y-4 uppercase"
            >
              <div>
                <p class="text-sm">Responsibility</p>
                <p class="text-sm">{{ projectResponsibility }}</p>
              </div>
            </div>
          </template>
        </UModal>
      </div>
    </div>

    <UCarousel
      v-if="images.length > 0"
      v-slot="{ item }"
      loop
      orientation="horizontal"
      wheel-gestures
      align="center"
      :items="images"
      :ui="{
        root: 'w-screen h-[100dvh]',
        viewport: 'w-screen h-[100dvh]',
        container: 'h-[100dvh]',
        item: 'basis-full min-w-0 shrink-0 w-screen h-[100dvh]'
      }"
    >
      <img
        :src="item"
        :alt="alt"
        class="h-full w-full object-cover"
      />
    </UCarousel>
  </div>
</template>
