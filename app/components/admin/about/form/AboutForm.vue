<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { About } from '#shared/types/pocketbase-types'

const props = defineProps<{
  about: About
}>()

const emit = defineEmits<{
  success: []
  deleted: []
}>()

const toast = useToast()

// ── Schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  portfolioTitle: z.string().min(1, 'Portfolio title is required').max(200),
  aboutDescription: z.string().max(5000).optional().default(''),
  expertiseTitle: z.string().max(200).optional().default(''),
  expertiseDescription: z.string().max(5000).optional().default(''),
  selectedClientsTitle: z.string().max(200).optional().default(''),
  clientListJson: z.string().optional().default(''),
  contactEmail: z.string().email('Invalid email').optional().or(z.literal('')).default(''),
  contactMessage: z.string().max(10000).optional().default(''),
  isActive: z.boolean().optional().default(false)
})

type Schema = z.output<typeof schema>

// ── Reactive State ─────────────────────────────────────────────────────────
const state = reactive<Partial<Schema>>({
  portfolioTitle: props.about.portfolioTitle ?? '',
  aboutDescription: props.about.aboutDescription ?? '',
  expertiseTitle: props.about.expertiseTitle ?? '',
  expertiseDescription: props.about.expertiseDescription ?? '',
  selectedClientsTitle: props.about.selectedClientsTitle ?? '',
  clientListJson:
    typeof props.about.clientListJson === 'string'
      ? props.about.clientListJson
      : JSON.stringify(props.about.clientListJson ?? [], null, 2),
  contactEmail: props.about.contactEmail ?? '',
  contactMessage: props.about.contactMessage ?? '',
  isActive: props.about.isActive ?? false
})

// ── Delete state ───────────────────────────────────────────────────────────
const showDeleteConfirm = ref(false)
const deleting = ref(false)

// ── Submit (update) ────────────────────────────────────────────────────────
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const formData = new FormData()

    formData.append('portfolioTitle', event.data.portfolioTitle)
    formData.append('aboutDescription', event.data.aboutDescription ?? '')
    formData.append('expertiseTitle', event.data.expertiseTitle ?? '')
    formData.append('expertiseDescription', event.data.expertiseDescription ?? '')
    formData.append('selectedClientsTitle', event.data.selectedClientsTitle ?? '')
    formData.append('clientListJson', event.data.clientListJson ?? '[]')
    formData.append('contactEmail', event.data.contactEmail ?? '')
    formData.append('contactMessage', event.data.contactMessage ?? '')
    formData.append('isActive', String(event.data.isActive ?? false))

    await $fetch(`/api/about/${props.about.id}`, {
      method: 'PATCH',
      body: formData
    })

    toast.add({ title: 'About record updated', color: 'success' })
    emit('success')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update about record'
    toast.add({ title: 'Update failed', description: message, color: 'error' })
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────
async function onDelete() {
  if (deleting.value) return
  deleting.value = true

  try {
    await $fetch(`/api/about/${props.about.id}`, {
      method: 'DELETE'
    })

    toast.add({ title: 'About record deleted', color: 'success' })
    emit('deleted')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete about record'
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
        label="Portfolio Title"
        name="portfolioTitle"
        required
      >
        <UInput
          v-model="state.portfolioTitle"
          placeholder="Portfolio title"
        />
      </UFormField>

      <UFormField
        label="About Description"
        name="aboutDescription"
      >
        <UTextarea
          v-model="state.aboutDescription"
          :rows="4"
          placeholder="About description"
          autoresize
          :maxrows="10"
        />
      </UFormField>

      <UFormField
        label="Expertise Title"
        name="expertiseTitle"
      >
        <UInput
          v-model="state.expertiseTitle"
          placeholder="Expertise section title"
        />
      </UFormField>

      <UFormField
        label="Expertise Description"
        name="expertiseDescription"
      >
        <UTextarea
          v-model="state.expertiseDescription"
          :rows="4"
          placeholder="Expertise description"
          autoresize
          :maxrows="10"
        />
      </UFormField>

      <UFormField
        label="Selected Clients Title"
        name="selectedClientsTitle"
      >
        <UInput
          v-model="state.selectedClientsTitle"
          placeholder="Selected clients section title"
        />
      </UFormField>

      <UFormField
        label="Client List (JSON)"
        name="clientListJson"
        hint="JSON array of client names"
      >
        <UTextarea
          v-model="state.clientListJson"
          :rows="4"
          placeholder='["Client A", "Client B"]'
          monospace
        />
      </UFormField>

      <UFormField
        label="Contact Email"
        name="contactEmail"
      >
        <UInput
          v-model="state.contactEmail"
          placeholder="contact@example.com"
          type="email"
        />
      </UFormField>

      <UFormField
        label="Contact Message"
        name="contactMessage"
      >
        <UTextarea
          v-model="state.contactMessage"
          :rows="3"
          placeholder="Contact form message / CTA"
          autoresize
          :maxrows="8"
        />
      </UFormField>

      <UFormField
        label="Active"
        name="isActive"
      >
        <USwitch v-model="state.isActive" />
      </UFormField>

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
          Delete About Record
        </UButton>
      </template>
      <template v-else>
        <p class="text-dimmed text-sm">
          This will permanently delete <strong>{{ about.portfolioTitle }}</strong
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
