<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <!-- <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="网点编码" prop="branchCode">
        <el-input
          v-model="queryParams.branchCode"
          placeholder="请输入网点编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车队名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入车队名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="管理者" prop="teamLeader">
        <el-input
          v-model="queryParams.teamLeader"
          placeholder="请输入车队管理者"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="是否删除" prop="isDel">
        <el-input
          v-model="queryParams.isDel"
          placeholder="请输入是否删除"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="创建人" prop="createCode">
        <el-input
          v-model="queryParams.createCode"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改人" prop="updateCode">
        <el-input
          v-model="queryParams.updateCode"
          placeholder="请输入修改人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="编码" align="center" prop="code" /> -->
      <el-table-column label="网点编码" align="center" prop="branchCode" sortable />
      <el-table-column label="车队名称" align="center" prop="name" sortable />
      <el-table-column label="车队管理者" align="center" prop="teamLeader" sortable />
      <!-- <el-table-column label="是否删除" align="center" prop="isDel" /> -->
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <!-- <el-table-column label="创建人" align="center" prop="createCode" />
      <el-table-column label="修改人" align="center" prop="updateCode" /> -->
      <el-table-column label="营业执照" align="center" prop="businessLicenseImg" />
      <el-table-column label="道路运输经营许可证照" align="center" prop="transportPermitImage" />
      <el-table-column label="身份证正面照片" align="center" prop="identificationImage" />
      <el-table-column label="身份证国徽面" align="center" prop="identificationBackImage" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDEtail(scope.row)"
          >详情</el-button>
          <el-button
            v-hasPermi="['assets:team:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['assets:team:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
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

    <!-- 新增/修改/详情 对话框 -->
    <team-dialog ref="TeamDialog" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
  </div>
</template>

<script>
import { listInfo, getInfo, delInfo } from '@/api/assets/team';
import TeamDialog from './teamDialog';

export default {
  name: 'Team',
  components: {
	  TeamDialog
  },
  data() {
    return {
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
      // 【请填写功能名称】表格数据
      infoList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 车队名称字典
      // nameOptions: [],
      // 车队管理者字典
      // teamLeaderOptions: [],
      // 状态字典
      statusOptions: [
        { dictLabel: '启用', dictValue: '0' },
        { dictLabel: '禁用', dictValue: '1' }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        branchCode: null,
        name: null,
        teamLeader: null,
        status: null
      },
      // 表单参数
      form: {},
	  // 表单是否禁用
	  formDisable: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询调度者列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 车队名称字典翻译
    // nameFormat(row, column) {
    //   return this.selectDictLabel(this.nameOptions, row.name);
    // },
    // 车队管理者字典翻译
    // teamLeaderFormat(row, column) {
    //   return this.selectDictLabel(this.teamLeaderOptions, row.teamLeader);
    // },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
    handleDEtail(row) {
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
    }
  }
};
</script>
