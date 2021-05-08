<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
        <el-form-item label="调度者名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入调度者名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="管理者名称" prop="teamLeaderName">
          <el-input
            v-model="queryParams.teamLeaderName"
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
        <el-form-item label="手机号" prop="telphone">
          <el-input
            v-model="queryParams.telphone"
            placeholder="请输入手机号"
            clearable
            size="small"
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
        <el-form-item label="审核状态" prop="authStatus">
          <el-select
            v-model="queryParams.authStatus"
            filterable
            clearable
            size="small"
          >
            <el-option
              v-for="dict in authStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态" prop="applyStatus">
          <el-select v-model="queryParams.applyStatus" placeholder="请选择状态" filterable clearable size="small">
            <el-option
              v-for="dict in applyStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
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
            @click="handleDetail({}, 'edit')"
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
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
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
        <template #authStatus="{row}">
          <i v-show="row.authStatus === 0" class="el-icon-warning g-color-light-gray mr5" />
          <i v-show="row.authStatus === 1" class="g-icon-deal mr5" />
          <i v-show="row.authStatus === 2" class="el-icon-error g-color-error mr5" />
          <i v-show="row.authStatus === 3" class="el-icon-success g-color-success mr5" />
          <span>{{ selectDictLabel(authStatusOptions, row.authStatus) }}</span>
        </template>
        <template #authTime="{row}">
          <span>{{ parseTime(row.authTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #createTime="{row}">
          <span>{{ parseTime(row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
        <template #edit="{row}">
          <el-button
            v-hasPermi="['assets:team:manage']"
            size="mini"
            type="text"
            @click="handleManage(row)"
          >管理</el-button>
          <el-button
            v-hasPermi="['assets:team:get']"
            size="mini"
            type="text"
            @click="handleDetail(row, 'detail')"
          >详情</el-button>
          <el-button
            v-hasPermi="['assets:team:edit']"
            size="mini"
            type="text"
            @click="handleDetail(row, 'edit')"
          >修改</el-button>
          <TableDropdown>
            <el-dropdown-item>
              <el-button
                v-show="row.authStatus != 3"
                v-has-permi="['assets:team:examine']"
                size="mini"
                type="text"
                @click="handleDetail(row, 'review')"
              >审核</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                v-show="row.status == 0 && row.authStatus == 3"
                v-hasPermi="['assets:team:invitation']"
                size="mini"
                type="text"
                @click="handleAddDriver(row)"
              >邀请司机</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                v-show="row.apply && row.status == 0 && row.authStatus == 3"
                v-hasPermi="['assets:team:deal']"
                size="mini"
                type="text"
                @click="handleDeal(row)"
              >处理申请</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                v-hasPermi="['assets:team:remove']"
                size="mini"
                type="text"
                @click="handleDelete(row)"
              >删除</el-button>
            </el-dropdown-item>
          </TableDropdown>
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
      <manage-dialog ref="ManageDialog" :open.sync="manageDialogOpen" :team-code="teamCode" :team-name="teamName" />
      <!-- 邀请司机 对话框 -->
      <add-driver-dialog :open.sync="addDriverDialogOpen" :team-code="teamCode" />
      <!-- 处理申请 对话框 -->
      <apply-driver-dialog :open.sync="applyDriverDialogOpen" :team-code="teamCode" @refresh="getList" />
    </div>
  </div>
</template>

<script>
import { listTeamApi, listInfo, getInfo, delInfo } from '@/api/assets/team';
import TeamDialog from './teamDialog';
import ManageDialog from './manageDialog';
import AddDriverDialog from './addDriverDialog';
import applyDriverDialog from './applyDriverDialog';

export default {
  name: 'Team',
  components: {
	  TeamDialog,
    ManageDialog,
    AddDriverDialog,
    applyDriverDialog
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: listTeamApi,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      teamNames: [],
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
      addDriverDialogOpen: false,
      applyDriverDialogOpen: false,
      // 状态字典
      statusOptions: [
        { dictLabel: '启用', dictValue: '0' },
        { dictLabel: '禁用', dictValue: '1' }
      ],
      // 审核状态字典
      authStatusOptions: [
        { dictLabel: '未审核', dictValue: 0 },
        { dictLabel: '审核中', dictValue: 1 },
        { dictLabel: '审核未通过', dictValue: 2 },
        { dictLabel: '审核通过', dictValue: 3 }
      ],
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 处理状态字典
      applyStatusOptions: [
        { dictLabel: '未处理', dictValue: 0 },
        { dictLabel: '已加入', dictValue: 1 },
        { dictLabel: '已拒绝', dictValue: 2 },
        { dictLabel: '待加入', dictValue: 3 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isAsc: 'desc',
        orderByColumn: 't0.create_time',
        name: undefined,
        teamLeaderName: undefined,
        telphone: undefined,
        status: undefined,
        driverName: undefined,
        licenseNumber: undefined,
        applyStatus: undefined
      },
      // 表单参数
      form: {},
      // 表单是否禁用
      formDisable: false,
      // 调度者code
      teamCode: null,
      teamName: null,
      // 导出
      exportLoading: false
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listTeamApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'right'
    });
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
      this.teamNames = selection.map(item => item.name);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.TeamDialog.reset();
      this.open = true;
      this.title = '新增';
	    this.formDisable = false;
    },
    /** 修改/详情/审核按钮操作 */
    handleDetail(row, flag) {
      this.$refs.TeamDialog.reset();
      const id = row.id || this.ids;
      getInfo(id).then(response => {
        this.$refs.TeamDialog.setForm(response.data);
        this.open = true;
        switch (flag) {
          case 'detail':
            this.title = '详情';
            break;
          case 'edit':
            this.title = '编辑';
            break;
          case 'review':
            this.title = '审核';
            if (row.authStatus === 0) {
              this.$refs.TeamDialog.authRead();
            }
            break;
          default:
            break;
        }
        this.formDisable = flag !== 'edit';
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const teamNames = row.name || this.teamNames;
      this.$confirm('是否确认删除调度者名称为"' + teamNames + '"的数据项?', '警告', {
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
      this.exportLoading = true;
      const params = Object.assign({}, this.queryParams);
      params.pageSize = undefined;
      params.pageNum = undefined;
      this.download('assets/team/export', params, `调度者信息_${new Date().getTime()}.xlsx`).then(() => {
        this.exportLoading = false;
      });
    },
    /** 管理按钮操作 */
    handleManage(row) {
      this.teamCode = row.code;
      this.teamName = row.name;
      this.manageDialogOpen = true;
    },
    // 添加司机
    handleAddDriver(row) {
      this.teamCode = row.code;
      this.addDriverDialogOpen = true;
    },
    // 处理申请
    handleDeal(row) {
      this.teamCode = row.code;
      this.applyDriverDialogOpen = true;
    }
  }
};
</script>
