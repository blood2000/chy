

const state = {
  estimateCostData: null,
  M0_option: null,
  provinceList: null
};

const mutations = {
  SET_EST: (state, device) => { state.estimateCostData = device; },
  SET_MO: (state, device) => { state.M0_option = device; },
  SET_PROVINCE: (state, device) => {
    console.log(device);
    state.provinceList = device;
  }

};

const actions = {

  store_getEst({ commit }, data) { commit('SET_EST', data); },
  store_getM0_option({ commit }, data) { commit('SET_MO', data); },
  store_getProvinceList({ commit }, data) { commit('SET_PROVINCE', data); }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
