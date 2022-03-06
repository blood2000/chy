const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  nickName: state => state.user.nickName,
  roleName: state => state.user.roleName,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  isDefaultPassword: state => state.user.isDefaultPassword,

  permission_routes: state => state.permission.routes,
  sidebarRouters: state => state.permission.sidebarRouters,
  isAdmin: state => state.user.isAdmin,
  isShipment: state => state.user.isShipment,
  isDriver: state => state.user.isDriver,
  isDispatcher: state => state.user.isDispatcher,
  shipment: state => state.user.shipment,
  defaultRoleCode: state => state.user.defaultRoleCode,
  provinceList: state => state.orders.provinceList,
  goodsBigType_option: state => state.orders.goodsBigType_option,
  branch: state => state.user.branch,
  parameters: state => state.util.parameters

};
export default getters;
