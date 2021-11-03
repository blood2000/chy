
const state = {
  percentage: 0// 读卡的数据
};

const mutations = {
  SET_percentage: (state, percentage) => { // 页面参数传递格式{key: value}
    console.log(percentage);
    state.percentage = percentage;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};


