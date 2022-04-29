import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

// export function getInfo (token) {
//   return new Promise((resolve, reject) => {
//     resolve({
//       data: {
//         roles: ['admin'],
//         name: '白马',
//         avatar: 'https://p.qqan.com/up/2020-10/202010281414254556.jpg',
//         introduction: '白马物业'
//       }
//     })
//   })
// return request({
//   url: '/vue-element-admin/user/info',
//   method: 'get',
//   params: { token }
// })
// }

export function getSysInfo () {
  return request({
    url: '/api/admin/sys-info',
    method: 'post'
  })
}

export function getUserDetail () {
  return request({
    url: '/api/admin/personal/get',
    method: 'post'
  })
}

export function updatePassword (data) {
  return request({
    url: '/api/admin/personal/update',
    method: 'post',
    data
  })
}

export function getUserPath () {
  return request({
    url: '/api/admin/user/get-path',
    method: 'post'
  })
}
