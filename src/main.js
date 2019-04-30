import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/plugins' /* 组件，指令，插件等core统一入口 */

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$bus = new Vue()
Vue.prototype.$store = store

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
