<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  responsibility?: unknown
}

withDefaults(defineProps<Props>(), {
  title: 'Project',
  description: '',
  responsibility: undefined
})
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :overlay="false"
    :close="false"
  >
    <span class="cursor-pointer text-4xl uppercase">{{ title }}</span>

    <template #body>
      <div
        v-if="responsibility"
        class="space-y-4 uppercase"
      >
        <div>
          <p class="text-sm">Responsibility</p>
          <p class="text-sm">{{ responsibility }}</p>
        </div>
      </div>
    </template>
  </UModal>
</template>
