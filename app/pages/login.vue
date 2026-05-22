<script setup lang="ts">
definePageMeta({
  title: 'Login'
})

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    // TODO: Implement login logic
    console.log('Login attempt:', { email: email.value, password: password.value })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="mb-2 text-3xl font-bold">Welcome Back</h1>
        <p class="text-gray-600 dark:text-gray-400">Sign in to your portfolio dashboard</p>
      </div>

      <!-- Login Form -->
      <div
        class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <form
          class="space-y-4"
          @submit.prevent="handleLogin"
        >
          <!-- Email Input -->
          <div>
            <label class="mb-2 block text-sm font-medium">Email Address</label>
            <UInput
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
              icon="i-heroicons-envelope"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label class="mb-2 block text-sm font-medium">Password</label>
            <UInput
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              icon="i-heroicons-lock-closed"
            />
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex cursor-pointer items-center gap-2">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4"
              />
              <span class="text-sm">Remember me</span>
            </label>
            <NuxtLink
              to="#"
              class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <!-- Login Button -->
          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            :loading="loading"
          >
            Sign In
          </UButton>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <NuxtLink
              to="#"
              class="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Sign up
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
      </p>
    </div>
  </div>
</template>
