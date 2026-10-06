import apiClient from '@/services/apiClient'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
export interface LoginSuccessResponse {
  sub: number
  currentRoleCode: RoleCodes
  accessToken: string
}

interface BackendErrorResponse {
  message: string | string[]
  error: string
  statusCode: number
}

export enum RoleCodes {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  SUPER_ADMIN = 'SUPER_ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const sub = ref<number | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const currentRoleCode = ref<RoleCodes | null>(null)
  const hasAttemptedInit = ref<boolean>(false)

  // In useAuthStore
  async function initAuth() {
    if (accessToken.value) return // Already logged in

    try {
      const res = await apiClient.post<{
        accessToken: string
        sub: number
        currentRoleCode: RoleCodes
      }>('/auth/refresh')

      accessToken.value = res.data.accessToken
      sub.value = res.data.sub
      currentRoleCode.value = res.data.currentRoleCode
      isAuthenticated.value = true
    } catch {
      // If refresh fails, ensure we are truly logged out
      logout()
    }
  }

  function isValidRole(value: string): value is RoleCodes {
    return Object.values(RoleCodes).includes(value as RoleCodes)
  }

  async function login(email: string, password: string): Promise<void> {
    try {
      const { data }: { data: LoginSuccessResponse } = await apiClient.post<LoginSuccessResponse>(
        '/auth/login',
        {
          email: email,
          password: password,
        },
      )

      if (!isValidRole(data.currentRoleCode))
        throw new Error('Received invalid role from the server.')

      isAuthenticated.value = true
      accessToken.value = data.accessToken
      sub.value = data.sub
      currentRoleCode.value = data.currentRoleCode
      return
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred. Please try again.'

      if (axios.isAxiosError<BackendErrorResponse>(error)) {
        if (error.response) {
          const backendData = error.response?.data

          if (backendData) {
            if (Array.isArray(backendData.message)) errorMessage = backendData.message.join('\n')
            else if (typeof backendData.message === 'string') errorMessage = backendData.message
          }
        }
      } else if (error instanceof Error) errorMessage = error.message
      throw new Error(errorMessage)
    }
  }

  async function logout(): Promise<void> {
    try {
      const { data }: { data: { success: boolean } } = await apiClient.post('/auth/logout')
      if (data.success) {
        accessToken.value = null
        currentRoleCode.value = null
        sub.value = null
        isAuthenticated.value = false
        return
      } else {
        throw new Error('Something went wrong!')
      }
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong!'
      if (error instanceof Error) errorMessage = error.message
      toast.error(errorMessage)
    }
  }

  return {
    isAuthenticated,
    currentRoleCode,
    sub,
    accessToken,
    hasAttemptedInit,

    login,
    logout,
    initAuth,
  }
})
