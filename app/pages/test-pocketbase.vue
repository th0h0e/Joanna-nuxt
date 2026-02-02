<script setup lang="ts">
import type { HomepageResponse, PortfolioProjectsResponse, AboutResponse, SettingsResponse } from '~/shared/types/pocketbase-types'

// Test 1: Fetch active Homepage
const { data: homepage, status: homepageStatus, refresh: refreshHomepage } = await usePocketBaseFirstListItem(
  'Homepage',
  'Is_Active = true'
)

// Test 2: Fetch all Portfolio Projects (sorted by Order)
const { data: projects, status: projectsStatus, refresh: refreshProjects } = await usePocketBaseFullList(
  'Portfolio_Projects',
  {
    sort: 'Order' // Sort by Order field ascending
  }
)

// Test 3: Fetch About page
const { data: about, status: aboutStatus } = await usePocketBaseFirstListItem(
  'About',
  'Is_Active = true'
)

// Test 4: Fetch Settings
const { data: settings, status: settingsStatus } = await usePocketBaseFirstListItem(
  'Settings',
  'id != ""' // Get first/only settings record
)

// Test 5: Paginated list of Portfolio Projects
const currentPage = ref(1)
const { data: paginatedProjects, status: paginatedStatus, refresh: refreshPaginated } = await usePocketBaseList(
  'Portfolio_Projects',
  {
    page: currentPage.value,
    perPage: 5,
    sort: '-created'
  }
)

// Helper to get image URLs
const getImageUrl = (record: any, filename: string, thumb?: string) => {
  return usePocketBaseFileUrl(record, filename, thumb ? { thumb } : undefined)
}

// Real-time subscription example
const { data: realtimeProject, isSubscribed, subscribe, unsubscribe } = usePocketBaseRealtime('Portfolio_Projects')

// Test realtime on mount
onMounted(() => {
  // Optionally auto-subscribe to real-time updates
  // subscribe()
})
</script>

<template>
  <div class="container mx-auto p-8 space-y-12">
    <h1 class="text-4xl font-bold mb-8">
      PocketBase Integration Test
    </h1>

    <!-- Test 1: Homepage -->
    <section class="border rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">
        1. Active Homepage (First List Item)
      </h2>
      <p class="text-sm text-gray-600 mb-4">
        Status: <span class="font-mono">{{ homepageStatus }}</span>
      </p>

      <div
        v-if="homepageStatus === 'pending'"
        class="text-gray-500"
      >
        Loading...
      </div>

      <div
        v-else-if="homepage"
        class="space-y-4"
      >
        <div>
          <strong>Title:</strong> {{ homepage.Hero_Title }}
        </div>
        <div>
          <strong>ID:</strong> <code class="bg-gray-100 px-2 py-1 rounded">{{ homepage.id }}</code>
        </div>
        <div>
          <strong>Is Active:</strong> {{ homepage.Is_Active }}
        </div>

        <!-- Display Hero Image if available -->
        <div
          v-if="homepage.Hero_Image"
          class="space-y-2"
        >
          <strong>Hero Image:</strong>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600 mb-2">
                Full Size
              </p>
              <img
                :src="getImageUrl(homepage, homepage.Hero_Image)"
                :alt="homepage.Hero_Title"
                class="w-full rounded-lg shadow"
              >
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-2">
                Thumbnail (400x300)
              </p>
              <img
                :src="getImageUrl(homepage, homepage.Hero_Image, '400x300')"
                :alt="homepage.Hero_Title"
                class="w-full rounded-lg shadow"
              >
            </div>
          </div>
        </div>

        <!-- Display Mobile Hero Image if available -->
        <div
          v-if="homepage.Hero_Image_Mobile"
          class="space-y-2"
        >
          <strong>Mobile Hero Image:</strong>
          <img
            :src="getImageUrl(homepage, homepage.Hero_Image_Mobile, '300x0')"
            :alt="`${homepage.Hero_Title} (Mobile)`"
            class="max-w-xs rounded-lg shadow"
          >
        </div>

        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="refreshHomepage()"
        >
          Refresh Homepage
        </button>
      </div>

      <div
        v-else
        class="text-red-500"
      >
        No active homepage found
      </div>
    </section>

    <!-- Test 2: Portfolio Projects (Full List) -->
    <section class="border rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">
        2. All Portfolio Projects (Full List, Sorted)
      </h2>
      <p class="text-sm text-gray-600 mb-4">
        Status: <span class="font-mono">{{ projectsStatus }}</span>
      </p>

      <div
        v-if="projectsStatus === 'pending'"
        class="text-gray-500"
      >
        Loading...
      </div>

      <div
        v-else-if="projects && projects.length > 0"
        class="space-y-6"
      >
        <p class="text-sm text-gray-600">
          Found {{ projects.length }} projects
        </p>

        <div
          v-for="project in projects"
          :key="project.id"
          class="border rounded p-4 space-y-2"
        >
          <h3 class="text-xl font-semibold">
            {{ project.Title }}
          </h3>
          <p class="text-gray-600">
            {{ project.Description }}
          </p>
          <div class="text-sm text-gray-500">
            <strong>Order:</strong> {{ project.Order }}
          </div>

          <!-- Display project images -->
          <div
            v-if="project.Images && project.Images.length > 0"
            class="space-y-2"
          >
            <strong class="block">Images ({{ project.Images.length }}):</strong>
            <div class="grid grid-cols-3 gap-2">
              <img
                v-for="(image, idx) in project.Images"
                :key="idx"
                :src="getImageUrl(project, image, '200x200')"
                :alt="`${project.Title} - Image ${idx + 1}`"
                class="w-full h-32 object-cover rounded shadow"
              >
            </div>
          </div>

          <!-- Display responsibilities if available -->
          <div
            v-if="project.Responsibility_json"
            class="text-sm"
          >
            <strong>Responsibilities:</strong>
            <pre class="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">{{ project.Responsibility_json }}</pre>
          </div>
        </div>

        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="refreshProjects()"
        >
          Refresh Projects
        </button>
      </div>

      <div
        v-else
        class="text-gray-500"
      >
        No projects found
      </div>
    </section>

    <!-- Test 3: About Page -->
    <section class="border rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">
        3. About Page
      </h2>
      <p class="text-sm text-gray-600 mb-4">
        Status: <span class="font-mono">{{ aboutStatus }}</span>
      </p>

      <div
        v-if="aboutStatus === 'pending'"
        class="text-gray-500"
      >
        Loading...
      </div>

      <div
        v-else-if="about"
        class="space-y-4"
      >
        <div>
          <strong>Portfolio Title:</strong> {{ about.Portfolio_Title }}
        </div>
        <div>
          <strong>Expertise Title:</strong> {{ about.Expertise_Title }}
        </div>
        <div>
          <strong>Expertise Description:</strong> {{ about.Expertise_Description }}
        </div>
        <div>
          <strong>Contact Email:</strong> {{ about.Contact_Email }}
        </div>
        <div v-if="about.Contact_Message">
          <strong>Contact Message:</strong>
          <div
            class="prose mt-2"
            v-html="about.Contact_Message"
          />
        </div>
        <div v-if="about.Client_List_Json">
          <strong>Client List:</strong>
          <pre class="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">{{ about.Client_List_Json }}</pre>
        </div>
      </div>

      <div
        v-else
        class="text-gray-500"
      >
        No about page found
      </div>
    </section>

    <!-- Test 4: Settings -->
    <section class="border rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">
        4. Settings
      </h2>
      <p class="text-sm text-gray-600 mb-4">
        Status: <span class="font-mono">{{ settingsStatus }}</span>
      </p>

      <div
        v-if="settingsStatus === 'pending'"
        class="text-gray-500"
      >
        Loading...
      </div>

      <div
        v-else-if="settings"
        class="space-y-2"
      >
        <div><strong>Desktop Font Size:</strong> {{ settings.Desktop_Font_Size }}px</div>
        <div><strong>Tablet Font Size:</strong> {{ settings.Tablet_Font_Size }}px</div>
        <div><strong>Mobile Font Size:</strong> {{ settings.Mobile_Font_Size }}px</div>
        <div><strong>Show Progress Bar:</strong> {{ settings.Show_Top_Progress_Bar }}</div>

        <div
          v-if="settings.favicon"
          class="mt-4"
        >
          <strong>Favicon:</strong>
          <img
            :src="getImageUrl(settings, settings.favicon, '32x32')"
            alt="Favicon"
            class="w-8 h-8 mt-2"
          >
        </div>
      </div>

      <div
        v-else
        class="text-gray-500"
      >
        No settings found
      </div>
    </section>

    <!-- Test 5: Paginated Projects -->
    <section class="border rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">
        5. Paginated Portfolio Projects
      </h2>
      <p class="text-sm text-gray-600 mb-4">
        Status: <span class="font-mono">{{ paginatedStatus }}</span>
      </p>

      <div
        v-if="paginatedStatus === 'pending'"
        class="text-gray-500"
      >
        Loading...
      </div>

      <div
        v-else-if="paginatedProjects"
        class="space-y-4"
      >
        <div class="flex items-center gap-4 text-sm text-gray-600">
          <span>Page {{ paginatedProjects.page }} of {{ paginatedProjects.totalPages }}</span>
          <span>Total: {{ paginatedProjects.totalItems }} projects</span>
          <span>Per page: {{ paginatedProjects.perPage }}</span>
        </div>

        <div class="space-y-4">
          <div
            v-for="project in paginatedProjects.items"
            :key="project.id"
            class="border rounded p-3"
          >
            <h3 class="font-semibold">
              {{ project.Title }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ project.Description }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            :disabled="paginatedProjects.page <= 1"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            @click="currentPage--; refreshPaginated()"
          >
            Previous
          </button>
          <button
            :disabled="paginatedProjects.page >= paginatedProjects.totalPages"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            @click="currentPage++; refreshPaginated()"
          >
            Next
          </button>
        </div>
      </div>
    </section>

    <!-- Test 6: Real-time Updates -->
    <section class="border rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">
        6. Real-time Updates Test
      </h2>

      <div class="space-y-4">
        <div class="flex gap-2">
          <button
            v-if="!isSubscribed"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            @click="subscribe()"
          >
            Start Listening for Updates
          </button>
          <button
            v-else
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            @click="unsubscribe()"
          >
            Stop Listening
          </button>
        </div>

        <div
          v-if="isSubscribed"
          class="text-sm text-green-600"
        >
          ✓ Subscribed to Portfolio_Projects updates
        </div>

        <div
          v-if="realtimeProject"
          class="border rounded p-4 bg-yellow-50"
        >
          <strong class="text-sm">Latest Update:</strong>
          <pre class="text-xs mt-2 overflow-auto">{{ realtimeProject }}</pre>
        </div>

        <p class="text-sm text-gray-600">
          When subscribed, any changes to Portfolio_Projects in PocketBase will appear here in real-time.
        </p>
      </div>
    </section>

    <!-- Raw Data Inspector -->
    <section class="border rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">
        Raw Data Inspector
      </h2>

      <details class="mt-4">
        <summary class="cursor-pointer font-semibold">
          Homepage Data
        </summary>
        <pre class="bg-gray-100 p-4 rounded mt-2 text-xs overflow-auto">{{ homepage }}</pre>
      </details>

      <details class="mt-4">
        <summary class="cursor-pointer font-semibold">
          Projects Data
        </summary>
        <pre class="bg-gray-100 p-4 rounded mt-2 text-xs overflow-auto">{{ projects }}</pre>
      </details>

      <details class="mt-4">
        <summary class="cursor-pointer font-semibold">
          About Data
        </summary>
        <pre class="bg-gray-100 p-4 rounded mt-2 text-xs overflow-auto">{{ about }}</pre>
      </details>

      <details class="mt-4">
        <summary class="cursor-pointer font-semibold">
          Settings Data
        </summary>
        <pre class="bg-gray-100 p-4 rounded mt-2 text-xs overflow-auto">{{ settings }}</pre>
      </details>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
