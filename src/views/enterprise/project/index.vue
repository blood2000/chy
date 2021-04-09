<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品类别" prop="commodityCategoryCode">
        <el-select
          v-model="queryParams.commodityCategoryCode"
          placeholder="请选择商品类别"
          clearable
          filterable
          size="small"
        >
          <el-option
            v-for="dict in commodityCategoryCodeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:shipment:project:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:shipment:project:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:shipment:project:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
     <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['enterprise:project:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>-->
      <el-col :span="1.5" style="float: right;">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <RefactorTable :loading="loading" :data="infoList" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
      <template #commodityCategoryCode="{row}">
        <span>{{ selectDictLabel(commodityCategoryCodeOptions, row.commodityCategoryCode) }}</span>
      </template>

      <template #edit="{row}">
        <el-button
          v-hasPermi="['assets:shipment:project:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(row)"
        >修改</el-button>
        <el-button
          v-hasPermi="['assets:shipment:project:remove']"
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(row)"
        >删除</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 新增/修改/详情 对话框 -->
    <project-dialog
      ref="ProjectDialog"
      :title="title"
      :open.sync="open"
      :shipment-code="shipmentCode"
      @refresh="getList"
    />
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo, listInfoApi } from '@/api/enterprise/project';
import ProjectDialog from './projectDialog';

export default {
  name: 'Project',
  components: {
    ProjectDialog
  },
  props: {
    shipmentCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: listInfoApi,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 项目表格数据
      infoList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 项目名称字典
      projectNameOptions: [],
      // 商品类别编码字典
      commodityCategoryCodeOptions: [],
      // 商品小类字典
      // commoditySubclassCodesOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // code: null,
        // shipmentCode: null,
        projectName: null,
        commodityCategoryCode: null
        // commoditySubclassCodes: null,
        // projectRemark: null,
        // createCode: null,
        // updateCode: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 表单是否禁用
      // formDisable: false
      // 大类字典类型
      commodityCategory: {
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      // 小类字典类型
      commoditySubclass: {
        'dictPid': '',
        'dictType': 'goodsType'
      }
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listInfoApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'right'
    });
    this.getList();
    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
  },
  methods: {
    /** 查询项目列表 */
    getList() {
      this.loading = true;
      if (this.shipmentCode) {
        this.queryParams.shipmentCode = this.shipmentCode;
      }
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 商品类别编码字典翻译
    commodityCategoryCodeFormat(row, column) {
      return this.selectDictLabel(this.commodityCategoryCodeOptions, row.commodityCategoryCode);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.ProjectDialog.reset();
      this.open = true;
      this.title = '添加项目';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.ProjectDialog.reset();
      const id = row.id || this.ids;
      getInfo(id).then(response => {
        this.$refs.ProjectDialog.setForm(response.data);
        this.open = true;
        this.title = '修改项目';
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除项目编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delInfo(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/info/export', {
        ...this.queryParams
      }, `system_info.xlsx`);
    }
  }
};
</script>
