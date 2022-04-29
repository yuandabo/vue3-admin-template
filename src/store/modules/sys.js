import { getSysInfo } from '@/api/user'
import defaultSetting from '@/settings'

const state = {
  name: defaultSetting.title,
  avatar: defaultSetting.avatar
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  getSysInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      getSysInfo().then(response => {
        const { data } = response
        commit('SET_NAME', data.projectName)
        commit('SET_AVATAR', data.logo)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
