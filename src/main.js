import Vue from 'vue';

import Cookies from 'js-cookie';

import Element from 'element-ui';
import './assets/styles/element-variables.scss';

import '@/assets/styles/index.scss'; // global css
import '@/assets/styles/ddc.scss'; // ddc css
import App from './App';
import store from './store';
import router from './router';
import permission from './directive/permission';
import { download } from '@/utils/request';

import './assets/icons'; // icon
import './permission'; // permission control
import { getDicts, listByDict } from '@/api/system/dict/data';
import { getConfigKey } from '@/api/system/config';
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from '@/utils/ddc';
import Pagination from '@/components/Pagination';
// 自定义表格工具扩展
import RightToolbar from '@/components/RightToolbar';
// 代码高亮插件
import hljs from 'highlight.js';
import 'highlight.js/styles/github-gist.css';
// chenhj添加2自定义组件及使用本地存储
import TablecCascader from '@/components/Ddc/Tin/TablecCascader.vue';
import RefactorTable from '@/components/Ddc/Tin/RefactorTable.vue';
import { setLocalStorage, getLocalStorage, removeLocalStorage } from '@/utils/auth';
// 表单校验
import { formValidate } from '@/utils/formValidate';

// s= chenghj 引入高德地图vue组件库 vue-amap
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '8176702ab4a0886a159684727fd7fb12', // TODO要换成公司的
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  v: '1.4.4'
});
// e=

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.listByDict = listByDict;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.setLocalStorage = setLocalStorage;
Vue.prototype.getLocalStorage = getLocalStorage;
Vue.prototype.removeLocalStorage = removeLocalStorage;
Vue.prototype.formValidate = formValidate;

Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' });
};

Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' });
};

Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg);
};

// 全局组件挂载
Vue.component('Pagination', Pagination);
Vue.component('RightToolbar', RightToolbar);
Vue.component('RefactorTable', RefactorTable);
Vue.component('TablecCascader', TablecCascader);

Vue.use(permission);
Vue.use(hljs.vuePlugin);

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
});

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
