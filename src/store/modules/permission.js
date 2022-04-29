import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission (paths, route) {
//   if (route.path) {
//     return paths.included(route.path)
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, paths, parentPath = '') {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    const truePath = parentPath ? parentPath + '/' + route.path : route.path
    if (paths.includes(truePath) || paths.includes('*') || route.meta.whiteMenu) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, paths, route.path)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  async generateRoutes ({ commit }, paths) {
    const accessedRoutes = filterAsyncRoutes(asyncRoutes, paths)
    commit('SET_ROUTES', accessedRoutes)
    return accessedRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
