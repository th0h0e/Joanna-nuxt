<script setup lang="ts">
interface RefreshButtonProps {
  cacheKey: string;
  invalidateUrl: string;
}

const props = defineProps<RefreshButtonProps>();

const refreshing = ref(false);

async function refresh() {
  refreshing.value = true;
  try {
    // Invalidate cache on server
    await $fetch(props.invalidateUrl);
    // Then refetch the data
    await refreshNuxtData(props.cacheKey);
  } finally {
    refreshing.value = false;
  }
}
</script>

<template>
  <button
    :disabled="refreshing"
    class="fixed top-4 left-4 z-10 bg-white px-4 py-2 rounded shadow"
    @click="refresh"
  >
    {{ refreshing ? "Loading..." : "Refresh Projects" }}
  </button>
</template>
