<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item label="稽核来源" prop="checkSourceType">
          <el-select
            v-model="queryParams.checkSourceType"
            placeholder="请选择稽核来源"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in checkSourceTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="!isShipment" label="发货企业" prop="deliveryCompany">
          <el-input
            v-model.trim="queryParams.deliveryCompany"
            placeholder="请输入发货企业"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="装货信息" prop="loadInfo">
          <el-input
            v-model.trim="queryParams.loadInfo"
            placeholder="装货地/装货电话/发货人"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="卸货信息" prop="receivedInfo">
          <el-input
            v-model.trim="queryParams.receivedInfo"
            placeholder="卸货地/卸货电话/卸货人"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="货源单号" prop="mainOrderNumber">
          <el-input
            v-model.trim="queryParams.mainOrderNumber"
            placeholder="请输入货源单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="运输单号" prop="waybillNo">
          <el-input
            v-model.trim="queryParams.waybillNo"
            placeholder="请输入运输单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="车牌号" prop="licenseNumber">
          <el-input
            v-model.trim="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="司机信息" prop="driverName">
          <el-input
            v-model.trim="queryParams.driverName"
            placeholder="请输入司机姓名/电话"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="运单状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择运单状态"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发票状态" prop="invoiceStatus">
          <el-select
            v-model="queryParams.invoiceStatus"
            placeholder="请选择运单状态"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in invoiceStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="轨迹情况" prop="track">
          <el-select
            v-model="queryParams.track"
            placeholder="请选择轨迹情况"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in trackOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="接单日期"
          prop="receiveTime"
        >
          <el-date-picker
            v-model="receiveTime"
            type="datetimerange"
            unlink-panels
            :picker-options="pickerTimeOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            :default-time="defaultTime"
            @change="datechoose"
          />
        </el-form-item>
        <el-form-item
          label="装货日期"
          prop="loadTime"
        >
          <el-date-picker
            v-model="loadTime"
            type="datetimerange"
            unlink-panels
            :picker-options="pickerTimeOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            :default-time="defaultTime"
            @change="loadDateChoose"
          />
        </el-form-item>
        <el-form-item
          label="卸货日期"
          prop="unloadTime"
        >
          <el-date-picker
            v-model="unloadTime"
            type="datetimerange"
            unlink-panels
            :picker-options="pickerTimeOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            :default-time="defaultTime"
            @change="unloadDateChoose"
          />
        </el-form-item>
        <el-form-item
          label="来源"
          prop="sourceType"
        >
          <el-select
            v-model="queryParams.sourceType"
            placeholder="请选择来源"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in sourceTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >搜索</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['transportation:waybillInspect:inspectListExport']"
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="loadingExport"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :loading="loadingExport"
            @click="handleBatchMark(999)"
          >批量标记正常</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-document-delete"
            size="mini"
            :loading="loadingExport"
            @click="handleBatchMark(-1)"
          >批量标记异常</el-button>
        </el-col>
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <!-- table -->
      <RefactorTable :loading="loading" :data="managesList" :table-columns-config="tableColumnsConfig" :height="height" @selection-change="handleSelectionChange">
        <template #status="{row}">
          <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
        </template>
        <!-- <template #trackSituation="{row}">
          <span>{{ selectDictLabel(trackOptions, row.trackSituation) }}</span>
        </template> -->
        <!-- <template #receiptSituation="{row}">
          <span v-if="row.receiptSituation">{{ row.receiptSituation.split(',').map(res => { return selectDictLabel(receiptSituationOptions, res)}).join('，') }}</span>
        </template> -->
        <!-- <template #loadUnloadSituation="{row}">
          <span v-if="row.loadUnloadSituation">{{ row.loadUnloadSituation.split(',').map(res => { return selectDictLabel(loadUnloadSituationOptions, res)}).join('，') }}</span>
        </template> -->
        <template #beforeStatus="{row}">
          <span>{{ selectDictLabel(statusOptions, row.beforeStatus) }}</span>
        </template>
        <template #invoiceStatus="{row}">
          <span>{{ selectDictLabel(invoiceStatusOptions, row.invoiceStatus) }}</span>
        </template>
        <template #stowageStatus="{row}">
          <span>{{ selectDictLabel(stowageStatusOptions, row.stowageStatus) }}</span>
        </template>
        <template #sourceType="{row}">
          <span>{{ selectDictLabel(sourceTypeOptions, row.sourceType) }}</span>
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
        <template #freightPriceDriver="{row}">
          <span>{{ row.freightPriceDriver ? floor(row.freightPriceDriver) + ' 元/' + (selectDictLabel(stowageStatusOptions, row.stowageStatus)) :'-' }}</span>
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
        <template #deliveryFeePractical="{row}">
          <span>{{ floor(row.deliveryFeePractical) }}</span>
        </template>
        <template #lossDeductionFee="{row}">
          <span>{{ floor(row.lossDeductionFee) }}</span>
        </template>
        <template #m0Fee="{row}">
          <span>{{ floor(row.m0Fee) }}</span>
        </template>
        <template #driverAddFee="{row}">
          <span>{{ floor(row.driverAddFee) }}</span>
        </template>
        <template #driverReductionFee="{row}">
          <span>{{ floor(row.driverReductionFee) }}</span>
        </template>
        <!-- <template #isChild="{row}">
          <span>{{ selectDictLabel(isChildOptions, row.isChild) }}</span>
        </template> -->
        <template #isWarning="{row}">
          <span>{{ selectDictLabel(isWarningOptions, row.isWarning) }}</span>
        </template>
        <template #loadWeight="{row}">
          <span v-if="row.loadWeight">
            <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.loadWeight }} 吨</span>
            <span v-if="row.stowageStatus === '1'">{{ row.loadWeight }} 方</span>
            <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.loadWeight) }} 车</span>
          </span>
        </template>
        <template #unloadWeight="{row}">
          <span v-if="row.unloadWeight">
            <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.unloadWeight }} 吨</span>
            <span v-if="row.stowageStatus === '1'">{{ row.unloadWeight }} 方</span>
            <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.unloadWeight) }} 车</span>
          </span>
        </template>
        <template #weight="{row}">
          <span v-if="row.weight">
            <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.weight }} 吨</span>
            <span v-if="row.stowageStatus === '1'">{{ row.weight }} 方</span>
            <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.weight) }} 车</span>
          </span>
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
            size="mini"
            type="text"
            @click="handleUpdate(row)"
          >
            详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleMark(row, -1)"
          >
            标记异常
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleMark(row, 999)"
          >
            标记正常
          </el-button>
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
    <!-- 详情对话框 -->
    <audit-detail
      :title="title"
      :open.sync="open"
      :current-id="currentId"
      :disable="formDisable"
      :current-row="currentRow"
      @refresh="getList"
    />
  </div>
</template>

<script>
import { listManagesApi, listManages, waybillInspectSave } from '@/api/waybill/audit';
import AuditDetail from './AuditDetail.vue';
import { getUserInfo } from '@/utils/auth';
import { pickerTimeOptions } from '@/utils/dateRange';

export default {
  name: 'Audit',
  components: {
    AuditDetail
  },
  data() {
    return {
      defaultTime: ['00:00:00', '23:59:59'], // '00:00:00', '23:59:59'
      pickerTimeOptions,
      receiveTime: [],
      loadTime: [],
      unloadTime: [],
      markTime: [],
      tableColumnsConfig: [],
      api: listManagesApi,
      // 遮罩层
      'loading': true,
      // 选中数组
      'ids': [],
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'managesList': [],
      // 弹出层标题
      'title': '',
      // 是否显示弹出层
      'open': false,
      'openMarkAbanormal': false,
      'openSeperateList': false,
      'openRemark': false,
      // 是否字典
      'isOptions': [
        { 'dictLabel': '否', 'dictValue': 0 },
        { 'dictLabel': '是', 'dictValue': 1 }
      ],
      // 回单确认状态字典
      'isReturnOptions': [
        { 'dictLabel': '未标记回单', 'dictValue': 0 },
        { 'dictLabel': '已标记回单', 'dictValue': 1 }
      ],
      // 异常标记状态字典
      'isWarningOptions': [
        { 'dictLabel': '正常', 'dictValue': 0 },
        { 'dictLabel': '异常', 'dictValue': 1 },
        { 'dictLabel': '取消', 'dictValue': 2 }
      ],
      // 是否子单字典
      'isChildOptions': [
        { 'dictLabel': '否', 'dictValue': 0 },
        // { 'dictLabel': '子单', 'dictValue': 1 },
        { 'dictLabel': '是', 'dictValue': 2 }
      ],
      // 给超载的子单排序用字典
      'childSortOptions': [
        { 'dictLabel': '车辆核载装货数量的子单', 'dictValue': 1 },
        { 'dictLabel': '其余重量子单', 'dictValue': 2 }
      ],
      // 运单状态字典
      'statusOptions': [
        // { 'dictLabel': '未接单', 'dictValue': '0' },
        // { 'dictLabel': '已接单', 'dictValue': '1' },
        // { 'dictLabel': '已装货', 'dictValue': '2' },
        // { 'dictLabel': '已签收(已卸货)', 'dictValue': '3' },
        { 'dictLabel': '已回单(收单复核)', 'dictValue': '4' },
        { 'dictLabel': '已核算', 'dictValue': '5' },
        { 'dictLabel': '已申请(打款)', 'dictValue': '6' },
        { 'dictLabel': '已打款', 'dictValue': '7' },
        // { 'dictLabel': '已申请开票', 'dictValue': '8' },
        // { 'dictLabel': '已开票', 'dictValue': '9' },
        // { 'dictLabel': '已作废', 'dictValue': '10' },
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


      // 配载方式字典
      stowageStatusOptions: [
        { 'dictLabel': '吨', 'dictValue': '0' },
        { 'dictLabel': '方', 'dictValue': '1' },
        { 'dictLabel': '车', 'dictValue': '2' }
      ],
      // 来源字典
      sourceTypeOptions: [
        { 'dictLabel': 'HZZD', 'dictValue': '1' },
        { 'dictLabel': 'FM', 'dictValue': '2' },
        { 'dictLabel': 'ZZJD', 'dictValue': '3' },
        { 'dictLabel': 'HTZP', 'dictValue': '4' },
        { 'dictLabel': 'WLPZ', 'dictValue': '5' },
        { 'dictLabel': 'JYZ', 'dictValue': '6' }
      ],
      // 稽核来源
      checkSourceTypeOptions: [
        { 'dictLabel': '自动', 'dictValue': '1' },
        { 'dictLabel': '手动', 'dictValue': '2' }
      ],
      // 轨迹稽核情况
      trackOptions: [],
      receiptSituationOptions: [],
      loadUnloadSituationOptions: [],
      // 司机取消订单字典
      'cancelStatusOptions': [
        { 'dictLabel': '正常', 'dictValue': 0 },
        { 'dictLabel': '司机撤单申请', 'dictValue': 1 },
        { 'dictLabel': '货主同意撤销', 'dictValue': 2 },
        { 'dictLabel': '货主拒绝撤销', 'dictValue': 3 }
      ],
      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'isAbnormal': 0,
        'isInvalid': 0,
        'isChildList': [0, 2],
        'orderClient': null,
        'deliveryCompany': null,
        'loadInfo': null,
        'receivedInfo': null,
        'startReceiveTime': null,
        'endReceiveTime': null,
        'startLoadTime': null,
        'endLoadTime': null,
        'startUnLoadTime': null,
        'endUnLoadTime': null,
        'startMarkTime': null,
        'endMarkTime': null,
        'mainOrderNumber': null,
        'waybillNo': null,
        'licenseNumber': null,
        'driverName': null,
        'driverPhone': null,
        'status': null,
        'invoiceStatus': null,
        'teamName': null
      },
      height: undefined,
      // 表单参数
      'form': {},
      // 表单校验
      'rules': {},
      'formDisable': false,
      // 当前选中的运单id
      'currentId': null,
      'currentRow': null,
      loadingExport: false,
      isAdmin: false,
      user: {},
      shipment: {},
      isShipment: false
    };
  },
  created() {
    console.log(1111111);
    const { isAdmin = false, isShipment = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.isShipment = isShipment;
    this.user = user;
    this.shipment = shipment;
    this.tableHeaderConfig(this.tableColumnsConfig, listManagesApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'left'
    });
    // 稽核情况字典获取
    this.getDicts('situation_track').then(response => {
      this.trackOptions = response.data;
    });
    this.getDicts('situation_load_unload').then(response => {
      this.loadUnloadSituationOptions = response.data;
    });
    this.getDicts('situation_receipt').then(response => {
      this.receiptSituationOptions = response.data;
    });
    this.queryParams.startReceiveTime = this.parseTime(new Date().getTime() - 24 * 60 * 60 * 1000 * 2, '{y}-{m}-{d} {h}:{i}:{s}');
    this.queryParams.endReceiveTime = this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
    this.receiveTime = [new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30), new Date()];
    this.getList();
  },
  methods: {
    datechoose(date) {
      if (date) {
        this.queryParams.startReceiveTime = this.parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
        this.queryParams.endReceiveTime = this.parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
      } else {
        this.queryParams.startReceiveTime = null;
        this.queryParams.endReceiveTime = null;
      }
    },
    loadDateChoose(date) {
      if (date) {
        this.queryParams.startLoadTime = this.parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
        this.queryParams.endLoadTime = this.parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
      } else {
        this.queryParams.startLoadTime = null;
        this.queryParams.endLoadTime = null;
      }
    },
    unloadDateChoose(date) {
      if (date) {
        this.queryParams.startUnLoadTime = this.parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
        this.queryParams.endUnLoadTime = this.parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
      } else {
        this.queryParams.startUnLoadTime = null;
        this.queryParams.endUnLoadTime = null;
      }
    },
    markDateChoose(date) {
      if (date) {
        this.queryParams.startMarkTime = this.parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
        this.queryParams.endMarkTime = this.parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
      } else {
        this.queryParams.startMarkTime = null;
        this.queryParams.endMarkTime = null;
      }
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      const params = { ...this.queryParams };
      if (params.licenseNumber) {
        params.licenseNumber = params.licenseNumber.toUpperCase();
      }
      listManages(params).then(response => {
        this.managesList = response.rows;
        this.total = response.total;
        this.height = 545;
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
      this.loadTime = [];
      this.queryParams.startLoadTime = null;
      this.queryParams.endLoadTime = null;
      this.unloadTime = [];
      this.queryParams.startUnLoadTime = null;
      this.queryParams.endUnLoadTime = null;
      this.markTime = [];
      this.queryParams.startMarkTime = null;
      this.queryParams.endMarkTime = null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.wayBillCode);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 导出
    handleExport() {
      this.loadingExport = true;
      this.download('/transportation/waybillInspect/inspectListExport', { ...this.queryParams }, `运输单管理`).then(res => {
        this.loadingExport = false;
      });
    },
    /** 详情按钮操作 */
    handleUpdate(row) {
      this.currentId = row.wayBillCode;
      this.currentRow = row;
      this.open = true;
      this.title = '运输单信息';
      this.formDisable = true;
    },
    /** 批量标记按钮操作 */
    handleBatchMark(situation) {
      this.$confirm('是否确认批量标记?', '警告', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        const info = this.ids.map(res => {
          return {
            situation: situation,
            userGradeKpiId: 1,
            waybillCode: res
          };
        });
        waybillInspectSave(info).then(() => {
          this.getList();
          this.msgSuccess('操作成功');
        });
      });
    },
    /** 标记按钮操作 */
    handleMark(row, situation) {
      this.$confirm('是否确认标记?', '警告', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        const info = [{
          situation: situation,
          userGradeKpiId: 1,
          waybillCode: row.wayBillCode
        }];
        waybillInspectSave(info).then(() => {
          this.getList();
          this.msgSuccess('操作成功');
        });
      });
    }
  }
};
</script>
