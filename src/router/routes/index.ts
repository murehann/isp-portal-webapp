import type { RouteRecordRaw } from 'vue-router'
import AuthRoutes from './auth-routes'
import appRoutes from './app-routes'

export const routes: RouteRecordRaw[] = [...AuthRoutes, ...appRoutes]
