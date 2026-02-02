<script setup lang="ts">
import type { PortfolioProjectsResponse } from '~/shared/types/pocketbase-types'

// Fetch portfolio projects from server
const { data: projects } = await useFetch<PortfolioProjectsResponse[]>('/api/portfolio', {
  query: {
    mode: 'full',
    sort: 'Order'
  }
})

// Helper to get image URLs for a project
const getProjectImages = (project: PortfolioProjectsResponse) => {
  if (!project.Images || project.Images.length === 0) return []

  return project.Images.map(image =>
    `https://admin.kontext.site/api/files/Portfolio_Projects/${project.id}/${image}?thumb=1200x800`
  )
}
</script>

<template>
  <div class="min-h-screen">
    <div
      v-for="project in projects"
      :key="project.id"
      class="mb-16"
    >
      <UCarousel
        v-slot="{ item }"
        loop
        :items="getProjectImages(project)"
        :ui="{ item: 'basis-1/3' }"
      >
        <img
          :src="item"
          :alt="project.Title"
          class="w-full h-96 object-cover rounded-lg"
        >
      </UCarousel>
    </div>
  </div>
</template>
