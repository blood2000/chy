import request from '@/utils/request';

/** ============================图表配置管理============================ */
// 获取图表分页列表
export function getChartList(query) {
  return request({
    url: `/analysis/dataChartInfos`,
    method: 'get',
    params: query
  });
}

// 新增图表
export function addChart(data) {
  return request({
    url: '/analysis/dataChartInfos',
    method: 'post',
    data: data
  });
}

// 修改图表
export function updateChart(id, data) {
  return request({
    url: `/analysis/dataChartInfos/${id}`,
    method: 'put',
    data: data
  });
}

// 获取图表信息
export function getChartDetail(id) {
  return request({
    url: `/analysis/dataChartInfos/${id}`,
    method: 'get'
  });
}

// 删除图表
export function delChart(ids) {
  return request({
    url: `/analysis/dataChartInfos/${ids}`,
    method: 'delete'
  });
}

// 选择性更新图表
export function patchChart(id, data) {
  return request({
    url: `/analysis/dataChartInfos/${id}`,
    method: 'patch',
    data: data
  });
}

// 根据图表Id查询图表配置Id集合
export function getChartConfig(chartId) {
  return request({
    url: `/analysis/dataChartInfoConfigs/chartConfigIdList`,
    method: 'get',
    params: {
      chartId
    }
  });
}

// 新增数据图表-配置关系
export function addChartConfig(data) {
  return request({
    url: '/analysis/dataChartInfoConfigs',
    method: 'post',
    data: data
  });
}


/** ============================图表配置============================ */
// 数据图表配置树
export function getChartSettingTree() {
  return request({
    url: `/analysis/dataChartConfigs/tree`,
    method: 'get'
  });
}

// 新增图表配置
export function addChartSetting(data) {
  return request({
    url: '/analysis/dataChartConfigs',
    method: 'post',
    data: data
  });
}

// 修改图表配置
export function updateChartSetting(id, data) {
  return request({
    url: `/analysis/dataChartConfigs/${id}`,
    method: 'put',
    data: data
  });
}

// 获取图表配置信息
export function getChartSettingDetail(id) {
  return request({
    url: `/analysis/dataChartConfigs/${id}`,
    method: 'get'
  });
}

// 删除图表配置
export function delChartSetting(id) {
  return request({
    url: `/analysis/dataChartConfigs/${id}`,
    method: 'delete'
  });
}


/** ============================图表配置渲染============================ */
// 获取全部图表
export function getChartListAll() {
  return request({
    url: `/analysis/dataChartInfos/list`,
    method: 'get'
  });
}

// 根据图表Id获取数据图表配置
export function getChartSetting(chartId) {
  return request({
    url: '/analysis/dataChartConfigs/tree/chartId',
    method: 'get',
    params: {
      chartId
    }
  });
}
