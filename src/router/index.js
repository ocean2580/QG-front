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
            {path: '/user', name: '用户管理', component: () => import('../views/User.vue')},
            {path: '/home', name: '首页', component: () => import('../views/Home.vue')},
            {path: '/person', name: '个人信息', component: () => import('../views/Person.vue')},
            {path: '/file', name: '文件管理', component: () => import('../views/Files.vue')},
            {path: '/role', name: '角色管理', component: () => import('../views/Role.vue')},
            {path: '/menu', name: '菜单管理', component: () => import('../views/Menu.vue')},
        ]
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
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    localStorage.setItem("currentPathName", to.name)
    store.commit("setPath")
    next()
})

export default router
