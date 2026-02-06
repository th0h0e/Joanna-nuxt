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
    <span class="text-4xl font-bold cursor-pointer uppercase">{{ title }}</span>

    <template #body>
      <div v-if="responsibility" class="space-y-4 uppercase">
        <div>
          <p class="text-sm">Responsibility</p>
          <p class="text-sm">{{ responsibility }}</p>
        </div>
      </div>
    </template>
  </UModal>
</template>
