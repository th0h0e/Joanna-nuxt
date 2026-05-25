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

// ── Schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description is too long'),
  responsibility: z.array(z.string()).optional().default([])
})

//Let types refer to zod schema above
type Schema = z.output<typeof schema>

// ── Reactive State ──────────────────────────────────────────────────────────────────
const state = reactive<Partial<Schema>>({
  title: props.project.title,
  description: props.project.description,
  responsibility: props.project.responsibility ?? []
})

// ── Ref to image manager ───────────────────────────────────────────────────
const imageManager = ref<{ getFormDataEntries: (formData: FormData) => Promise<void> } | null>(null)

// ── Delete state (absorbed from ProjectDeleteZone) ─────────────────────────
const showDeleteConfirm = ref(false)
const deleting = ref(false)

// ── Submit (update) ────────────────────────────────────────────────────────
// loading-auto on UForm handles disabling inputs automatically during submit
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const formData = new FormData()

    // Read from event.data (Zod-validated) instead of state (raw reactive)
    formData.append('title', event.data.title)
    formData.append('description', event.data.description)
    if (event.data.responsibility && event.data.responsibility.length > 0) {
      formData.append('responsibility', JSON.stringify(event.data.responsibility))
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
  }
}

// ── Delete project ────────────────────────────────────────────────────────
async function onDelete() {
  if (deleting.value) return
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
    <UForm
      :schema="schema"
      :state="state"
      loading-auto
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="Title"
        name="title"
        required
      >
        <UInput
          v-model="state.title"
          placeholder="Project title"
        />
      </UFormField>

      <UFormField
        label="Description"
        name="description"
        required
      >
        <UTextarea
          v-model="state.description"
          :rows="6"
          placeholder="Project description"
          autoresize
          :maxrows="10"
        />
      </UFormField>

      <UFormField
        label="Responsibilities"
        name="responsibility"
      >
        <UInputTags
          v-model="state.responsibility"
          placeholder="Add your responsibility..."
        />
      </UFormField>

      <AdminProjectsFormProjectImageManager
        ref="imageManager"
        :project-id="project.id"
        :images="project.images"
      />

      <UButton
        type="submit"
        block
        loading-auto
      >
        Save Changes
      </UButton>
    </UForm>

    <!-- Danger Zone (absorbed from ProjectDeleteZone) -->
    <UDivider />

    <div class="space-y-3">
      <p class="text-error text-sm font-medium">Danger Zone</p>
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
        <p class="text-dimmed text-sm">
          This will permanently delete <strong>{{ project.title }}</strong
          >.
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
  </div>
</template>
