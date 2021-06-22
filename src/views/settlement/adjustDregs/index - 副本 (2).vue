
<template>
  <div>

    <div class="g-radio-group ly-flex-pack-justify">
      <el-radio-group v-model="activeName" size="small" @change="handleClick">
        <el-radio-button label="4">已复核</el-radio-button>
        <el-radio-button label="5">已核验</el-radio-button>
        <el-radio-button v-hasPermi="['transportation:batch:list']" label="7">已打款</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 已核验 -->
    <Verification v-show="activeName == '5'" />

    <PaiMoney v-show="activeName == '7'" />

    <AccountingPage v-show="activeName == '4'" />


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
    <nuclear-card ref="NuclearCard" :open.sync="nuclearCardDialog" @listData="listData" />

  </div>
</template>

<script>
import FilterableSelect from '@/components/FilterableSelect';

import { listForWeb } from '@/api/listForWeb/index';
import { listInfo } from '@/api/enterprise/project';
import { shipmentList } from '@/api/finance/askfor'; // 获取货主(搜索用)
import { listInfo as teamListInfo } from '@/api/assets/team';

import { ztApiList, ztApi } from '@/api/settlement/adjust';
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


import MyTest from './test.vue';
// ----------
// 已核验的页面
import Verification from './VerificationPage';

// 已打款的页面
import PaiMoney from './PaiMoney';

// 已核算页面
import AccountingPage from './AccountingPage';
export default {
  'name': 'AdjustDregs',
  components: { RejectDialog, AdjustDialog, DetailDialog, ChildDialog, CommentDialog, RateDialog, NuclearCard, StatementsDialog, AlreadyPaid, AlreadyTable, FilterableSelect, MyTest, Verification, PaiMoney, AccountingPage },
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
        'companyCode': undefined,
        'isReturn': undefined,
        'isChild': undefined,
        'status': '4',
        ztcCode: undefined,
        teamCode: undefined,
        waybill: undefined,
        projectCode: undefined,
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
        companyCode: undefined, //	发货企业	query	false
        invoiceTitle: undefined, //	发票抬头	query	false
        operator: undefined, //	操作人名称	query	false
        status: 4, //	1已申请对账列表 2已申请开票列表 3已申请打款列表 4已完成列表	query	false
        teamCode: undefined, //	调度者名称	query	false
        ztcCode: undefined, //	渣土场	query	false

        'pageNum': 1,
        'pageSize': 10,
        'total': 0
      },

      companyCode: undefined,
      shipmentCode: undefined,
      orgCode: undefined,

      listInfo,
      listForWeb,
      shipmentList,
      teamListInfo,

      myData: undefined

    };
  },
  computed: {
    api() {
      return ztApi + '--' + (this.isShipment ? 'isShipment' : 'isNoShipment') + this.activeName;
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

    if (this.shipment.info) {
      this.companyCode = this.shipment.info.companyCode;
      this.shipmentCode = this.shipment.info.code;
    }

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
            sortNum: 2,
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
      ztApiList(que).then(response => {
        this.adjustlist = response.data;
        this.total = response.total || 0;
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
      console.log('批量打开的');
      // this.adjustdialog = true;
      // this.title = '结算审核';
      // this.$refs.AdjustDialog.setForm(this.ids); // this.ids 数组
      // this.$refs.MyTest.handleTableBtn('ADJUST');
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
      const que = {
        waybillCodes: this.commentlist.map(e => e.wayBillCode)
      };

      const obj = {};
      this.commentlist.forEach(e => {
        const str = e.projectName + ':' + e.ztcName + ':' + e.teamName;
        const array = obj[str];
        if (array) {
          array.push(e);
        } else {
          const suibian = [e];
          obj[str] = suibian;
        }
      });

      this.loading = true;
      accountStatement(que).then(res => {
        this.Statementsdialog = true;
        this.title = '对账单';
        this.loading = false;
        this.$refs.StatementsDialog.setForm(obj, res.data || {});
      }).catch(() => {
        this.loading = false;
      });
    },

    /** IC卡核销完的数据 */
    listData(data) {
      // const data1 = [{
      //   'serialNumber': 31,
      //   'waybillNo': '2106191000275187',
      //   'orderId': 30528,
      //   'projectName': '616测试项目1',
      //   'licenseNumber': '闽AQ8002',
      //   'driverName': '测试独立加强',
      //   'driverPhone': '15859109002',
      //   'fillTime': 1624068000000,
      //   'signTime': 1624068000000,
      //   'mudtail': '616测试1—石渣土',
      //   'writeOffStatus': 0,
      //   'writeOffRemark': null,
      //   'fillTimeDate': '2021-06-19T02:00:00.000+00:00',
      //   'signTimeDate': '2021-06-19T02:00:00.000+00:00',
      //   'icStatus': null,
      //   'batchWayBillBalanceInfoVo': {
      //     'wayBillCode': '83d7b5856f3247d78ba7ba5ca574151f',
      //     'mainOrderNumber': '2106190954579183',
      //     'waybillNo': '2106191000275187',
      //     'deliveryCompany': '渣土货主公司',
      //     'orderClient': '渣土货主[15859109601]',
      //     'isChild': 0,
      //     'driverName': '测试独立加强',
      //     'driverPhone': '15859109002',
      //     'goodsBigType': '1800',
      //     'licenseNumber': '闽AQ8002',
      //     'loadWeight': '1.00',
      //     'unloadWeight': '1.00',
      //     'goodsPrice': 0,
      //     'freightPrice': null,
      //     'deliveryFeeDeserved': 0,
      //     'deliveryFeePractical': 0,
      //     'deliveryCashFee': 0,
      //     'serviceFee': 0,
      //     'serviceTaxFee': 0,
      //     'taxPayment': 0,
      //     'driverAddFee': 0,
      //     'driverReductionFee': 0,
      //     'loadAddress': '福建省福州市晋安区易速递',
      //     'loadContact': '渣土货主',
      //     'loadContactPhone': '15859109601',
      //     'unloadAddress': '福建省福州市台江区江滨中大道鼓山大桥旁富邦总部大楼',
      //     'unloadContact': null,
      //     'unloadContactPhone': null,
      //     'isReturn': 1,
      //     'lastLoadingTime': null,
      //     'orderTime': '2021-06-19 09:54:57',
      //     'receiveTime': '2021-06-19 10:00:00',
      //     'wayBillUpdateTime': '2021-06-19 10:30:52',
      //     'isApplyMoneyBack': 0,
      //     'applyMoneyBackRemark': null,
      //     'taxFreeFee': 0,
      //     'taxFee': 0,
      //     'stowageStatus': '2',
      //     'weight': null,
      //     'teamLeaderName': '15859109120',
      //     'teamName': '测试网商小强调度',
      //     'teamUserCode': '55221c19f4954853b46dca4a2b481e58',
      //     'icStatus': '1',
      //     'shipperCopeFee': '0.00',
      //     'projectName': '616测试项目1',
      //     'ztcName': '616测试1'
      //   }
      // }];
      console.log(data, '返回的数据了----');
      this.myData = data.map(e => e.batchWayBillBalanceInfoVo);
    }

    // /** 一键分组功能 */
    // handleFenzu() {
    //   const list = this.adjustlist;
    //   console.log(list);
    // }
  }
};
</script>
