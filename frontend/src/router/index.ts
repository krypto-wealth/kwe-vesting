import { createRouter, createWebHistory } from 'vue-router'
import { contractsInfoPath } from '@/gotbit-tools/vue'

import Home from '@/views/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    contractsInfoPath,
    {
      path: '/',
      name: 'home',
      component: Home,
    },
  ],
})

export default router
