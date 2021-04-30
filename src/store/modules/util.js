

const state = {
  parameters: {}// 保存页面传参
};

const mutations = {
  setParameters: (state, parametersData) => { // 页面参数传递格式{key: value}
    if (parametersData) {
      // 试了好久state.parameters[key]=value这样会报错只能先取出来添加属性再赋值
      const parameters = state.parameters;

      Object.keys(parametersData).forEach(key => {
        parameters[key] = parametersData[key];
      });

      state.parameters = parameters;
    } else {
      state.parameters = {};
    }
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

