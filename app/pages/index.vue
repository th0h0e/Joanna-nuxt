<script setup lang="ts">
// Client-side interface matching the API response structure
interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  images: string[];
  order: number;
  responsibility: unknown;
  created: string;
  updated: string;
}

// Fetch portfolio projects from server
const { data: projects } = await useFetch<PortfolioProject[]>(
  "/api/portfolio",
  {
    key: "portfolio",
  },
);

const refreshing = ref(false);

// Extract project titles for the index section
const projectTitles = computed(() => projects.value?.map((p) => p.title) ?? []);

// Helper to get image URLs for a project
const getProjectImages = (project: PortfolioProject) => {
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
  <div class="h-screen overflow-y-scroll" style="scroll-snap-type: y mandatory">
    <button :disabled="refreshing" class="fixed top-4 left-4 z-10 bg-white px-4 py-2 rounded shadow" @click="refreshPortfolio">
      {{ refreshing ? "Loading..." : "Refresh Projects" }}
    </button>

    <div v-for="project in projects" :key="project.id" style="scroll-snap-align: start; scroll-snap-stop: always">
      <MotionCarouselDesktop
        :images="getProjectImages(project)"
        :alt="project.title"
      />
    </div>

    <div style="scroll-snap-align: start; scroll-snap-stop: always">
      <ProjectIndex :project-titles="projectTitles" />
    </div>
  </div>
</template>
