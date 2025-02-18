import { createApp } from 'vue'
import router from './router/index'
import store from './store'
import './style.css'
import App from './App.vue'
import '../node_modules/flowbite-vue/dist/index.css'
createApp(App)
    .use(router)
    .use(store)
    .mount('#app')
