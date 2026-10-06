import axios, { AxiosError } from 'axios'
import { RoleCodes, useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

// 1. Create the Axios Instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// 2. Request Interceptor: Automatically attach the token if it exists
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 3. Response Interceptor: Catch global errors (like 401 Token Expiration)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config
    if (!originalRequest) return Promise.reject(error)

    // If the backend returns a 401, the token has expired or is invalid
    if (error.response?.status === 401 && !originalRequest?.url?.includes('/auth')) {
      try {
        const authStore = useAuthStore()

        const res = await apiClient.post<{
          sub: number
          currentRoleCode: RoleCodes
          accessToken: string
        }>('/auth/refresh')

        authStore.accessToken = res.data.accessToken
        authStore.sub = res.data.sub
        authStore.currentRoleCode = res.data.currentRoleCode

        if (originalRequest.headers)
          originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        await useAuthStore().logout()
        useRouter().push('/login')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
