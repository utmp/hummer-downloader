import { createWebHistory, createRouter } from 'vue-router'
import AboutView from '../components/AboutView.vue'
import Input from '../components/Input.vue'
import Download from '../components/Download.vue'
const routes = [
  { path: '/',component:Input},
  { path: '/about',component: AboutView },
  {path: '/dwn',component:Download}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router