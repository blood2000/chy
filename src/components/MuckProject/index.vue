<template>
  <div>
    <!-- 核验的页面 独立 -->
    <div v-show="showSearch">
      <QueryForm ref="queryRefForm" v-model="queryParams" :is-shipment="isShipment" @handleQuery="handleQuery" />
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-if="status===0"
            :disabled="selections.length<=0"
            type="primary"
            icon="el-icon-s-claim"
            size="mini"
            :loading="loading"
            @click="handlerPilianHeyang()"
          >批量核验</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-if="status===1"
            :disabled="selections.length<=0"
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :loading="loading"
            @click="handleAskfor()"
          >批量索票</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            v-if="status===2"
            v-hasPermi="['transportation:batch:passBilling']"
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="selections.length<=0"
            @click="handleVerify"
          >批量开票</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            v-if="status===3"
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :loading="loading"
            :disabled="selections.length<=0"
            @click="handlerPassPayment()"
          >批量打款</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button
            v-if="status===-1"
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :loading="loading"
            :disabled="selections.length<=0"
            @click="handleHesuan()"
          >批量再复核</el-button>
        </el-col>

        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" /><!-- api 使用computed -->
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <RefactorTable :loading="loading" :data="billlist" :table-columns-config="tableColumnsConfig" @selection-change="(selection)=> selections = selection">
        <template #batchNo="{row}">
          <DismissedTrack :batch-no="row.batchNo" />
        </template>

        <template #opName="{row}">
          <span>{{ row.nickName || row.opName }}</span>
        </template>

        <template #status="{row}">
          <span>
            {{ selectDictLabel(statusOptions, row.status) }}
          </span>
        </template>
        <template #loogImage="{row}">
          <el-button
            v-if="row.imgCodes"
            size="mini"
            type="text"
            @click="loogImage(row)"
          >查看</el-button>
          <span v-else>-</span>
        </template>

        <template #edit="{row}">
          <div>
            <el-button
              v-if="status===0"
              size="mini"
              type="text"
              :loading="loading"
              @click="handlerPilianHeyang(row)"
            >核验</el-button>

            <el-button
              v-if="status===1"
              size="mini"
              type="text"
              :loading="loading"
              @click="handleAskfor(row)"
            >索票</el-button>

            <!-- v-show="!isShipment " -->
            <el-button
              v-if="status===2 && !isShipment"
              size="mini"
              type="text"
              :loading="loading"
              @click="handleVerify(row)"
            >开票</el-button>

            <el-button
              v-if="status===3"
              size="mini"
              type="text"
              :loading="loading"
              @click="handlerPassPayment(row)"
            >打款</el-button>

            <el-button
              v-if="status===-1"
              size="mini"
              type="text"
              :loading="loading"
              @click="handleHesuan(row)"
            >再复核</el-button>

            <!-- 公共有 -->
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
            <el-button
              v-if="status!==4 && status!==-1"
              size="mini"
              type="text"
              @click="handleBohui(row)"
            >驳回</el-button>


          </div>
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

    <!-- 驳回弹窗 -->
    <reject-dialog ref="RejectDialog" :open.sync="rejectdialog" :title="'驳回'" :status="status" @refresh="getList" />
    <!-- 对账单详情弹窗 -->

    <!-- 运单详情 -->
    <el-dialog class="i-adjust" title="运单详情" :visible.sync="openDetailDialog" width="80%" :close-on-click-modal="false" append-to-body>
      <StatementsInfo
        v-if="openDetailDialog"
        :print-data="printData"
      />
    </el-dialog>

    <!-- 结算单 -->
    <el-dialog class="i-adjust" title="结算单" :visible.sync="settlementOpen" width="1200px" :close-on-click-modal="false" append-to-body>
      <div v-if="settlementOpen">
        <SettlementPrint :print-data="printData" />
      </div>
    </el-dialog>

    <!-- 编辑开票信息管理 只在核算页面显示-->
    <el-dialog v-if="status===0" class="i-adjust" title="票务信息" :visible.sync="openBillPage" width="80%" :close-on-click-modal="false" append-to-body>
      <bill-page v-if="openBillPage" :shipment-code="shipmentCode" @submitRes="()=>{openBillPage=false; handleQuery()}" />
    </el-dialog>

    <!-- 开票弹窗 只在索票页面显示-->
    <billing-dialog v-if="status===2" ref="BillingDialog" :open.sync="billingdialog" :title="'开发票'" @refresh="getList" />

    <!-- 查看图片 -->
    <el-dialog v-if="status===3" :title="'查看发票图片'" class="i-price" :visible.sync="openimg" append-to-body>
      <div v-if="openimg" class="ly-flex-pack-center ly-flex-pack-center">

        <viewer :images="attachUrl">
          <img
            v-for="(src,index) in attachUrl"
            :key="index"
            v-real-img="src"
            src="@/assets/images/workbench/icon_noavator.png"
            class="avatar-wrapper__image"
          >
        </viewer>
      </div>
    </el-dialog>

    <!-- 核算弹窗 重新核算的要传1过去-->
    <adjust-dialog ref="AdjustDialog" :open.sync="adjustdialog" :is-again="1" :title="'结算审核'" @refresh="getList" />
  </div>
</template>

<script>



import { getUserInfo } from '@/utils/auth';

import { rejectionList, adjustDregsList, adjustListApi, passBatchClaim } from '@/api/settlement/adjustDregs';
import { confirmVerification, passPayment } from '@/api/finance/askfor';
import { getFile } from '@/api/system/image.js';

import QueryForm from './components/QueryForm.vue';
import StatementsInfo from './components/StatementsInfo';
import SettlementPrint from './components/SettlementPrint';
import RejectDialog from './components/rejectDialog';
import BillPage from '@/views/enterprise/company/billing';
import DismissedTrack from './components/DismissedTrack';

// 开票弹窗
import BillingDialog from '@/views/finance/list/dregs/billingDialog';
// 核算
import AdjustDialog from '@/views/settlement/adjustDregs/adjustDialog';

export default {
  'name': 'AskforDregs',
  components: { QueryForm, StatementsInfo, SettlementPrint, BillPage, RejectDialog, BillingDialog, AdjustDialog, DismissedTrack }, // 筛选条件

  props: {
    status: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      'exportLoading': false,
      // 总条数
      'total': 0,
      // 查询参数
      'queryParams': {
        // 固定--
        'pageNum': 1,
        'pageSize': 10,
        // 'total': 0,
        companyCode: undefined, // 发货企业	query	false
        batchNo: undefined, //	批次号	query	false
        operator: undefined, //	操作人名称	query	false
        status: 0, //	1:已核验 2:已索票 3:已开票 4:已完成
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
      // a_dataList: undefined,
      openDetailDialog: false,

      // 结算单数据
      settlementOpen: false,
      printData: undefined,

      // 开票
      billingdialog: false,
      // 打款
      openimg: false,
      attachUrl: [],

      // 再核算
      adjustdialog: false,

      openBillPage: false,

      // 驳回
      rejectdialog: false,

      // -1 核验驳回 0 已核算 1 已核验 2 已索票 3 已开票 4 已打款
      statusOptions: [
        { dictLabel: '核验驳回', dictValue: -1 },
        { dictLabel: '已核算', dictValue: 0 },
        { dictLabel: '已核验', dictValue: 1 },
        { dictLabel: '已索票', dictValue: 2 },
        { dictLabel: '已开票', dictValue: 3 },
        { dictLabel: '已打款', dictValue: 4 }
      ],

      shipmentCode: undefined
    };
  },
  computed: {
    api() {
      return adjustListApi + '--' + (this.isShipment ? 'isShipment' : 'isNoShipment') + this.status;
    },
    tableColumns() {
      let arr = [];
      const isAdmin = !this.isShipment;

      switch (this.status) {
        case -1:
          arr = [
            {
              'label': '发货企业',
              'prop': 'companyName',
              'isShow': isAdmin,
              'sortNum': 2,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '驳回原因',
              'prop': 'remark',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '驳回人员',
              'prop': 'opName',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            }
          ];
          break;
        case 0:
          arr = [
            {
              'label': '发货企业',
              'prop': 'companyName',
              'isShow': isAdmin,
              'sortNum': 2,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '驳回原因',
              'prop': 'remark',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '核算人员',
              'prop': 'opName',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            }
          ];
          break;
        case 1:
          arr = [
            {
              'label': '发货企业',
              'prop': 'companyName',
              'isShow': isAdmin,
              'sortNum': 2,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '收票人',
              'prop': 'receiver',
              'isShow': isAdmin,
              'sortNum': 17,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '收票人电话',
              'prop': 'receiverPhone',
              'isShow': isAdmin,
              'sortNum': 18,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '收票人地址',
              'prop': 'invoiceReceiverAddress',
              'isShow': isAdmin,
              'sortNum': 19,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '驳回原因',
              'prop': 'remark',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '核验人员',
              'prop': 'opName',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            }
          ];
          break;
        case 2:
          arr = [
            {
              'label': '发货企业',
              'prop': 'companyName',
              'isShow': isAdmin,
              'sortNum': 2,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '驳回原因',
              'prop': 'remark',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '索票人员',
              'prop': 'opName',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            }
          ];
          break;
        case 3:
          arr = [
            {
              'label': '发货企业',
              'prop': 'companyName',
              'isShow': isAdmin,
              'sortNum': 2,
              'width': '120',
              'tooltip': true
            },
            { // 查看图片
              prop: 'loogImage',
              isShow: true,
              width: 120,
              sortNum: 10,
              tooltip: true,
              label: '发票图片'
            },
            {
              'label': '驳回原因',
              'prop': 'remark',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '开票人员',
              'prop': 'opName',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            }
          ];
          break;
        case 4:
          arr = [
            {
              'label': '发货企业',
              'prop': 'companyName',
              'isShow': isAdmin,
              'sortNum': 2,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '驳回原因',
              'prop': 'remark',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            },
            {
              'label': '打款人员',
              'prop': 'opName',
              'isShow': true,
              'sortNum': 21,
              'width': '120',
              'tooltip': true
            }
          ];
          break;
      }

      return arr;
    },

    fileName() {
      return this.selectDictLabel(this.statusOptions, this.status);
    }



  },

  watch: {
    status: {
      handler(status) {
        // -1 核验驳回 0 已核算 1 已核验 2 已索票 3 已开票 4 已打款
        this.queryParams.pageNum = 1;
        this.queryParams.status = status;
        this.tableColumnsInit();
        this.getList();
      },
      immediate: true
    }
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
    const { isShipment = false, shipment = {}} = getUserInfo() || {};
    this.isShipment = isShipment;
    // this.shipment = shipment;
    this.shipmentCode = shipment.info ? shipment.info.code : '';
  },
  'methods': {
    /** 初始化表头 */
    tableColumnsInit() {
      this.tableColumnsConfig = [];

      this.tableHeaderConfig(this.tableColumnsConfig, this.api, {
        prop: 'edit',
        isShow: true,
        label: '操作',
        width: 170,
        fixed: 'left'
      }, this.tableColumns);
    },

    /** 查询批次列表 */
    async getList() {
      this.loading = true;

      const que = {
        ...this.queryParams,
        beginTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[0] : undefined,
        endTime: this.queryParams.receiveTime ? this.queryParams.receiveTime[1] : undefined,
        receiveTime: undefined
      };
      this.loading = false;
      let res = null;
      if (this.status === -1) {
        res = await rejectionList(que);
      } else {
        res = await adjustDregsList(que);
      }

      this.billlist = res.data.list;
      this.total = res.data.total;
      this.loading = false;
    },

    /* s=状态0 */
    // 核验按钮
    handlerPilianHeyang(row) {
      if (row) {
        this.selections = [row];
      }
      this.$confirm('确定立即核验吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const que = {
          batchNos: this.selections.map(e => e.batchNo),
          remark: undefined
        };
        confirmVerification(que).then(res => {
          // console.log(res);

          if (res.data && res.data.data === '201') {
            // this.msgError(res.data.msg);
            this.handleError(res.data.msg);
          } else {
            this.msgSuccess(res.msg);
            // this.selections = [];
            this.handleQuery();
          }
        });
      }).catch(() => {

      });
    },
    /* e= */

    /* s=状态1 */
    // 索票
    handleAskfor(row) {
      if (row) {
        this.selections = [row];
      }
      this.$confirm('确定立即索票吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const que = {
          batchNos: this.selections.map(e => e.batchNo),
          remark: undefined
        };

        passBatchClaim(que).then(response => {
          this.msgSuccess('索票申请成功');
          this.selections = [];
          this.loading = false;
          this.handleQuery();
          // this.getList();
        });
      }).catch(() => {

      });
    },
    /* e= */

    /* s=状态2 */
    // 开票
    handleVerify(row) {
      // if (row) {
      //   this.selections = [row];
      // }

      this.$refs.BillingDialog.reset();
      this.billingdialog = true;
      this.$refs.BillingDialog.setForm(row);
    },
    /* e= */

    /* s=状态3 */
    // 打款
    handlerPassPayment(row) {
      if (row) {
        this.selections = [row];
      }
      this.$confirm('确定打款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        const que = {
          batchNos: this.selections.map(e => e.batchNo)
        };

        passPayment(que).then(res => {
          this.msgSuccess('确定打款成功');
          this.selections = [];
          this.loading = false;
          this.handleQuery();
        }).catch(() => { this.loading = false; });
      }).catch(() => {});
    },
    // 查看图片信息
    loogImage(row) {
      if (!row.imgCodes) {
        this.msgWarning('无图片信息');
        return;
      }
      this.loading = true;


      getFile(row.imgCodes).then(response => {
        this.loading = false;
        this.openimg = true;

        if (response.data && response.data.length > 0) {
          this.attachUrl = response.data.map(e => e.attachUrl);
        } else {
          this.attachUrl = [];
        }
      }).catch(() => {
        this.loading = false;
        this.openimg = true;
      });
    },
    /* e= */

    /* s=状态-1 */
    // 再核算
    handleHesuan(row) {
      if (row) {
        this.selections = [row];
      }

      this.adjustdialog = true;
      this.$refs.AdjustDialog.setForm(this.selections);
    },
    /* e= */

    // 提示去编辑票务信息
    handleError(msg) {
      this.$confirm(msg + '需要立即去编辑票务信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 当前用户是货主则必有code
        if (this.shipmentCode) {
          this.openBillPage = true;
          return;
        }
        // 不是货主 通过搜索则走这
        if (this.$refs.queryRefForm.shipmentCode) {
          this.shipmentCode = this.$refs.queryRefForm.shipmentCode;
          this.openBillPage = true;
          return;
        }

        // 不是货主也不搜索 走这
        const arr = [...new Set(this.selections.map(e => e.shipperCode))];

        if (arr.length > 1) {
          this.msgError('存在多个货主,无法同时编辑, 请选择同一个货主的批次再进行编辑');
          return;
        } else if (!arr[0]) {
          this.msgError('请选择当前需要操作的货主~!');
          return;
        } else if (arr[0]) {
          this.shipmentCode = arr[0];
          this.openBillPage = true;
        }
      });
    },

    // 查看详情
    handleInfo(row) {
      this.printData = row;
      this.openDetailDialog = true;
    },
    // 结算单
    handleVerification(row) {
      this.printData = row;
      this.settlementOpen = true;
    },
    // 驳回
    handleBohui(row) {
      this.$refs.RejectDialog.reset();
      this.rejectdialog = true;
      if (row) {
        this.selections = [row];
      }
      this.$refs.RejectDialog.setForm(this.selections);
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.selections = [];
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 导出运费明细
    // handleExportFreight() {
    // },
    // 导出服务费明细
    // handleExportService() {
    // },
    // 导出批次列表
    async handleExport() {
      this.exportLoading = true;
      await this.download('/transportation/batch/export', this.queryParams, this.fileName);
      this.exportLoading = false;
    }
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
