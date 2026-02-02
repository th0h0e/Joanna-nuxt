/**
 * Server-side PocketBase Fetch Examples
 * How to use the /api/portfolio endpoint from the client
 *
 * This endpoint uses PocketBase SDK on the server
 */

/* ============================================
   EXAMPLE 1: Basic Fetch (Default Sort by Order)
   ============================================ */
export const exampleBasicFetch = async () => {
  const data = await $fetch('/api/portfolio')
  console.log('Portfolio projects:', data)
  return data
}

/* ============================================
   EXAMPLE 2: Fetch with Custom Sort
   ============================================ */
export const exampleCustomSort = async () => {
  // Sort by created date (newest first)
  const data = await $fetch('/api/portfolio', {
    query: {
      sort: '-created'
    }
  })

  return data
}

/* ============================================
   EXAMPLE 3: Fetch with Filter
   ============================================ */
export const exampleWithFilter = async () => {
  // Only get projects with Order > 0
  const data = await $fetch('/api/portfolio', {
    query: {
      filter: 'Order > 0',
      sort: 'Order'
    }
  })

  return data
}

/* ============================================
   EXAMPLE 4: Paginated Fetch
   ============================================ */
export const examplePaginated = async () => {
  // Get page 1 with 5 items per page
  const data = await $fetch('/api/portfolio', {
    query: {
      page: 1,
      perPage: 5,
      sort: 'Order'
    }
  })

  console.log('Total items:', data.totalItems)
  console.log('Total pages:', data.totalPages)
  console.log('Current page:', data.page)

  return data
}

/* ============================================
   EXAMPLE 5: In a Component with Loading State
   ============================================ */
export const exampleComponent = `
<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch('/api/portfolio', {
  query: {
    sort: 'Order'
  }
})
</script>

<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="data">
      <div v-for="project in data.items" :key="project.id">
        {{ project.Title }}
      </div>
    </div>
    <button @click="refresh()">Refresh</button>
  </div>
</template>
`

/* ============================================
   EXAMPLE 6: Lazy Fetch (Client-side only)
   ============================================ */
export const exampleLazyFetch = `
<script setup lang="ts">
const { data, pending, execute } = useLazyFetch('/api/portfolio', {
  server: false, // Only fetch on client
  query: {
    sort: 'Order'
  }
})

// Manually trigger the fetch
const loadProjects = () => {
  execute()
}
</script>

<template>
  <div>
    <button @click="loadProjects" :disabled="pending">
      {{ pending ? 'Loading...' : 'Load Projects' }}
    </button>

    <div v-if="data">
      {{ data.items.length }} projects loaded
    </div>
  </div>
</template>
`

/* ============================================
   EXAMPLE 7: Error Handling
   ============================================ */
export const exampleErrorHandling = async () => {
  try {
    const data = await $fetch('/api/portfolio', {
      query: {
        sort: 'Order'
      }
    })
    return { success: true, data }
  }
  catch (error: any) {
    console.error('Failed to fetch:', error)
    return {
      success: false,
      error: error.message,
      statusCode: error.statusCode
    }
  }
}

/* ============================================
   EXAMPLE 8: Using in a Composable
   ============================================ */
export const exampleComposable = `
// composables/usePortfolioProjects.ts
export const usePortfolioProjects = () => {
  const projects = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchProjects = async (options = {}) => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch('/api/portfolio', {
        query: {
          sort: 'Order',
          ...options
        }
      })

      projects.value = data.items
      return data
    }
    catch (err) {
      error.value = err
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects
  }
}

// Usage in component:
const { projects, loading, fetchProjects } = usePortfolioProjects()
await fetchProjects({ filter: 'Order > 0' })
`

/* ============================================
   EXAMPLE 9: Watch Reactive Query Parameters
   ============================================ */
export const exampleReactiveQuery = `
<script setup lang="ts">
const sortBy = ref('Order')
const filterValue = ref('')

const { data, pending } = await useFetch('/api/portfolio', {
  query: {
    sort: sortBy,
    filter: filterValue
  },
  watch: [sortBy, filterValue] // Refetch when these change
})
</script>

<template>
  <div>
    <select v-model="sortBy">
      <option value="Order">Sort by Order</option>
      <option value="-created">Newest First</option>
      <option value="Title">Sort by Title</option>
    </select>

    <div v-if="pending">Loading...</div>
    <div v-else>
      {{ data?.items?.length }} projects
    </div>
  </div>
</template>
`

/* ============================================
   EXAMPLE 10: Multiple Query Parameters
   ============================================ */
export const exampleMultipleParams = async () => {
  const data = await $fetch('/api/portfolio', {
    query: {
      sort: '-created',
      filter: 'Title != "" && Order > 0',
      page: 1,
      perPage: 10
    }
  })

  return data
}
