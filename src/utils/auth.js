import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function setUserName (name) {
  return window.localStorage.setItem('username', name)
}

export function getUserName () {
  return window.localStorage.getItem('username')
}

export function removeUserName () {
  return window.localStorage.removeItem('username')
}

export function setUserPaths (paths) {
  return window.localStorage.setItem('userpaths', JSON.stringify(paths))
}

export function getUserPaths () {
  return JSON.parse(window.localStorage.getItem('userpaths'))
}

export function removeUserPaths () {
  return window.localStorage.removeItem('userpaths')
}
