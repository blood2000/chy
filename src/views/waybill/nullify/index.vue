<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="130px">
      <el-form-item label="下单客户" prop="orderClient">
        <el-input
          v-model="queryParams.orderClient"
          placeholder="请输入下单客户"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发货企业" prop="deliveryCompany">
        <el-input
          v-model="queryParams.deliveryCompany"
          placeholder="请输入发货企业"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="装货信息" prop="loadInfo">
        <el-input
          v-model="queryParams.loadInfo"
          placeholder="装货地/装货电话/发货人"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货信息" prop="receivedInfo">
        <el-input
          v-model="queryParams.receivedInfo"
          placeholder="目的地/收货电话/收货人"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货源单号" prop="orderCode">
        <el-input
          v-model="queryParams.orderCode"
          placeholder="请输入货源单号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="接单日期"
        prop="receiveTime"
      >
        <el-date-picker
          v-model="queryParams.startReceiveTime"
          size="small"
          style="width: 113px"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="开始日期"
          :clearable="false"
        />
        -
        <el-date-picker
          v-model="queryParams.endReceiveTime"
          size="small"
          style="width: 113px"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="结束日期"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机姓名" prop="driverName">
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机电话" prop="driverPhone">
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入司机电话"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运输单号" prop="waybillNo">
        <el-input
          v-model="queryParams.waybillNo"
          placeholder="请输入运输单号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          filterable
          size="small"
          style="width: 240px"
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

    <RefactorTable :loading="loading" :data="nullifyList" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <template #isWarning="{row}">
        <span>{{ selectDictLabel(isWarningOptions, row.isWarning) }}</span>
      </template>
      <template #isChild="{row}">
        <span>{{ selectDictLabel(isChildOptions, row.isChild) }}</span>
      </template>
      <template #isSplit="{row}">
        <span>{{ selectDictLabel(isOptions, row.isSplit) }}</span>
      </template>
      <template #status="{row}">
        <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
      </template>
      <template #lastLoadingTime="{row}">
        <span>{{ parseTime(row.lastLoadingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #orderTime="{row}">
        <span>{{ parseTime(row.orderTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #receiveTime="{row}">
        <span>{{ parseTime(row.receiveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #wayBillUpdateTime="{row}">
        <span>{{ parseTime(row.wayBillUpdateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>

      <template #edit="{row}">
        <el-button
          v-hasPermi="['waybill:nullify:edit']"
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleWaybill(row)"
        >查看运单</el-button>
        <el-button
          v-hasPermi="['waybill:nullify:remove']"
          size="mini"
          type="text"
          icon="el-icon-document-remove"
          @click="handleLog(row)"
        >驳回</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
  </div>
</template>

<script>
import { listNullify, invalidRejected, listNullifyApi } from '@/api/waybill/nullify';
import DetailDialog from '../components/detailDialog';
import tableColumnsConfig from './config';

export default {
  name: 'Nullify',
  components: {
    DetailDialog
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
      // 作废运单表格数据
      nullifyList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openNullify: false,
      // 是否字典
      isOptions: [
        { 'dictLabel': '否', 'dictValue': false },
        { 'dictLabel': '是', 'dictValue': true }
      ],
      // 是否子单字典
      isChildOptions: [
        { 'dictLabel': '正常单', 'dictValue': 0 },
        { 'dictLabel': '子单', 'dictValue': 1 },
        { 'dictLabel': '超载的主单', 'dictValue': 1 }
      ],
      // 回单确认状态 0未标记回单，1-已标记回单字典
      isWarningOptions: [
        { 'dictLabel': '正常', 'dictValue': 0 },
        { 'dictLabel': '异常', 'dictValue': 1 },
        { 'dictLabel': '取消', 'dictValue': 2 }
      ],
      // 运单状态 0未接单/1已接单/2已签收/3已回单/4已结算/5已打款字典
      statusOptions: [
        { 'dictLabel': '未接单', 'dictValue': 0 },
        { 'dictLabel': '已接单', 'dictValue': 1 },
        { 'dictLabel': '已装货', 'dictValue': 2 },
        { 'dictLabel': '已签收', 'dictValue': 3 },
        { 'dictLabel': '已回单', 'dictValue': 4 },
        { 'dictLabel': '已结算', 'dictValue': 5 },
        { 'dictLabel': '已申请打款', 'dictValue': 6 },
        { 'dictLabel': '已打款', 'dictValue': 7 },
        { 'dictLabel': '已申请开票', 'dictValue': 8 },
        { 'dictLabel': '已开票', 'dictValue': 9 }
      ],
      // 查询参数
      queryParams: {
        isInvalid: 1,
        pageNum: 1,
        pageSize: 10,
        orderClient: null,
        deliveryCompany: null,
        loadInfo: null,
        receivedInfo: null,
        orderCode: null,
        startReceiveTime: null,
        endReceiveTime: null,
        licenseNumber: null,
        driverName: null,
        driverPhone: null,
        waybillNo: null,
        status: null
      },
      // 表单是否禁用
      formDisable: false,
      // 当前选中的运单id
      currentId: null
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, listNullifyApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'right'
    });
    this.getList();
  },
  methods: {
    /** 查询作废运单列表 */
    getList() {
      this.loading = true;
      listNullify(this.queryParams).then(response => {
        this.nullifyList = response.rows;
        this.total = response.total;
        console.log(this.nullifyList);
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
    /** 查看运单按钮操作 */
    handleWaybill(row) {
      this.$refs.DetailDialog.reset();
      this.currentId = row.wayBillCode;
      this.open = true;
      this.title = '运输单信息';
      this.formDisable = true;
    },
    /** 驳回按钮操作 */
    handleLog(row) {
      this.$confirm('请确认驳回此作废运单？', '提示信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('驳回点击');
        invalidRejected(row.wayBillCode).then(response => {
          this.$message({
            type: 'success',
            message: '驳回成功'
          });
          this.getList();
        });
      }).catch(() => {

      });
    }
  }
};
</script>
