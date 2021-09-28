<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item v-show="!isShipment" label="下单用户" prop="orderClient">
          <el-input
            v-model.trim="queryParams.orderClient"
            placeholder="发货企业/操作人/手机号"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item v-show="!isShipment" label="发货企业" prop="deliveryCompany">
          <el-input
            v-model.trim="queryParams.deliveryCompany"
            placeholder="请输入发货企业"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="装货信息" prop="loadInfo">
          <el-input
            v-model.trim="queryParams.loadInfo"
            placeholder="装货地/装货电话/发货人"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="卸货信息" prop="receivedInfo">
          <el-input
            v-model.trim="queryParams.receivedInfo"
            placeholder="卸货地/卸货电话/卸货人"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="货源单号" prop="mainOrderNumber">
          <el-input
            v-model.trim="queryParams.mainOrderNumber"
            placeholder="请输入货源单号"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="接单日期"
          prop="receiveTime"
        >
          <el-date-picker
            v-model="receiveTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 230px"
            @change="datechoose"
          />
        </el-form-item>
        <el-form-item label="车牌号" prop="licenseNumber">
          <el-input
            v-model.trim="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="司机姓名" prop="driverName">
          <el-input
            v-model.trim="queryParams.driverName"
            placeholder="请输入司机姓名"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="司机电话" prop="driverPhone">
          <el-input
            v-model.trim="queryParams.driverPhone"
            placeholder="请输入司机电话"
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
        <el-form-item label="变更前状态" prop="beforeStatus">
          <el-select
            v-model="queryParams.beforeStatus"
            placeholder="请选择变更前状态"
            clearable
            filterable
            size="small"
            style="width: 230px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否删除" prop="isDel">
          <el-select
            v-model="queryParams.isDel"
            placeholder="请选择是否删除"
            clearable
            filterable
            size="small"
            style="width: 230px"
          >
            <el-option
              v-for="dict in isDelOptions"
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
            v-hasPermi="['transportation:waybill:manageListExport']"
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="loadingExport"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['transportation:waybillOper:invalidRejected']"
            :loading="logLoading"
            type="primary"
            icon="el-icon-wallet"
            size="mini"
            :disabled="multiple"
            @click="handleLogs"
          >批量驳回</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['transportation:waybillOper:delInvalid']"
            :loading="deleteLoading"
            type="primary"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDeletes"
          >批量确认删除</el-button>
        </el-col>
        <el-col :span="1.5" style="float: right;">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable :loading="loading" :data="nullifyList" :table-columns-config="tableColumnsConfig" :selectable="checkboxT" @selection-change="handleSelectionChange">
        <template #sourceType="{row}">
          <span>{{ selectDictLabel(sourceTypeOptions, row.sourceType) }}</span>
        </template>
        <template #invoiceStatus="{row}">
          <span>{{ selectDictLabel(invoiceStatusOptions, row.invoiceStatus) }}</span>
        </template>
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
        <template #beforeStatus="{row}">
          <span>{{ selectDictLabel(statusOptions, row.beforeStatus) }}</span>
        </template>
        <template #stowageStatus="{row}">
          <span>{{ selectDictLabel(stowageStatusOptions, row.stowageStatus) }}</span>
        </template>
        <template #goodsPrice="{row}">
          <span>{{ row.goodsPrice ? floor(row.goodsPrice) + ' 元/' + (selectDictLabel(stowageStatusOptions, row.stowageStatus)) :'-' }}</span>
        </template>
        <template #mileage="{row}">
          <span>{{ floor(row.mileage) }}</span>
        </template>
        <template #freightPrice="{row}">
          <span>{{ row.freightPrice ? floor(row.freightPrice) + ' 元/' + (selectDictLabel(stowageStatusOptions, row.stowageStatus)) :'-' }}</span>
        </template>
        <template #taxFee="{row}">
          <span>{{ floor(row.taxFee) }}</span>
        </template>
        <template #shipperCopeFee="{row}">
          <span>{{ floor(row.shipperCopeFee) }}</span>
        </template>
        <template #taxFreeFee="{row}">
          <span>{{ floor(row.taxFreeFee) }}</span>
        </template>
        <template #deliveryFeeDeserved="{row}">
          <span>{{ floor(row.deliveryFeeDeserved) }}</span>
        </template>
        <template #taxPayment="{row}">
          <span>{{ floor(row.taxPayment) }}</span>
        </template>
        <template #serviceFee="{row}">
          <span>{{ floor(row.serviceFee) }}</span>
        </template>
        <template #loadWeight="{row}">
          <span v-if="row.stowageStatus === '1'">{{ row.loadWeight || '0.000' }} 方</span>
          <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.loadWeight) || '0' }} 车</span>
          <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.loadWeight || '0.000' }} 吨</span>
        </template>
        <template #unloadWeight="{row}">
          <span v-if="row.stowageStatus === '1'">{{ row.unloadWeight || '0.000' }} 方</span>
          <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.unloadWeight) || '0' }} 车</span>
          <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.unloadWeight || '0.000' }} 吨</span>
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
            v-hasPermi="['waybill:nullify:detail']"
            size="mini"
            type="text"
            @click="handleWaybill(row)"
          >查看运单</el-button>
          <el-button
            v-if="row.unloadBeforeCancel !== 1 && row.isDel !== 1"
            v-hasPermi="['transportation:waybillOper:invalidRejected']"
            size="mini"
            type="text"
            @click="handleLog(row)"
          >驳回</el-button>
          <el-button
            v-if="row.unloadBeforeCancel !== 1 && row.isDel !== 1"
            v-hasPermi="['transportation:waybillOper:delInvalid']"
            size="mini"
            type="text"
            @click="handleDelete(row)"
          >确认删除</el-button>
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
  </div>

</template>

<script>
import { listNullify, invalidRejected, listNullifyApi, invalidDelete } from '@/api/waybill/nullify';
import DetailDialog from '../components/detailDialog';
import { getUserInfo } from '@/utils/auth';
// import tableColumnsConfig from './config';
import { pickerOptions } from '@/utils/dateRange';
export default {
  name: 'Nullify',
  components: {
    DetailDialog
  },
  data() {
    return {
      pickerOptions,
      tableColumnsConfig: [],
      api: listNullifyApi,
      // 遮罩层
      loading: false,
      deleteLoading: false,
      logLoading: false,
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
      // 是否卸货之前取消字典
      unloadBeforeCancelOptions: [
        { 'dictLabel': '否', 'dictValue': 0 },
        { 'dictLabel': '是', 'dictValue': 1 }
      ],
      // 是否删除
      isDelOptions: [
        { 'dictLabel': '否', 'dictValue': 0 },
        { 'dictLabel': '是', 'dictValue': 1 }
      ],
      // 配载方式字典
      stowageStatusOptions: [
        { 'dictLabel': '吨', 'dictValue': '0' },
        { 'dictLabel': '方', 'dictValue': '1' },
        { 'dictLabel': '车', 'dictValue': '2' }
      ],
      // 来源字典
      sourceTypeOptions: [
        { 'dictLabel': '承运码', 'dictValue': '1' },
        { 'dictLabel': '调度者指派', 'dictValue': '2' },
        { 'dictLabel': '自主接单', 'dictValue': '3' },
        { 'dictLabel': '后台指派', 'dictValue': '4' }
      ],
      // 回单确认状态 0未标记回单，1-已标记回单字典
      isWarningOptions: [
        { 'dictLabel': '正常', 'dictValue': 0 },
        { 'dictLabel': '异常', 'dictValue': 1 },
        { 'dictLabel': '取消', 'dictValue': 2 }
      ],
      // 运单状态字典
      'statusOptions': [
        { 'dictLabel': '未接单', 'dictValue': '0' },
        { 'dictLabel': '已接单', 'dictValue': '1' },
        { 'dictLabel': '已装货', 'dictValue': '2' },
        { 'dictLabel': '已签收(已卸货)', 'dictValue': '3' },
        { 'dictLabel': '已回单(收单复核)', 'dictValue': '4' },
        { 'dictLabel': '已核算', 'dictValue': '5' },
        { 'dictLabel': '已申请(打款)', 'dictValue': '6' },
        { 'dictLabel': '已打款', 'dictValue': '7' },
        // { 'dictLabel': '已申请开票', 'dictValue': '8' },
        // { 'dictLabel': '已开票', 'dictValue': '9' },
        { 'dictLabel': '已作废', 'dictValue': '10' },
        { 'dictLabel': '已核验', 'dictValue': '11' },
        { 'dictLabel': '已完成', 'dictValue': '12' }
      ],
      // 发票状态  0 未索取 / 8 已申请开票 / 9 已开票 /10 确认发票")
      'invoiceStatusOptions': [
        { 'dictLabel': '未索取', 'dictValue': '0' },
        { 'dictLabel': '已申请开票', 'dictValue': '8' },
        { 'dictLabel': '已开票', 'dictValue': '9' }
        // { 'dictLabel': '确认发票', 'dictValue': '10' }
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
        mainOrderNumber: null,
        startReceiveTime: null,
        endReceiveTime: null,
        licenseNumber: null,
        driverName: null,
        driverPhone: null,
        waybillNo: null,
        isDel: 0,
        beforeStatus: null
      },
      receiveTime: [],
      loadingExport: false,
      // 表单是否禁用
      formDisable: false,
      // 当前选中的运单id
      currentId: null,
      isAdmin: false,
      user: {},
      shipment: {},
      isShipment: false
    };
  },
  created() {
    const { isAdmin = false, isShipment = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.isShipment = isShipment;
    this.user = user;
    this.shipment = shipment;
    this.tableHeaderConfig(this.tableColumnsConfig, listNullifyApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'left'
    });
    this.getList();
  },
  methods: {
    checkboxT(row) {
      if (row.unloadBeforeCancel !== 1 && row.isDel !== 1) {
			  return true;
      } else {
			  return false;
      }
    },
    datechoose(date) {
      if (date) {
        this.queryParams.startReceiveTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.endReceiveTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.startReceiveTime = null;
        this.queryParams.endReceiveTime = null;
      }
    },
    /** 查询作废运单列表 */
    getList() {
      this.loading = true;
      const params = { ...this.queryParams };
      if (params.licenseNumber) {
        params.licenseNumber = params.licenseNumber.toUpperCase();
      }
      listNullify(params).then(response => {
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
      this.receiveTime = [];
      this.queryParams.startReceiveTime = null;
      this.queryParams.endReceiveTime = null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.wayBillCode);
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
    // 导出
    handleExport() {
      this.loadingExport = true;
      this.download('/transportation/waybill/manageListExport', { ...this.queryParams }, `作废运单`).then(res => {
        this.loadingExport = false;
      });
    },
    /** 驳回按钮操作 */
    handleLog(row) {
      this.$confirm('请确认驳回作废运单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('驳回点击');
        invalidRejected([row.wayBillCode]).then(response => {
          this.$message({
            type: 'success',
            message: '驳回成功'
          });
          this.getList();
        });
      }).catch(() => {

      });
    },
    // 确认删除按钮
    handleDelete(row) {
      this.$confirm('请确认删除作废运单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        invalidDelete([row.wayBillCode]).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getList();
        });
      }).catch(() => {

      });
    },
    /** 批量驳回按钮操作 */
    handleLogs() {
      this.$confirm('请确认批量驳回作废运单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logLoading = true;
        invalidRejected(this.ids).then(response => {
          this.$message({
            type: 'success',
            message: '批量驳回成功'
          });
          this.getList();
          this.logLoading = false;
        }).catch(() => { this.logLoading = false; });
      }).catch(() => {

      });
    },
    // 批量确认删除按钮
    handleDeletes() {
      this.$confirm('请确认批量删除作废运单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLoading = true;
        invalidDelete(this.ids).then(response => {
          this.$message({
            type: 'success',
            message: '批量删除成功'
          });
          this.getList();
          this.deleteLoading = false;
        }).catch(() => { this.deleteLoading = false; });
      }).catch(() => {

      });
    }
  }
};
</script>
