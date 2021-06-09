<template>
  <div>
    <!-- 发票索取-渣土 页面 -->
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="90px"
    >

      <div v-if="!isShipment" class="app-container" style="display: flex; align-items: center;">
        <el-form-item label="发货企业" style="margin-bottom:0">
          <el-select
            v-model="queryParams.shipmentCode"
            v-el-select-loadmore="loadmore"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请选择发货企业"
            :remote-method="remoteMethod"
            :loading="shipmentloading"
            style="width: 230px"
            size="small"
            @change="chooseShipment"
          >
            <el-option
              v-for="dict in shipmentlist"
              :key="dict.code"
              :label="dict.adminName"
              :value="dict.code"
            >
              <div class="ly-flex-pack-justify">
                <span style="margin-right:10px">{{ dict.adminName }}</span>
                <span>{{ dict.companyName }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <span v-if="!queryParams.shipmentCode" class="g-color-warning">
          <i class="el-icon-warning" />
          您还未选择发货企业
        </span>
      </div>

      <div v-show="showSearch" class="app-container app-container--search">
        <el-form-item
          label="对账批次号"
          prop="batchNo"
        >
          <el-input
            v-model="queryParams.batchNo"
            placeholder="请输入对账批次号"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
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
            style="width: 230px"
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
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item
          label="操作人"
          prop="operator"
        >
          <el-input
            v-model="queryParams.operator"
            placeholder="请输入操作人"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>



        <el-form-item
          v-if="!isShipment"
          label="发票抬头"
          prop="invoiceTitle"
        >
          <el-input
            v-model="queryParams.invoiceTitle"
            placeholder="请输入发票抬头"
            clearable
            size="small"
            style="width: 230px"
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

      </div>
    </el-form>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['transportation:batch:passBatchClaim']"
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="multiple"
            @click="handleAskfor"
          >批量索票</el-button>
          <el-button
            v-if="false"
            v-hasPermi="['askfor:invoice:export']"
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <RefactorTable :loading="loading" :data="askforlist" :table-columns-config="tableColumnsConfig" :max-height="isAdmin ? '400':'500'" @selection-change="handleSelectionChange">

        <template #status="{row}">
          <span>
            {{ selectDictLabel(statusOptions, row.status) }}
          </span>
        </template>

        <template #edit="{row}">
          <el-button
            v-hasPermi="['transportation:batch:batchInfo']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 1)"
          >详情</el-button>
          <el-button
            v-hasPermi="['transportation:batch:passBatchClaim']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 2)"
          >索票</el-button>
          <el-button
            v-hasPermi="['transportation:batch:refuseBatchClaim']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 3)"
          >驳回</el-button>
          <el-button
            v-if="false"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 4)"
          >导出</el-button>
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

    <!-- 对账单弹窗 -->
    <StatementsDialog ref="StatementsDialog" :open.sync="Statementsdialog" :disable="formDisable" :title="title" @refresh="getList" />

    <!-- 驳回弹窗 -->
    <reject-dialog ref="RejectDialog" :open.sync="rejectdialog" :title="title" :disable="formDisable" @refresh="getList" />

  </div>
</template>

<script>
import { shipmentList } from '@/api/finance/askfor'; // 获取货主(搜索用)
import { adjustDregsList, adjustListApi, passBatchClaim } from '@/api/settlement/adjustDregs'; // 1 当前页列表(批次号) 2. 表头 3.索票

import { getUserInfo } from '@/utils/auth';

// 运单详情弹窗
import StatementsDialog from '@/views/settlement/adjustDregs/StatementsDialog';

// 驳回弹窗
import RejectDialog from './components/rejectDialog';


export default {
  'name': 'AskforDregs',
  components: { StatementsDialog, RejectDialog },
  data() {
    return {
      tableColumnsConfig: [],
      // api: adjustListApi + '--1',
      // 遮罩层
      'loading': false,
      // 选中数组
      'ids': null,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      askforlist: [],
      shipmentlist: [],
      // 查询参数


      'queryParams': {
        batchNo: undefined, //	批次号	query	false
        invoiceTitle: undefined, //	发票抬头	query	false
        operator: undefined, //	操作人名称	query	false
        status: 1, //	1已申请对账列表 2已申请开票列表 3已申请打款列表 4已完成列表	query	false
        teamName: undefined, //	调度者名称	query	false
        ztcName: undefined, //	渣土场	query	false
        'pageNum': 1,
        'pageSize': 10,
        'shipmentCode': undefined
      },
      loadTime: [],
      unloadTime: [],
      // 弹框 内容
      visible: false,
      open: false,
      rejectdialog: false,
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
      // 配载方式字典
      stowageStatusOptions: [
        { 'dictLabel': '吨', 'dictValue': '0' },
        { 'dictLabel': '方', 'dictValue': '1' },
        { 'dictLabel': '车数配载', 'dictValue': '2' }
      ],
      // 运单状态字典
      statusOptions: [
        { dictLabel: '已申请对账', dictValue: 1 },
        { dictLabel: '已申请开票', dictValue: 2 },
        { dictLabel: '已申请打款', dictValue: 3 },
        { dictLabel: '已完成', dictValue: 4 }
      ],
      // 是否子单字典
      isChildOptions: [
        { 'dictLabel': '正常单', 'dictValue': '0' },
        { 'dictLabel': '子单', 'dictValue': '1' },
        { 'dictLabel': '超载的主单', 'dictValue': '2' }
      ],

      isAdmin: false,
      isShipment: false,
      user: {},
      shipment: {},
      // 数据统计
      feeinfo: {
        waybillNum: 0,
        // deliveryFee: 0,
        taxPayment: 0,
        serviceFee: 0,
        serviceTaxFee: 0,
        deliveryCashFee: 0
      },
      shipmentInfoQuery: {
        pageNum: 1,
        pageSize: 10,
        authStatus: 3,
        adminName: null
      },
      shipmentloading: false,
      dataOver: false // 是否请求完了
    };
  },
  computed: {
    api() {
      return adjustListApi + '--' + (this.isShipment ? 'isShipment' : 'isNoShipment') + ('1');
    },

    isShipmentTableColumnsConfig() {
      return !this.isShipment ? [
        {
          prop: 'companyName',
          isShow: true,
          label: '发货企业',
          sortNum: 2,
          width: 180
        },
        {
          prop: 'invoiceTitle',
          isShow: true,
          label: '发票抬头',
          sortNum: 2,
          width: 180
        },
        {
          prop: 'taxpayerNumber',
          isShow: true,
          label: '税务登记',
          sortNum: 2,
          width: 180
        }
      ] : [];
    }
  },
  created() {
    const { isAdmin = false, isShipment = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.isShipment = isShipment;
    this.user = user;
    this.shipment = shipment;

    this.tableHeaderConfig(this.tableColumnsConfig, this.api, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 120,
      fixed: 'left'
    }, [{
      prop: 'status',
      isShow: true,
      label: '状态',
      sortNum: 2,
      width: 180
    }].concat(this.isShipmentTableColumnsConfig));

    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });

    this.getList();
  },
  'methods': {
    // 获取货主列表
    getShipment() {
      shipmentList(this.shipmentInfoQuery).then(response => {
        this.dataOver = !response.rows.length;
        this.shipmentlist = this.shipmentlist.concat(response.rows);
        this.shipmentloading = false;
      }).catch(() => {
        this.shipmentloading = false;
      });
    },
    // 触发货主远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.shipmentloading = true;
        this.shipmentInfoQuery.pageNum = 1;
        this.dataOver = false;
        this.shipmentInfoQuery.adminName = query;
        this.shipmentlist = [];
        this.getShipment();
      } else {
        this.shipmentlist = [];
      }
    },
    // 货主列表触底事件
    loadmore() {
      if (this.dataOver) return;
      this.shipmentInfoQuery.pageNum++;
      this.getShipment();
    },
    // 搜索时间选择
    datechoose1(date) {
      if (date) {
        this.queryParams.loadTimeBegin = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.loadTimeEnd = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.loadTimeBegin = null;
        this.queryParams.loadTimeEnd = null;
      }
    },
    datechoose2(date) {
      if (date) {
        this.queryParams.receiveDateBegin = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.receiveDateEnd = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.receiveDateBegin = null;
        this.queryParams.receiveDateEnd = null;
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.batchNo);
      this.multiple = !selection.length;
    },

    getList() {
      if (this.isShipment) {
        this.queryParams.shipmentCode = this.shipment.info.code;
      }
      if (this.queryParams.shipmentCode) {
        this.loading = true;

        const quer = {
          ...this.queryParams,
          createCode: this.queryParams.shipmentCode,
          shipmentCode: undefined
        };
        adjustDregsList(quer).then(response => {
          this.askforlist = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      } else {
        this.$message({ type: 'warning', message: '请选择货主查询列表！' });
        this.askforlist = [];
      }
    },
    chooseShipment() {
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.loadTime = [];
      this.unloadTime = [];
      this.queryParams.loadTimeBegin = null;
      this.queryParams.loadTimeEnd = null;
      this.queryParams.receiveDateBegin = null;
      this.queryParams.receiveDateEnd = null;
      this.handleQuery();
    },
    // 导出
    handleExport() {
      this.download('/transportation/invoice/export', { ...this.queryParams }, `askfor_${new Date().getTime()}.xlsx`);
    },
    // 批量索票
    handleAskfor() {
      this.$confirm('是否立即索票?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        const que = {
          batchCodes: this.ids //	批次列表不能为空		false
        };
        passBatchClaim(que).then(response => {
          this.msgSuccess('索票申请成功');
          this.ids = null;
          this.loading = false;
          this.getList();
        });
      });
    },
    // 批量驳回
    handleBohui() {
      this.$refs.RejectDialog.reset();
      this.rejectdialog = true;
      this.title = '驳回索取发票';
      this.$refs.RejectDialog.setForm(this.ids);
    },

    handleTableBtn(row, index) {
      this.visible = true;
      switch (index) {
        case 1:

          this.Statementsdialog = true;
          this.title = '对账单详情';
          this.$refs.StatementsDialog.setBatchStatementCode(row.batchStatementCode, row); // 传code
          break;
        case 2:
          this.ids = [row.batchNo];
          this.handleAskfor();
          break;
        case 3:
          this.ids = [row.batchNo];
          this.handleBohui();
          break;
        case 4:
          this.handleExport();
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown-menu::-webkit-scrollbar {display:none}
</style>
