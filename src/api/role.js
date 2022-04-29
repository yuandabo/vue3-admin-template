import request from '@/utils/request'

export function getRoleList (data, params) {
  return request({
    url: '/api/admin/role/list',
    method: 'post',
    data,
    params
  })
}

export function getRoleMenuList (data) {
  return request({
    url: '/api/admin/role/get-menu',
    method: 'post',
    data
  })
}

export function getRoleDetail (data) {
  return request({
    url: '/api/admin/role/get',
    method: 'post',
    data
  })
}

export function addRole (data) {
  return request({
    url: '/api/admin/role/add',
    method: 'post',
    data
  })
}

export function updateRole (data) {
  return request({
    url: '/api/admin/role/update',
    method: 'post',
    data
  })
}

export function enableRole (data) {
  return request({
    url: '/api/admin/role/enable',
    method: 'post',
    data
  })
}

export function disableRole (data) {
  return request({
    url: '/api/admin/role/disable',
    method: 'post',
    data
  })
}

export function moveUpRole (data) {
  return request({
    url: '/api/admin/role/move-up',
    method: 'post',
    data
  })
}

export function movedownRole (data) {
  return request({
    url: '/api/admin/role/move-down',
    method: 'post',
    data
  })
}

export function topRole (data) {
  return request({
    url: '/api/admin/role/top',
    method: 'post',
    data
  })
}
