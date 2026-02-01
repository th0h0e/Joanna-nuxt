/**
 * PocketBase Usage Examples
 * Copy-paste examples for common patterns
 */

/* ============================================
   EXAMPLE 1: Fetch Active Homepage
   ============================================ */
export const exampleHomepage = async () => {
  const { data: homepage, status } = await usePocketBaseFirstListItem(
    'Homepage',
    'Is_Active = true',
  )

  // Type: HomepageResponse | null
  // Properties: Hero_Image, Hero_Image_Mobile, Hero_Title, Is_Active
  return { homepage, status }
}

/* ============================================
   EXAMPLE 2: Fetch All Portfolio Projects
   ============================================ */
export const examplePortfolioProjects = async () => {
  const { data: projects } = await usePocketBaseFullList(
    'Portfolio_Projects',
    {
      sort: 'Order', // Sort by Order field ascending
      // sort: '-Order', // Use minus for descending
    },
  )

  // Type: PortfolioProjectsResponse[]
  // Properties: Title, Description, Images, Order, Responsibility_json
  return projects
}

/* ============================================
   EXAMPLE 3: Paginated Portfolio Projects
   ============================================ */
export const examplePaginatedProjects = async () => {
  const page = ref(1)

  const { data: result, refresh } = await usePocketBaseList(
    'Portfolio_Projects',
    {
      page: page.value,
      perPage: 10,
      sort: '-created', // Newest first
    },
  )

  // result contains: { page, perPage, totalItems, totalPages, items[] }
  return { result, refresh, page }
}

/* ============================================
   EXAMPLE 4: Display Hero Image with Thumbnail
   ============================================ */
export const exampleImageDisplay = () => {
  // In component setup:
  const { data: homepage } = await usePocketBaseFirstListItem('Homepage', 'Is_Active = true')

  // In template:
  // Full size:
  // <img :src="usePocketBaseFileUrl(homepage, homepage.Hero_Image)" />
  //
  // Thumbnail 400x300:
  // <img :src="usePocketBaseFileUrl(homepage, homepage.Hero_Image, { thumb: '400x300' })" />
  //
  // Fixed width (auto height):
  // <img :src="usePocketBaseFileUrl(homepage, homepage.Hero_Image, { thumb: '800x0' })" />

  return homepage
}

/* ============================================
   EXAMPLE 5: Display Multiple Images from Array
   ============================================ */
export const exampleImageArray = () => {
  // In component setup:
  const { data: project } = await usePocketBaseRecord('Portfolio_Projects', 'some-id')

  // In template:
  // <div v-for="(image, idx) in project?.Images" :key="idx">
  //   <img :src="usePocketBaseFileUrl(project, image, { thumb: '300x300' })" />
  // </div>

  return project
}

/* ============================================
   EXAMPLE 6: Fetch Settings
   ============================================ */
export const exampleSettings = async () => {
  const { data: settings } = await usePocketBaseFirstListItem(
    'Settings',
    'id != ""', // Get first/only record
  )

  // Type: SettingsResponse | null
  // Properties: Desktop_Font_Size, Mobile_Font_Size, Show_Top_Progress_Bar, favicon
  return settings
}

/* ============================================
   EXAMPLE 7: Fetch About Page
   ============================================ */
export const exampleAbout = async () => {
  const { data: about } = await usePocketBaseFirstListItem(
    'About',
    'Is_Active = true',
  )

  // Type: AboutResponse | null
  // Properties: Portfolio_Title, Expertise_Title, Contact_Email, Client_List_Json
  return about
}

/* ============================================
   EXAMPLE 8: Real-time Subscription
   ============================================ */
export const exampleRealtime = () => {
  const { data, isSubscribed, subscribe, unsubscribe } = usePocketBaseRealtime('Portfolio_Projects')

  onMounted(() => {
    subscribe() // Start listening
  })

  // Automatically unsubscribes on unmount
  return { data, isSubscribed }
}

/* ============================================
   EXAMPLE 9: Filter by Multiple Conditions
   ============================================ */
export const exampleFilters = async () => {
  // AND condition
  const { data: activeProjects } = await usePocketBaseFullList(
    'Portfolio_Projects',
    {
      filter: 'Title != "" && Order > 0',
    },
  )

  // OR condition
  const { data: featuredProjects } = await usePocketBaseFullList(
    'Portfolio_Projects',
    {
      filter: 'Order = 1 || Title ~ "Featured"',
    },
  )

  return { activeProjects, featuredProjects }
}

/* ============================================
   EXAMPLE 10: Using Direct PocketBase Client
   ============================================ */
export const exampleDirectClient = async () => {
  const pb = usePocketBase()

  // Use any PocketBase SDK method
  const record = await pb.collection('Portfolio_Projects').getOne('record-id')

  // Create a new record
  const newProject = await pb.collection('Portfolio_Projects').create({
    Title: 'New Project',
    Description: 'Project description',
    Order: 1,
  })

  // Update a record
  const updated = await pb.collection('Portfolio_Projects').update('record-id', {
    Title: 'Updated Title',
  })

  // Delete a record
  await pb.collection('Portfolio_Projects').delete('record-id')

  return { record, newProject, updated }
}

/* ============================================
   EXAMPLE 11: Authentication Flow
   ============================================ */
export const exampleAuth = () => {
  const { user, isAuthenticated, login, logout, register } = usePocketBaseAuth()

  // Login
  const handleLogin = async () => {
    const result = await login('user@example.com', 'password')
    if (result.success) {
      console.log('Logged in!', result.user)
    }
  }

  // Register
  const handleRegister = async () => {
    const result = await register(
      'new@example.com',
      'password',
      'password',
      'John Doe',
    )
    if (result.success) {
      console.log('Registered!', result.user)
    }
  }

  // Logout
  const handleLogout = () => {
    logout()
  }

  return { user, isAuthenticated, handleLogin, handleRegister, handleLogout }
}

/* ============================================
   EXAMPLE 12: Watching Reactive Values
   ============================================ */
export const exampleReactive = () => {
  const selectedId = ref<string>('')

  // Fetch record when selectedId changes
  const { data: project } = await usePocketBaseRecord(
    'Portfolio_Projects',
    selectedId.value,
  )

  watch(selectedId, () => {
    // Will automatically refetch when selectedId changes
  })

  return { project, selectedId }
}

/* ============================================
   EXAMPLE 13: Manual Refresh
   ============================================ */
export const exampleRefresh = () => {
  const { data: projects, refresh } = await usePocketBaseFullList('Portfolio_Projects')

  // Call refresh() to re-fetch the data
  const handleRefresh = () => {
    refresh()
  }

  return { projects, handleRefresh }
}

/* ============================================
   EXAMPLE 14: Error Handling
   ============================================ */
export const exampleErrorHandling = async () => {
  const { data, error, status } = await usePocketBaseRecord(
    'Portfolio_Projects',
    'some-id',
  )

  // In template:
  // <div v-if="status === 'pending'">Loading...</div>
  // <div v-else-if="error">Error: {{ error.message }}</div>
  // <div v-else-if="data">{{ data.Title }}</div>

  return { data, error, status }
}

/* ============================================
   EXAMPLE 15: Complete Page Component
   ============================================ */
export const exampleCompleteComponent = `
<script setup lang="ts">
// Fetch active homepage
const { data: homepage, status: homepageStatus } = await usePocketBaseFirstListItem(
  'Homepage',
  'Is_Active = true'
)

// Fetch all portfolio projects
const { data: projects, status: projectsStatus } = await usePocketBaseFullList(
  'Portfolio_Projects',
  { sort: 'Order' }
)

// Helper for image URLs
const getImageUrl = (record: any, filename: string, thumb?: string) => {
  return usePocketBaseFileUrl(record, filename, thumb ? { thumb } : undefined)
}
</script>

<template>
  <div>
    <!-- Homepage Hero -->
    <section v-if="homepage">
      <h1>{{ homepage.Hero_Title }}</h1>
      <img
        v-if="homepage.Hero_Image"
        :src="getImageUrl(homepage, homepage.Hero_Image)"
        alt="Hero"
      >
    </section>

    <!-- Portfolio Projects -->
    <section v-if="projects">
      <div v-for="project in projects" :key="project.id">
        <h2>{{ project.Title }}</h2>
        <p>{{ project.Description }}</p>

        <!-- Project Images -->
        <div v-if="project.Images">
          <img
            v-for="(image, idx) in project.Images"
            :key="idx"
            :src="getImageUrl(project, image, { thumb: '400x300' })"
          >
        </div>
      </div>
    </section>
  </div>
</template>
`
