import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Burgers from '../views/Burgers.vue'
import Layout from '../views/Layout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/hamburguesas',
    name: 'hamburguesas',
    component: Burgers
  },
  {
    path: '/layout',
    name: 'layout',
    component: Layout
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
