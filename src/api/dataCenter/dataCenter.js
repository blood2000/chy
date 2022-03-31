import request from '@/utils/request';

/** ============================数据集管理============================ */
// 获取数据集列表
export function getDataInfoList(query) {
  return request({
    url: `/analysis/dataSetInfos`,
    method: 'get',
    params: query
  });
}

// 新增数据集
export function addDataInfo(data) {
  return request({
    url: '/analysis/dataSetInfos',
    method: 'post',
    data: data
  });
}

// 修改数据集
export function updateDataInfo(id, data) {
  return request({
    url: `/analysis/dataSetInfos/${id}`,
    method: 'put',
    data: data
  });
}

// 获取数据集信息
export function getDataDetail(id) {
  return request({
    url: `/analysis/dataSetInfos/${id}`,
    method: 'get'
  });
}

// 删除数据集
export function delDataInfo(ids) {
  return request({
    url: `/analysis/dataSetInfos/${ids}`,
    method: 'delete'
  });
}

// 选择性更新数据集
export function patchDataInfo(id, data) {
  return request({
    url: `/analysis/dataSetInfos/${id}`,
    method: 'patch',
    data: data
  });
}

// 查询字典类型列表
export function dictTypeListAll() {
  return request({
    url: '/system/dict/type/list',
    method: 'get'
  });
}

// 复制数据集
export function copyDataInfo(data) {
  return request({
    url: '/analysis/dataSetInfos/copy',
    method: 'post',
    data: data
  });
}

/** ==============================数据项管理============================== */
// 根据数据项Id获取枚举类型
export function getCustomEnumById(id) {
  return request({
    url: `/analysis/dataItemInfos/getCustomEnum/${id}`,
    method: 'get'
  });
}

/** ============================数据集类型管理============================ */
// 数据集类型树
export function getDataTypeTree(query) {
  return request({
    url: '/analysis/dataSetTypes/select',
    method: 'get',
    params: query
  });
}

// 数据集类型表格树
export function getDataTypeTable(query) {
  return request({
    url: '/analysis/dataSetTypes/table',
    method: 'get',
    params: query
  });
}

// 新增数据集类型
export function addDataType(data) {
  return request({
    url: '/analysis/dataSetTypes',
    method: 'post',
    data: data
  });
}

// 修改数据集类型
export function updateDataType(id, data) {
  return request({
    url: `/analysis/dataSetTypes/${id}`,
    method: 'put',
    data: data
  });
}

// 获取数据集类型
export function getDataTypeDetail(id) {
  return request({
    url: `/analysis/dataSetTypes/${id}`,
    method: 'get'
  });
}

// 删除数据集类型
export function delDataType(ids) {
  return request({
    url: `/analysis/dataSetTypes/${ids}`,
    method: 'delete'
  });
}

// 选择性更新数据集类型
export function patchDataType(id, data) {
  return request({
    url: `/analysis/dataSetTypes/${id}`,
    method: 'patch',
    data: data
  });
}

/** ============================数据模型管理============================ */
// 数据集类型+数据集树
export function getDataTypeTreeAll() {
  return request({
    url: '/analysis/dataSetInfos/tree',
    method: 'get'
  });
}

// 统计
export function getDataModelStatistics() {
  return request({
    url: '/analysis/dataModelInfos/statistics',
    method: 'get'
  });
}

// 获取数据模型列表
export function getDataModelList() {
  return request({
    url: `/analysis/dataModelInfos/list`,
    method: 'get'
  });
}

// 新增数据模型
export function addDataModel(data) {
  return request({
    url: '/analysis/dataModelInfos',
    method: 'post',
    data: data
  });
}

// 修改数据模型
export function updateDataModel(id, data) {
  return request({
    url: `/analysis/dataModelInfos/${id}`,
    method: 'put',
    data: data
  });
}

// 获取数据集信息
export function getDataModel(id) {
  return request({
    url: `/analysis/dataModelInfos/get/${id}`,
    method: 'get'
  });
}

// 删除数据模型
export function delDataModel(ids) {
  return request({
    url: `/analysis/dataModelInfos/${ids}`,
    method: 'delete'
  });
}

// 模型查询
export function searchDataModel(data) {
  return request({
    url: '/analysis/dataModelInfos/query',
    method: 'post',
    data: data
  });
}

// 获取动态sql
export function showDataSql(data) {
  return request({
    url: '/analysis/dataModelInfos/showSql',
    method: 'post',
    data: data
  });
}

// 获取上级菜单
export function getParentMenuByMenuId(menuId, produceCode) {
  return request({
    url: `/system/menu/getParentMenuByMenuId/${menuId}/${produceCode}`,
    get: 'post'
  });
}

/** ============================数据操作============================ */
// 获取数据操作列表
export function getDataOperateList(query) {
  return request({
    url: `/analysis/dataOperates`,
    method: 'get',
    params: query
  });
}

// 新增数据操作
export function addDataOperate(data) {
  return request({
    url: '/analysis/dataOperates',
    method: 'post',
    data: data
  });
}

// 修改数据操作
export function updateDataOperate(id, data) {
  return request({
    url: `/analysis/dataOperates/${id}`,
    method: 'put',
    data: data
  });
}

// 获取数据操作信息
export function getDataOperate(id) {
  return request({
    url: `/analysis/dataOperates/detail`,
    method: 'get',
    params: {
      id
    }
  });
}

// 删除数据操作
export function delDataOperate(ids) {
  return request({
    url: `/analysis/dataOperates/${ids}`,
    method: 'delete'
  });
}

// 执行数据备份查询
export function runBackupSql(data) {
  return request({
    url: '/analysis/dataOperates/runBackupSql',
    method: 'post',
    data: data
  });
}

// 执行数据操作
export function runOperateSql(data) {
  return request({
    url: '/analysis/dataOperates/runOperateSql',
    method: 'post',
    data: data
  });
}

// 数据库下拉选项
export function getDataBasesList() {
  return request({
    url: `/analysis/dataBases/list`,
    method: 'get'
  });
}
