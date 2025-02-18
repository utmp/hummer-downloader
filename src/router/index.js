import { createWebHistory, createRouter } from 'vue-router'
import AboutView from '../components/AboutView.vue'
import Input from '../components/Input.vue'
const routes = [
  { path: '/',component:Input},
  { path: '/about',component: AboutView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router