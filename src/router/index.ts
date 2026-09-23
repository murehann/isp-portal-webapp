import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { RoleCodes, useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const currentRoleCode = authStore.currentRoleCode

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (requiresAuth && isAuthenticated && !currentRoleCode) {
    return next({ path: '/login', query: { reason: 'invalid-session' } })
  }

  const allowedRoles: RoleCodes[] = (to.meta.roles as RoleCodes[]) || []

  if (
    requiresAuth &&
    allowedRoles.length > 0 &&
    currentRoleCode &&
    !allowedRoles.includes(currentRoleCode)
  ) {
    return next({ path: '/unauthorized' })
  }

  if (to.path === '/login' && isAuthenticated) {
    return next({ path: '/dashboard' })
  }

  next()
})

export default router
