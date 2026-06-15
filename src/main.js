import './assets/main.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Mengaktifkan fungsi klik Modal & Accordion
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

createApp(App).use(router).mount('#app')