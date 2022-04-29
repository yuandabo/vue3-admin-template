import { getLocationList as getLocationListApi } from '@/api/location'
import { getOrganizationList as getOrganizationListApi } from '@/api/organization'
import {
  getBusinessList as getBusinessListApi
} from '@/api/business'
import { queryNewsUser } from '@/api/news'
import { queryScope } from '@/api/payment-item'
const state = {
  merchantsSelectList: [],
  marketSelectList: [],
  regionSelectList: [],
  floorSelectList: [],
  companySelectList: [],
  floorTreeData: [],
  bussinessList: [],
  newsUserList: [],
  scopeList: []
}

const mutations = {
  SET_MERCHANTS: (state, list) => {
    state.merchantsSelectList = list
  },
  SET_MARKETSELECTLIST: (state, list) => {
    state.marketSelectList = list
  },
  SET_REGIONSELECTLIST: (state, list) => {
    state.regionSelectList = list
  },
  SET_FLOORSELECTLIST: (state, list) => {
    state.floorSelectList = list
  },
  SET_COMPANYSELECTLIST: (state, list) => {
    state.companySelectList = list
  },
  SET_FLOORTREEDATA: (state, list) => {
    state.floorTreeData = list
  },
  SET_BUSSINESSLIST: (state, list) => {
    state.bussinessList = list
  },
  SET_NEWSUSERLIST: (state, list) => {
    state.newsUserList = list
  },
  SET_SCOPELIST: (state, list) => {
    state.scopeList = list
  }
}

const actions = {
  async getStoreList ({ state, commit }, params = {}) {
    if (state.scopeList?.length > 0) {
      return state.scopeList
    } else {
      const { data } = await queryScope(params)
      const { locationSet, storeList } = data
      storeList.forEach(store => {
        store.parentId = store.locationId
        store.name = store.storeNum
      })
      const list = [...locationSet, ...storeList]
      list.forEach(item => {
        if (!item.locationId) {
          item.id += 10000
          if (item.parentId) {
            item.parentId += 10000
          }
        } else {
          item.parentId += 10000
        }
      })
      const scopeList = getJsonTree(list)
      commit('SET_SCOPELIST', scopeList)
      return state.scopeList
    }
  },
  async queryNewsUserList ({ state, commit }, params = {}) {
    if (state.bussinessList?.length > 0) {
      return state.newsUserList
    } else {
      const { data } = await queryNewsUser({})
      commit('SET_NEWSUSERLIST', data)
      return state.newsUserList
    }
  },
  async getBussinessList ({ state, commit }, params = {}) {
    if (state.bussinessList?.length > 0) {
      return state.bussinessList
    } else {
      const data = await loadData({ page: 1, limit: 50 }, false, [], getBusinessListApi.bind(null, params))
      commit('SET_BUSSINESSLIST', data)
      return state.bussinessList
    }
  },
  async getFloorTreeData ({ state, commit }, params = {}) {
    if (state.floorTreeData?.length > 0) {
      return state.floorTreeData
    } else {
      const { data } = await getLocationListApi(params)
      const treeData = getJsonTree(data)
      commit('SET_FLOORTREEDATA', treeData)
      return state.floorTreeData
    }
  },
  async getMarketSelectList ({ state, commit }, params = {}) {
    if (state.marketSelectList?.length > 0) {
      return {
        marketSelectList: state.marketSelectList,
        regionSelectList: state.regionSelectList,
        floorSelectList: state.floorSelectList
      }
    } else {
      const { data } = await getLocationListApi(params)
      commit('SET_MARKETSELECTLIST', data.filter((v) => v.type === 1))
      commit('SET_REGIONSELECTLIST', data.filter((v) => v.type === 2))
      commit('SET_FLOORSELECTLIST', data.filter((v) => v.type === 3))
      return {
        marketSelectList: state.marketSelectList,
        regionSelectList: state.regionSelectList,
        floorSelectList: state.floorSelectList
      }
    }
  },
  async getCompanySelectList ({ state, commit }, params = {}) {
    if (state.companySelectList?.length > 0) {
      console.log(state.companySelectList)
      return { companySelectList: state.companySelectList }
    } else {
      const { data } = await getOrganizationListApi(params)
      commit('SET_COMPANYSELECTLIST', data)
      return {
        companySelectList: data
      }
    }
  }
}

const getJsonTree = function (data, parentId) {
  const itemArr = []
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    if (node.parentId === parentId) {
      let newNode = {}
      if (node.locationId) {
        // 最后一级不递归
        newNode = { id: node.id, name: node.name, children: [] }
      } else {
        newNode = { id: node.id, name: node.name, children: getJsonTree(data, node.id), type: node.type || '' }
      }
      itemArr.push(newNode)
    }
  }
  return itemArr
}
const loadData = async (page = { page: 1, limit: 50 }, loadFinish = false, returnData = [], fetchApi) => {
  if (loadFinish) return
  const { data } = await fetchApi(page)
  const { list, pager } = data
  const { pageNo, pageCount } = pager
  returnData = returnData.concat(list)
  if (pageNo >= pageCount) {
    loadFinish = true
    return returnData
  } else {
    page.page++
  }
  loadData(page, loadFinish, returnData, fetchApi)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
