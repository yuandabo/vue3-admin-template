import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'
import store from '@/store'
import paymentRouter from './modules/payment'
import reqairRouter from './modules/repair'
import storeRouter from './modules/store'
import merchantsRouter from './modules/merchants'
import adRouter from './modules/advertisement'
import informationRouter from './modules/information'
import newsRouter from './modules/news'
// import newsCenterRouter from './modules/newsCenter'
import systemRouter from './modules/system'
import { ElMessage } from 'element-plus'

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    meta: {
      title: '后台首页',
      icon: 'home-filled',
      breadcrumb: false
    },
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        meta: {
          title: '后台首页',
          breadcrumb: false
        },
        component: () => import('@/views/Home')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      noTag: true
    },
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '无权限'
    },
    component: () => import('@/views/404'),
    hidden: true
  }
]

export const asyncRoutes = [
  merchantsRouter,
  storeRouter,
  reqairRouter,
  paymentRouter,
  adRouter,
  informationRouter,
  newsRouter,
  // newsCenterRouter,
  systemRouter
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export const initRouter = async (paths) => {
  try {
    const routesList = await store.dispatch('permission/generateRoutes', paths)
    await routesList.forEach(async item => {
      await router.addRoute(item)
    })
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '路由信息初始失败，请联系管理员'
    })
  }
}

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes
  })
  router.matcher = newRouter.matcher // reset router
}

export const routerPush = async (route = { name: '' }) => {
  if (!route.name) return
  try {
    await router.push({ name: route.name, params: route.params || {} })
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '权限不足，请联系管理员设置相关权限'
    })
  }
}

router.beforeEach(async (to, from, next) => {
  const routesLen = store.getters.routes?.length
  document.title = to.meta.title || store.getters.sysName
  if (to.name === 'Login') {
    next()
  } else {
    const { paths, token, username } = await store.dispatch('user/getInfo')
    if (paths && token && username) {
      if (routesLen > 0) {
        next()
      } else {
        await initRouter(paths)
        if (to.matched.length === 0) {
          next(to.path)
        } else {
          next()
        }
      }
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
