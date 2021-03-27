<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="调度者名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入调度者名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="管理者名称" prop="teamLeader">
        <el-input
          v-model="queryParams.teamLeader"
          placeholder="请输入管理者名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" filterable clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="司机姓名" prop="driverName">
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号码" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:team:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:team:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:team:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['assets:team:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" />
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <RefactorTable :loading="loading" :data="infoList" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
      <template #status="{row}">
        <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
      </template>
      <template #isDistribution="{row}">
        <span>{{ selectDictLabel(isOptions, row.isDistribution) }}</span>
      </template>
      <template #edit="{row}">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-setting"
          @click="handleManage(row)"
        >管理</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleDetail(row)"
        >详情</el-button>
        <el-button
          v-hasPermi="['assets:team:edit']"
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(row)"
        >修改</el-button>
        <el-button
          v-hasPermi="['assets:team:remove']"
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
    <team-dialog ref="TeamDialog" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />

    <!-- 管理 对话框 -->
    <manage-dialog ref="ManageDialog" :open.sync="manageDialogOpen" :team-code="teamCode" />
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo } from '@/api/assets/team';
import TeamDialog from './teamDialog';
import ManageDialog from './manageDialog.vue';
import tableColumnsConfig from './config.js';

export default {
  name: 'Team',
  components: {
	  TeamDialog,
    ManageDialog
  },
  data() {
    return {
      tableColumnsConfig,
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
      // 调度者表格数据
      infoList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      manageDialogOpen: false,
      // 状态字典
      statusOptions: [
        { dictLabel: '启用', dictValue: '0' },
        { dictLabel: '禁用', dictValue: '1' }
      ],
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        branchCode: null,
        name: null,
        teamLeader: null,
        status: null,
        driverName: null,
        licenseNumber: null
      },
      // 表单参数
      form: {},
      // 表单是否禁用
      formDisable: false,
      // 调度者code
      teamCode: null
    };
  },
  created() {
    this.tableHeaderConfig();
    this.getList();
  },
  methods: {
    /** 配置表头 */
    tableHeaderConfig() {
      this.tableColumnsConfig = this.getLocalStorage(this.$route.name) || this.tableColumnsConfig;
    },
    /** 查询调度者列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
      this.$refs.TeamDialog.reset();
      this.open = true;
      this.title = '添加调度者';
	    this.formDisable = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.TeamDialog.reset();
      const id = row.id || this.ids;
      getInfo(id).then(response => {
        this.$refs.TeamDialog.setForm(response.data);
        this.open = true;
        this.title = '修改调度者';
        this.formDisable = false;
      });
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.$refs.TeamDialog.reset();
      const id = row.id || this.ids;
      getInfo(id).then(response => {
        this.$refs.TeamDialog.setForm(response.data);
        this.open = true;
        this.title = '详情';
        this.formDisable = true;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除调度者编号为"' + ids + '"的数据项?', '警告', {
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
      this.download('assets/team/export', {
        ...this.queryParams
      }, `assets_${new Date().getTime()}.xlsx`);
    },
    /** 管理按钮操作 */
    handleManage(row) {
      this.teamCode = row.code;
      this.manageDialogOpen = true;
    }
  }
};
</script>
