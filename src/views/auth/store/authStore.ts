import Validations from '@/services/validations'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export interface LoginResponse {
  sub: number
  currentRoleCode: RoleCodes
  accessToken: string
}

interface LoginApiErrorResponse {
  message: string
  error: string
  statusCode: number
}

type LoginErrors = {
  email: string | null
  password: string | null
}

export enum RoleCodes {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  SUPER_ADMIN = 'SUPER_ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export const useAuthStore = defineStore('auth', () => {
  const email = ref<string>('')
  const password = ref<string>('')
  const isLoading = ref<boolean>(false)
  const errors = ref<LoginErrors>({
    email: null,
    password: null,
  })

  const accessToken = ref<string | null>(null)
  const sub = ref<number | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const currentRoleCode = ref<RoleCodes | null>(null)

  function validateCredentials(): boolean {
    validateEmail()
    validatePassword()
    return errors.value.email === null && errors.value.password === null
  }

  function validateEmail(): void {
    let validationMessage: string | null = null

    if (!Validations.checkRequired(email.value)) validationMessage = 'Email is required.'
    else if (!Validations.checkEmailFormat(email.value)) validationMessage = 'Invalid email format.'

    errors.value.email = validationMessage
  }

  function validatePassword(): void {
    let validationMessage: string | null = null

    if (!Validations.checkRequired(password.value)) validationMessage = 'Password is required.'

    errors.value.password = validationMessage
  }

  function isValidRole(value: string): value is RoleCodes {
    return Object.values(RoleCodes).includes(value as RoleCodes)
  }

  async function login(): Promise<void> {
    isLoading.value = true
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })

      if (!response.ok) {
        const errorData: LoginApiErrorResponse = await response.json()
        throw new Error(errorData.message || 'Invalid email or password.')
      }

      const data: LoginResponse = await response.json()

      if (!isValidRole(data.currentRoleCode))
        throw new Error('Received invalid role from the server.')

      email.value = ''
      password.value = ''

      isAuthenticated.value = true
      accessToken.value = data.accessToken
      sub.value = data.sub
      currentRoleCode.value = data.currentRoleCode
      return
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred. Please try again.'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  return {
    email,
    password,
    isLoading,
    errors,

    isAuthenticated,
    currentRoleCode,
    sub,
    accessToken,

    validateCredentials,
    validateEmail,
    validatePassword,
    login,
  }
})
