import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { RoleCodes, useAuthStore } from '@/stores/authStore'
import { toast } from 'vue-sonner'

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const currentRoleCode = authStore.currentRoleCode

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (requiresAuth && isAuthenticated && !currentRoleCode) {
    return { path: '/login', query: { reason: 'invalid-session' } }
  }

  const allowedRoles: RoleCodes[] = (to.meta.roles as RoleCodes[]) || []

  if (
    requiresAuth &&
    allowedRoles.length > 0 &&
    currentRoleCode &&
    !allowedRoles.includes(currentRoleCode)
  ) {
    toast.error('Unauthorized!')
    return { path: from.path, query: { reason: 'unauthorized' } }
  }

  if (to.path === '/login' && isAuthenticated) {
    return { path: '/dashboard' }
  }

  return
})

export default router
