
const state = {
  percentage: 0, // 读卡的数据
  isover: false
};

const mutations = {
  SET_percentage: (state, percentage) => { // 页面参数传递格式{key: value}
    // console.log(percentage);
    state.percentage = percentage;
  },
  EMITOVER: (state, isover) => { // 页面参数传递格式{key: value}
    // console.log(percentage);
    state.isover = isover;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};


