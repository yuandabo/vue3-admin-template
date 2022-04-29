import { login, getUserPath } from '@/api/user'
import { getToken, setToken, removeToken, removeUserName, setUserName, getUserName } from '@/utils/auth'
import router, { resetRouter, initRouter } from '@/router'
const state = {
  token: getToken(),
  name: getUserName(),
  avatar: '',
  introduction: '',
  roles: [],
  phone: '',
  status: '',
  paths: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_STATUS: (state, status) => {
    state.status = status
  },
  SET_PATHS: (state, paths) => {
    state.paths = paths
  }
}

const actions = {
  // user login
  async login ({ commit, dispatch }, userInfo) {
    if (userInfo) {
      const { loginName, password } = userInfo
      const { data } = await login({ loginName: loginName.trim(), password: password })
      commit('SET_TOKEN', data.token)
      commit('SET_NAME', data.name)
      commit('SET_PHONE', data.phone)
      commit('SET_STATUS', data.status)
      commit('SET_PATHS', data.paths)
      setToken(data.token)
      setUserName(data.name)
      dispatch('user/getInfo', true, { root: true })
      router.push({ name: 'Home' })
      return data
    }
  },

  // get user info
  async getInfo ({ commit, state }, init = false) {
    if (!state.token) return {}
    const token = getToken()
    const username = getUserName()
    commit('SET_TOKEN', token)
    commit('SET_NAME', username)
    if (init || state.paths?.length === 0) {
      const { data } = await getUserPath()
      const paths = data
      commit('SET_PATHS', paths)
      initRouter(paths)
    }
    return {
      paths: state.paths,
      token,
      username
    }
  },

  // user logout
  logout ({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      commit('SET_TOKEN', '')
      // commit('SET_ROLES', [])
      commit('SET_PATHS', [])
      commit('SET_NAME', '')
      commit('SET_PATHS', [])
      removeToken()
      removeUserName()
      resetRouter()
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles ({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
