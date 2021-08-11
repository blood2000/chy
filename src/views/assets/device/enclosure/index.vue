<template>
  <div class="device-info">
    <el-row :gutter="15">
      <el-col :xl="5" :lg="6" :md="8" :sm="9" :xs="24">
        <div class="device-info-left">
          <div class="head-container">
            <el-input
              v-model="deviceName"
              placeholder="请输入设备名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              class="mb20"
            />
          </div>
          <div class="head-container el-tree-scroll-container">
            <el-tree
              ref="tree"
              :data="deviceTreeOptions"
              :props="defaultTreeProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              :indent="0"
              default-expand-all
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <i class="tree-node-icon" :class="data.icon" />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :xl="19" :lg="18" :md="16" :sm="15" :xs="24">
        <div class="device-info-right">
          <div v-show="showSearch" class="device-info-right-top">
            <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
              <el-form-item label="设备名称" prop="deviceName">
                <el-input
                  v-model="queryParams.deviceName"
                  placeholder="请输入设备名称"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="device-info-right-bottom" style="height: calc(100vh - 240px)">
            <MapBox />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MapBox from './map.vue';
export default {
  name: 'Enclosure',
  components: {
    MapBox
  },
  data() {
    return {
      deviceName: undefined,
      deviceTreeOptions: undefined,
      defaultTreeProps: {
        children: 'children',
        label: 'label'
      },
      currentDeviceCode: undefined,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      names: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      deviceList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceName: undefined
      },
      exportLoading: false
      // 地图

    };
  },
  watch: {
    deviceName(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.currentDeviceCode = data.code;
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.currentDeviceCode = undefined;
      this.handleQuery();
    },
    /** 获取列表数据 */
    getList() {
      this.loading = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId);
      this.names = selection.map(item => item.roleName);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加设备';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // const roleId = row.roleId || this.ids;
      this.open = true;
      this.title = '修改设备';
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      // const roleIds = row.roleId || this.ids;
      const names = row.roleName || this.names;
      this.$confirm('是否确认删除设备名称为"' + names + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        //
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportLoading = true;
      const params = Object.assign({}, this.queryParams);
      params.pageSize = undefined;
      params.pageNum = undefined;
      this.download('', params, `设备信息`).then(() => {
        this.exportLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.device-info{
  margin: 0 15px;
  @mixin box-shadow{
    margin: 0 0 15px;
    padding: 20px;
    background: #fff;
    box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
    border-radius: 3px;
  }

  .device-info-left{
    @include box-shadow;

  }

  .device-info-right{
    .device-info-right-top{
      @include box-shadow;
      padding-bottom: 8px;
    }
    .device-info-right-bottom{
      @include box-shadow;
    }
  }
}
</style>
