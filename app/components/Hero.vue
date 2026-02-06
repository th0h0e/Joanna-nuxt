<script setup lang="ts">
interface HomepageData {
  id: string;
  title: string;
  image: string;
  imageUrl: string;
}

const { data: homepageData } = await useFetch<HomepageData>("/api/homepage", {
  key: "homepage",
});

const imageUrl = computed(() => homepageData.value?.imageUrl || null);
</script>

<template>
  <UPageHero
    :title="homepageData?.title || 'Joanna VDW'"
    :ui="{
      root: 'h-[100dvh] flex items-center justify-center',
      container: 'py-0',
      wrapper: 'text-center'
    }"
  >
    <template #top>
      <div v-if="imageUrl" class="absolute inset-0 -z-10">
        <img
          :src="imageUrl"
          alt="Hero background"
          class="w-full h-full object-cover"
        >
      </div>
    </template>
  </UPageHero>
</template>
