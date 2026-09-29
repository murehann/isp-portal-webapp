<script setup lang="ts">
import apiClient from '@/services/apiClient'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const userInfo = ref<{
  userId: number
  email: string
  displayName: string
  address: string
  role: string[]
  managedId: number
  createdAt: Date
  updatedAt: Date
} | null>(null)
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  try {
    const response = await apiClient.get(`/users/${authStore.sub}`)
    userInfo.value = response.data
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong!'
    if (error instanceof Error) errorMessage = error.message
    toast.error(errorMessage)
  }
})
</script>

<template>
  <h2>App Dashboard</h2>
  <ul v-if="userInfo">
    <li :key="key" v-for="(value, key) in userInfo">{{ key }}: {{ value }}</li>
  </ul>
  <button class="bg-blue-500 cursor-pointer" @click="handleLogout()">Logout</button>
</template>
