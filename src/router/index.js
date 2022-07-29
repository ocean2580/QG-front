import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Manage',
        redirect: "/home",
        component: () => import('../views/Manage.vue'),
        // 子页面
        children: [
            {path: 'user', name: '用户管理', component: () => import('../views/User.vue')},
            {path: 'home', name: '首页', component: () => import('../views/Home.vue')},]
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 路由守卫
router.beforeEach((to , from, next )=>{
    localStorage.setItem("currentPathName", to.name)
    store.commit("setPath")
    next()
})

export default router
