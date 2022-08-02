import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store"

Vue.use(VueRouter)

const routes = [

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

export const setRoutes = () => {
    const storeMenus = localStorage.getItem("menus");
    if (storeMenus) {
        // 动态拼装路由
        const manageRoute = {
            path: '/',
            name: 'Manage',
            redirect: "/home",
            component: () => import('../views/Manage.vue'),
            children: []
        }
        const menus = JSON.parse(storeMenus)
        menus.forEach(item => {
            if (item.path) {
                let itemMenu = {
                    path: item.path.replace("/", ""),
                    name: item.name,
                    component: () => import('../views/' + item.pagePath + '.vue')
                }
                manageRoute.children.push(itemMenu)
            } else if (item.children.length) {
                item.children.forEach(item => {
                    if (item.path) {
                        let itemMenu = {
                            path: item.path.replace("/", ""),
                            name: item.name,
                            component: () => import('../views/' + item.pagePath + '.vue')
                        }
                        manageRoute.children.push(itemMenu)
                    }
                })
            }
        })

        const currentRouteNames = router.getRoutes().map(v => v.name)
        if (!currentRouteNames.includes('Manage')) {
            // 动态添加
            router.addRoute(manageRoute)
        }

    }
}


// 路由守卫
router.beforeEach((to, from, next) => {
    localStorage.setItem("currentPathName", to.name)
    store.commit("setPath")
    next()
})

export default router
