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

// ── Loading state ──────────────────────────────────────────────────────────
const submitting = ref(false)

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
</script>

<template>
  <div class="space-y-6 p-4">
    <UForm
      :schema="schema"
      :state="state"
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

      <ProjectImageManager
        ref="imageManager"
        :project-id="project.id"
        :images="project.images"
      />

      <UButton
        type="submit"
        block
        :loading="submitting"
      >
        Save Changes
      </UButton>
    </UForm>

    <ProjectDeleteZone
      :project-id="project.id"
      :project-title="project.title"
      @deleted="emit('deleted')"
    />
  </div>
</template>
