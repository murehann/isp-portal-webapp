import Validations from '@/services/validations'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export interface LoginResponse {
  sub: number
  currentRoleCode: string
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
  general: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const email = ref<string>('')
  const password = ref<string>('')
  const isLoading = ref<boolean>(false)
  const errors = ref<LoginErrors>({
    email: null,
    password: null,
    general: null,
  })

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

  async function login(): Promise<LoginResponse> {
    if (!validateCredentials()) {
      throw new Error('Validation failed')
    }

    isLoading.value = true
    errors.value.general = null

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

      // Parse the response based on status
      if (!response.ok) {
        const errorData: LoginApiErrorResponse = await response.json()
        throw new Error(errorData.message || 'Invalid email or password.')
      }

      const data: LoginResponse = await response.json()

      // TODO: Store token in localStorage/Pinia here later
      // localStorage.setItem('accessToken', data.accessToken)

      return data
    } catch (error: unknown) {
      // Safely extract the error message without using 'any'
      let errorMessage = 'An unexpected error occurred. Please try again.'
      if (error instanceof Error) {
        errorMessage = error.message
      }

      errors.value.general = errorMessage
      throw new Error(errorMessage) // Re-throw for the component
    } finally {
      isLoading.value = false
    }
  }

  return {
    email,
    password,
    isLoading,
    errors,
    validateCredentials,
    validateEmail,
    validatePassword,
    login,
  }
})
