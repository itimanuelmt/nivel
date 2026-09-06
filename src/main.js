import { createApp } from 'vue'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fontsource/space-grotesk/latin-400.css'
import '@fontsource/space-grotesk/latin-700.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import './styles/custom.scss'
import App from './App.vue'
import { registerSW } from './registerSW.js'

registerSW()

createApp(App).mount('#app')