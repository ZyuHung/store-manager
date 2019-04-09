import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        // 1-管理员
        {
            path: '/',
            name: 'manager',
            component: () => import('@/pages/manager/index'),
            redirect: { name: 'login' },
            children: [
                // 1-a[订单管理]订单列表
                {
                    path: 'order-list',
                    name: 'order-list',
                    component: () => import('@/pages/manager/order/list')
                },
                // 1-b历史订单
                {
                    path: 'order-history',
                    name: 'order-history',
                    component: () => import('@/pages/manager/order/history')
                },
                // 10-会员系统
                {
                    path: 'client',
                    name: 'client',
                    component: () => import('@/pages/manager/client/index')
                }
            ]
        },
        // 2-用户
        {
            path: '/user',
            name: 'user',
            component: () => import('@/pages/user/index'),
            children: [
                // 2-充值记录
                {
                    path: 'recharge-list',
                    name: 'recharge-list',
                    component: () => import('@/pages/user/recharge-list')
                },
                // 2-消费记录
                {
                    path: 'consume-list',
                    name: 'consume-list',
                    component: () => import('@/pages/user/consume-list')
                }
            ]
        },
        // 3-登录页
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "about" */ './pages/login.vue')
        }
    ]
})