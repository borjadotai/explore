import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { supabase } from '@/supabase'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import Account from '../views/Account.vue'

const canUserAccess = (to: RouteLocationNormalized) => {
  return supabase.auth.getSession().then(({ data }) => !!data.session)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/settings',
      name: 'settings',
      component: Account
    },
    {
      path: '/login',
      name: 'login',
      component: Auth
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const canAccess = await canUserAccess(to)
  if (canAccess && to.path !== '/login') next()
  if (!canAccess && to.path === '/login') next()
  if (canAccess && to.path === '/login') next('/home')
  if (!canAccess && to.path !== '/login') next('/login')
})

export default router
