<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { PortfolioProject } from '#shared/types/pocketbase-types'

const props = defineProps<{
  project: PortfolioProject
}>()

const emit = defineEmits<{
  success: []
  deleted: []
}>()

const toast = useToast()

// ── Helpers ────────────────────────────────────────────────────────────────
function parseResponsibility(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === 'string')
    } catch { /* not JSON, treat as single tag */ }
    return value ? [value] : []
  }
  return []
}

// ── Schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description is too long'),
  responsibility: z.array(z.string()).optional().default([])
})

type Schema = z.output<typeof schema>

// ── State ──────────────────────────────────────────────────────────────────
const state = reactive<Partial<Schema>>({
  title: props.project.title,
  description: props.project.description,
  responsibility: parseResponsibility(props.project.responsibility)
})

// ── Ref to image manager ───────────────────────────────────────────────────
const imageManager = ref<{ getFormDataEntries: (formData: FormData) => Promise<void> } | null>(null)

// ── Loading states ─────────────────────────────────────────────────────────
const submitting = ref(false)
const deleting = ref(false)

// ── Submit (update) ────────────────────────────────────────────────────────
async function onSubmit(_event: FormSubmitEvent<Schema>) {
  submitting.value = true

  try {
    const formData = new FormData()

    formData.append('title', state.title!)
    formData.append('description', state.description!)
    if (state.responsibility && state.responsibility.length > 0) {
      formData.append('responsibility', JSON.stringify(state.responsibility))
    } else {
      formData.append('responsibility', '[]')
    }

    // Delegate image data to the image manager component
    await imageManager.value?.getFormDataEntries(formData)

    await $fetch(`/api/portfolio/${props.project.id}`, {
      method: 'PATCH',
      body: formData
    })

    toast.add({ title: 'Project updated', color: 'success' })
    emit('success')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update project'
    toast.add({ title: 'Update failed', description: message, color: 'error' })
  } finally {
    submitting.value = false
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────
async function onDelete() {
  deleting.value = true

  try {
    await $fetch(`/api/portfolio/${props.project.id}`, {
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
  <div class="space-y-6 p-4">
    <!-- Update Form -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <ProjectFormFields
        :state="state"
        @update:state="Object.assign(state, $event)"
      />

      <ProjectImageManager
        ref="imageManager"
        :project-id="project.id"
        :images="project.images"
      />

      <UButton type="submit" block :loading="submitting">
        Save Changes
      </UButton>
    </UForm>

    <!-- Divider -->
    <USeparator />

    <!-- Danger Zone -->
    <ProjectDeleteZone
      :project-title="project.title"
      :deleting="deleting"
      @delete="onDelete"
    />
  </div>
</template>
