/\*\*

- Client-Side PocketBase SDK Examples
- Using usePocketBase() with the official PocketBase JavaScript SDK
-
- This is the recommended approach by PocketBase
  \*/

/_ ============================================
EXAMPLE 1: Get All Records (No Pagination)
============================================ _/
export const exampleGetFullList = async () => {
const pb = usePocketBase()

// Fetch all records at once
const records = await pb.collection('Portfolio_Projects').getFullList({
sort: 'Order'
})

console.log('Total records:', records.length)
return records
}

/_ ============================================
EXAMPLE 2: Get Paginated List
============================================ _/
export const exampleGetList = async () => {
const pb = usePocketBase()

// Fetch page 1, 50 items per page
const result = await pb.collection('Portfolio_Projects').getList(1, 50, {
sort: '-created',
filter: 'Title != ""'
})

console.log('Page:', result.page)
console.log('Total pages:', result.totalPages)
console.log('Total items:', result.totalItems)
console.log('Items on this page:', result.items.length)

return result
}

/_ ============================================
EXAMPLE 3: Get Single Record by ID
============================================ _/
export const exampleGetOne = async () => {
const pb = usePocketBase()

const record = await pb.collection('Portfolio_Projects').getOne('RECORD_ID', {
expand: 'author'
})

return record
}

/_ ============================================
EXAMPLE 4: Get First Matching Record
============================================ _/
export const exampleGetFirstListItem = async () => {
const pb = usePocketBase()

const record = await pb.collection('Portfolio_Projects').getFirstListItem('Order = 1', {
expand: 'author'
})

return record
}

/_ ============================================
EXAMPLE 5: Create Record
============================================ _/
export const exampleCreate = async () => {
const pb = usePocketBase()

const record = await pb.collection('Portfolio_Projects').create({
Title: 'New Project',
Description: 'Project description',
Order: 10
})

console.log('Created:', record.id)
return record
}

/_ ============================================
EXAMPLE 6: Update Record
============================================ _/
export const exampleUpdate = async () => {
const pb = usePocketBase()

const record = await pb.collection('Portfolio_Projects').update('RECORD_ID', {
Title: 'Updated Title'
})

return record
}

/_ ============================================
EXAMPLE 7: Delete Record
============================================ _/
export const exampleDelete = async () => {
const pb = usePocketBase()

await pb.collection('Portfolio_Projects').delete('RECORD_ID')
console.log('Deleted successfully')
}

/_ ============================================
EXAMPLE 8: Filtering Records
============================================ _/
export const exampleFiltering = async () => {
const pb = usePocketBase()

// Simple filter
const records1 = await pb.collection('Portfolio_Projects').getFullList({
filter: 'Order > 5'
})

// Multiple conditions with AND
const records2 = await pb.collection('Portfolio_Projects').getFullList({
filter: 'Order > 0 && Title != ""'
})

// Multiple conditions with OR
const records3 = await pb.collection('Portfolio_Projects').getFullList({
filter: 'Order = 1 || Order = 2'
})

// Contains (using ~)
const records4 = await pb.collection('Portfolio_Projects').getFullList({
filter: 'Title ~ "Web"'
})

return { records1, records2, records3, records4 }
}

/_ ============================================
EXAMPLE 9: Sorting Records
============================================ _/
export const exampleSorting = async () => {
const pb = usePocketBase()

// Sort ascending
const ascending = await pb.collection('Portfolio_Projects').getFullList({
sort: 'Order'
})

// Sort descending (prefix with -)
const descending = await pb.collection('Portfolio_Projects').getFullList({
sort: '-created'
})

// Multiple sort fields
const multipleSorts = await pb.collection('Portfolio_Projects').getFullList({
sort: '-created,Order' // First by created DESC, then by Order ASC
})

return { ascending, descending, multipleSorts }
}

/_ ============================================
EXAMPLE 10: Expanding Relations
============================================ _/
export const exampleExpand = async () => {
const pb = usePocketBase()

// Expand single relation
const record = await pb.collection('Portfolio_Projects').getOne('RECORD_ID', {
expand: 'author'
})
// Access: record.expand.author.name

// Expand multiple relations
const records = await pb.collection('Portfolio_Projects').getFullList({
expand: 'author,category'
})
// Access: records[0].expand.author, records[0].expand.category

// Expand nested relations
const nested = await pb.collection('Portfolio_Projects').getFullList({
expand: 'author.organization'
})

return { record, records, nested }
}

/_ ============================================
EXAMPLE 11: Component Usage (Button Click)
============================================ _/
export const componentExample1 = `

<script setup lang="ts">
const pb = usePocketBase()
const projects = ref([])
const loading = ref(false)
const error = ref(null)

const fetchProjects = async () => {
  loading.value = true
  error.value = null

  try {
    projects.value = await pb.collection('Portfolio_Projects').getFullList({
      sort: 'Order'
    })
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button @click="fetchProjects" :disabled="loading">
    {{ loading ? 'Loading...' : 'Load Projects' }}
  </button>

  <div v-if="error">Error: {{ error }}</div>

  <div v-for="project in projects" :key="project.id">
    {{ project.Title }}
  </div>
</template>
`

/_ ============================================
EXAMPLE 12: Component with Pagination
============================================ _/
export const componentExample2 = `

<script setup lang="ts">
const pb = usePocketBase()
const currentPage = ref(1)
const perPage = 10
const result = ref(null)

const fetchPage = async () => {
  result.value = await pb.collection('Portfolio_Projects').getList(
    currentPage.value,
    perPage,
    { sort: 'Order' }
  )
}

const nextPage = () => {
  if (currentPage.value < result.value.totalPages) {
    currentPage.value++
    fetchPage()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchPage()
  }
}

onMounted(() => {
  fetchPage()
})
</script>

<template>
  <div v-if="result">
    <div v-for="project in result.items" :key="project.id">
      {{ project.Title }}
    </div>

    <button @click="prevPage" :disabled="currentPage === 1">
      Previous
    </button>
    <span>Page {{ currentPage }} of {{ result.totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === result.totalPages">
      Next
    </button>

  </div>
</template>
`

/_ ============================================
EXAMPLE 13: Real-time Subscriptions
============================================ _/
export const exampleRealtime = `

<script setup lang="ts">
const pb = usePocketBase()
const latestProject = ref(null)

onMounted(() => {
  // Subscribe to changes
  pb.collection('Portfolio_Projects').subscribe('*', (e) => {
    console.log('Change detected:', e.action) // create, update, delete
    latestProject.value = e.record
  })
})

onUnmounted(() => {
  // Cleanup subscription
  pb.collection('Portfolio_Projects').unsubscribe()
})
</script>

<template>
  <div v-if="latestProject">
    Latest update: {{ latestProject.Title }}
  </div>
</template>
`

/_ ============================================
EXAMPLE 14: Authentication
============================================ _/
export const exampleAuth = async () => {
const pb = usePocketBase()

// Login
const authData = await pb.collection('users').authWithPassword(
'user@example.com',
'password123'
)
console.log('Logged in:', authData.record.email)
console.log('Token:', authData.token)

// Check if authenticated
console.log('Is valid:', pb.authStore.isValid)
console.log('Current user:', pb.authStore.model)

// Logout
pb.authStore.clear()
}

/_ ============================================
EXAMPLE 15: File Upload
============================================ _/
export const exampleFileUpload = async () => {
const pb = usePocketBase()

// Create FormData with file
const formData = new FormData()
formData.append('Title', 'Project with Image')
formData.append('Description', 'Description here')
formData.append('Images', fileInput.files[0]) // File from input element

const record = await pb.collection('Portfolio_Projects').create(formData)

return record
}

/_ ============================================
EXAMPLE 16: Error Handling
============================================ _/
export const exampleErrorHandling = async () => {
const pb = usePocketBase()

try {
const record = await pb.collection('Portfolio_Projects').getOne('INVALID_ID')
return { success: true, record }
}
catch (error) {
console.error('Error:', error.status, error.message)
return {
success: false,
statusCode: error.status,
message: error.message,
details: error.data
}
}
}

/_ ============================================
EXAMPLE 17: Custom Fetch Options
============================================ _/
export const exampleCustomFetch = async () => {
const pb = usePocketBase()

// Add custom headers or modify request
const records = await pb.collection('Portfolio_Projects').getFullList({
sort: 'Order',
fetch: (url, config) => {
// Add custom headers
config.headers = {
...config.headers,
'X-Custom-Header': 'value'
}
return fetch(url, config)
}
})

return records
}
