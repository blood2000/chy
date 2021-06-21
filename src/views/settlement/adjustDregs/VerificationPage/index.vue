<template>
  <div>
    <!-- 核验的页面 独立 -->
    <div v-show="showSearch" class="app-container app-container--search">
      <QueryForm v-model="alreadyPaid_queryParams" :is-shipment="isShipment" @handleQuery="handleQuery" />
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            :disabled="selections.length<=0"
            type="primary"
            icon="el-icon-s-claim"
            size="mini"
            @click="handlerPilianHeyang"
          >批量核验</el-button>
        </el-col>
        <el-col :span="1.5" class="fr">
          <!-- api 使用computed -->
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <RefactorTable :loading="loading" :data="billlist" :table-columns-config="tableColumnsConfig" @selection-change="(selection)=> selections = selection">
        <template #status="{row}">
          <span>
            {{ selectDictLabel(statusOptions, row.status) }}
          </span>
        </template>

        <template #edit="{row}">
          <div>
            <el-button
              size="mini"
              type="text"
              @click="handleHeyang(row)"
            >核验</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleInfo(row)"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleVerification(row)"
            >结算单</el-button>

          </div>
        </template>
      </RefactorTable>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="alreadyPaid_queryParams.pageNum"
        :limit.sync="alreadyPaid_queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 驳回弹窗 -->
    <!-- <reject-dialog ref="RejectDialog" :open.sync="rejectdialog" :title="title" :disable="formDisable" @refresh="getList" /> -->
    <!-- 对账单详情弹窗 -->

    <!-- 运单详情 对话框 -->
    <el-dialog class="i-adjust" title="运单详情" :visible.sync="openDetailDialog" width="80%" :close-on-click-modal="false" append-to-body>
      <StatementsInfo
        v-if="openDetailDialog"
        :way-bill-codes="a_dataList"
      />
    </el-dialog>

    <!-- 结算单 -->
    <el-dialog class="i-adjust" title="结算单" :visible.sync="settlementOpen" width="1200px" :close-on-click-modal="false" append-to-body>
      <div v-if="settlementOpen">
        <SettlementPrint :print-data="printData" :way-bill-codes="a_dataList" />
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { getUserInfo } from '@/utils/auth';

import { adjustDregsList, adjustListApi } from '@/api/settlement/adjustDregs';

// 分类 ---------------
import QueryForm from './components/QueryForm.vue';
import StatementsInfo from '../StatementsInfo.vue';
import SettlementPrint from '../SettlementPrint.vue';

export default {
  'name': 'AskforDregs',
  components: { QueryForm, StatementsInfo, SettlementPrint }, // 筛选条件
  data() {
    return {
      // 总条数
      'total': 0,
      // 查询参数
      'alreadyPaid_queryParams': {
        // 固定--
        'pageNum': 1,
        'pageSize': 10,
        // 'total': 0,
        companyCode: undefined, // 发货企业	query	false
        batchNo: undefined, //	批次号	query	false
        operator: undefined, //	操作人名称	query	false
        status: 2, //	1已申请对账列表 2已申请开票列表 3已申请打款列表 4已完成列表	query	false
        teamCode: undefined, //	调度者名称	query	false
        ztcCode: undefined, //	渣土场	query	false
        projectCode: undefined, // 项目
        receiveTime: []
      },
      isShipment: false,
      // 显示搜索条件
      'showSearch': true,
      // 遮罩层
      'loading': false,

      'billlist': [],

      tableColumnsConfig: [],

      selections: [], // 多选选中

      verificationOpen: false,


      // 运单详情
      a_dataList: undefined,
      openDetailDialog: false,

      // 结算单数据
      settlementOpen: false,
      printData: undefined,





      // ---------


      // 选中数组
      // 'ids': null,
      // 非多个禁用
      // multiple: true,
      // 选中数量
      // 'selectlenght': '',
      //   // 表格数据






      // invoiceApplyTime: [],
      // // 弹框 内容
      // visible: false,
      // open: false,
      // verifydialog: false,
      // billingdialog: false,
      // rejectdialog: false,

      // title: '',
      // dialogWidth: '800px',
      // // 当前选中的运单id
      // currentId: null,
      // // 表单是否禁用
      // formDisable: false,


      // 发票状态字典
      // invoiceStatusOptions: [
      //   { 'dictLabel': '未开票', 'dictValue': '0' },
      //   { 'dictLabel': '待审核', 'dictValue': '1' },
      //   { 'dictLabel': '货主已取消', 'dictValue': '2' },
      //   { 'dictLabel': '审核不通过', 'dictValue': '3' },
      //   { 'dictLabel': '审核通过', 'dictValue': '4' },
      //   { 'dictLabel': '已开票', 'dictValue': '5' }
      // ],
      statusOptions: [
        { dictLabel: '已申请对账', dictValue: 1 },
        { dictLabel: '已申请开票', dictValue: 2 },
        { dictLabel: '已申请打款', dictValue: 3 },
        { dictLabel: '已完成', dictValue: 4 }
      ]
      // 发票来源字典
      // invoiceFromOptions: [
      //   { 'dictLabel': '货主向平台索取', 'dictValue': '0' },
      //   { 'dictLabel': '货主向承运商索取', 'dictValue': '1' }
      // ]

      // shipmentCode: undefined,
      // companyCode: undefined,
      // orgCode: undefined,

      // shipmentList,
      // listForWeb,
      // teamListInfo
    };
  },
  computed: {
    api() {
      return adjustListApi + '--' + (this.isShipment ? 'isShipment' : 'isNoShipment') + 111;
    }

    // mtableColumns() {
    //   return this.tableColumnsConfig
    // },
    // isShipmentTableColumnsConfig() {
    //   return (!this.isShipment ? [
    //     {
    //       prop: 'companyCode',
    //       isShow: true,
    //       label: '发货企业',
    //       sortNum: 2,
    //       width: 180
    //     },
    //     {
    //       prop: 'shipper',
    //       isShow: true,
    //       label: '发票抬头',
    //       sortNum: 2,
    //       width: 180
    //     },
    //     {
    //       prop: 'taxpayerNumber',
    //       isShow: true,
    //       label: '税务登记',
    //       sortNum: 2,
    //       width: 180
    //     }
    //   ] : []).concat(this.mtableColumns);
    // }
  },

  watch: {
    // '$route.query.list': {
    //   handler(value) {
    //     if (value) {
    //       this.activeName = value;
    //     //   this.handleClick(value);
    //     }
    //   },
    //   immediate: true
    // }
  },

  created() {
    const { isShipment = false } = getUserInfo() || {};
    this.isShipment = isShipment;
    this.tableColumnsInit();
    this.getList();
  },
  'methods': {
    // datechoose(date) {
    //   if (date) {
    //     this.queryParams.invoiceApplyTimeBegin = this.parseTime(date[0], '{y}-{m}-{d}');
    //     this.queryParams.invoiceApplyTimeEnd = this.parseTime(date[1], '{y}-{m}-{d}');
    //   } else {
    //     this.queryParams.invoiceApplyTimeBegin = null;
    //     this.queryParams.invoiceApplyTimeEnd = null;
    //   }
    // },
    // handleClick(tab) {
    //   this.tableColumnsInit(tab);

    //   this.queryParams.pageNum = 1;
    //   this.getList();
    // },
    /** 初始化表头 */
    tableColumnsInit() {
      this.tableColumnsConfig = [];
      this.tableHeaderConfig(this.tableColumnsConfig, this.api, {
        prop: 'edit',
        isShow: true,
        label: '操作',
        width: 120,
        fixed: 'left'
      });
    },

    /** 查询【请填写功能名称】列表 */
    async getList() {
      this.loading = true;

      const que = {
        ...this.alreadyPaid_queryParams
      };
      // console.log(que);

      this.loading = false;
      const res = adjustDregsList(que);

      // 测试数据
      const datads = {
        'code': 200,
        'msg': null,
        'data': {
          'total': 3,
          'list': [
            {
              'batchNo': '2106161340008608',
              'status': 3,
              'companyName': '渣土货主公司',
              'teamName': '测试网商小强调度',
              'teamCode': '55221c19f4954853b46dca4a2b481e58',
              'createCode': '1895f44aa560475aa55ec3b3024112c8',
              'projectName': '616测试项目1',
              'ztcName': '616测试1',
              'loadNum': 2,
              'actualTripsNum': 2,
              'settlementTripsNum': 2,
              'freightAmount': 2.12,
              'shipper': '渣土开票公司',
              'taxpayerNumber': '12345678',
              'createTime': '2021-06-16 13:40:00.421',
              'opName': 'admin',
              'batchStatementCode': '17e5726c4ee6481b909760c7f34aa387',
              'receiver': '渣土开票',
              'receiverPhone': '13312341234',
              'invoiceReceiverAddress': '渣土开票地址',
              'imgCodes': 'e9a133328d0d49a591a85163c96cc6f5',
              'remark': null,
              'phonenumber': '15888888888',
              'updateTime': '2021-06-16 13:41:39.609'
            },
            {
              'batchNo': '2106151124448370',
              'status': 3,
              'companyName': '彩虹堂建设工程有限公司',
              'teamName': '刘海波',
              'teamCode': '787fdf170bfe495b92d98239eb221bb3',
              'createCode': 'e592fe1ccd794ea59b824cfac815f8b9',
              'projectName': '超级测试地址',
              'ztcName': null,
              'loadNum': 1,
              'actualTripsNum': 1,
              'settlementTripsNum': 1,
              'freightAmount': 10.6,
              'shipper': '彩虹堂建设工厂',
              'taxpayerNumber': '1234811616181',
              'createTime': '2021-06-15 11:24:44.767',
              'opName': 'admin',
              'batchStatementCode': '89e62b5ca319440f87aaab0d1012554b',
              'receiver': '啥武器会前往',
              'receiverPhone': '17605211111',
              'invoiceReceiverAddress': '撒方式',
              'imgCodes': '27f374aba64c45a1a2eb29facacdc3a5,36edc8ff548b4e3fada4e60dab31c384',
              'remark': null,
              'phonenumber': '15888888888',
              'updateTime': null
            },
            {
              'batchNo': '2106111635365927',
              'status': 3,
              'companyName': '测试货主一六三',
              'teamName': '刘海波',
              'teamCode': '787fdf170bfe495b92d98239eb221bb3',
              'createCode': '4519773dd5c944b4a7ab289b7f3917e2',
              'projectName': '测试项目',
              'ztcName': '这里渣土场',
              'loadNum': 1,
              'actualTripsNum': 1,
              'settlementTripsNum': 1,
              'freightAmount': 0,
              'shipper': '测试企业',
              'taxpayerNumber': 'X12SDFA512SDFA152',
              'createTime': '2021-06-11 16:35:36.042',
              'opName': 'admin',
              'batchStatementCode': '1de4358588174514bbc0da2920de6b17',
              'receiver': '陈小是',
              'receiverPhone': '0591-25124125',
              'invoiceReceiverAddress': '大道成富邦',
              'imgCodes': '981bc29cdf02490abc1727d829db1bca',
              'remark': null,
              'phonenumber': '15888888888',
              'updateTime': null
            }
          ],
          'pageNum': 1,
          'pageSize': 10,
          'size': 3,
          'startRow': 1,
          'endRow': 3,
          'pages': 1,
          'prePage': 0,
          'nextPage': 0,
          'isFirstPage': true,
          'isLastPage': true,
          'hasPreviousPage': false,
          'hasNextPage': false,
          'navigatePages': 8,
          'navigatepageNums': [
            1
          ],
          'navigateFirstPage': 1,
          'navigateLastPage': 1
        }
      };

      this.billlist = datads.data.list || res.data.list;
      this.total = datads.data.total || res.data.total;
      this.loading = false;
    },

    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.selections = selection;
    // },

    // 核验按钮
    handleHeyang(row) {
      this.selections = [row];
      this.handlerPilianHeyang();
    },

    // 批量核验
    handlerPilianHeyang() {
      // console.log(this.selections);

      this.$confirm('确定核验?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const que = {
          batchCodes: this.selections
        };

        console.log(que);



        // passPayment(que).then(res => {
        //   this.msgSuccess('确定打款成功');
        //   this.queryParams.pageNum = 1;
        //   this.getList();
        // });
      }).catch(() => {});
    },

    // 查看详情
    handleInfo(row) {
      console.log(row);
      this.a_dataList = ['83d7b5856f3247d78ba7ba5ca574151f'];

      // wayBillCodes[0]: 83d7b5856f3247d78ba7ba5ca574151f


      this.openDetailDialog = true;

      // 运单详情
      // a_dataList: undefined,
      // openDetailDialog: false,

      // // 结算单数据
      // settlementOpen: false,
      // printData: undefined,
    },
    // 结算单
    handleVerification(row) {
      // this.a_dataList = row.map(e => e);
      this.a_dataList = ['83d7b5856f3247d78ba7ba5ca574151f'];
      this.printData = row;
      this.settlementOpen = true;
    },

    // -------------------



    /** 搜索按钮操作 */
    handleQuery() {
      this.alreadyPaid_queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 批量审核
    // handleVerify() {
    //   this.formDisable = true;
    //   this.$refs.VerifyDialog.reset();
    //   this.verifydialog = true;
    //   this.title = '批量审批';
    //   this.$refs.VerifyDialog.setForm(this.ids);
    //   this.$refs.VerifyDialog.setNum(this.selectlenght);
    // },
    // 导出运费明细
    // handleExportFreight() {
    // },
    // 导出服务费明细
    // handleExportService() {
    // },
    // 导出批次列表
    handleExport() {
      this.download('/transportation/batch/export', this.queryParams, `batch_${new Date().getTime()}.xlsx`);
    }


    // handleTableBtn(row, index) {
    //   this.visible = true;
    //   switch (index) {
    //     case 1:
    //       this.$refs.RejectDialog.reset();
    //       this.rejectdialog = true;
    //       this.title = '驳回申请';
    //       this.$refs.RejectDialog.setForm(row);
    //       break;
    //     case 2:
    //       this.$refs.BillingDialog.reset();
    //       this.billingdialog = true;
    //       this.title = '开发票';
    //       this.formDisable = false;
    //       this.$refs.BillingDialog.setForm(row);
    //       break;
    //     case 3:
    //       this.Statementsdialog = true;
    //       this.title = '对账单详情';
    //       this.$refs.StatementsDialog.setBatchStatementCode(row.batchStatementCode, row); // 传code
    //       break;
    //     case 4:
    //       this.ids = [row.batchNo];
    //       this.handlerPassPayment();
    //       break;
    //     default:
    //       break;
    //   }
    // },

    // // 批量打款
    // handlerPassPayment() {
    //   this.$confirm('确定打款?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const que = {
    //       batchCodes: this.ids
    //     };

    //     passPayment(que).then(res => {
    //       this.msgSuccess('确定打款成功');
    //       this.queryParams.pageNum = 1;
    //       this.getList();
    //     });
    //   }).catch(() => {});
    // }

  }
};
</script>

<style lang="scss" scoped>
.avatar-wrapper__image{
  width: 100px;
  height: 100px;
  margin: 0 10px;
}
</style>
