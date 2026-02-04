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
  <div class="relative w-full h-[100dvh] flex items-center justify-center">
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
        container: 'h-[100dvh]',
        item: 'w-full h-[100dvh]',
      }"
    >
      <img :src="item" :alt="alt" class="object-cover" />
    </UCarousel>
  </div>
</template>
