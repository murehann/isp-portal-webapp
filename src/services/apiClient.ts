import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

// 1. Create the Axios Instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  (response) => {
    // If the request is successful, just return the data
    return response
  },
  (error) => {
    // If the backend returns a 401, the token has expired or is invalid
    if (error.response?.status === 401) {
      console.warn('API Client: 401 Unauthorized - Token likely expired.')
      // We will add the store clearing and router redirect logic here in the next step
    }

    return Promise.reject(error)
  },
)

export default apiClient
