<template>
  <div>
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
      <div v-if="!isShipment" class="app-container" style="display: flex; align-items: center;">
        <el-form-item
          label="发货企业"
          prop="shipperCode"
          style="margin-bottom:0"
        >
          <FilterableSelect
            v-model="queryParams.shipperCode"
            clearable
            style="width:228px"
            placeholder="请输入发货企业"
            :axios="{
              queryFn:shipmentList,
              queryData:{
                authStatus: undefined
              },
              key: 'rows'
            }"
            :show-key="{
              value: 'code',
              label: 'companyName',
            }"
            :keywords="'searchValue'"
            @selected="(data)=>{ shipmentCode= data.code; orgCode=data.orgCode; companyCode = data.companyCode; handleQuery()}"
          >
            <template #default="{row}">
              <span>{{ row.companyName }}</span>
            </template>
          </FilterableSelect>
        </el-form-item>

        <span v-if="!shipmentCode" class="g-color-warning">
          <i class="el-icon-warning" />
          您还未选择货主
        </span>
      </div>
      <div v-show="showSearch" class="app-container app-container--search">

        <el-form-item v-show="!isShipment" label="下单用户" prop="orderClient">
          <el-input
            v-model.trim="queryParams.orderClient"
            placeholder="发货企业/操作人/手机号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item v-if="false" v-show="!isShipment" label="发货企业" prop="deliveryCompany">
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
            style="width: 228px"
            @change="datechoose"
          />
        </el-form-item>
        <el-form-item
          label="装货日期"
          prop="loadTime"
        >
          <el-date-picker
            v-model="loadTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            @change="loadDateChoose"
          />
        </el-form-item>
        <el-form-item
          label="卸货日期"
          prop="unloadTime"
        >
          <el-date-picker
            v-model="unloadTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            @change="unloadDateChoose"
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
        <el-form-item label="司机姓名" prop="driverName">
          <el-input
            v-model.trim="queryParams.driverName"
            placeholder="请输入司机姓名"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="司机电话" prop="driverPhone">
          <el-input
            v-model.trim="queryParams.driverPhone"
            placeholder="请输入司机电话"
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
        <el-form-item label="分单" prop="isChildList">
          <el-select
            v-model="queryParams.isChildList"
            placeholder="请选择是否分单"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in isChildOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="调度/调度员" prop="teamName">
          <el-input
            v-model.trim="queryParams.teamName"
            placeholder="请输入调度名称/调度员姓名"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="渣土场"
          prop="ztcCode"
        >
          <FilterableSelect
            v-model="queryParams.ztcCode"
            clearable
            style="width:228px"
            placeholder="请输入渣土场"
            :requer-msg="isShipment?null:'请先选择发货企业！'"
            :is-sure-key="'orgCode'"
            :axios="{
              queryFn:listForWeb,
              queryData:{
                orgCode: orgCode
              },
              key: 'data'
            }"
            :show-key="{
              value: 'code',
              label: 'name',
            }"
            :keywords="'name'"
            @selected="(data)=>{ handleQuery() }"
          >
            <template #default="{row}">
              <span>{{ row.name }}</span>
            </template>
          </FilterableSelect>
        </el-form-item>
        <el-form-item
          label="项目"
          prop="projectCode"
        >
          <FilterableSelect
            v-model="queryParams.projectCode"
            clearable
            style="width:228px"
            placeholder="请输入项目名称"
            :requer-msg="isShipment?null:'请先选择发货企业！'"
            :is-sure-key="'companyCode'"
            :axios="{
              queryFn:listInfo,
              queryData:{
                isAsc:'desc',
                orderByColumn:'t0.id',
                companyCode:companyCode,
                shipmentCode: !isShipment? shipmentCode: undefined
              }
            }"
            :show-key="{
              value: 'code',
              label: 'projectName',
              telphone: ''
            }"
            :keywords="'projectName'"
            @selected="(data)=>{ handleQuery() }"
          >
            <template #default="{row}">
              <span>{{ row.projectName }}</span>
            </template>
          </FilterableSelect>
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
      </div>
    </el-form>

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
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <!-- table -->
      <RefactorTable :loading="loading" :data="managesList" :table-columns-config="tableColumnsConfig">  <!-- @selection-change="handleSelectionChange" -->
        <template #status="{row}">
          <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
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
            v-hasPermi="['transportation:waybill:getWayBillByCode']"
            size="mini"
            type="text"
            @click="handleUpdate(row)"
          >
            详情
          </el-button>
          <el-button
            v-has-permi="['transportation:waybillAbnormal:add']"
            size="mini"
            type="text"
            @click="handleMark(row)"
          >
            标记异常
          </el-button>
          <el-button
            v-has-permi="['transportation:waybillOper:shipperRemark']"
            size="mini"
            type="text"
            @click="handleRemarks(row)"
          >
            备注
          </el-button>
          <!-- <el-button
            v-if="row.isChild === 2 && isShipment"
            v-hasPermi="['transportation:waybillOper:reinsurance']"
            size="mini"
            type="text"
            @click="handleSeperate(row)"
          >
            分单列表
          </el-button> -->
          <TableDropdown v-show="row.isChild === 2 || row.status < '5'">
            <el-dropdown-item>
              <el-button
                v-if="row.status < '5'"
                v-hasPermi="['transportation:waybillOper:invalid']"
                size="mini"
                type="text"
                @click="handleDelete(row)"
              >
                作废运单
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                v-if="row.isChild === 2"
                v-hasPermi="['transportation:waybillOper:reinsurance']"
                size="mini"
                type="text"
                @click="handleSeperate(row)"
              >
                分单列表
              </el-button>
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
    </div>
    <!-- 详情对话框 -->
    <detail-dialog
      :title="title"
      :open.sync="open"
      :current-id="currentId"
      :disable="formDisable"
      :current-row="currentRow"
      @refresh="getList"
    />
    <!-- 标记异常对话框 -->
    <mark-abnormal-dialog
      ref="MarkAbnormalDialog"
      :title="title"
      :open.sync="openMarkAbanormal"
      :current-id="currentId"
      @refresh="getList"
    />
    <!-- 分单列表对话框 -->
    <seperate-list-dialog
      :title="title"
      :open.sync="openSeperateList"
      :current-id="currentId"
      @refresh="getList"
    />
    <!-- 备注对话框 -->
    <remark-dialog
      ref="RemarkDialog"
      :title="title"
      :open.sync="openRemark"
      :current-id="currentId"
      @refresh="getList"
    />
  </div>
</template>

<script>
import { listDregsManagesApi, listDregsManages, waybillInvalid } from '@/api/waybill/manages';
import DetailDialog from '../../components/detailDialog.vue';
import MarkAbnormalDialog from '../markAbnormalDialog';
import SeperateListDialog from '../seperateListDialog';
import RemarkDialog from '../remarkDialog';
import { getUserInfo } from '@/utils/auth';
import { pickerOptions } from '@/utils/dateRange';


import { shipmentList } from '@/api/finance/askfor'; // 获取货主(搜索用)
import { listForWeb } from '@/api/listForWeb/index'; // 获取渣土(搜索用)
import { listInfo } from '@/api/enterprise/project'; // 获取渣土项目(搜索用)
import FilterableSelect from '@/components/FilterableSelect'; // 远程组件

export default {
  name: 'Manages',
  components: {
    DetailDialog,
    MarkAbnormalDialog,
    SeperateListDialog,
    RemarkDialog,
    FilterableSelect
  },
  data() {
    return {
      pickerOptions,
      receiveTime: [],
      loadTime: [],
      unloadTime: [],
      tableColumnsConfig: [],
      api: listDregsManagesApi,
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
        { 'dictLabel': '未接单', 'dictValue': '0' },
        { 'dictLabel': '已接单', 'dictValue': '1' },
        { 'dictLabel': '已装货', 'dictValue': '2' },
        { 'dictLabel': '已签收(已卸货)', 'dictValue': '3' },
        { 'dictLabel': '已回单(收单复核)', 'dictValue': '4' },
        { 'dictLabel': '已核算', 'dictValue': '5' },
        { 'dictLabel': '已申请(打款)', 'dictValue': '6' },
        { 'dictLabel': '已打款', 'dictValue': '7' },
        { 'dictLabel': '已申请开票', 'dictValue': '8' },
        { 'dictLabel': '已开票', 'dictValue': '9' },
        { 'dictLabel': '已作废', 'dictValue': '10' },
        { 'dictLabel': '已核验', 'dictValue': '11' },
        { 'dictLabel': '已完成', 'dictValue': '12' }
      ],
      // 配载方式字典
      stowageStatusOptions: [
        { 'dictLabel': '吨', 'dictValue': '0' },
        { 'dictLabel': '方', 'dictValue': '1' },
        { 'dictLabel': '车', 'dictValue': '2' }
      ],
      // 配载方式字典
      sourceTypeOptions: [
        { 'dictLabel': '承运码', 'dictValue': '1' },
        { 'dictLabel': '调度者指派', 'dictValue': '2' },
        { 'dictLabel': '自主接单', 'dictValue': '3' },
        { 'dictLabel': '后台指派', 'dictValue': '4' }
      ],
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
        'mainOrderNumber': null,
        'waybillNo': null,
        'licenseNumber': null,
        'driverName': null,
        'driverPhone': null,
        'status': null,
        'teamName': null,
        'shipperCode': undefined,
        'ztcCode': null,
        'projectCode': null
      },
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
      isShipment: false,
      // 自己页面要用
      shipmentCode: undefined,
      companyCode: undefined,
      orgCode: undefined,
      shipmentList,
      listForWeb,
      listInfo
    };
  },
  created() {
    const { isAdmin = false, isShipment = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.isShipment = isShipment;
    this.user = user;
    this.shipment = shipment;
    this.tableHeaderConfig(this.tableColumnsConfig, listDregsManagesApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'left'
    });
    this.queryParams.startReceiveTime = this.parseTime(new Date().getTime() - 24 * 60 * 60 * 1000 * 2, '{y}-{m}-{d}');
    this.queryParams.endReceiveTime = this.parseTime(new Date(), '{y}-{m}-{d}');
    this.receiveTime = [new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2), new Date()];
    this.getList();
  },
  methods: {
    datechoose(date) {
      if (date) {
        this.queryParams.startReceiveTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.endReceiveTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.startReceiveTime = null;
        this.queryParams.endReceiveTime = null;
      }
    },
    loadDateChoose(date) {
      if (date) {
        this.queryParams.startLoadTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.endLoadTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.startLoadTime = null;
        this.queryParams.endLoadTime = null;
      }
    },
    unloadDateChoose(date) {
      if (date) {
        this.queryParams.startUnLoadTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.endUnLoadTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.startUnLoadTime = null;
        this.queryParams.endUnLoadTime = null;
      }
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      const params = { ...this.queryParams };
      if (params.licenseNumber) {
        params.licenseNumber = params.licenseNumber.toUpperCase();
      }
      listDregsManages(params).then(response => {
        this.managesList = response.rows;
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
      this.receiveTime = [];
      this.queryParams.startReceiveTime = null;
      this.queryParams.endReceiveTime = null;
      this.loadTime = [];
      this.queryParams.startLoadTime = null;
      this.queryParams.endLoadTime = null;
      this.unloadTime = [];
      this.queryParams.startUnLoadTime = null;
      this.queryParams.endUnLoadTime = null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 导出
    handleExport() {
      this.loadingExport = true;
      this.download('/transportation/waybill/manageDregsListExport', { ...this.queryParams }, `渣土运输单管理`).then(res => {
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
    /** 标记异常按钮操作 */
    handleMark(row) {
      this.$refs.MarkAbnormalDialog.reset();
      // this.currentId = row.wayBillCode;
      this.openMarkAbanormal = true;
      this.title = '标记异常';
      this.$refs.MarkAbnormalDialog.setForm(row);
    },
    /** 分单列表按钮操作 */
    handleSeperate(row) {
      this.currentId = row.wayBillCode;
      this.openSeperateList = true;
      this.title = '子单列表';
    },
    /** 作废运单按钮操作 */
    handleDelete(row) {
      const code = row.wayBillCode;
      this.$confirm('是否确认作废单号为"' + row.waybillNo + '"的运单?', '警告', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(function() {
        return waybillInvalid(code);
      }).then(() => {
        this.getList();
        this.msgSuccess('操作成功');
      });
    },
    /** 备注按钮操作 */
    handleRemarks(row) {
      this.$refs.RemarkDialog.reset();
      // this.currentId = row.wayBillCode;
      this.openRemark = true;
      this.title = '编辑运单备注';
      this.$refs.RemarkDialog.setForm(row);
    }
  }
};
</script>
