<script setup lang="ts">
import type { PortfolioProjectsResponse } from "~/shared/types/pocketbase-types";

// Fetch portfolio projects from server
const { data: projects } = await useFetch<PortfolioProjectsResponse[]>(
  "/api/portfolio",
  {
    key: "portfolio",
  },
);

const refreshing = ref(false);

// Helper to get image URLs for a project
const getProjectImages = (project: PortfolioProjectsResponse) => {
  if (!project.images || project.images.length === 0) return [];
  return project.images.map(
    (image: string) =>
      `https://admin.kontext.site/api/files/Portfolio_Projects/${project.id}/${image}?thumb=1200x800`,
  );
};

// Refresh portfolio data
async function refreshPortfolio() {
  refreshing.value = true;
  try {
    // Invalidate cache on server
    await $fetch("/api/portfolio/invalidate");
    // Then refetch the data
    await refreshNuxtData("portfolio");
  } finally {
    refreshing.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen">
    <button :disabled="refreshing" class="mb-8" @click="refreshPortfolio">
      {{ refreshing ? "Loading..." : "Refresh Projects" }}
    </button>

    <div v-for="project in projects" :key="project.id" class="mb-16">
      <UCarousel
        v-slot="{ item }"
        loop
        :items="getProjectImages(project)"
        :ui="{ item: 'basis-1/3' }"
      >
        <img
          :src="item"
          :alt="project.title"
          class="w-full h-96 object-cover rounded-lg"
        />
      </UCarousel>
    </div>
  </div>
</template>
