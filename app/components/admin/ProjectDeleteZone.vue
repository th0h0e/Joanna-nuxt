<script setup lang="ts">
defineProps<{
  projectTitle: string
  deleting: boolean
}>()

const emit = defineEmits<{
  delete: []
}>()

const showDeleteConfirm = ref(false)
</script>

<template>
  <div class="space-y-3">
    <p class="text-sm font-medium text-error">Danger Zone</p>

    <template v-if="!showDeleteConfirm">
      <UButton
        color="error"
        variant="outline"
        icon="i-lucide-trash-2"
        block
        @click="showDeleteConfirm = true"
      >
        Delete Project
      </UButton>
    </template>

    <template v-else>
      <p class="text-sm text-dimmed">
        This will permanently delete <strong>{{ projectTitle }}</strong>. This action cannot be undone.
      </p>
      <div class="flex gap-2">
        <UButton
          color="error"
          :loading="deleting"
          @click="emit('delete')"
        >
          Confirm Delete
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          @click="showDeleteConfirm = false"
        >
          Cancel
        </UButton>
      </div>
    </template>
  </div>
</template>
