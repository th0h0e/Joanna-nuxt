<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Setting } from '#shared/types/pocketbase-types'

const props = defineProps<{
  setting: Setting
}>()

const emit = defineEmits<{
  success: []
  deleted: []
}>()

const toast = useToast()
const { pocketbaseUrl } = useRuntimeConfig().public

// ── Schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  mobileFontSize: z.number().min(8).max(32).optional(),
  tabletFontSize: z.number().min(8).max(40).optional(),
  desktopFontSize: z.number().min(8).max(48).optional(),
  largeDesktopFontSize: z.number().min(8).max(56).optional(),
  showTopProgressBar: z.boolean().optional().default(false)
})

type Schema = z.output<typeof schema>

// ── Reactive State ─────────────────────────────────────────────────────────
const state = reactive<Partial<Schema>>({
  mobileFontSize: props.setting.mobileFontSize ?? 16,
  tabletFontSize: props.setting.tabletFontSize ?? 18,
  desktopFontSize: props.setting.desktopFontSize ?? 20,
  largeDesktopFontSize: props.setting.largeDesktopFontSize ?? 22,
  showTopProgressBar: props.setting.showTopProgressBar ?? false
})

// ── Favicon state ──────────────────────────────────────────────────────────
const faviconFile = ref<File | null>(null)
const faviconRemoved = ref(false)

const getFaviconUrl = () => {
  if (!props.setting.favicon) return null
  return `${pocketbaseUrl}/api/files/Settings/${props.setting.id}/${props.setting.favicon}`
}

// ── Delete state ───────────────────────────────────────────────────────────
const showDeleteConfirm = ref(false)
const deleting = ref(false)

// ── Submit (update) ────────────────────────────────────────────────────────
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const formData = new FormData()

    formData.append('mobileFontSize', String(event.data.mobileFontSize ?? 16))
    formData.append('tabletFontSize', String(event.data.tabletFontSize ?? 18))
    formData.append('desktopFontSize', String(event.data.desktopFontSize ?? 20))
    formData.append('largeDesktopFontSize', String(event.data.largeDesktopFontSize ?? 22))
    formData.append('showTopProgressBar', String(event.data.showTopProgressBar ?? false))

    // Handle favicon removal
    if (faviconRemoved.value && !faviconFile.value && props.setting.favicon) {
      formData.append('favicon-', props.setting.favicon)
    }

    // Append new favicon
    if (faviconFile.value) {
      formData.append('favicon', faviconFile.value)
    }

    await $fetch(`/api/settings/${props.setting.id}`, {
      method: 'PATCH',
      body: formData
    })

    toast.add({ title: 'Settings updated', color: 'success' })
    emit('success')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update settings'
    toast.add({ title: 'Update failed', description: message, color: 'error' })
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────
async function onDelete() {
  if (deleting.value) return
  deleting.value = true

  try {
    await $fetch(`/api/settings/${props.setting.id}`, {
      method: 'DELETE'
    })

    toast.add({ title: 'Settings record deleted', color: 'success' })
    emit('deleted')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete settings record'
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
      <!-- Font Sizes -->
      <UFormField
        label="Mobile Font Size (px)"
        name="mobileFontSize"
      >
        <UInput
          v-model.number="state.mobileFontSize"
          type="number"
          :min="8"
          :max="32"
          placeholder="16"
        />
      </UFormField>

      <UFormField
        label="Tablet Font Size (px)"
        name="tabletFontSize"
      >
        <UInput
          v-model.number="state.tabletFontSize"
          type="number"
          :min="8"
          :max="40"
          placeholder="18"
        />
      </UFormField>

      <UFormField
        label="Desktop Font Size (px)"
        name="desktopFontSize"
      >
        <UInput
          v-model.number="state.desktopFontSize"
          type="number"
          :min="8"
          :max="48"
          placeholder="20"
        />
      </UFormField>

      <UFormField
        label="Large Desktop Font Size (px)"
        name="largeDesktopFontSize"
      >
        <UInput
          v-model.number="state.largeDesktopFontSize"
          type="number"
          :min="8"
          :max="56"
          placeholder="22"
        />
      </UFormField>

      <!-- Progress Bar -->
      <UFormField
        label="Show Top Progress Bar"
        name="showTopProgressBar"
      >
        <USwitch v-model="state.showTopProgressBar" />
      </UFormField>

      <!-- Favicon -->
      <UFormField label="Current Favicon">
        <div class="flex items-center gap-3">
          <template v-if="getFaviconUrl() && !faviconRemoved">
            <img
              :src="getFaviconUrl()!"
              alt="Favicon"
              class="h-8 w-8 rounded object-contain"
            >
            <UButton
              size="xs"
              color="error"
              variant="solid"
              icon="i-lucide-x"
              @click="faviconRemoved = true"
            />
          </template>
          <p
            v-else
            class="text-dimmed text-sm"
          >
            No favicon uploaded
          </p>
        </div>
      </UFormField>

      <UFormField
        label="Upload Favicon"
        hint="Select a new favicon (.ico, .png, .svg)"
      >
        <UFileUpload
          v-model="faviconFile"
          accept="image/*,.ico"
          variant="area"
          icon="i-lucide-upload"
          class="w-full"
        />
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
          Delete Settings Record
        </UButton>
      </template>
      <template v-else>
        <p class="text-dimmed text-sm">This will permanently delete these site settings.</p>
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
