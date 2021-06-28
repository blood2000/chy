<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item label="货源单号" prop="orderCode">
          <el-input
            v-model.trim="queryParams.orderCode"
            placeholder="请输入货源单号"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="运输单号" prop="waybillNo">
          <el-input
            v-model.trim="queryParams.waybillNo"
            placeholder="请输入运输单号"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="异常状态" prop="isWarning">
          <el-select
            v-model="queryParams.isWarning"
            placeholder="请选择异常标记状态"
            clearable
            filterable
            size="small"
            style="width: 230px"
          >
            <el-option
              v-for="dict in isWarningOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运输司机" prop="driverName">
          <el-input
            v-model.trim="queryParams.driverName"
            placeholder="请输入运输司机"
            clearable
            size="small"
            style="width: 230px"
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
        <el-col :span="1.5" style="float: right;">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable :loading="loading" :data="abnormalList" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
        <template #isWarning="{row}">
          <span>{{ selectDictLabel(isWarningOptions, row.isWarning) }}</span>
        </template>
        <template #createTime="{row}">
          <span>{{ parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #updateTime="{row}">
          <span>{{ parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #edit="{row}">
          <el-button
            v-if="row.isWarning === '1'"
            v-hasPermi="['transportation:waybillAbnormal:handle']"
            size="mini"
            type="text"
            @click="handleAbnormal(row)"
          >处理异常</el-button>
          <el-button
            v-hasPermi="['transportation:waybillAbnormal:orders']"
            size="mini"
            type="text"
            @click="handleWaybill(row)"
          >查看运单</el-button>
          <el-button
            v-hasPermi="['transportation:waybillAbnormal:logs']"
            size="mini"
            type="text"
            @click="handleLog(row)"
          >查看日志</el-button>
        </template>
      </RefactorTable>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
    <!-- 运单异常 对话框 -->
    <abnormal-dialog ref="AbnormalDialog" :title="title" :open.sync="openAbnormal" :disable="formDisable" @refresh="getList" />
    <!-- 处理异常 对话框 -->
    <handle-dialog ref="HandleDialog" :title="title" :open.sync="openHandle" :disable="formDisable" @refresh="getList" />
  </div>
</template>

<script>
import { listAbnormal, getAbnormal, listAbnormalApi } from '@/api/waybill/abnormal';
import DetailDialog from '../components/detailDialog';
import AbnormalDialog from './abnormalDialog';
import HandleDialog from './handleDialog';
// import tableColumnsConfig from './config';

export default {
  name: 'Abnormal',
  components: {
    DetailDialog,
    AbnormalDialog,
    HandleDialog
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: listAbnormalApi,
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
      abnormalList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openAbnormal: false,
      openHandle: false,
      // 异常标记状态  0正常，1异常，2取消字典
      isWarningOptions: [
        { 'dictLabel': '正常', 'dictValue': '0' },
        { 'dictLabel': '异常', 'dictValue': '1' },
        { 'dictLabel': '取消', 'dictValue': '2' }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverName: null,
        waybillNo: null,
        isWarning: null,
        orderCode: null
      },
      // 表单是否禁用
      formDisable: false,
      // 当前选中的运单id
      currentId: null
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listAbnormalApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 240,
      fixed: 'left'
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
      listAbnormal(this.queryParams).then(response => {
        this.abnormalList = response.data;
        this.total = response.data.length;
        console.log(this.abnormalList);
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
      this.ids = selection.map(item => item.waybillCode);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 处理异常按钮操作 */
    handleAbnormal(row) {
      this.$refs.HandleDialog.reset();
      this.openHandle = true;
      this.title = '处理异常';
      this.formDisable = false;
      this.$refs.HandleDialog.setForm(row);
    },
    /** 查看运单按钮操作 */
    handleWaybill(row) {
      this.$refs.DetailDialog.reset();
      this.currentId = row.waybillCode;
      this.open = true;
      this.title = '运输单信息';
      this.formDisable = true;
    },
    /** 查看日志按钮操作 */
    handleLog(row) {
      this.$refs.AbnormalDialog.reset();
      getAbnormal(row.code).then((response) => {
        console.log(response);
        this.$refs.AbnormalDialog.setForm(response.data);
        this.openAbnormal = true;
        this.title = '查看日志';
        this.formDisable = true;
      });
    }
  }
};
</script>
