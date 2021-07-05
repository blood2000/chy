import variables from '@/assets/styles/element-variables.scss';
import defaultSettings from '@/settings';

const { sideTheme, showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings;

const state = {
  theme: variables.theme,
  sideTheme: sideTheme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  quickEntryName: null
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value;
    }
  },
  CHANGE_QUICK: (state, val) => {
    state.quickEntryName = val;
  }
};

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data);
  },
  changeQuick({ commit }, data) {
    commit('CHANGE_QUICK', data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

