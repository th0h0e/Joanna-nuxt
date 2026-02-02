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
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">
          Welcome Back
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Sign in to your portfolio dashboard
        </p>
      </div>

      <!-- Login Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form
          class="space-y-4"
          @submit.prevent="handleLogin"
        >
          <!-- Email Input -->
          <div>
            <label class="block text-sm font-medium mb-2">Email Address</label>
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
            <label class="block text-sm font-medium mb-2">Password</label>
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
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4"
              >
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
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Sign up
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
        Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
      </p>
    </div>
  </div>
</template>
