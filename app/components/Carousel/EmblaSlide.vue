<script setup lang="ts">
import { inject } from 'vue'

// useCarousel is auto-imported from the remote layer
type CarouselApi = ReturnType<typeof useCarousel>

const carousel = inject<CarouselApi>('carousel')
</script>

<template>
  <div class="new-carousel__slide min-w-0 shrink-0">
    <slot />
  </div>
</template>
