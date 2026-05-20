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

const { pocketbaseUrl } = useRuntimeConfig().public
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

// Compress image files to fit within PocketBase's upload limit
async function compressImage(file: File, maxSizeKB = 140): Promise<File> {
  const MAX_BYTES = maxSizeKB * 1024
  if (file.size <= MAX_BYTES) return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img

      // Scale down dimensions progressively
      const scale = Math.sqrt(MAX_BYTES / file.size) * 0.85
      width = Math.round(width * scale)
      height = Math.round(height * scale)

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      // Try with decreasing quality until under limit
      const tryCompress = (quality: number): void => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error(`Failed to compress ${file.name}`))
              return
            }
            if (blob.size <= MAX_BYTES || quality <= 0.1) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }))
            } else {
              tryCompress(quality - 0.1)
            }
          },
          'image/jpeg',
          quality
        )
      }

      tryCompress(0.8)
    }
    img.onerror = () => reject(new Error(`Failed to load ${file.name}`))
    img.src = URL.createObjectURL(file)
  })
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

const newImages = ref<File[]>([])

// Track existing images with removal state
const existingImages = ref<string[]>([...props.project.images])
const removedImages = ref<Set<string>>(new Set())

const displayImages = computed(() =>
  existingImages.value.filter(img => !removedImages.value.has(img))
)

const getImageUrl = (image: string) => {
  return `${pocketbaseUrl}/api/files/Portfolio_Projects/${props.project.id}/${image}?thumb=120x80`
}

const toggleRemoveImage = (image: string) => {
  if (removedImages.value.has(image)) {
    removedImages.value.delete(image)
  } else {
    removedImages.value.add(image)
  }
}

// ── Loading states ─────────────────────────────────────────────────────────
const submitting = ref(false)
const deleting = ref(false)

// ── Submit (update) ────────────────────────────────────────────────────────
async function onSubmit(_event: FormSubmitEvent<Schema>) {
  submitting.value = true

  try {
    const formData = new FormData()

    // Text fields
    formData.append('title', state.title!)
    formData.append('description', state.description!)
    if (state.responsibility && state.responsibility.length > 0) {
      formData.append('responsibility', JSON.stringify(state.responsibility))
    } else {
      formData.append('responsibility', '[]')
    }

    // Delete removed images using PocketBase's '-' suffix convention
    // Each filename must be a separate FormData entry
    for (const filename of removedImages.value) {
      formData.append('images_remove', filename)
    }

    // Append new image files using PocketBase's '+' suffix to ADD alongside existing files
    // (without '+', PocketBase would REPLACE all existing files)
    for (const file of newImages.value) {
      const compressed = await compressImage(file)
      formData.append('images_add', compressed)
    }

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
const showDeleteConfirm = ref(false)

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
      <UFormField label="Title" name="title" required>
        <UInput v-model="state.title" placeholder="Project title" />
      </UFormField>

      <UFormField label="Description" name="description" required>
        <UTextarea v-model="state.description" :rows="4" placeholder="Project description" autoresize :maxrows="8" />
      </UFormField>

      <UFormField label="Responsibilities" name="responsibility">
        <UInputTags v-model="state.responsibility" placeholder="Add a responsibility..." />
      </UFormField>

      <!-- Existing Images -->
      <UFormField label="Current Images">
        <div v-if="displayImages.length" class="flex flex-wrap gap-2">
          <div
            v-for="image in existingImages"
            :key="image"
            class="relative group"
          >
            <img
              :src="getImageUrl(image)"
              :alt="image"
              class="h-20 w-28 object-cover rounded border"
              :class="removedImages.has(image) ? 'opacity-30 grayscale' : ''"
            />
            <UButton
              size="xs"
              :color="removedImages.has(image) ? 'success' : 'error'"
              variant="solid"
              :icon="removedImages.has(image) ? 'i-lucide-undo-2' : 'i-lucide-x'"
              class="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              @click="toggleRemoveImage(image)"
            />
          </div>
        </div>
        <p v-else class="text-sm text-dimmed">No images uploaded yet</p>
      </UFormField>

      <!-- New Images Upload -->
      <UFormField label="Add Images" hint="Select new images to upload">
        <UFileUpload
          v-model="newImages"
          multiple
          accept="image/*"
          variant="area"
          icon="i-lucide-upload"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" block :loading="submitting">
        Save Changes
      </UButton>
    </UForm>

    <!-- Divider -->
    <USeparator />

    <!-- Danger Zone -->
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
          This will permanently delete <strong>{{ project.title }}</strong>. This action cannot be undone.
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
