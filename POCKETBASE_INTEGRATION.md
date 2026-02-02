# PocketBase Integration Guide

This project uses PocketBase as the backend CMS with the **official PocketBase JavaScript SDK**. All requests are proxied through Nuxt server API routes for security.

## 🏗️ Architecture

```
Client (Browser)
    ↓
PocketBase SDK (usePocketBase)
    ↓
Nuxt Server API Proxy (/api/pocketbase/*)
    ↓
PocketBase Backend (https://admin.kontext.site)
```

## 📁 File Structure

```
app/composables/
├── usePocketBase.ts          # PocketBase SDK client
├── usePocketBaseAuth.ts      # Authentication management
└── usePocketBaseRealtime.ts  # Real-time subscriptions

server/api/
├── pocketbase/[...path].ts   # Proxy for PocketBase API calls
├── pb-files/[...path].ts     # Proxy for serving images/files
└── portfolio.ts              # Example: Server-side PocketBase SDK usage

shared/types/
└── pocketbase-types.ts       # Auto-generated TypeScript types

examples/
├── portfolio-api-examples.ts        # Server API usage examples
└── server-side-fetch-examples.ts    # Client-side SDK usage examples
```

## 🚀 Quick Start

### 1. Environment Setup

Ensure your `.env` file has:

```env
NITRO_POCKETBASE_URL=https://admin.kontext.site
```

This will override the `pocketbaseUrl` runtime config defined in `nuxt.config.ts`.

## 📖 Two Approaches

### **Approach 1: Client-Side SDK (Recommended by PocketBase)**

Use the PocketBase SDK directly in your components. This is the **official PocketBase approach**.

```vue
<script setup lang="ts">
// Get the PocketBase client
const pb = usePocketBase()

// Fetch all records
const projects = ref([])
const loading = ref(false)

const fetchProjects = async () => {
  loading.value = true
  try {
    // Use PocketBase SDK methods directly
    projects.value = await pb.collection('Portfolio_Projects').getFullList({
      sort: 'Order'
    })
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
```

### **Approach 2: Server API Endpoint**

Create Nitro server endpoints that use the PocketBase SDK server-side.

```ts
// server/api/portfolio.ts
import PocketBase from 'pocketbase'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const pb = new PocketBase(config.pocketbaseUrl)

  const records = await pb.collection('Portfolio_Projects').getFullList({
    sort: 'Order'
  })

  return records
})
```

Then call from client:
```vue
<script setup>
const projects = await $fetch('/api/portfolio')
</script>
```

## 🎯 PocketBase SDK Methods

### Get All Records (No Pagination)

```ts
const pb = usePocketBase()

const records = await pb.collection('Portfolio_Projects').getFullList({
  sort: 'Order',
  filter: 'Title != ""'
})
```

### Get Paginated List

```ts
const result = await pb.collection('Portfolio_Projects').getList(1, 50, {
  sort: '-created',
  filter: 'Order > 0'
})

// result contains: { page, perPage, totalItems, totalPages, items: [...] }
```

### Get Single Record by ID

```ts
const record = await pb.collection('Portfolio_Projects').getOne('RECORD_ID', {
  expand: 'author'
})
```

### Get First Matching Record

```ts
const record = await pb.collection('Portfolio_Projects').getFirstListItem('Order = 1', {
  expand: 'author'
})
</script>

<template>
  <div v-if="result">
    <div>Page {{ result.page }} of {{ result.totalPages }}</div>
    <div v-for="project in result.items" :key="project.id">
      {{ project.Title }}
    </div>
  </div>
</template>
```

## 🖼️ Working with Images

### Display an Image

```vue
<script setup lang="ts">
const { data: homepage } = await usePocketBaseFirstListItem('Homepage', 'Is_Active = true')

// Helper function to generate image URLs
const getImageUrl = (record: any, filename: string, thumb?: string) => {
  return usePocketBaseFileUrl(record, filename, thumb ? { thumb } : undefined)
}
</script>

<template>
  <div v-if="homepage?.Hero_Image">
    <!-- Full size image -->
    <img :src="getImageUrl(homepage, homepage.Hero_Image)" alt="Hero" />

    <!-- Thumbnail (400x300) -->
    <img :src="getImageUrl(homepage, homepage.Hero_Image, '400x300')" alt="Hero Thumb" />
  </div>
</template>
```

### Image Array (Multiple Images)

```vue
<script setup lang="ts">
const { data: project } = await usePocketBaseRecord('Portfolio_Projects', 'abc123')
</script>

<template>
  <div v-if="project?.Images">
    <img
      v-for="(image, idx) in project.Images"
      :key="idx"
      :src="usePocketBaseFileUrl(project, image, { thumb: '200x200' })"
      :alt="`Image ${idx + 1}`"
    />
  </div>
</template>
```

### Thumbnail Options

PocketBase supports flexible thumbnails:

- `'100x100'` - Fixed size (cropped)
- `'100x0'` - Fixed width, auto height
- `'0x100'` - Fixed height, auto width

## 🔐 Authentication

### Login/Logout

```vue
<script setup lang="ts">
const { user, isAuthenticated, login, logout } = usePocketBaseAuth()

const handleLogin = async () => {
  const result = await login('user@example.com', 'password')
  if (result.success) {
    console.log('Logged in!', result.user)
  } else {
    console.error('Login failed:', result.error)
  }
}
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Welcome {{ user?.email }}</p>
    <button @click="logout()">Logout</button>
  </div>
  <div v-else>
    <button @click="handleLogin()">Login</button>
  </div>
</template>
```

### Register New User

```vue
<script setup lang="ts">
const { register } = usePocketBaseAuth()

const handleRegister = async () => {
  const result = await register(
    'newuser@example.com',
    'password123',
    'password123',
    'John Doe'
  )

  if (result.success) {
    console.log('Registered!', result.user)
  } else {
    console.error('Registration failed:', result.error)
  }
}
</script>
```

## 🔄 Real-time Updates

### Subscribe to Record Changes

```vue
<script setup lang="ts">
const { data, isSubscribed, subscribe, unsubscribe } = usePocketBaseRealtime(
  'Portfolio_Projects',
  {
    recordId: 'specific-record-id', // Optional: subscribe to specific record
    filter: 'Title != ""', // Optional: filter records
  }
)

onMounted(() => {
  subscribe() // Start listening for changes
})

// Automatically unsubscribes on component unmount
</script>

<template>
  <div v-if="isSubscribed">
    <p>Listening for updates...</p>
    <div v-if="data">
      Latest update: {{ data.Title }}
    </div>
  </div>
</template>
```

### Subscribe to Multiple Records

```vue
<script setup lang="ts">
const { items, subscribe, unsubscribe } = usePocketBaseRealtimeList('Portfolio_Projects')

onMounted(() => {
  subscribe()
})
</script>

<template>
  <div v-for="item in items" :key="item.id">
    {{ item.Title }}
  </div>
</template>
```

## 🎯 Available Composables

### `usePocketBase()`
Returns the typed PocketBase client instance.

```ts
const pb = usePocketBase()
// Use native PocketBase SDK methods
const record = await pb.collection('Portfolio_Projects').getOne('id')
```

### `usePocketBaseRecord(collection, id, options?)`
Fetch a single record by ID.

```ts
const { data, error, status, refresh } = await usePocketBaseRecord(
  'Portfolio_Projects',
  'record-id-123',
  { expand: 'relatedField' }
)
```

### `usePocketBaseFirstListItem(collection, filter, options?)`
Fetch the first record matching a filter.

```ts
const { data } = await usePocketBaseFirstListItem(
  'Homepage',
  'Is_Active = true',
  { expand: 'author' }
)
```

### `usePocketBaseList(collection, options?)`
Fetch paginated records.

```ts
const { data } = await usePocketBaseList('Portfolio_Projects', {
  page: 1,
  perPage: 10,
  sort: '-created',
  filter: 'Title != ""',
})
```

### `usePocketBaseFullList(collection, options?)`
Fetch all records (no pagination).

```ts
const { data } = await usePocketBaseFullList('Portfolio_Projects', {
  sort: 'Order',
})
```

### `usePocketBaseFileUrl(record, filename, options?)`
Generate a URL for a file stored in PocketBase.

```ts
const url = usePocketBaseFileUrl(record, 'image.jpg', { thumb: '400x300' })
```

## 🔍 Filter Syntax

PocketBase uses a SQL-like filter syntax:

```ts
// Equality
'Title = "Example"'

// Comparison
'Order > 5'
'Order <= 10'

// Not equal
'Is_Active != false'

// AND / OR
'Title != "" && Is_Active = true'
'Order > 5 || Title = "Featured"'

// Contains
'Title ~ "portfolio"'

// Array contains
'Images:length > 0'
```

## 📚 Collections Reference

Available collections in this project:

- `About` - About page content
- `Homepage` - Homepage content
- `Portfolio_Projects` - Portfolio project items
- `Settings` - Global settings
- `users` - User authentication

All collections have auto-generated TypeScript types in `shared/types/pocketbase-types.ts`.

## 🧪 Testing

Visit `/test-pocketbase` in your browser to see all functionality in action:

1. Fetching homepage content
2. Loading portfolio projects
3. Displaying images with thumbnails
4. Paginated lists
5. Real-time subscriptions
6. And more...

## 🔧 Troubleshooting

### Images not loading?
- Check that `NITRO_POCKETBASE_URL` is set correctly in `.env`
- Verify the PocketBase backend is accessible
- Ensure the file exists in PocketBase

### Data not fetching?
- Check browser console for errors
- Verify PocketBase API is accessible
- Check collection name spelling (case-sensitive)
- Verify filter syntax is correct

### Real-time not working?
- Ensure you called `subscribe()` after component mount
- Check that PocketBase realtime is enabled
- Verify network connection allows WebSocket

## 📖 Additional Resources

- [PocketBase Documentation](https://pocketbase.io/docs/)
- [PocketBase JS SDK](https://github.com/pocketbase/js-sdk)
- [Nuxt Data Fetching](https://nuxt.com/docs/getting-started/data-fetching)
