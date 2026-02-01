/**
 * PocketBase Authentication Composable
 * Handles user authentication and session management
 */

import type { UsersResponse } from '~/shared/types/pocketbase-types'

export function usePocketBaseAuth() {
  const pb = usePocketBase()

  // Reactive user state
  const user = useState<UsersResponse | null>('pb_user', () => pb.authStore.model as UsersResponse | null)
  const token = useState<string>('pb_token', () => pb.authStore.token)

  // Listen to auth changes
  pb.authStore.onChange((newToken, model) => {
    user.value = model as UsersResponse | null
    token.value = newToken
  })

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password)
      return {
        success: true,
        user: authData.record as UsersResponse,
        token: authData.token,
      }
    }
    catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      }
    }
  }

  /**
   * Logout current user
   */
  const logout = () => {
    pb.authStore.clear()
  }

  /**
   * Register a new user
   */
  const register = async (email: string, password: string, passwordConfirm: string, name?: string) => {
    try {
      const data = {
        email,
        password,
        passwordConfirm,
        ...(name && { name }),
      }

      const record = await pb.collection('users').create(data)
      return {
        success: true,
        user: record as UsersResponse,
      }
    }
    catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      }
    }
  }

  /**
   * Request password reset
   */
  const requestPasswordReset = async (email: string) => {
    try {
      await pb.collection('users').requestPasswordReset(email)
      return { success: true }
    }
    catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset request failed',
      }
    }
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => pb.authStore.isValid && !!user.value)

  /**
   * Refresh the authentication token
   */
  const refresh = async () => {
    try {
      const authData = await pb.collection('users').authRefresh()
      return {
        success: true,
        user: authData.record as UsersResponse,
      }
    }
    catch (error: any) {
      return {
        success: false,
        error: error.message || 'Token refresh failed',
      }
    }
  }

  return {
    user,
    token,
    login,
    logout,
    register,
    requestPasswordReset,
    refresh,
    isAuthenticated,
    pb,
  }
}
