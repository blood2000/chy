import elSelectLoadmore from './elSelectLoadmore';

const install = function(Vue) {
  Vue.directive('el-select-loadmore', elSelectLoadmore);
};

export default install;
