<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  responsibility?: unknown;
}

withDefaults(defineProps<Props>(), {
  title: "Project",
  description: "",
});
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :overlay="false"
    :close="false"
  >
    <UButton :label="title" color="neutral" variant="subtle" />

    <template #body>
      <div v-if="responsibility" class="space-y-4">
        <div>
          <p class="text-sm font-semibold">Responsibility</p>
          <p class="text-sm text-gray-600">{{ responsibility }}</p>
        </div>
      </div>
    </template>
  </UModal>
</template>
