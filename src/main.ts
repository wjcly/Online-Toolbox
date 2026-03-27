import { createApp } from 'vue'
import pinia from './stores/pinia'
import router from './router'
import './index.css'
import App from './App.vue'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
