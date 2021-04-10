const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  sidebarRouters: state => state.permission.sidebarRouters,
  isAdmin: state => state.user.isAdmin,
  isShipment: state => state.user.isShipment,
  isDriver: state => state.user.isDriver,
  isDispatcher: state => state.user.isDispatcher,
  shipment: state => state.user.shipment,
  provinceList: state => state.orders.provinceList
};
export default getters;
