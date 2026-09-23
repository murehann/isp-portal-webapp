import type { RouteRecordRaw } from 'vue-router'

const LoginRoute: RouteRecordRaw = {
  name: 'login',
  path: '/login',
  component: () => import('@/views/auth/LoginView.vue'),
  meta: { requiresAuth: false },
}

const AuthRoutes: RouteRecordRaw[] = [LoginRoute]

export default AuthRoutes
