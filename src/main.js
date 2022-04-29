import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as Icons from '@element-plus/icons-vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import '@/styles/index.scss' // global css
import 'element-plus/dist/index.css'

import { autoHeightTable, autoFocus } from '@/utils/directive'

const app = createApp(App)

Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key])
})

app.directive('autoHeightTable', autoHeightTable())
app.directive('focus', autoFocus())

// 分环境处理
if (process.env.NODE_ENV === 'development') {
//   if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in window) {
//   // 这里__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue赋值一个createApp实例
//     window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
//   }
//   app.config.devtools = true
}

app.use(store).use(router).mount('#app')
