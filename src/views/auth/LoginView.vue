<template>
  <main
    class="min-h-dvh flex flex-col md:flex-row lg:flex-row bg-[url('/login-page-image.webp')] bg-cover bg-center"
  >
    <section class="relative hidden md:flex md:flex-1 lg:flex lg:flex-2" aria-label="ISP Portal">
      <h1 class="absolute top-[5%] left-[5%] text-5xl text-black font-semibold">ISP Portal</h1>
    </section>

    <section
      class="flex-1 bg-[#F5F5F5]/90 flex flex-col gap-8 py-12 lg:py-20 justify-center"
      aria-labelledby="welcome-heading"
    >
      <header class="flex-1 px-8">
        <h2 id="welcome-heading" class="text-2xl font-semibold flex flex-col">
          <span>Hi,</span>
          <span>Welcome to <span class="text-blue-600">ISP Portal</span></span>
        </h2>
      </header>

      <form
        class="w-full flex-4 flex flex-col px-8 gap-6"
        novalidate
        aria-labelledby="login-heading"
        @submit.prevent="handleLogin"
      >
        <h3 id="login-heading" class="text-xl font-semibold">Login to Your Account</h3>

        <!-- Email -->
        <div class="relative flex flex-col gap-2">
          <label for="email" class="font-semibold">
            <span class="text-red-500" aria-hidden="true">*</span>
            Email
          </label>

          <div
            class="flex items-center border rounded-sm bg-white focus-within:border-blue-500"
            :class="
              authStore.errors.email
                ? 'border-red-500 focus-within:border-red-500'
                : 'border-gray-300'
            "
          >
            <span class="pl-3 text-gray-400" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                />
              </svg>
            </span>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              autocomplete="email"
              required
              aria-required="true"
              :aria-invalid="!!authStore.errors.email"
              :aria-describedby="authStore.errors.email ? 'email-error' : undefined"
              v-model.trim="authStore.email"
              @blur="validateEmail"
              class="w-full p-3 bg-transparent focus:outline-none placeholder:text-gray-300 placeholder:font-medium text-sm text-gray-600"
            />
          </div>

          <Transition name="slide">
            <p
              v-if="authStore.errors.email"
              id="email-error"
              class="absolute top-full left-0 text-sm text-red-500"
              role="alert"
            >
              {{ authStore.errors.email }}
            </p>
          </Transition>
        </div>

        <!-- Password -->
        <div class="relative flex flex-col gap-2">
          <label for="password" class="font-semibold">
            <span class="text-red-500" aria-hidden="true">*</span>
            Password
          </label>

          <div
            class="flex items-center border rounded-sm bg-white focus-within:border-blue-500"
            :class="
              authStore.errors.password
                ? 'border-red-500 focus-within:border-red-500'
                : 'border-gray-300'
            "
          >
            <span class="pl-3 text-gray-400" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <rect width="14" height="11" x="5" y="10" rx="2" stroke-width="2" />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 10V7a4 4 0 018 0v3M12 15v2"
                />
              </svg>
            </span>

            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              placeholder="Password"
              autocomplete="current-password"
              required
              aria-required="true"
              :aria-invalid="!!authStore.errors.password"
              :aria-describedby="authStore.errors.password ? 'password-error' : undefined"
              v-model.trim="authStore.password"
              @focus="passwordFocused = true"
              @blur="handlePasswordBlur"
              class="w-full p-3 bg-transparent focus:outline-none placeholder:text-gray-300 text-sm text-gray-600"
            />

            <button
              v-if="passwordFocused || authStore.password.length > 0"
              type="button"
              class="pr-3 text-gray-400 cursor-pointer"
              @mousedown.prevent
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
            >
              <!-- Eye -->
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M2.25 12s3.75-6 9.75-6 9.75 6 9.75 6-3.75 6-9.75 6-9.75-6-9.75-6Z"
                />
                <circle cx="12" cy="12" r="2.5" stroke-width="1" />
              </svg>

              <!-- Crossed eye -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M3 3l18 18M10.5 6.2A10.8 10.8 0 0112 6c6 0 9.75 6 9.75 6a17.6 17.6 0 01-3.1 3.5M6.2 6.2C3.7 8 2.25 12 2.25 12s3.75 6 9.75 6c1.7 0 3.2-.4 4.5-1"
                />
              </svg>
            </button>
          </div>

          <Transition name="slide">
            <p
              v-if="authStore.errors.password"
              id="password-error"
              class="absolute top-full left-0 text-sm text-red-500"
              role="alert"
            >
              {{ authStore.errors.password }}
            </p>
          </Transition>
        </div>

        <button
          class="mt-2 flex items-center justify-center gap-2 bg-blue-600 p-3 rounded-sm text-white font-semibold transition-colors hover:bg-blue-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          type="submit"
          :disabled="authStore.isLoading"
          :aria-busy="authStore.isLoading"
        >
          <Transition name="fade" mode="out-in">
            <span v-if="authStore.isLoading" key="loading-text" class="flex items-center gap-2">
              <svg
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  class="opacity-100"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          </Transition>
          <span key="login-text"> Login </span>
        </button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from './store/authStore'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const passwordFocused = ref(false)

const { validateCredentials, validateEmail, validatePassword } = authStore

function handlePasswordBlur() {
  passwordFocused.value = false
  validatePassword()
}

async function handleLogin() {
  if (!validateCredentials()) return
  try {
    await authStore.login()

    toast.success('Login Successful!')
    router.push('/dashboard')
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred. Please try again.'

    if (error instanceof Error) errorMessage = error.message
    toast.error(errorMessage)
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
