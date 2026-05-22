<script setup lang="ts">
const props = defineProps<{
  projectId: string
  images: string[]
}>()

const { pocketbaseUrl } = useRuntimeConfig().public

// ── Image compression helper ──────────────────────────────────────────────
async function compressImage(file: File, maxSizeKB = 140): Promise<File> {
  const MAX_BYTES = maxSizeKB * 1024
  if (file.size <= MAX_BYTES) return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img

      const scale = Math.sqrt(MAX_BYTES / file.size) * 0.85
      width = Math.round(width * scale)
      height = Math.round(height * scale)

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

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

// ── State ──────────────────────────────────────────────────────────────────
const newImages = ref<File[]>([])
const existingImages = ref<string[]>([...props.images])
const removedImages = ref<Set<string>>(new Set())

// Reset state when props change (e.g. different project selected)
watch(
  () => [props.projectId, props.images] as const,
  ([_newId, newImgs]) => {
    existingImages.value = [...newImgs]
    removedImages.value = new Set()
    newImages.value = []       // ← note: newImages, not newFiles
  }
)

const displayImages = computed(() =>
  existingImages.value.filter(img => !removedImages.value.has(img))
)

const getImageUrl = (image: string) => {
  return `${pocketbaseUrl}/api/files/Portfolio_Projects/${props.projectId}/${image}?thumb=120x80`
}

const toggleRemoveImage = (image: string) => {
  if (removedImages.value.has(image)) {
    removedImages.value.delete(image)
  } else {
    removedImages.value.add(image)
  }
}

// ── Expose for parent to use in API calls ─────────────────────────────────
async function getFormDataEntries(formData: FormData) {
  // Delete removed images
  if (removedImages.value.size > 0) {
    formData.append('images_remove', JSON.stringify([...removedImages.value]))
  }

  // Append new (compressed) images
  for (const file of newImages.value) {
    const compressed = await compressImage(file)
    formData.append('images_add', compressed)
  }
}

defineExpose({ getFormDataEntries })
</script>

<template>
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
        >
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
</template>
