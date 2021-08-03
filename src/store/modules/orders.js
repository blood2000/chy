

const state = {
  estimateCostData: null,
  M0_option: null,
  provinceList: null,
  goodsBigType_option: null,

  orderStowageStatus: '0', // 单位
  lossPlans: {}, // 取路耗 亏吨方案, key为规则code,value为路耗内容
  radius1: 200, // 设置电子围栏装
  radius2: 200 // 设置电子围栏卸
};

const mutations = {
  SET_EST: (state, device) => { state.estimateCostData = device; },
  SET_MO: (state, device) => { state.M0_option = device; },
  SET_PROVINCE: (state, device) => { state.provinceList = device; },
  SET_GOODSBIGTYPE: (state, device) => { state.goodsBigType_option = device; },
  SET_ORDERSTOWAGESTATUS: (state, device) => { state.orderStowageStatus = device; },

  SET_LOSS_PLAN: (state, device) => {
    // console.log(device);
    state.lossPlans = {
      ...state.lossPlans,
      [device.ruleCode]: device
    };
  },

  SET_RADIUS1: (state, device) => { state.radius1 = device; },
  SET_RADIUS2: (state, device) => { state.radius2 = device; }

};

const actions = {

  store_getEst({ commit }, data) { commit('SET_EST', data); },
  store_getM0_option({ commit }, data) { commit('SET_MO', data); },
  store_getProvinceList({ commit }, data) { commit('SET_PROVINCE', data); },
  store_goodsBigType_option({ commit }, data) { commit('SET_GOODSBIGTYPE', data); }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
