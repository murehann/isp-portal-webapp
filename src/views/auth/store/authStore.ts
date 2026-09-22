import Validations from '@/services/validations'
import { defineStore } from 'pinia'
import { ref } from 'vue'

type LoginErrors = {
  email: string | null
  password: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const email = ref('')
  const password = ref('')
  const errors = ref<LoginErrors>({
    email: null,
    password: null,
  })

  function validateCredentials(): boolean {
    validateEmail()
    validatePassword()
    if (errors.value.email !== null || errors.value.password !== null) return false
    return true
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

  return { email, password, errors, validateCredentials, validateEmail, validatePassword }
})
