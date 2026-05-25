<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Homepage } from '#shared/types/pocketbase-types'

const props = defineProps<{
  homepage: Homepage
}>()

const emit = defineEmits<{
  success: []
  deleted: []
}>()

const toast = useToast()

// ── Schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  heroTitle: z.string().min(1, 'Hero title is required').max(200),
  isActive: z.boolean().optional().default(false)
})

type Schema = z.output<typeof schema>

// ── Reactive State ─────────────────────────────────────────────────────────
const state = reactive<Partial<Schema>>({
  heroTitle: props.homepage.heroTitle ?? '',
  isActive: props.homepage.isActive ?? false
})

// ── Ref to image manager ───────────────────────────────────────────────────
const imageManager = ref<{ getFormDataEntries: (formData: FormData) => Promise<void> } | null>(null)

// ── Delete state ───────────────────────────────────────────────────────────
const showDeleteConfirm = ref(false)
const deleting = ref(false)

// ── Submit (update) ────────────────────────────────────────────────────────
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const formData = new FormData()

    formData.append('heroTitle', event.data.heroTitle)
    formData.append('isActive', String(event.data.isActive ?? false))

    // Delegate image data to the image manager component
    await imageManager.value?.getFormDataEntries(formData)

    await $fetch(`/api/homepage/${props.homepage.id}`, {
      method: 'PATCH',
      body: formData
    })

    toast.add({ title: 'Homepage updated', color: 'success' })
    emit('success')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update homepage'
    toast.add({ title: 'Update failed', description: message, color: 'error' })
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────
async function onDelete() {
  if (deleting.value) return
  deleting.value = true

  try {
    await $fetch(`/api/homepage/${props.homepage.id}`, {
      method: 'DELETE'
    })

    toast.add({ title: 'Homepage record deleted', color: 'success' })
    emit('deleted')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete homepage record'
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
        label="Hero Title"
        name="heroTitle"
        required
      >
        <UInput
          v-model="state.heroTitle"
          placeholder="Hero section title"
        />
      </UFormField>

      <UFormField
        label="Active"
        name="isActive"
      >
        <USwitch v-model="state.isActive" />
      </UFormField>

      <AdminHeroFormHeroImageManager
        ref="imageManager"
        :homepage-id="homepage.id"
        :hero-image="homepage.heroImage"
        :hero-image-mobile="homepage.heroImageMobile"
      />

      <UButton
        type="submit"
        block
        loading-auto
      >
        Save Changes
      </UButton>
    </UForm>

    <!-- Danger Zone -->
    <USeparator />

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
          Delete Homepage Record
        </UButton>
      </template>
      <template v-else>
        <p class="text-dimmed text-sm">
          This will permanently delete <strong>{{ homepage.heroTitle }}</strong
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
