<template>
  <div class="device-info">
    <el-row :gutter="15">
      <el-col :xl="5" :lg="6" :md="8" :sm="9" :xs="24">
        <div class="device-info-left">
          <div class="head-container">
            <el-input
              v-model="typeName"
              placeholder="请输入设备类型"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              class="mb20"
            />
          </div>
          <div class="page-device-type-tree">
            <el-tree
              ref="tree"
              :data="deviceTreeOptions"
              :props="defaultTreeProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              :render-content="renderContent"
              :indent="0"
              default-expand-all
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </el-col>
      <el-col :xl="19" :lg="18" :md="16" :sm="15" :xs="24">
        <div class="device-info-right">
          <div v-show="showSearch" class="device-info-right-top">
            <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
              <el-form-item label="类型名称" prop="typeName">
                <el-input
                  v-model="queryParams.typeName"
                  placeholder="请输入类型名称"
                  clearable
                  size="small"
                  style="width: 200px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <!-- <el-form-item label="对象类型" prop="objectType">
                <el-select
                  v-model="queryParams.objectType"
                  clearable
                  filterable
                  size="small"
                  style="width: 200px"
                >
                  <el-option
                    v-for="dict in objectTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item> -->
              <!-- <el-form-item label="类型种类" prop="typeKind">
                <el-select
                  v-model="queryParams.typeKind"
                  clearable
                  filterable
                  size="small"
                  style="width: 200px"
                >
                  <el-option
                    v-for="dict in typeKindOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="device-info-right-bottom">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAdd"
                >新增</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="success"
                  icon="el-icon-edit"
                  size="mini"
                  :disabled="single"
                  @click="handleUpdate"
                >修改</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :disabled="multiple"
                  @click="handleDelete"
                >删除</el-button>
              </el-col>
              <!-- <el-col :span="1.5">
                <el-button
                  type="warning"
                  icon="el-icon-download"
                  size="mini"
                  :loading="exportLoading"
                  @click="handleExport"
                >导出</el-button>
              </el-col> -->
              <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
            </el-row>

            <el-table v-loading="loading" highlight-current-row border :data="deviceList" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="类型名称" align="center" prop="typeName" />
              <el-table-column label="类型标识" align="center" prop="typeKeys" />
              <!-- <el-table-column label="对象类型" align="center" prop="objectType" :formatter="objectTypeFormat" /> -->
              <!-- <el-table-column label="类型种类" align="center" prop="typeKind" :formatter="typeKindFormat" />-->
              <el-table-column label="备注" align="center" prop="typeRemark" />
              <el-table-column label="创建时间" align="center" prop="createTime">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" fixed="left" width="180">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleUpdate(scope.row)"
                  >修改</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleConfig(scope.row)"
                  >配置</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDelete(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改（列表）设备类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="86px">
        <el-form-item label="所属类型" prop="pcode">
          <treeselect
            v-model="form.pcode"
            :options="deviceTreeOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="请选择所属类型"
            :disabled="!!form.code"
          />
        </el-form-item>
        <el-form-item label="类型标识" prop="typeKeys">
          <el-input v-model="form.typeKeys" placeholder="请输入类型标识" :disabled="!!form.code" clearable />
        </el-form-item>
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入类型名称" clearable />
        </el-form-item>
        <!-- <el-form-item label="对象类型" prop="objectType">
          <el-select
            v-model="form.objectType"
            clearable
            filterable
            style="width: 100%"
            disabled
          >
            <el-option
              v-for="dict in objectTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item> -->
        <!--<el-form-item label="类型种类" prop="typeKind">
          <el-select
            v-model="form.typeKind"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="dict in typeKindOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>-->
        <el-form-item label="备注" prop="typeRemark">
          <el-input v-model="form.typeRemark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="类型照片" prop="typeImage">
          <upload-image v-model="form.typeImage" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改（树）设备类型对话框 -->
    <el-dialog :title="title" :visible.sync="treeOpen" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="treeForm" :model="treeForm" :rules="treeRules" label-width="86px">
        <el-form-item label="类型分类名称" prop="typeName">
          <el-input v-model="treeForm.typeName" placeholder="请输入类型目录（大类）" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="treeButtonLoading" @click="treeSubmitForm">确 定</el-button>
        <el-button @click="treeCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceTypeTree, getDeviceTypeList, delDriverType, addDeviceType, updateDeviceType, getDeviceTypeDetail } from '@/api/assets/device.js';
import UploadImage from '@/components/UploadImage/index';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'DeviceType',
  components: {
    UploadImage,
    Treeselect
  },
  data() {
    return {
      typeName: undefined,
      deviceTreeOptions: undefined,
      defaultTreeProps: {
        children: 'children',
        label: 'typeName'
      },
      normalizer(node) {
        return {
          id: node.code, // 键名转换，方法默认是label和children进行树状渲染
          label: node.typeName,
          children: node.children
        };
      },
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
        pcode: undefined,
        typeName: undefined,
        objectType: undefined,
        typeKind: undefined
      },
      exportLoading: false,
      // 对象类型字典
      objectTypeOptions: [
        { dictLabel: '模型目录', dictValue: 1 },
        { dictLabel: '模型实体', dictValue: 2 }
      ],
      // 类型种类字典
      typeKindOptions: [
        { dictLabel: '定位设备', dictValue: 1 }
      ],
      // 新增/编辑（列表）
      title: '',
      open: false,
      buttonLoading: false,
      form: {},
      rules: {
        pcode: [
          { required: true, message: '所属类型不能为空', trigger: 'change' }
        ],
        typeName: [
          { required: true, message: '设备类型名称不能为空', trigger: ['blur', 'change'] }
        ],
        typeKeys: [
          { required: true, message: '类型标识不能为空', trigger: ['blur', 'change'] }
        ]
      },
      // 新增/编辑（树）
      treeOpen: false,
      treeButtonLoading: false,
      treeForm: {},
      treeRules: {
        typeName: [
          { required: true, message: '设备类型名称不能为空', trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  watch: {
    typeName(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.getTree();
    this.getList();
  },
  methods: {
    /** 查询设备类型树 */
    getTree() {
      getDeviceTypeTree({}).then(response => {
        this.deviceTreeOptions = response.data;
      });
    },
    renderContent(h, { node, data, store }) {
      const className = 'tree-node-icon ' + data.icon;
      return (
        <span class='custom-tree-node'>
          <span class='custom-tree-text'><i class={className} style='margin-right: 4px' />{node.label}</span>
          <span class='custom-tree-button'>
            <el-button type='text' on-click={ (event) => this.appendTree(event, data) }><i class='el-icon-circle-plus-outline' /></el-button>
            <el-button type='text' on-click={ (event) => this.editTree(event, node, data) }><i class='el-icon-edit-outline' /></el-button>
            <el-button type='text' on-click={ (event) => this.removeTree(event, node, data) }><i class='el-icon-delete' /></el-button>
          </span>
        </span>
      );
    },
    appendTree(event, data) {
      this.treeReset();
      this.treeOpen = true;
      this.title = '添加设备类型';
      this.treeForm.pcode = data.code;
      event.stopPropagation();
    },
    editTree(event, node, data) {
      this.treeReset();
      getDeviceTypeDetail(data.code).then(response => {
        this.treeForm = response.data;
        this.treeOpen = true;
        this.title = '修改设备类型';
      });
      event.stopPropagation();
    },
    treeSubmitForm: function() {
      this.$refs['treeForm'].validate(valid => {
        if (valid) {
          this.treeButtonLoading = true;
          if (this.treeForm.code !== undefined) {
            updateDeviceType(this.treeForm).then(response => {
              this.treeButtonLoading = false;
              this.msgSuccess('修改成功');
              this.treeOpen = false;
              this.getTree();
            }).catch(() => {
              this.treeButtonLoading = false;
            });
          } else {
            addDeviceType(this.treeForm).then(response => {
              this.treeButtonLoading = false;
              this.msgSuccess('新增成功');
              this.treeOpen = false;
              this.getTree();
            }).catch(() => {
              this.treeButtonLoading = false;
            });
          }
        }
      });
    },
    treeCancel() {
      this.treeOpen = false;
      this.treeReset();
    },
    treeReset() {
      this.treeForm = {
        code: undefined,
        typeName: undefined,
        typeKind: undefined,
        typeKeys: undefined,
        typeRemark: undefined,
        typeImage: undefined,
        pcode: undefined,
        objectType: 1
      };
      this.resetForm('treeForm');
    },
    removeTree(event, node, data) {
      this.$confirm('此操作会删除该目录下的所有设备类型信息，是否确认删除目录名称为"' + data.typeName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDriverType(data.code);
      }).then(() => {
        this.getTree();
        this.getList();
        this.msgSuccess('删除成功');
      });
      event.stopPropagation();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.typeName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.queryParams.pcode = data.code;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 对象类型字典翻译
    objectTypeFormat(row, column) {
      return this.selectDictLabel(this.objectTypeOptions, row.objectType);
    },
    // 类型种类字典翻译
    typeKindFormat(row, column) {
      return this.selectDictLabel(this.typeKindOptions, row.typeKind);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.queryParams.pcode = undefined;
      this.handleQuery();
    },
    /** 获取列表数据 */
    getList() {
      this.loading = true;
      getDeviceTypeList(this.queryParams).then((response) => {
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.names = selection.map(item => item.typeName);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加设备类型';
      this.form.pcode = this.queryParams.pcode;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ids = row.code || this.ids;
      getDeviceTypeDetail(ids).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改设备类型';
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.code || this.ids;
      const names = row.typeName || this.names;
      this.$confirm('是否确认删除设备类型名称为"' + names + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDriverType(ids);
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
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.code !== undefined) {
            updateDeviceType(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addDeviceType(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        code: undefined,
        typeName: undefined,
        typeKind: undefined,
        typeKeys: undefined,
        typeRemark: undefined,
        typeImage: undefined,
        pcode: undefined,
        objectType: 2
      };
      this.resetForm('form');
    },
    /** 打开配置页 */
    handleConfig(row) {
      this.$router.push({
        path: '/device/type/config/' + row.code
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
    min-height: calc(100vh - 146px);
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

<style lang="scss">
// 树样式
.page-device-type-tree{
  .el-tree-node__content .custom-tree-node{
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    .custom-tree-button{
      display: none;
      padding-left: 10px;
      >button{
        padding: 5px;
        +.el-button{
          margin-left: 0;
        }
      }
    }
    &:hover{
      .custom-tree-button{
        display: block;
      }
    }
  }
}
</style>
