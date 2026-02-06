<script setup lang="ts">
import type { Settings } from "../config/pocketbase";
import ProjectNavigation from "./ProjectNavigation";

interface ProjectIndexProps {
  projectTitles: string[];
  settingsData?: Settings | null;
}

withDefaults(defineProps<ProjectIndexProps>(), {
  settingsData: null,
});
</script>

<template>
  <section
    id="project-index"
    class="w-full snap-center bg-white flex items-center justify-center"
    :style="{ height: '100lvh' }"
  >
    <ProjectNavigation
      :project-titles="projectTitles"
      :settings-data="settingsData"
    />
  </section>
</template>
