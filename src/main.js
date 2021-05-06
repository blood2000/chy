import Vue from 'vue';
import Cookies from 'js-cookie';
import Element from 'element-ui';
import './assets/styles/element-variables.scss';
import '@/assets/styles/index.scss'; // global css
import '@/assets/styles/ddc.scss'; // ddc css
import '@/assets/font/index.scss'; // 自定义字体,只在数据大屏用到,不影响其他页面的加载速度
import App from './App';
import store from './store';
import router from './router';

// 自定义指令
import permission from './directive/permission';
import elementDirective from './directive/element';

import { download } from '@/utils/request';
import './assets/icons'; // icon
import './permission'; // permission control
import { getDicts, listByDict, getDictsByType } from '@/api/system/dict/data';
import { getConfigKey } from '@/api/system/config';
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree, tableHeaderConfig } from '@/utils/ddc';
// 本地缓存
import { setLocalStorage, getLocalStorage, removeLocalStorage } from '@/utils/auth';
// 表单校验
import { formValidate } from '@/utils/formValidate';
// 分页组件
import Pagination from '@/components/Pagination';
// 表头配置组件
import TablecCascader from '@/components/Ddc/Tin/TablecCascader.vue';
import RefactorTable from '@/components/Ddc/Tin/RefactorTable.vue';
import MoreRefactorTable from '@/components/Ddc/Tin/MoreRefactorTable.vue';
import TableDropdown from '@/components/Dropdown';
// 自定义表格工具扩展
import RightToolbar from '@/components/RightToolbar';
// 代码高亮插件
import hljs from 'highlight.js';
import 'highlight.js/styles/github-gist.css';
// 打印
import Print from 'vue-print-nb';
Vue.use(Print);

// 图片查看插件
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
Vue.use(Viewer);
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source', hide: function() { Viewer.destroy(); } }
});

// 高德地图vue组件库
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '2066cb0dafaa492aee47fa1090227a38', // 高德企业key
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.Driving', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geocoder', 'AMap.Marker'],
  v: '1.4.4'
});

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.listByDict = listByDict;
Vue.prototype.getDictsByType = getDictsByType;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.tableHeaderConfig = tableHeaderConfig;
Vue.prototype.setLocalStorage = setLocalStorage;
Vue.prototype.getLocalStorage = getLocalStorage;
Vue.prototype.removeLocalStorage = removeLocalStorage;
Vue.prototype.formValidate = formValidate;
// 提示方法
Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' });
};
Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' });
};
Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg);
};
Vue.prototype.msgWarning = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'warning' });
};

// 全局组件挂载
Vue.component('Pagination', Pagination);
Vue.component('RightToolbar', RightToolbar);
Vue.component('RefactorTable', RefactorTable);
Vue.component('MoreRefactorTable', MoreRefactorTable);
Vue.component('TablecCascader', TablecCascader);
Vue.component('TableDropdown', TableDropdown);
Vue.use(permission);
Vue.use(elementDirective);
Vue.use(hljs.vuePlugin);
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
});

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
console.log(process.env);
