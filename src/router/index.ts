import { createRouter, createWebHistory } from 'vue-router'
import universal from '@/layout/universal.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: universal,
      children: [
        {
          path: '',
          component: () => import('@/views/home.vue'),
          meta: {
            title: '首页',
            keepAlive: false,
            requireAuth: false,
            transitionName: 'fade'
          }
        },
        {
          path: 'game',
          name: 'Game',
          component: () => import('@/views/game/index.vue'),
        }
      ]
    },
    {
      path: '/:pathMatch(.*)',
      name: '404',
      component: () => import('@/views/404.vue'),
      meta: {
        title: '页面不存在',
        keepAlive: false,
        requireAuth: false,
        transitionName: 'fade'
      }
    }
  ],
})

export default router
