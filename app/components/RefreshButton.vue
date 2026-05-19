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
  <UButton
    icon="i-lucide-rotate-ccw"
    size="md"
    color="neutral"
    variant="outline"
    :disabled="refreshing"
    @click="refresh"
  />
</template>
