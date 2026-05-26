<script setup lang="ts">
import type { Homepage } from '#shared/types/pocketbase-types'

const { pocketbaseUrl } = useRuntimeConfig().public

const { data: homepageRecords } = await useFetch<Homepage[]>('/api/homepage', {
  key: 'homepage-hero',
  transform: data => data ?? []
})

// Use the first (active) homepage record
const homepage = computed(() => homepageRecords.value?.[0] ?? null)

const imageUrl = computed(() => {
  if (!homepage.value?.heroImage) return null
  return `${pocketbaseUrl}/api/files/Homepage/${homepage.value.id}/${homepage.value.heroImage}`
})
</script>

<template>
  <UPageHero
    :title="homepage?.heroTitle || 'Joanna VDW'"
    :ui="{
      root: 'h-[100dvh] flex items-center justify-center',
      container: 'py-0 max-w-none',
      title: 'text-white'
    }"
  >
    <template #top>
      <div
        v-if="imageUrl"
        class="absolute inset-0 -z-10"
      >
        <img
          :src="imageUrl"
          alt="Hero background"
          class="h-full w-full object-cover"
        >
      </div>
    </template>
  </UPageHero>
</template>
