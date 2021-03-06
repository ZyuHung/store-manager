import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import ElementUI from 'element-ui'
import VCharts from 'v-charts'
import 'element-ui/lib/theme-chalk/index.css'
import '@/plugins' /* 组件，指令，插件等core统一入口 */

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VCharts)
Vue.prototype.$bus = new Vue()
Vue.prototype.$store = store

// 把普通的改为success
Vue.prototype.$message = Object.assign(Vue.prototype.$message.success, { error: Vue.prototype.$message.error })

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
