import { createApp } from 'vue'
import client, { connect, root, router } from '@koishijs/client'
import App from './layouts/index.vue'
import Home from './layouts/home.vue'

import './index.scss'

const app = createApp(App)

app.use(client)

app.provide('ecTheme', 'dark-blue')

app.use(router)

root.page({
  path: '/',
  name: '欢迎',
  icon: 'activity:home',
  order: 1000,
  component: Home,
})

router.afterEach((route) => {
  if (typeof route.name === 'string') {
    document.title = `${route.name} | Koishi 控制台`
  }
})

app.mount('#app')

connect()
