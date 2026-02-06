<script setup lang="ts">
interface Props {
  images: string[];
  projectTitle?: string;
  projectDescription?: string;
  projectResponsibility?: unknown;
  alt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  projectTitle: "Project",
  projectDescription: "",
  alt: "Image",
});
</script>

<template>
  <div class="relative w-screen h-[100dvh]">
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div class="pointer-events-auto">
        <ProjectPopup
          :title="projectTitle"
          :description="projectDescription"
          :responsibility="projectResponsibility"
        />
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
