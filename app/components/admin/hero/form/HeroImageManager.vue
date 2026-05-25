<script setup lang="ts">
const props = defineProps<{
  homepageId: string
  heroImage: string
  heroImageMobile: string
}>()

const { pocketbaseUrl } = useRuntimeConfig().public

// ── State ──────────────────────────────────────────────────────────────────
const heroImageFile = ref<File | null>(null)
const heroImageMobileFile = ref<File | null>(null)
const heroImageRemoved = ref(false)
const heroImageMobileRemoved = ref(false)

// Reset state when props change (e.g. different record selected)
watch(
  () => [props.homepageId, props.heroImage, props.heroImageMobile] as const,
  () => {
    heroImageFile.value = null
    heroImageMobileFile.value = null
    heroImageRemoved.value = false
    heroImageMobileRemoved.value = false
  }
)

const getHeroImageUrl = (image: string) => {
  return `${pocketbaseUrl}/api/files/Homepage/${props.homepageId}/${image}?thumb=120x80`
}

// ── Expose for parent to use in API calls ─────────────────────────────────
async function getFormDataEntries(formData: FormData) {
  // Handle hero image removal
  if (heroImageRemoved.value && !heroImageFile.value) {
    formData.append('heroImage-', props.heroImage)
  }

  // Handle mobile hero image removal
  if (heroImageMobileRemoved.value && !heroImageMobileFile.value) {
    formData.append('heroImageMobile-', props.heroImageMobile)
  }

  // Append new hero image (compressed)
  if (heroImageFile.value) {
    const compressed = await compressImage(heroImageFile.value)
    formData.append('heroImage', compressed)
  }

  // Append new mobile hero image (compressed)
  if (heroImageMobileFile.value) {
    const compressed = await compressImage(heroImageMobileFile.value)
    formData.append('heroImageMobile', compressed)
  }
}

defineExpose({ getFormDataEntries })
</script>

<template>
  <div class="space-y-4">
    <!-- Hero Image -->
    <UFormField label="Hero Image (Desktop)">
      <div class="flex items-center gap-3">
        <template v-if="heroImage && !heroImageRemoved">
          <img
            :src="getHeroImageUrl(heroImage)"
            alt="Hero Image"
            class="h-20 w-28 rounded border object-cover"
          >
          <UButton
            size="xs"
            color="error"
            variant="solid"
            icon="i-lucide-x"
            @click="heroImageRemoved = true"
          />
        </template>
        <p
          v-else-if="!heroImage || heroImageRemoved"
          class="text-dimmed text-sm"
        >
          No desktop hero image
        </p>
      </div>
    </UFormField>

    <UFormField
      label="Upload Hero Image (Desktop)"
      hint="Select a new desktop hero image"
    >
      <UFileUpload
        v-model="heroImageFile"
        accept="image/*"
        variant="area"
        icon="i-lucide-upload"
        class="w-full"
      />
    </UFormField>

    <!-- Hero Image Mobile -->
    <UFormField label="Hero Image (Mobile)">
      <div class="flex items-center gap-3">
        <template v-if="heroImageMobile && !heroImageMobileRemoved">
          <img
            :src="getHeroImageUrl(heroImageMobile)"
            alt="Mobile Hero Image"
            class="h-20 w-28 rounded border object-cover"
          >
          <UButton
            size="xs"
            color="error"
            variant="solid"
            icon="i-lucide-x"
            @click="heroImageMobileRemoved = true"
          />
        </template>
        <p
          v-else-if="!heroImageMobile || heroImageMobileRemoved"
          class="text-dimmed text-sm"
        >
          No mobile hero image
        </p>
      </div>
    </UFormField>

    <UFormField
      label="Upload Hero Image (Mobile)"
      hint="Select a new mobile hero image"
    >
      <UFileUpload
        v-model="heroImageMobileFile"
        accept="image/*"
        variant="area"
        icon="i-lucide-upload"
        class="w-full"
      />
    </UFormField>
  </div>
</template>
