<script setup lang="ts">
interface Props {
  images: string[];
  projectTitle?: string;
  projectDescription?: string;
  projectResponsibility?: unknown;
  alt?: string;
}

withDefaults(defineProps<Props>(), {
  projectTitle: "Project",
  projectDescription: "",
  projectResponsibility: undefined,
  alt: "Image",
});
</script>

<template>
  <div class="relative w-screen h-dvh">
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div class="pointer-events-auto">
        <UModal
          :title="projectTitle"
          :description="projectDescription"
          :overlay="false"
          :close="false"
        >
          <span class="text-4xl cursor-pointer text-pretty tracking-tight uppercase">{{ projectTitle }}</span>

          <template #body>
            <div v-if="projectResponsibility" class="space-y-4 uppercase">
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
        item: 'basis-full min-w-0 shrink-0 w-screen h-[100dvh]',
      }"
    >
      <img :src="item" :alt="alt" class="w-full h-full object-cover" >
    </UCarousel>
  </div>
</template>
