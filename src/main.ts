import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './style.css'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())

// 初始化认证状态
const authStore = useAuthStore()
authStore.initialize()

app.use(router)

app.mount('#app')
