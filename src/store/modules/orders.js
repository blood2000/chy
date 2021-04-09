
const state = {
  estimateCostData: null
};

const mutations = {
  SET_EST: (state, device) => {
    console.log(device);

    state.estimateCostData = device;
  }

};

const actions = {

  store_getEst({ commit }, data) {
    commit('SET_EST', data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
