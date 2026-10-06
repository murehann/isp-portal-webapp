<script setup lang="ts">
import apiClient from '@/services/apiClient'
import { RoleCodes, useAuthStore } from '@/stores/authStore'
import nProgress from 'nprogress'
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
const isLoading = ref<boolean>(false)
const router = useRouter()
const selectedRole = ref<RoleCodes | null>(authStore.currentRoleCode)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleRolesSwitch = async () => {
  nProgress.start()
  if (!selectedRole.value) return
  try {
    await authStore.switchRole(selectedRole.value)
    getUser()
    toast.success(`Role switched to ${authStore.currentRoleCode}`)
  } catch (error: unknown) {
    if (error instanceof Error) {
      let errorMessage = 'Failed to switch roles!'
      if (error.message) errorMessage = error.message
      toast.error(errorMessage)
    }
  } finally {
    nProgress.done()
  }
}

const getUser = async () => {
  isLoading.value = true
  try {
    const response = await apiClient.get(`/users/${authStore.sub}`)
    userInfo.value = response.data
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong!'
    if (error instanceof Error) errorMessage = error.message
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getUser()
})
</script>

<template>
  <h2>App Dashboard</h2>
  <h3>
    Current Role: <b>{{ authStore.currentRoleCode }}</b>
  </h3>

  <div v-if="isLoading">Loading...</div>

  <ul v-else-if="userInfo">
    <li :key="key" v-for="(value, key) in userInfo">{{ key }}: {{ value }}</li>
  </ul>

  <button class="bg-blue-500 cursor-pointer" @click="handleLogout()">Logout</button>

  <select v-if="userInfo && userInfo.role.length > 1" v-model="selectedRole">
    <option v-for="(value, key) in userInfo.role" :key="key" :value="value">
      {{ value.toLowerCase() }}
    </option>
  </select>
  <button class="bg-green-500 cursor-pointer" @click="handleRolesSwitch">Switch Role</button>
</template>
