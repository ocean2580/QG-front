import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Manage',
        redirect: "/home",
        component: () => import('../views/Manage.vue'),
        // 子页面
        children: [
            {path: 'user', name: 'User', component: () => import('../views/User.vue')},
            {path: 'home', name: 'Home', component: () => import('../views/Home.vue')},]
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
    routes
})

export default router
