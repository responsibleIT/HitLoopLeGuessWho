import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)
// app.use(VueCircleSlider)
app.use(createPinia())
app.use(router)


app.mount('#app')
