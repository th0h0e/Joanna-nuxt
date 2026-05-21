<script setup lang="ts">
const props = defineProps<{
  state: {
    title?: string
    description?: string
    responsibility?: string[]
  }
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:state': [value: { title?: string; description?: string; responsibility?: string[] }]
}>()

function updateField<K extends keyof typeof props.state>(key: K, value: (typeof props.state)[K]) {
  emit('update:state', { ...props.state, [key]: value })
}
</script>

<template>
  <UFormField label="Title" name="title" required>
    <UInput
      :model-value="state.title"
      placeholder="Project title"
      @update:model-value="updateField('title', $event)"
    />
  </UFormField>

  <UFormField label="Description" name="description" required>
    <UTextarea
      :model-value="state.description"
      :rows="4"
      placeholder="Project description"
      autoresize
      :maxrows="8"
      @update:model-value="updateField('description', $event)"
    />
  </UFormField>

  <UFormField label="Responsibilities" name="responsibility">
    <UInputTags
      :model-value="state.responsibility"
      placeholder="Add a responsibility..."
      @update:model-value="updateField('responsibility', $event)"
    />
  </UFormField>

  <UButton type="submit" block :loading="submitting">
    Save Changes
  </UButton>
</template>
