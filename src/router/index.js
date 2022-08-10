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
    {
        path: '*',
        name: '404',
        component: () => import('../views/404.vue')
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

        const currentRouteNames = router.getRoutes().map(v => v.name)
        if (!currentRouteNames.includes('Manage')) {

            // 动态拼装路由
            const manageRoute = {
                path: '/',
                name: 'Manage',
                redirect: "/home",
                component: () => import('../views/Manage.vue'),
                children: [{path: 'person', name: 'Profile', component: ()=> import('../views/Person.vue')},
                    // {path: 'password', name: '修改密码', componet: ()=> import('../views/Password.vue')},
                ]
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

            // 动态添加
            router.addRoute(manageRoute)
        }
    }
}


// 重置我就再set一次路由
setRoutes()

// 路由守卫
router.beforeEach((to, from, next) => {
    localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称
    store.commit("setPath")

    // 未找到路由的情况
    if (!to.matched.length) {
        const storeMenus = localStorage.getItem("menus")
        if (storeMenus) {
            next("/404")
        } else {
            // 跳回登录页面
            next("/login")
        }
    }
    // 其他的情况都放行
    next()

})


export default router
