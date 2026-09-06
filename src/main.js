import { createApp } from 'vue'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/custom.scss'
import App from './App.vue'
import { registerSW } from './registerSW.js'

registerSW()

createApp(App).mount('#app')