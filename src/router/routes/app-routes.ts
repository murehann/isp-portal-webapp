import AppDashboard from '@/views/common/AppDashboard.vue'
import type { RouteRecordRaw } from 'vue-router'

const dashboardRoute: RouteRecordRaw = {
  name: 'dashboard',
  path: '/dashboard',
  component: AppDashboard,
  meta: { requiresAuth: true },
}

const homeRoute: RouteRecordRaw = {
  name: 'Home',
  path: '/',
  redirect: 'dashboard',
  meta: { requiresAuth: true },
}

const appRoutes: RouteRecordRaw[] = [dashboardRoute, homeRoute]

export default appRoutes
