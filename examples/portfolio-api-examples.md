/**
 * Portfolio API Examples
 * Using /api/portfolio with PocketBase SDK methods
 */

/* ============================================
   MODE 1: Paginated List (Default)
   ============================================ */
export const examplePaginatedList = async () => {
  // Equivalent to: pb.collection('Portfolio_Projects').getList(1, 50, {...})
  const data = await $fetch('/api/portfolio', {
    query: {
      mode: 'list', // Optional, this is default
      page: 1,
      perPage: 50,
      sort: 'Order'
    }
  })

  // Response format:
  // {
  //   page: 1,
  //   perPage: 50,
  //   totalItems: 100,
  //   totalPages: 2,
  //   items: [...]
  // }

  console.log('Total projects:', data.totalItems)
  console.log('Projects on this page:', data.items.length)

  return data
}

/* ============================================
   MODE 2: Full List (All Records)
   ============================================ */
export const exampleFullList = async () => {
  // Equivalent to: pb.collection('Portfolio_Projects').getFullList({...})
  const data = await $fetch('/api/portfolio', {
    query: {
      mode: 'full',
      sort: '-created' // Newest first
    }
  })

  // Response format: [...] (direct array of all records)
  console.log('Total projects:', data.length)

  return data
}

/* ============================================
   MODE 3: First Matching Item
   ============================================ */
export const exampleFirstItem = async () => {
  // Equivalent to: pb.collection('Portfolio_Projects').getFirstListItem('filter', {...})
  const data = await $fetch('/api/portfolio', {
    query: {
      mode: 'first',
      filter: 'Order = 1',
      expand: 'author'
    }
  })

  // Response format: { id, Title, Description, ... } (single record)
  console.log('First project:', data.Title)

  return data
}

/* ============================================
   FILTERING EXAMPLES
   ============================================ */

// Filter by title
export const exampleFilterByTitle = async () => {
  const data = await $fetch('/api/portfolio', {
    query: {
      mode: 'list',
      filter: 'Title ~ "Web"', // Contains "Web"
      sort: 'Order'
    }
  })

  return data
}

// Filter by order
export const exampleFilterByOrder = async () => {
  const data = await $fetch('/api/portfolio', {
    query: {
      mode: 'full',
      filter: 'Order > 0 && Order <= 5',
      sort: 'Order'
    }
  })

  return data
}

// Multiple conditions
export const exampleMultipleFilters = async () => {
  const data = await $fetch('/api/portfolio', {
    query: {
      mode: 'list',
      filter: 'Title != "" && Order > 0',
      sort: '-created'
    }
  })

  return data
}

/* ============================================
   SORTING EXAMPLES
   ============================================ */

// Sort ascending
export const exampleSortAscending = async () => {
  const data = await $fetch('/api/portfolio', {
    query: {
      mode: 'full',
      sort: 'Order' // Ascending
    }
  })

  return data
}

// Sort descending
export const exampleSortDescending = async () => {
  const data = await $fetch('/api/portfolio', {
    query: {
      mode: 'full',
      sort: '-created' // Descending (note the minus sign)
    }
  })

  return data
}

// Multiple sort fields
export const exampleMultipleSort = async () => {
  const data = await $fetch('/api/portfolio', {
    query: {
      mode: 'full',
      sort: '-created,Order' // First by created DESC, then by Order ASC
    }
  })

  return data
}

/* ============================================
   PAGINATION EXAMPLES
   ============================================ */

// First page
export const exampleFirstPage = async () => {
  const data = await $fetch('/api/portfolio', {
    query: {
      page: 1,
      perPage: 10,
      sort: 'Order'
    }
  })

  return data
}

// Specific page
export const exampleSpecificPage = async () => {
  const data = await $fetch('/api/portfolio', {
    query: {
      page: 3,
      perPage: 10,
      sort: 'Order'
    }
  })

  return data
}

// Pagination with total info
export const examplePaginationInfo = async () => {
  const data = await $fetch('/api/portfolio', {
    query: {
      page: 1,
      perPage: 10
    }
  })

  console.log(`Page ${data.page} of ${data.totalPages}`)
  console.log(`Showing ${data.items.length} of ${data.totalItems} total items`)

  return data
}

/* ============================================
   EXPAND (RELATIONS) EXAMPLES
   ============================================ */

// Expand related fields
export const exampleExpand = async () => {
  const data = await $fetch('/api/portfolio', {
    query: {
      mode: 'list',
      expand: 'author,category', // Expand multiple relations
      sort: 'Order'
    }
  })

  // Access expanded data
  // data.items[0].expand.author.name
  // data.items[0].expand.category.title

  return data
}

/* ============================================
   COMPONENT USAGE EXAMPLES
   ============================================ */

export const componentExample1 = `
<script setup lang="ts">
// Simple fetch on button click
const projects = ref([])
const loading = ref(false)

const fetchProjects = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/portfolio', {
      query: { mode: 'full', sort: 'Order' }
    })
    projects.value = data
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button @click="fetchProjects" :disabled="loading">
    {{ loading ? 'Loading...' : 'Load Projects' }}
  </button>

  <div v-for="project in projects" :key="project.id">
    {{ project.Title }}
  </div>
</template>
`

export const componentExample2 = `
<script setup lang="ts">
// With useFetch (SSR + caching)
const { data, pending, error, refresh } = await useFetch('/api/portfolio', {
  query: {
    mode: 'list',
    page: 1,
    perPage: 20,
    sort: 'Order'
  }
})
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else-if="data">
    <div v-for="project in data.items" :key="project.id">
      {{ project.Title }}
    </div>
    <button @click="refresh()">Refresh</button>
  </div>
</template>
`

export const componentExample3 = `
<script setup lang="ts">
// Reactive pagination
const currentPage = ref(1)
const perPage = 10

const { data } = await useFetch('/api/portfolio', {
  query: {
    page: currentPage,
    perPage,
    sort: 'Order'
  },
  watch: [currentPage] // Refetch when page changes
})

const nextPage = () => {
  if (data.value && currentPage.value < data.value.totalPages) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
</script>

<template>
  <div v-if="data">
    <div v-for="project in data.items" :key="project.id">
      {{ project.Title }}
    </div>

    <div>
      <button @click="prevPage" :disabled="currentPage === 1">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ data.totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === data.totalPages">
        Next
      </button>
    </div>
  </div>
</template>
`
