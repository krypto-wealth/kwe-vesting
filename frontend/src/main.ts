import { createApp } from 'vue'

import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import App from '@/App.vue'
import '@/assets/index.css'
import router from '@/router'

import '@/gotbit-tools/vue/init'
import { routerPlugin, vId } from '@/gotbit-tools/vue/plugins'
import DialogComponents from '@/components/dialogs'

const app = createApp(App)

const pinia = createPinia()
pinia.use(routerPlugin(router))

Object.keys(DialogComponents).forEach((name) => {
  app.component(name, (DialogComponents as any)[name])
})

app.use(pinia)
app.use(router)
app.directive('id', vId)
app.use(autoAnimatePlugin)

app.mount('#app')
