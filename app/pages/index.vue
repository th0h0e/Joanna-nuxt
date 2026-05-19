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

// Extract project titles for the index section
const projectTitles = computed(() => projects.value?.map((p) => p.title) ?? []);

const { pocketbaseUrl } = useRuntimeConfig().public;

// Helper to get image URLs for a project
const getProjectImages = (project: PortfolioProject) => {
  if (!project.images || project.images.length === 0) return [];
  return project.images.map(
    (image: string) =>
      `${pocketbaseUrl}/api/files/Portfolio_Projects/${project.id}/${image}?thumb=1200x800`,
  );
};


</script>

<template>
  <div class="h-screen overflow-y-scroll snap-container">
    <RefreshButton cache-key="portfolio" invalidate-url="/api/portfolio/invalidate" />

    <div class="snap-point">
      <IndexHero />
    </div>

    <div v-for="project in projects" :key="project.id" class="snap-point">
      <CarouselDesktop
        :images="getProjectImages(project)"
        :project-title="project.title"
        :project-description="project.description"
        :project-responsibility="project.responsibility"
        :alt="project.title"
      />

    </div>

    <div class="snap-point">
      <ProjectIndex :project-titles="projectTitles" />
    </div>
  </div>
</template>

<style scoped>
.snap-container {
  scroll-snap-type: y mandatory;
}

.snap-point {
  scroll-snap-align: center;
  scroll-snap-stop: always;
}
</style>
