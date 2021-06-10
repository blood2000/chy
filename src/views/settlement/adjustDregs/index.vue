
<template>
  <div>
    <div v-show="showSearch" ref="searchBox" class="app-container app-container--search">
      <el-form
        v-show="activeName !== '7'"
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="98px"
      >
        <el-form-item
          v-show="!isShipment"
          label="下单用户"
          prop="orderClient"
        >
          <el-input
            v-model="queryParams.orderClient"
            placeholder="发货企业/操作人/手机号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          v-show="!isShipment"
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
            placeholder="装货地/装货电话/发货人"
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

        <!-- <el-form-item
          label="调度者姓名"
          prop="teamName"
        >
          <el-input
            v-model="queryParams.teamName"
            placeholder="请输入调度者姓名"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->

        <el-form-item
          v-if="false"
          label="运单核对"
          prop="waybill"
        >
          <el-checkbox v-model="queryParams.waybill" />
        </el-form-item>

        <el-form-item
          label="IC卡核对状态"
          prop="icStatus"
        >
          <el-select
            v-model="queryParams.icStatus"
            placeholder="请选择纸质回单"
            filterable
            clearable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in [
                { dictValue: '0',dictLabel:'未核对' },
                { dictValue: '1',dictLabel:'已核对' }
              ]"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="false"
          label="批次号"
          prop="criticism"
        >
          <el-input
            v-model="queryParams.criticism"
            placeholder="请输入批次号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>



        <el-form-item label="货物大类" prop="goodsBigType">
          <el-select
            v-model="queryParams.goodsBigType"
            placeholder="请选择货物大类"
            filterable
            clearable
            style="width: 228px"
            size="small"
          >
            <el-option
              v-for="dict in commodityCategoryCodeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="false"
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
          label="接单日期"
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
        <!-- <el-form-item label="纸质回单" prop="isReturn">
          <el-select
            v-model="queryParams.isReturn"
            placeholder="请选择纸质回单"
            filterable
            clearable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in isReturnOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="分单" prop="isChild">
          <el-select
            v-model="queryParams.isChild"
            placeholder="请选择分单"
            filterable
            clearable
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

        <el-form-item
          label="渣土场"
          prop="ztcName"
        >
          <el-input
            v-model="queryParams.ztcName"
            placeholder="请输入渣土场"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item
          label="调度者名称"
          prop="teamName"
        >
          <el-input
            v-model="queryParams.teamName"
            placeholder="请输入调度者名称"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item
          label="项目"
          prop="projectName"
        >
          <el-input
            v-model="queryParams.projectName"
            placeholder="请输入项目名称"
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

      <div v-show="showSearch && activeName === '7'">
        <AlreadyPaid v-model="alreadyPaid_queryParams" @handleQuery="handleClick('7')" />
      </div>
    </div>

    <div class="g-radio-group ly-flex-pack-justify">
      <el-radio-group v-model="activeName" size="small" @change="handleClick">
        <el-radio-button label="4">已复核</el-radio-button>
        <el-radio-button label="5">已核算</el-radio-button>
        <el-radio-button label="7">已打款</el-radio-button>
      </el-radio-group>

      <el-button v-if="activeName==='4'" v-hasPermi="['transportation:icCheck:checkList']" type="success" size="mini" @click="nuclearCardOpen">核销IC卡</el-button>
    </div>

    <div class="app-container">
      <div v-show="activeName !== '7'">
        <el-row
          :gutter="10"
          class="mb8"
        >
          <el-col v-if="activeName == '4'" :span="1.5">
            <el-button
              v-hasPermi="['transportation:waybillBalanceInfo:batchCheck']"
              type="primary"
              icon="el-icon-document-checked"
              size="mini"
              :disabled="multiple"
              @click="handleAdjust"
            >批量核算</el-button>
          </el-col>
          <el-col v-if="activeName == '5'" :span="1.5">
            <el-button
              v-hasPermi="['transportation:batch:applyReconciliation']"
              type="primary"
              icon="el-icon-wallet"
              size="mini"
              :disabled="multiple"
              @click="createdDatch"
            >批量申请对账</el-button>
          </el-col>
          <el-col :span="1.5" class="fr">
            <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
          </el-col>
          <right-toolbar
            :show-search.sync="showSearch"
            @queryTable="getList"
          />
        </el-row>
        <RefactorTable
          :loading="loading"
          :data="adjustlist"
          :table-columns-config="tableColumnsConfig"
          :row-key="(row)=> row.waybillNo"
          :reserve-selection="activeName == '5'"
          @selection-change="handleSelectionChange"
        >
          <template #goodsBigType="{row}">
            <span>{{ selectDictLabel(commodityCategoryCodeOptions, row.goodsBigType) }}</span>
          </template>
          <template #loadWeight="{row}">
            <span v-if="row.loadWeight">
              <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.loadWeight }} 吨</span>
              <span v-if="row.stowageStatus === '1'">{{ row.loadWeight }} 立方</span>
              <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.loadWeight) }} 车</span>
            </span>
          </template>
          <template #icStatus="{row}">
            <span v-if="row.icStatus == '0'"><i class="el-icon-error g-color-error mr10" />未核对</span>
            <span v-if="row.icStatus == '1'"><i class="el-icon-success g-color-success mr10" />已核对</span>
          </template>
          <template #unloadWeight="{row}">
            <span v-if="row.unloadWeight">
              <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.unloadWeight }} 吨</span>
              <span v-if="row.stowageStatus === '1'">{{ row.unloadWeight }} 立方</span>
              <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.unloadWeight) }} 车</span>
            </span>
          </template>
          <template #weight="{row}">
            <span v-if="row.weight">
              <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.weight }} 吨</span>
              <span v-if="row.stowageStatus === '1'">{{ row.weight }} 立方</span>
              <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.weight) }} 车</span>
            </span>
          </template>
          <template #lastLoadingTime="{row}">
            <span>{{ parseTime(row.lastLoadingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>

          <template #edit="{row}">
            <el-button
              v-if="activeName == '5' && row.isApplyMoneyBack == 1"
              v-has-permi="['transportation:waybillBalanceInfo:warning']"
              size="mini"
              type="text"
              @click="handleTableBtn(row, 1)"
            >驳回提示</el-button>
            <el-button
              v-if="activeName == '4'"
              v-hasPermi="['transportation:waybillBalanceInfo:shipperRebutUnloading']"
              size="mini"
              type="text"
              @click="handleTableBtn(row, 2)"
            >驳回</el-button>
            <el-button
              v-if="activeName == '4'"
              v-hasPermi="['transportation:waybillBalanceInfo:batchCheck']"
              size="mini"
              type="text"
              @click="handleTableBtn(row, 3)"
            >核算</el-button>
            <el-button
              v-if="activeName == '5'"
              v-hasPermi="['transportation:batch:applyReconciliation']"
              size="mini"
              type="text"
              @click="handleTableBtn(row, 4)"
            >申请对账</el-button>

            <el-button
              v-if="!isShipment && row.isChild == '2'"
              v-has-permi="['transportation:waybill:childList']"
              size="mini"
              type="text"
              @click="handleTableBtn(row, 6)"
            >分单列表</el-button>
            <el-button
              v-has-permi="['transportation:waybill:getWayBillByCode']"
              size="mini"
              type="text"
              @click="handleTableBtn(row, 7)"
            >详情</el-button>
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

      <!-- 已打款 -->
      <div v-if="activeName === '7'">
        <AlreadyTable
          v-model="alreadyPaid_queryParams"
          :list="alreadyTableList"
          :loading="loading"
          :config="{api: adjustDregsApi}"
          :show-search.sync="showSearch"
          @getList="getadjustDregsList"
          @handleTableBtn="handleTableBtn"
          @handleSelectionChange="handleSelectionChange1"
        />
      </div>



    </div>
    <!-- 驳回弹窗 -->
    <reject-dialog ref="RejectDialog" :open.sync="rejectdialog" :title="title" :disable="formDisable" @refresh="getList" />
    <!-- 核算弹窗 -->
    <adjust-dialog ref="AdjustDialog" :open.sync="adjustdialog" :title="title" @refresh="()=>{getList(); multiple=true }" />
    <!-- 子单弹窗 -->
    <child-dialog ref="ChildDialog" :open.sync="childdialog" :title="title" @refresh="getList" />
    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
    <!-- 评价弹窗 -->
    <comment-dialog ref="CommentDialog" :open.sync="commentdialog" :title="title" @refresh="getList" />
    <!-- 评价详情 -->
    <rate-dialog ref="RateDialog" :open.sync="ratedialog" :disable="formDisable" :title="title" @refresh="getList" />
    <!-- 对账单弹窗 -->
    <StatementsDialog ref="StatementsDialog" :open.sync="Statementsdialog" :disable="formDisable" :title="title" @refresh="getList" />
    <!-- 核销IC卡 -->
    <nuclear-card ref="NuclearCard" :open.sync="nuclearCardDialog" @refresh="getList" />

  </div>
</template>

<script>
import { adjustList, adjustListApi } from '@/api/settlement/adjust';
import { adjustDregsList, adjustListApi as adjustDregsApi, accountStatement } from '@/api/settlement/adjustDregs';
import { getUserInfo } from '@/utils/auth';
// 驳回弹窗
import RejectDialog from '../components/rejectDialog';
// 核算弹窗
import AdjustDialog from './adjustDialog';
// 子单弹窗
import ChildDialog from '../components/childDialog';
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';
// 评价弹窗
import CommentDialog from './commentDialog';
// 评价详情弹窗
import RateDialog from './rateDialog';
// 核销IC卡
import NuclearCard from './NuclearCard';

import StatementsDialog from './StatementsDialog';

import AlreadyPaid from './AlreadyQueryForm';
import AlreadyTable from './AlreadyTable';

export default {
  'name': 'AdjustDregs',
  components: { RejectDialog, AdjustDialog, DetailDialog, ChildDialog, CommentDialog, RateDialog, NuclearCard, StatementsDialog, AlreadyPaid, AlreadyTable },
  data() {
    return {
      tableColumnsConfig_4: [],
      tableColumnsConfig_5: [],

      activeName: '4',
      createTime: '',
      // 遮罩层
      'loading': false,
      // 选中数组
      'ids': [],
      // 非多个禁用
      multiple: true,
      waybillCodeList: [],
      'bodyParams': {
        waybillCodeList: []
      },
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'adjustlist': [],

      // 弹窗表格
      commentlist: [],
      commentlist1: [],
      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'loadInfo': undefined,
        'receivedInfo': undefined,
        'goodsBigType': undefined,
        'mainOrderNumber': undefined,
        'orderEndTime': undefined,
        'orderStartTime': undefined,
        'licenseNumber': undefined,
        'driverName': undefined,
        'waybillNo': undefined,
        'icStatus': undefined,
        'orderClient': undefined,
        'deliveryCompany': undefined,
        'isReturn': undefined,
        'isChild': undefined,
        'status': '4',
        ztcName: undefined,
        teamName: undefined,
        waybill: undefined,
        projectName: undefined,
        criticism: undefined
      },

      receiveTime: [],
      // 弹框 内容
      visible: false,
      open: false,
      rejectdialog: false,
      adjustdialog: false,
      childdialog: false,
      commentdialog: false,
      nuclearCardDialog: false,
      ratedialog: false,
      Statementsdialog: false,
      title: '',
      dialogWidth: '800px',
      // 当前选中的运单id
      currentId: null,
      // 表单是否禁用
      formDisable: false,
      // 商品类别编码字典
      commodityCategoryCodeOptions: [],
      // 大类字典类型
      commodityCategory: {
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      // 字典
      transportation_scenario: [
        { 'dictLabel': '渣土短倒', 'dictValue': '1200' },
        { 'dictLabel': '大宗商品货物运输', 'dictValue': '1100' }
      ],
      // 纸质回单字典
      isReturnOptions: [
        { 'dictLabel': '未回单', 'dictValue': '0' },
        { 'dictLabel': '已回单', 'dictValue': '1' }
      ],
      // 是否子单字典
      isChildOptions: [
        { 'dictLabel': '否', 'dictValue': '0' },
        { 'dictLabel': '是', 'dictValue': '2' }
      ],
      isAdmin: false,
      user: {},
      shipment: {},
      isShipment: false,

      addition: 45, // tin添加的(追加高度)

      // 渣土相关的

      // tab = 7 的表格数据
      alreadyTableList: [],
      alreadyPaid_queryParams: {
        batchNo: undefined, //	批次号	query	false
        companyName: undefined, //	发货企业	query	false
        invoiceTitle: undefined, //	发票抬头	query	false
        operator: undefined, //	操作人名称	query	false
        status: 4, //	1已申请对账列表 2已申请开票列表 3已申请打款列表 4已完成列表	query	false
        teamName: undefined, //	调度者名称	query	false
        ztcName: undefined, //	渣土场	query	false

        'pageNum': 1,
        'pageSize': 10,
        'total': 0
      }
    };
  },
  computed: {
    api() {
      return adjustListApi + '--' + (this.isShipment ? 'isShipment' : 'isNoShipment') + this.activeName;
    },
    adjustDregsApi() {
      return adjustDregsApi + '--' + (this.isShipment ? 'isShipment' : 'isNoShipment') + ('4');
    },
    tableColumnsConfig: {
      get() {
        return this['tableColumnsConfig_' + this.activeName];
      },
      set(data) {
        this['tableColumnsConfig_' + this.activeName] = data;
      }
    }

  },

  watch: {
    '$route.query.adjust': {
      handler(value) {
        if (value) {
          this.activeName = value;
          this.handleClick(value);
        }
      },
      immediate: true
    }
  },

  created() {
    const { isAdmin = false, isShipment, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.user = user;
    this.shipment = shipment;
    this.isShipment = isShipment;

    this.handleClick('4');

    // 请求字典值
    this.getAllDict();
  },
  'methods': {
    getAllDict() {
      this.getDicts('transportation_scenario').then(res => {
        this.transportation_scenario = res.data;
      });

      !this.$route.query.adjust && this.getList();
      this.listByDict(this.commodityCategory).then(response => {
        this.commodityCategoryCodeOptions = response.data;
      });
    },

    datechoose(date) {
      if (date) {
        this.queryParams.orderStartTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.orderEndTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.orderStartTime = null;
        this.queryParams.orderEndTime = null;
      }
    },
    /** tab切换 */
    handleClick(tab) {
      if (tab === '7') {
        this.alreadyPaid_queryParams.pageNum = 1;
        this.getadjustDregsList();
      } else {
        !this.tableColumnsConfig.length && this.tableHeaderConfig(
          this.tableColumnsConfig,
          this.api,
          { prop: 'edit',
            isShow: true,
            tooltip: false,
            label: '操作',
            width: 240,
            fixed: 'left' }, [{
            prop: 'icStatus',
            isShow: true,
            tooltip: false,
            sortNum: 8,
            label: 'IC卡核对状态',
            width: 120
          }, { // 需要顶替掉的项
            prop: 'shipperCopeFee',
            isShow: true,
            tooltip: false,
            sortNum: 28,
            label: '货主应付金额',
            width: 120
          }, { // 需要顶替掉的项
            prop: 'isReturn',
            isShow: false,
            tooltip: false,
            sortNum: 0,
            label: '纸质回单状态',
            width: 120
          }]);
        this.queryParams.status = tab;
        this.queryParams.pageNum = 1;
        this.getList();
      }
    },

    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      if (this.activeName !== '5') {
        this.ids = selection.map((item) => item.wayBillCode);
        this.bodyParams.waybillCodeList = this.ids;
      }
      this.commentlist = selection;
      this.multiple = !selection.length;
    },

    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      const que = {
        ...this.queryParams,
        scenario: '1200',
        waybillType: this.activeName === '5' ? 1 : undefined
      };
      adjustList(que).then(response => {
        this.adjustlist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 获取渣土已审核列表 */
    getadjustDregsList() {
      this.loading = true;
      adjustDregsList(this.alreadyPaid_queryParams).then(res => {
        this.alreadyTableList = res.data.list;
        this.alreadyPaid_queryParams.total = res.data.total;
        this.loading = false;
      });
    },

    handleSelectionChange1(selection) {},

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

    /** 批量核算 */
    handleAdjust() {
      this.adjustdialog = true;
      this.title = '结算审核';
      this.$refs.AdjustDialog.setForm(this.ids); // this.ids 数组
    },

    // 批量评价
    handleAssess() {
      this.commentdialog = true;
      this.title = '评价司机';
      this.$refs.CommentDialog.setForm(this.commentlist);
    },


    /** 批量核算 */
    handleTableBtn(row, index) {
      this.visible = true;
      switch (index) {
        case 1: // 驳回提示
          this.$alert(row.applyMoneyBackRemark, '驳回提示', {
            confirmButtonText: '确定',
            type: 'warning'
          }).then(() => {
          });
          break;
        case 2: // 驳回 - 弹框
          this.$refs.RejectDialog.reset();
          this.rejectdialog = true;
          this.title = '驳回运输核算单';
          this.$refs.RejectDialog.setForm(row);
          break;
        case 3: // 核算 - 弹框
          this.adjustdialog = true;
          this.title = '结算审核';
          this.waybillCodeList = [];
          this.waybillCodeList.push(row.wayBillCode);
          this.$refs.AdjustDialog.setForm(this.waybillCodeList);
          break;
        case 4: // 申请对账 - 弹框
          this.commentlist = [row];
          this.createdDatch();
          break;
        case 5:
          this.commentdialog = true;
          this.title = '评价司机';
          this.commentlist1 = [];
          this.commentlist1.push(row);
          this.$refs.CommentDialog.setForm(this.commentlist1);
          break;
        case 6:
          this.title = '子单列表';
          this.childdialog = true;
          this.$refs.ChildDialog.setForm(row);
          break;
        case 7:
          this.$refs.DetailDialog.reset();
          this.currentId = row.wayBillCode;
          this.open = true;
          this.title = '运输单信息';
          this.formDisable = true;
          break;
        case 8:
          this.$refs.RateDialog.reset();
          this.ratedialog = true;
          this.formDisable = true;
          this.title = '货主评价司机详情';
          this.$refs.RateDialog.setForm(row);
          break;
        case 'XIANGQONG':
          console.log(123);
          this.Statementsdialog = true;
          this.title = '对账单详情';
          this.$refs.StatementsDialog.setBatchStatementCode(row.batchStatementCode, row); // 传code
          break;
        default:
          break;
      }
    },

    /** IC核算 **/
    nuclearCardOpen() {
      this.$confirm('请确认读卡器USB设备连接上了吗? 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.nuclearCardDialog = true;
      }).catch(() => {});
    },


    /** 处理申请对账 **/
    createdDatch() {
      this.loading = true;
      const que = {
        waybillCodes: this.commentlist.map(e => e.wayBillCode)
      };

      const obj = {};
      this.commentlist.forEach(e => {
        const str = e.loadAddress + ':' + e.unloadAddress + ':' + e.teamName;
        const array = obj[str];
        if (array) {
          array.push(e);
        } else {
          const suibian = [e];
          obj[str] = suibian;
        }
      });

      accountStatement(que).then(res => {
        this.Statementsdialog = true;
        this.title = '对账单';
        this.loading = false;
        this.$refs.StatementsDialog.setForm(obj, res.data || {});
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
