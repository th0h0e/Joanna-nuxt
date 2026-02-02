<template>
  <div class="min-h-screen">
    <h1>Welcome</h1>
    <button @click="fetchPortfolio">Fetch Portfolio Projects</button>
  </div>
</template>

<script setup>
const fetchPortfolio = async () => {
  try {
    const data = await $fetch('/api/index')
    console.log('Portfolio data:', data)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
  }
}
</script>
