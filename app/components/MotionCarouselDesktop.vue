<script setup lang="ts">
interface Props {
  images: string[];
  alt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  alt: "Image",
});
</script>

<template>
  <UCarousel
    v-if="images.length > 0"
    v-slot="{ item }"
    loop
    wheel-gestures
    align="center"
    :items="images"
    :ui="{
      root: 'h-[100dvh]',
      item: 'basis-full',
    }"
  >
    <img :src="item" :alt="alt" class="w-full h-full object-cover rounded-lg" />
  </UCarousel>
</template>
