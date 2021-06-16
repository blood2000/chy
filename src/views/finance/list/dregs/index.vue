<template>
  <div>
    <!-- 发票列表-渣土 页面-->
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form
        v-show="showSearch"
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="110px"
      >

        <el-form-item
          v-if="!isShipment"
          label="发货企业"
          prop="companyCode"
        >
          <!-- <el-input
            v-model="queryParams.companyCode"
            placeholder="请输入发货企业"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          /> -->
          <FilterableSelect
            v-model="queryParams.companyCode"
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
              value: 'orgCode',
              label: 'companyName',
            }"
            :keywords="'searchValue'"
            @selected="(data)=>{ shipmentCode= data.code; orgCode= data.orgCode; companyCode = data.companyCode; handleQuery()}"
          >
            <template #default="{row}">
              <span>{{ row.companyName }}</span>
            </template>
          </FilterableSelect>
        </el-form-item>

        <el-form-item
          v-if="!isShipment"
          label="发票抬头"
          prop="shipper"
        >
          <el-input
            v-model="queryParams.shipper"
            placeholder="请输入发票抬头"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

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
          prop="ztcCode"
        >
          <!-- <el-input
            v-model="queryParams.ztcCode"
            placeholder="请输入渣土场"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          /> -->
          <FilterableSelect
            v-model="queryParams.ztcCode"
            clearable
            style="width:228px"
            placeholder="请输入渣土场"
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
            @selected="handleQuery"
          >
            <template #default="{row}">
              <span>{{ row.name }}</span>
            </template>
          </FilterableSelect>
        </el-form-item>

        <el-form-item
          label="调度者名称"
          prop="teamCode"
        >
          <!-- <el-input
            v-model="queryParams.teamCode"
            placeholder="请输入调度者名称"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          /> -->
          <FilterableSelect
            v-model="queryParams.teamCode"
            clearable
            style="width:228px"
            placeholder="请输入调度者名称"
            :axios="{
              queryFn:teamListInfo,
              queryData:{
                isAsc: 'desc',
                orderByColumn:'t0.create_time'
              },
              key: 'rows'
            }"
            :show-key="{
              value: 'code',
              label: 'name',
            }"
            :keywords="'name'"
            @selected="(data)=>{ handleQuery()}"
          >
            <template #default="{row}">
              <span>{{ row.name }}({{ row.telphone }})</span>
            </template>
          </FilterableSelect>
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
        <el-radio-button label="1">已申请</el-radio-button>
        <el-radio-button label="5">已开票</el-radio-button>
      </el-radio-group>
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col v-show="false && !isShipment && activeName == '1'" :span="1.5">
          <el-button
            v-hasPermi="['transportation:batch:passBilling']"
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="multiple"
            @click="handleVerify"
          >批量开票</el-button>
        </el-col>
        <el-col v-show="activeName == '5'" :span="1.5">
          <el-button
            v-hasPermi="['transportation:batch:passPayment']"
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="multiple"
            @click="handlerPassPayment"
          >批量打款</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button
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

      <RefactorTable :loading="loading" :data="billlist" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
        <template #loogImage="{row}">
          <el-button
            v-if="row.imgCodes"
            size="mini"
            type="text"
            @click="loogImage(row)"
          >查看</el-button>
          <span v-else>-</span>
        </template>

        <template #status="{row}">
          <span>
            {{ selectDictLabel(statusOptions, row.status) }}
          </span>
        </template>

        <template #edit="{row}">
          <div v-show="activeName == '1'">
            <el-button
              v-hasPermi="['transportation:batch:refuseBilling']"
              size="mini"
              type="text"
              @click="handleTableBtn(row, 1)"
            >驳回</el-button>
            <el-button
              v-show="!isShipment "
              v-hasPermi="['transportation:batch:passBilling']"
              size="mini"
              type="text"
              @click="handleTableBtn(row, 2)"
            >开票</el-button>
            <el-button
              v-hasPermi="['transportation:batch:batchInfo']"
              size="mini"
              type="text"
              @click="handleTableBtn(row, 3)"
            >详情</el-button>
          </div>
          <div v-show="activeName != '1'">

            <el-button
              size="mini"
              type="text"
              @click="handleTableBtn(row, 3)"
            >详情</el-button>
            <el-button
              v-hasPermi="['transportation:batch:passPayment']"
              size="mini"
              type="text"
              @click="handleTableBtn(row, 4)"
            >打款</el-button>
            <el-button
              v-show="false"
              v-hasPermi="['transportation:batch:passPayment']"
              size="mini"
              type="text"
              @click="handleTableBtn(row, 5)"
            >导出</el-button>
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
    <reject-dialog ref="RejectDialog" :open.sync="rejectdialog" :title="title" :disable="formDisable" @refresh="getList" />
    <!-- 开票弹窗 -->
    <billing-dialog ref="BillingDialog" :open.sync="billingdialog" :title="title" @refresh="getList" />
    <!-- 对账单详情弹窗 -->
    <StatementsDialog ref="StatementsDialog" :open.sync="Statementsdialog" :disable="formDisable" :title="title" @refresh="getList" />

    <el-dialog :title="'查看发票图片'" class="i-price" :visible.sync="openimg" append-to-body>
      <!-- 弹框内的组件 -->
      <div v-if="openimg" class="ly-flex-pack-center ly-flex-pack-center">

        <viewer :images="[attachUrl]">
          <img
            v-for="(src,index) in [attachUrl]"
            :key="index"
            v-real-img="src"
            src="@/assets/images/workbench/icon_noavator.png"
            class="avatar-wrapper__image"
          >
        </viewer>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { shipmentList } from '@/api/finance/askfor'; // 获取货主(搜索用)
import { listForWeb } from '@/api/listForWeb/index';
import { listInfo as teamListInfo } from '@/api/assets/team';

import { getFile } from '@/api/system/image.js';

import { passPayment } from '@/api/finance/askfor';

// 开票弹窗
import BillingDialog from './billingDialog';
// 详情弹窗
import StatementsDialog from '@/views/settlement/adjustDregs/StatementsDialog';
// 驳回弹窗
import RejectDialog from './components/rejectDialog';

import { getUserInfo } from '@/utils/auth';

import { adjustDregsList, adjustListApi } from '@/api/settlement/adjustDregs';

import FilterableSelect from '@/components/FilterableSelect';


export default {
  'name': 'AskforDregs',
  components: { StatementsDialog, BillingDialog, RejectDialog, FilterableSelect },
  data() {
    return {
      // s=图片
      openimg: false,
      attachUrl: '', // 查看图片地址
      // e=图片
      isShipment: false,
      tableColumnsConfig: [],
      tableColumnsConfig1: [{
        prop: 'status',
        isShow: true,
        label: '状态',
        sortNum: 2,
        width: 180
      }],
      tableColumnsConfig2: [
        { // 查看图片
          prop: 'loogImage',
          isShow: true,
          width: 120,
          sortNum: 10,
          tooltip: true,
          label: '发票图片'
        },
        {
          prop: 'status',
          isShow: true,
          label: '状态',
          sortNum: 2,
          width: 180
        }
      ],
      // api: adjustListApi,
      activeName: '1',
      createTime: '',
      // 遮罩层
      'loading': false,
      // 选中数组
      'ids': null,
      // 非多个禁用
      multiple: true,
      // 选中数量
      'selectlenght': '',
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'billlist': [{ code: 123 }],

      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        batchNo: undefined, //	批次号	query	false
        companyCode: undefined, //	发货企业	query	false
        shipper: undefined, //	发票抬头	query	false
        operator: undefined, //	操作人名称	query	false
        status: 2, //	1已申请对账列表 2已申请开票列表 3已申请打款列表 4已完成列表	query	false
        teamCode: undefined, //	调度者名称	query	false
        ztcCode: undefined //	渣土场	query	false
      },
      invoiceApplyTime: [],
      // 弹框 内容
      visible: false,
      open: false,
      verifydialog: false,
      billingdialog: false,
      rejectdialog: false,
      Statementsdialog: false,
      title: '',
      dialogWidth: '800px',
      // 当前选中的运单id
      currentId: null,
      // 表单是否禁用
      formDisable: false,
      // 发票状态字典
      invoiceStatusOptions: [
        { 'dictLabel': '未开票', 'dictValue': '0' },
        { 'dictLabel': '待审核', 'dictValue': '1' },
        { 'dictLabel': '货主已取消', 'dictValue': '2' },
        { 'dictLabel': '审核不通过', 'dictValue': '3' },
        { 'dictLabel': '审核通过', 'dictValue': '4' },
        { 'dictLabel': '已开票', 'dictValue': '5' }
      ],
      statusOptions: [
        { dictLabel: '已申请对账', dictValue: 1 },
        { dictLabel: '已申请开票', dictValue: 2 },
        { dictLabel: '已申请打款', dictValue: 3 },
        { dictLabel: '已完成', dictValue: 4 }
      ],
      // 发票来源字典
      invoiceFromOptions: [
        { 'dictLabel': '货主向平台索取', 'dictValue': '0' },
        { 'dictLabel': '货主向承运商索取', 'dictValue': '1' }
      ],

      shipmentCode: undefined,
      companyCode: undefined,
      orgCode: undefined,

      shipmentList,
      listForWeb,
      teamListInfo
    };
  },
  computed: {

    api() {
      return adjustListApi + '--' + (this.isShipment ? 'isShipment' : 'isNoShipment') + (this.activeName === '1' ? '2' : '3');
    },

    mtableColumns() {
      return this.activeName === '1' ? this.tableColumnsConfig1 : this.tableColumnsConfig2;
    },
    isShipmentTableColumnsConfig() {
      return (!this.isShipment ? [
        {
          prop: 'companyCode',
          isShow: true,
          label: '发货企业',
          sortNum: 2,
          width: 180
        },
        {
          prop: 'shipper',
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
      ] : []).concat(this.mtableColumns);
    }
  },

  watch: {
    '$route.query.list': {
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
    const { isShipment = false } = getUserInfo() || {};

    this.isShipment = isShipment;

    this.handleClick('1');
  },
  'methods': {
    datechoose(date) {
      if (date) {
        this.queryParams.invoiceApplyTimeBegin = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.invoiceApplyTimeEnd = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.invoiceApplyTimeBegin = null;
        this.queryParams.invoiceApplyTimeEnd = null;
      }
    },
    handleClick(tab) {
      this.tableColumnsInit(tab);

      this.queryParams.pageNum = 1;
      this.getList();
    },

    tableColumnsInit(tab) {
      // this.api = this.api + '--' + ((tab - 0) + 1);
      // const tableColumnsConfig = tab === '1' ? this.tableColumnsConfig1 : this.tableColumnsConfig2;
      this.queryParams.status = tab === '1' ? 2 : 3;

      this.tableColumnsConfig = [];

      this.tableHeaderConfig(this.tableColumnsConfig, this.api, {
        prop: 'edit',
        isShow: true,
        label: '操作',
        width: 120,
        fixed: 'left'
      }, this.isShipmentTableColumnsConfig);
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.selectlenght = selection.length;
      this.ids = selection.map((item) => item.batchNo);
      this.multiple = !selection.length;
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;

      adjustDregsList(this.queryParams).then(response => {
        this.billlist = response.data.list;
        this.total = response.data.total;
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
      this.invoiceApplyTime = [];
      this.queryParams.invoiceApplyTimeBegin = null;
      this.queryParams.invoiceApplyTimeEnd = null;
      this.handleQuery();
    },
    // 批量审核
    handleVerify() {
      this.formDisable = true;
      this.$refs.VerifyDialog.reset();
      this.verifydialog = true;
      this.title = '批量审批';
      this.$refs.VerifyDialog.setForm(this.ids);
      this.$refs.VerifyDialog.setNum(this.selectlenght);
    },
    // 导出运费明细
    handleExportFreight() {
    },
    // 导出服务费明细
    handleExportService() {
    },
    // 导出批次列表
    handleExport() {
      this.download('/transportation/batch/export', this.queryParams, `batch_${new Date().getTime()}.xlsx`);
    },


    handleTableBtn(row, index) {
      this.visible = true;
      switch (index) {
        case 1:
          this.$refs.RejectDialog.reset();
          this.rejectdialog = true;
          this.title = '驳回申请';
          this.$refs.RejectDialog.setForm(row);
          break;
        case 2:
          this.$refs.BillingDialog.reset();
          this.billingdialog = true;
          this.title = '开发票';
          this.formDisable = false;
          this.$refs.BillingDialog.setForm(row);
          break;
        case 3:
          this.Statementsdialog = true;
          this.title = '对账单详情';
          this.$refs.StatementsDialog.setBatchStatementCode(row.batchStatementCode, row); // 传code
          break;
        case 4:
          this.ids = [row.batchNo];
          this.handlerPassPayment();
          break;
        default:
          break;
      }
    },

    // 批量打款
    handlerPassPayment() {
      this.$confirm('确定打款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const que = {
          batchCodes: this.ids
        };

        passPayment(que).then(res => {
          this.msgSuccess('确定打款成功');
          this.queryParams.pageNum = 1;
          this.getList();
        });
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
          this.attachUrl = response.data[0].attachUrl;
        } else {
          this.attachUrl = '';
        }
      }).catch(() => {
        this.loading = false;
        this.openimg = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
