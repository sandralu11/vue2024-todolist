import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
    // {
    //   path: '/week1',
    //   component: () => import('../views/Week1View.vue')
    // },
  ]
})

export default router
