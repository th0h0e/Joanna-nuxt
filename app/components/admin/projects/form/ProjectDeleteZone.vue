<script setup lang="ts">
defineProps<{
  projectId: string
  projectTitle: string
}>()

const emit = defineEmits<{
  deleted: []
}>()

const toast = useToast()
const showDeleteConfirm = ref(false)
const deleting = ref(false)

async function onDelete() {
  deleting.value = true

  try {
    await $fetch(`/api/portfolio/${projectId}`, {
      method: 'DELETE'
    })

    toast.add({ title: 'Project deleted', color: 'success' })
    emit('deleted')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete project'
    toast.add({ title: 'Delete failed', description: message, color: 'error' })
  } finally {
    deleting.value = false
  }
}
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
          @click="onDelete"
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
