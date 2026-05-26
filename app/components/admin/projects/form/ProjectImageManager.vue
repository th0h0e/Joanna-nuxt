<script setup lang="ts">
const props = defineProps<{
  projectId: string
  images: string[]
}>()

const { pocketbaseUrl } = useRuntimeConfig().public

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
    newImages.value = [] // ← note: newImages, not newFiles
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

  // Append new (compressed) images in parallel
  const compressed = await Promise.all(newImages.value.map(file => compressImage(file)))
  for (const file of compressed) {
    formData.append('images_add', file)
  }
}

defineExpose({ getFormDataEntries })
</script>

<template>
  <!-- Existing Images -->
  <UFormField label="Current Images">
    <div
      v-if="displayImages.length"
      class="flex flex-wrap gap-2"
    >
      <div
        v-for="image in existingImages"
        :key="image"
        class="group relative"
      >
        <img
          :src="getImageUrl(image)"
          :alt="image"
          class="h-20 w-28 rounded border object-cover"
          :class="removedImages.has(image) ? 'opacity-30 grayscale' : ''"
        >
        <UButton
          size="xs"
          :color="removedImages.has(image) ? 'success' : 'error'"
          variant="solid"
          :icon="removedImages.has(image) ? 'i-lucide-undo-2' : 'i-lucide-x'"
          class="absolute -top-1.5 -right-1.5 opacity-0 transition-opacity group-hover:opacity-100"
          @click="toggleRemoveImage(image)"
        />
      </div>
    </div>
    <p
      v-else
      class="text-dimmed text-sm"
    >
      No images uploaded yet
    </p>
  </UFormField>

  <!-- New Images Upload -->
  <UFormField
    label="Add Images"
    hint="Select new images to upload"
  >
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
