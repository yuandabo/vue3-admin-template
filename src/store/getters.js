const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  merchantsSelectList: state => state.dict.merchantsSelectList,
  sysAvatar: state => state.sys.avatar,
  sysName: state => state.sys.name,
  paths: state => state.user.paths,
  routes: state => state.permission.routes
}
export default getters
