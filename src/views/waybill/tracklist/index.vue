
<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="90px"
      >
        <el-form-item
          v-show="isAdmin"
          label="下单企业"
          prop="orderClient"
        >
          <el-input
            v-model="queryParams.orderClient"
            placeholder="请输入下单企业"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          v-show="isAdmin"
          label="发货企业"
          prop="deliveryCompany"
        >
          <el-input
            v-model="queryParams.deliveryCompany"
            placeholder="请输入发货企业"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="装货信息"
          prop="loadInfo"
        >
          <el-input
            v-model="queryParams.loadInfo"
            placeholder="装货地/装货电话/装货人"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="卸货信息"
          prop="receivedInfo"
        >
          <el-input
            v-model="queryParams.receivedInfo"
            placeholder="卸货地/卸货电话/卸货人"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="货源单号"
          prop="mainOrderNumber"
        >
          <el-input
            v-model="queryParams.mainOrderNumber"
            placeholder="请输入货源单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="创建时间"
          prop="receiveTime"
        >
          <el-date-picker
            v-model="receiveTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            @change="datechoose"
          />
        </el-form-item>
        <el-form-item
          label="车牌号"
          prop="licenseNumber"
        >
          <el-input
            v-model="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="司机姓名"
          prop="driverName"
        >
          <el-input
            v-model="queryParams.driverName"
            placeholder="请输入司机姓名"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="司机电话"
          prop="driverPhone"
        >
          <el-input
            v-model="queryParams.driverPhone"
            placeholder="请输入司机电话"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="运输单号"
          prop="waybillNo"
        >
          <el-input
            v-model="queryParams.waybillNo"
            placeholder="请输入运输单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >
            搜索
          </el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="g-radio-group">
      <el-radio-group v-model="activeName" size="small" @change="handleClick">
        <el-radio-button label="1">已接单</el-radio-button>
        <el-radio-button label="2">已装货</el-radio-button>
        <el-radio-button label="3">已卸货</el-radio-button>
      </el-radio-group>
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <!-- <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete"
          >批量删除</el-button>
        </el-col> -->
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <RefactorTable :loading="loading" :data="tracklist" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
        <template #cancelStatus="{row}">
          <span>{{ selectDictLabel(cancelStatusOptions, row.cancelStatus) }}</span>
        </template>
        <template #status="{row}">
          <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
        </template>
        <template #loadWeight="{row}">
          <span v-if="row.loadWeight">
            <span v-if="row.stowageStatus === '1'">{{ row.loadWeight }} 方</span>
            <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.loadWeight) }} 车</span>
            <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.loadWeight }} 吨</span>
          </span>
        </template>
        <template #unloadWeight="{row}">
          <span v-if="row.unloadWeight">
            <span v-if="row.stowageStatus === '1'">{{ row.unloadWeight }} 方</span>
            <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.unloadWeight) }} 车</span>
            <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.unloadWeight }} 吨</span>

          </span>
        </template>
        <template #weight="{row}">
          <span v-if="row.weight">
            <span v-if="row.stowageStatus === '1'">{{ row.weight }} 方</span>
            <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.weight) }} 车</span>
            <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.weight }} 吨</span>
          </span>
        </template>
        <!-- <template #stowageStatus="{row}">
          <span>{{ selectDictLabel(stowageStatusOptions, row.stowageStatus) }}</span>
        </template> -->

        <template #edit="{row}">
          <!-- <el-button
            v-if="activeName == '3' && !isAdmin"
            v-hasPermi="['transportation:waybillComment:add']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 10)"
          >评价</el-button>
          <el-button
            v-if="activeName == '3' && isAdmin"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 11)"
          >评价详情</el-button> -->
          <el-button
            v-if="activeName == '1'"
            v-hasPermi="['transportation:waybillOper:load']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 2)"
          >车辆装货</el-button>
          <el-button
            v-if="activeName == '2'"
            v-hasPermi="['transportation:waybillOper:unload']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 3)"
          >车辆卸货</el-button>
          <el-button
            v-if="activeName == '1'"
            v-hasPermi="['transportation:waybillOper:cancel']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 4)"
          >作废运单</el-button>
          <el-button
            v-if="activeName != '1'"
            v-hasPermi="['iot:jimiDevice:getTrackList']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 7)"
          >车辆跟踪</el-button>
          <el-button
            v-hasPermi="['iot:jimiDevice:location']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 8)"
          >定位</el-button>
          <el-button
            v-if="activeName == '3'"
            v-hasPermi="['transportation:driverComplaint:add']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 9)"
          >投诉</el-button>
          <TableDropdown>
            <el-dropdown-item>
              <el-button
                v-if="activeName == '3' && row.isAccountBack == '1'"
                v-hasPermi="['transportation:waybillOper:accountBackRemark']"
                size="mini"
                type="text"
                @click="handleTableBtn(row, 1)"
              >驳回提示</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                v-if="activeName != '1'"
                v-hasPermi="['transportation:waybillOper:loadCredentials']"
                size="mini"
                type="text"
                @click="handleTableBtn(row, 5)"
              >补装货凭证</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                v-if="activeName == '3'"
                v-hasPermi="['transportation:waybillOper:unloadCredentials']"
                size="mini"
                type="text"
                @click="handleTableBtn(row, 6)"
              >补卸货凭证</el-button>
            </el-dropdown-item>
            <el-dropdown-item v-if="activeName != '3'">
              <el-button
                v-hasPermi="['transportation:driverComplaint:add']"
                size="mini"
                type="text"
                @click="handleTableBtn(row, 9)"
              >投诉</el-button>
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
    <!-- 车辆装货 / 补装货凭证 -->
    <dialog-a ref="DialogA" :open.sync="dialoga" :title="title" :disable="formDisable" @refresh="getList" />
    <!-- 车辆卸货 / 补卸货凭证 -->
    <dialog-c ref="DialogC" :open.sync="dialogc" :title="title" :disable="formDisable" @refresh="getList" />
    <!-- 投诉 -->
    <dialog-b ref="DialogB" :open.sync="dialogb" :title="title" @refresh="getList" />
    <!-- 取消订单 -->
    <cancel-dialog ref="CancelDialog" :open.sync="canceldialog" :title="title" @refresh="getList" />
    <!-- 评价 -->
    <rate-dialog ref="RateDialog" :open.sync="ratedialog" :disable="formDisable" :title="title" @refresh="getList" />
    <!-- 车辆跟踪 -->
    <track-dialog ref="TrackDialog" :open.sync="trackdialog" :title="title" />
    <!-- 定位 -->
    <location-dialog ref="LocationDialog" :open.sync="locationdialog" :title="title" />
  </div>
</template>

<script>
// import tableColumnsConfig from './data/tracklist-index';
import { trackList, trackListApi, waybillInvalid } from '@/api/waybill/tracklist';
import { getUserInfo } from '@/utils/auth';
// 车辆装货弹窗
import DialogA from './component/DialogA';
// 投诉弹窗
import DialogB from './component/DialogB';
// 车辆卸货弹窗
import DialogC from './component/DialogC';
// 取消订单弹窗
import CancelDialog from './component/cancelDialog';
// 评价弹窗
import RateDialog from './component/rateDialog';
// 车辆跟踪弹窗
import TrackDialog from './component/trackDialog';
// 定位弹窗
import LocationDialog from './component/locationDialog';

export default {
  'name': 'Tracklist',
  components: { DialogA, DialogB, DialogC, CancelDialog, RateDialog, TrackDialog, LocationDialog },
  data() {
    return {
      tableColumnsConfig: [],
      api: trackListApi,
      activeName: '1',

      // 遮罩层
      'loading': false,
      // 选中数组
      //   'ids': [],
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'tracklist': [],

      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'orderClient': undefined,
        'deliveryCompany': undefined,
        'loadInfo': undefined,
        'receivedInfo': undefined,
        'mainOrderNumber': undefined,
        'orderEndTime': undefined,
        'orderStartTime': undefined,
        'licenseNumber': undefined,
        'driverName': undefined,
        'driverPhone': undefined,
        'waybillNo': undefined,
        'statusList': ['1']
      },
      receiveTime: [],
      // 弹框 内容
      visible: false,

      dialoga: false,
      dialogb: false,
      dialogc: false,
      canceldialog: false,
      ratedialog: false,
      trackdialog: false,
      locationdialog: false,
      title: '',
      dialogWidth: '800px',
      // 表单是否禁用
      formDisable: false,
      // 商品类别编码字典
      commodityCategoryCodeOptions: [],
      // 大类字典类型
      commodityCategory: {
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      // 取消状态
      cancelStatusOptions: [
        { 'dictLabel': '正常', 'dictValue': '0' },
        { 'dictLabel': '司机撤单申请', 'dictValue': '1' },
        { 'dictLabel': '货主同意撤销 ', 'dictValue': '2' },
        { 'dictLabel': '货主拒绝撤销 ', 'dictValue': '3' }
      ],
      // 配载方式
      stowageStatusOptions: [
        { 'dictLabel': '吨数配载', 'dictValue': '0' },
        { 'dictLabel': '立方配载', 'dictValue': '1' },
        { 'dictLabel': '车数配载 ', 'dictValue': '2' }
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
        { 'dictLabel': '已开票', 'dictValue': '9' }
      ],
      isAdmin: false,
      user: {},
      shipment: {}
    //   // <!-- isPay	支付给司机运费状态 0-未支付 1-已支付 -->
    //   isPayOptions: [
    //     { 'dictLabel': '未支付', 'dictValue': '0' },
    //     { 'dictLabel': '已支付', 'dictValue': '1' }
    //   ]
    };
  },

  computed: {
    lcokey() {
      return this.$route.name + this.activeName;
    }
  },

  watch: {
    '$route.query.tracklist': {
      handler(value) {
        if (value) {
          this.activeName = value;
          this.queryParams.statusList[0] = value;
          this.handleQuery();
        }
      },
      immediate: true
    }
  },
  created() {
    const { isAdmin = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.user = user;
    this.shipment = shipment;
    // this['tableColumnsConfig' + this.activeName] = this.getLocalStorage(this.lcokey) || this.tableColumnsConfig;
    this.tableHeaderConfig(this.tableColumnsConfig, trackListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 240,
      fixed: 'right'
    });
    !this.$route.query.tracklist && this.getList();
    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
  },
  'methods': {
    datechoose(date) {
      if (date) {
        this.queryParams.orderStartTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.orderEndTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.orderStartTime = null;
        this.queryParams.orderEndTime = null;
      }
    },
    /** handleClick */
    handleClick(tab) {
      // this['tableColumnsConfig' + this.activeName] = this.getLocalStorage(this.lcokey) || this.tableColumnsConfig;
      this.queryParams.statusList[0] = tab;
      this.queryParams.pageNum = 1;
      // console.log(this.queryParams);
      this.getList();
    },

    /** 查询【请填写功能名称】列表 */
    getList() {
      // console.log(this.queryParams);
      this.loading = true;
      trackList(this.queryParams).then(response => {
        this.tracklist = response.rows;
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
      this.queryParams.orderStartTime = null;
      this.queryParams.orderEndTime = null;
      this.handleQuery();
    },
    handleDelete() {
      this.$refs.DialogB.reset();
      this.dialogb = true;
      this.title = '投诉';
    },
    handleTableBtn(row, index) {
      // console.log(row, index);

      this.visible = true;
      switch (index) {
        case 1:
          this.$alert(row.accountBackRemark, '驳回提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
          });
          break;
        case 2:
          this.$refs.DialogA.reset();
          this.dialoga = true;
          this.title = '车辆装货';
          this.formDisable = false;
          this.$refs.DialogA.setForm(row);
          // this.$refs.DialogA.getAddress(row);
          break;
        case 3:
          this.$refs.DialogC.reset();
          this.dialogc = true;
          this.title = '车辆卸货';
          this.formDisable = false;
          this.$refs.DialogC.setForm(row);
          // this.$refs.DialogC.getAddress(row);
          break;
        case 4:
          this.$confirm('是否确认作废编号为"' + row.waybillNo + '"的运单?', '警告', {
            'confirmButtonText': '确定',
            'cancelButtonText': '取消',
            'type': 'warning'
          }).then(function() {
            return waybillInvalid(row.code);
          }).then(() => {
            this.getList();
            this.msgSuccess('操作成功');
          });
          break;
        case 5:
          // this.$refs.DialogA.reset();
          this.dialoga = true;
          this.formDisable = true;
          this.title = '补装货凭证';
          this.$refs.DialogA.setForm(row);
          // this.$refs.DialogA.getAddress(row);
          break;
        case 6:
          // this.$refs.DialogC.reset();
          this.dialogc = true;
          this.formDisable = true;
          this.title = '补卸货凭证';
          this.$refs.DialogC.setForm(row);
          // this.$refs.DialogC.getAddress(row);
          break;
        case 7:
          this.title = '车辆跟踪';
          this.trackdialog = true;
          this.$refs.TrackDialog.setForm(row);
          break;
        case 8:
          this.title = '定位';
          this.locationdialog = true;
          this.$refs.LocationDialog.setForm(row);
          break;
        case 9:
          this.$refs.DialogB.reset();
          this.dialogb = true;
          this.title = '投诉';
          this.$refs.DialogB.setForm(row);
          break;
        case 10:
          this.$refs.RateDialog.reset();
          this.ratedialog = true;
          this.title = '评价司机';
          this.$refs.RateDialog.setForm(row);
          break;
        case 11:
          this.$refs.RateDialog.reset();
          this.ratedialog = true;
          this.formDisable = true;
          this.title = '货主评价司机详情';
          this.$refs.RateDialog.setForm(row);
          break;
        default:
          break;
      }
    }
  }
};
</script>
