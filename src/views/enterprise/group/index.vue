<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
        <el-form-item label="调度组名称" prop="disName">
          <el-input
            v-model="queryParams.disName"
            placeholder="请输入调度组名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="调度者姓名" prop="disUserName">
          <el-input
            v-model="queryParams.disUserName"
            placeholder="请输入调度者姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="调度者手机" prop="disUserPhone">
          <el-input
            v-model="queryParams.disUserPhone"
            placeholder="请输入调度者手机"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container">
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
            v-hasPermi="['assets:shipment:project:remove']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5" style="float: right;">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable :loading="loading" :data="infoList" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
        <template #isOften="{row}">
          <span>{{ selectDictLabel(isOftenOptions, row.isOften) }}</span>
        </template>
        <template #isNotInvoice="{row}">
          <span>{{ selectDictLabel(isNotInvoiceOptions, row.isNotInvoice) }}</span>
        </template>
        <template #edit="{row}">
          <el-button
            v-hasPermi="['assets:shipment:project:remove']"
            size="mini"
            type="text"
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
      <group-dialog
        ref="GroupDialog"
        :title="title"
        :open.sync="open"
        @refresh="getList"
      />
    </div>
  </div>
</template>

<script>
import { listInfo, delInfo, listInfoApi } from '@/api/enterprise/group';
import GroupDialog from './groupDialog';

export default {
  name: 'Group',
  components: {
    GroupDialog
  },
  props: {
  },

  data() {
    return {
      tableColumnsConfig: [],
      api: listInfoApi,
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
      // 调度组表格数据
      infoList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        disName: null,
        disUserName: null,
        disUserPhone: null
      },
      // 是否常用调度组
      isOftenOptions: [
        { 'dictLabel': '否', 'dictValue': '0' },
        { 'dictLabel': '是', 'dictValue': '1' }
      ],
      // 是否不开票打款
      isNotInvoiceOptions: [
        { 'dictLabel': '否', 'dictValue': '0' },
        { 'dictLabel': '是', 'dictValue': '1' }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },

  watch: {
    '$route.query.project': {
      handler(value) {
        if (value) {
          this.$nextTick(() => {
            this.handleAdd();
          });
        }
      },
      immediate: true
    }
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
  },
  methods: {
    /** 查询调度组列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
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
      this.names = selection.map(item => item.disName);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.GroupDialog.reset();
      this.open = true;
      this.title = '添加调度组';
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const names = row.disName || this.names;
      this.$confirm('是否确认删除调度组名称为"' + names + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delInfo(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    }
  }
};
</script>
