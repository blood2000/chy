import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import tagsView from './modules/tagsView';
import permission from './modules/permission';
import settings from './modules/settings';
import orders from './modules/orders';
import util from './modules/util';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    orders,
    util
  },
  getters
});

export default store;
