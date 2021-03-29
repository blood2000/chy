<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="货源单号" prop="mainOrderNumber">
        <el-input
          v-model="queryParams.mainOrderNumber"
          placeholder="请输入货源单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运输单号" prop="waybillNo">
        <el-input
          v-model="queryParams.waybillNo"
          placeholder="请输入运输单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="司机电话" prop="driverPhone">
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入司机电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="处理状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择处理状态"
          clearable
          filterable
          size="small"
        >
          <el-option
            v-for="dict in statusOptions"
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
      <el-col :span="1.5" style="float: right;">
        <tablec-cascader v-model="tableColumnsConfig" />
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <RefactorTable :loading="loading" :data="complaintList" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <template #status="{row}">
        <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
      </template>
      <template #createTime="{row}">
        <span>{{ parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #updateTime="{row}">
        <span>{{ parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #edit="{row}">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleWaybill(row)"
        >详情</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit-outline"
          @click="handleLog(row)"
        >处理投诉</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 投诉处理 对话框 -->
    <complaint-dialog ref="ComplaintDialog" :title="title" :open.sync="openComplaint" :disable="formDisable" @refresh="getList" />
  </div>
</template>

<script>
import { listComplaint, listComplaintApi } from '@/api/waybill/complaint';
import ComplaintDialog from './complaintDialog';
// import tableColumnsConfig from './config';

export default {
  name: 'Complaint',
  components: {
    ComplaintDialog
  },
  data() {
    return {
      tableColumnsConfig: [],
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
      // 运输异常表格数据
      complaintList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      openComplaint: false,
      // 异常标记状态  0正常，1异常，2取消字典
      statusOptions: [
        { 'dictLabel': '待处理', 'dictValue': '0' },
        { 'dictLabel': '处理中', 'dictValue': '1' },
        { 'dictLabel': '已处理', 'dictValue': '2' }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mainOrderNumber: null,
        waybillNo: null,
        driverName: null,
        driverPhone: null,
        status: null
      },
      // 表单是否禁用
      formDisable: false,
      // 当前选中的运单id
      currentId: null
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listComplaintApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'right'
    });
    this.getList();
  },
  methods: {
    // 异常标记状态字典翻译
    isWarningFormat(row, column) {
      return this.selectDictLabel(this.isWarningOptions, row.isWarning);
    },
    /** 查询运输异常列表 */
    getList() {
      this.loading = true;
      listComplaint(this.queryParams).then(response => {
        this.complaintList = response.rows;
        this.total = response.total;
        this.loading = false;
        console.log(this.complaintList);
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
      this.ids = selection.map(item => item.waybillCode);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 查看投诉详情按钮操作 */
    handleWaybill(row) {
      this.$refs.ComplaintDialog.reset();
      this.$refs.ComplaintDialog.setForm(JSON.parse(JSON.stringify(row))); // 深拷贝，断开弹窗联系：JSON.parse(JSON.stringify(data))
      this.openComplaint = true;
      this.title = '司机投诉详情';
      this.formDisable = true;
    },
    /** 处理投诉按钮操作 */
    handleLog(row) {
      this.$refs.ComplaintDialog.reset();
      this.$refs.ComplaintDialog.setForm(JSON.parse(JSON.stringify(row))); // 深拷贝，断开弹窗联系
      this.openComplaint = true;
      this.formDisable = false;
      this.title = '处理投诉';
    }
  }
};
</script>
