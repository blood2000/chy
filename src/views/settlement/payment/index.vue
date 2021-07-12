
<template>
  <div v-loading="payLoading" element-loading-background="rgba(255, 255, 255, 0.3)">
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="110px"
      >
        <el-form-item
          label="装货信息"
          prop="loadInfo"
        >
          <el-input
            v-model.trim="queryParams.loadInfo"
            placeholder="装货地/装货电话/发货人"
            clearable
            size="small"
            style="width: 225px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="卸货信息"
          prop="receivedInfo"
        >
          <el-input
            v-model.trim="queryParams.receivedInfo"
            placeholder="卸货地/卸货电话/卸货人"
            clearable
            size="small"
            style="width: 225px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="车牌号"
          prop="licenseNumber"
        >
          <el-input
            v-model.trim="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            style="width: 225px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="司机姓名"
          prop="driverName"
        >
          <el-input
            v-model.trim="queryParams.driverName"
            placeholder="请输入司机姓名/手机号"
            clearable
            size="small"
            style="width: 225px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="货物大类" prop="goodsBigType">
          <el-select
            v-model="queryParams.goodsBigType"
            placeholder="请选择货物大类"
            filterable
            clearable
            style="width: 225px"
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
          label="结算申请批次号"
          prop="bizNo"
        >
          <el-input
            v-model.trim="queryParams.bizNo"
            placeholder="请输入结算申请批次号"
            clearable
            size="small"
            style="width: 225px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="货源单号"
          prop="mainOrderNumber"
        >
          <el-input
            v-model.trim="queryParams.mainOrderNumber"
            placeholder="请输入货源单号"
            clearable
            size="small"
            style="width: 225px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="运输单号"
          prop="waybillNo"
        >
          <el-input
            v-model.trim="queryParams.waybillNo"
            placeholder="请输入运输单号"
            clearable
            size="small"
            style="width: 225px"
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
            style="width: 225px"
            @change="datechoose"
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

    <div class="app-container">
      <el-row
        :gutter="10"
        class="total_bg"
      >
        <el-col :span="1">
          <img src="../../../../src/assets/images/icon/total.png" alt="">
        </el-col>
        <el-col :span="3">
          <span style="line-height: 31px">运单数量：{{ statistical.waybillCount }}</span>
        </el-col>
        <el-col :span="3">
          <span style="line-height: 31px">运费金额：{{ statistical.waybillAmount }}</span>
        </el-col>
        <el-col :span="3">
          <span style="line-height: 31px">纳税金额：{{ statistical.taxPayment }}</span>
        </el-col>
        <el-col :span="3">
          <span style="line-height: 31px">服务费金额：{{ statistical.serviceFee }}</span>
        </el-col>
        <el-col :span="3">
          <span style="line-height: 31px">服务费税额：{{ statistical.serviceTaxFee }}</span>
        </el-col>
      </el-row>

      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['transportation:waybillSettlement:batch']"
            type="primary"
            icon="el-icon-wallet"
            size="mini"
            :disabled="multiple"
            @click="handlePayment"
          >批量打款</el-button>
        </el-col>
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <RefactorTable :loading="loading" :data="paymentlist" :table-columns-config="tableColumnsConfig" :row-class-name="tableRowClassName" :selectable="checkboxT" @selection-change="handleSelectionChange">
        <template #status="{row}">
          <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
        </template>
        <template #applyStatus="{row}">
          <span>{{ selectDictLabel(applyStatusOptions, row.applyStatus) }}</span>
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
        <template #applyTime="{row}">
          <span>{{ parseTime(row.applyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #wayBillUpdateTime="{row}">
          <span>{{ parseTime(row.wayBillUpdateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #receiveTime="{row}">
          <span>{{ parseTime(row.receiveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #orderTime="{row}">
          <span>{{ parseTime(row.orderTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #lastLoadingTime="{row}">
          <span>{{ parseTime(row.lastLoadingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>

        <template #edit="{row}">
          <el-button
            v-if="row.applyStatus === 1 || row.applyStatus === 5"
            v-hasPermi="['transportation:waybillSettlement:rejected']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 1)"
          >驳回</el-button>
          <el-button
            v-if="row.applyStatus === 1 || row.applyStatus === 5"
            v-hasPermi="['transportation:waybillSettlement:batch']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 2)"
          >网商打款</el-button>
          <el-button
            v-if="row.isChild == '2'"
            v-hasPermi="['transportation:waybillSettlement:reinsurance']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 3)"
          >分单列表</el-button>
          <el-button
            v-hasPermi="['transportation:waybillSettlement:detail']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 4)"
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
    <!-- 驳回弹窗 -->
    <reject-dialog ref="RejectDialog" :open.sync="rejectdialog" :title="title" :disable="formDisable" @refresh="getList" />
    <!-- 子单弹窗 -->
    <child-dialog ref="ChildDialog" :open.sync="childdialog" :title="title" @refresh="getList" />
    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
  </div>
</template>

<script>
import { paymentList, paymentListApi, statistical, batch } from '@/api/settlement/payment';
// 驳回弹窗
import RejectDialog from './rejectDialog';
// 子单弹窗
import ChildDialog from '../components/childDialog';
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';
import { pickerOptions } from '@/utils/dateRange';

export default {
  'name': 'Payment',
  components: { RejectDialog, DetailDialog, ChildDialog },
  data() {
    return {
      pickerOptions,
      tableColumnsConfig: [],
      api: paymentListApi,
      createTime: '',
      // 遮罩层
      'loading': false,
      // 选中数组
      'ids': [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'paymentlist': [],
      // 统计数据
      statistical: {
	      serviceFee: 0,
	      serviceTaxFee: 0,
	      taxPayment: 0,
	      waybillAmount: 0,
	      waybillCount: 0
      },
      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'loadInfo': undefined,
        'receivedInfo': undefined,
        'goodsBigType': undefined,
        'bizNo': undefined,
        'mainOrderNumber': undefined,
        'endTime': undefined,
        'startTime': undefined,
        'licenseNumber': undefined,
        'driverName': undefined,
        'waybillNo': undefined
      },
      bodyParams: {
        wayBillSettlementCodeList: []
      },
      receiveTime: [],
      // 弹框 内容
      visible: false,
      open: false,
      rejectdialog: false,
      childdialog: false,
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
      // 运单状态字典
      statusOptions: [
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
      // 申请状态字典
      applyStatusOptions: [
        { 'dictLabel': '未申请', 'dictValue': '0' },
        { 'dictLabel': '待打款', 'dictValue': '1' },
        { 'dictLabel': '已驳回', 'dictValue': '2' },
        { 'dictLabel': '打款中', 'dictValue': '3' },
        { 'dictLabel': '打款成功', 'dictValue': '4' },
        { 'dictLabel': '打款失败', 'dictValue': '5' }
      ],
      payLoading: false,
      batchIndex: 0,
      errList: [],
      sucList: []
    };
  },
  computed: {
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, paymentListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 240,
      fixed: 'left'
    });
    this.getList();
    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
  },
  'methods': {
    datechoose(date) {
      if (date) {
        this.queryParams.startTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.endTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.wayBillSettlementCode);
      this.bodyParams.wayBillSettlementCodeList = this.ids;
      this.multiple = !selection.length;
    },
    checkboxT(row) {
      if (row.applyStatus === 3) {
			  return false;
      } else {
			  return true;
      }
    },
    /** 查询【请填写功能名称】列表 */
    getList(e) {
      if (e !== 1) {
        this.errList = [];
        this.sucList = [];
        this.loading = true;
      }
      paymentList(this.queryParams).then(response => {
        this.paymentlist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      statistical(this.queryParams).then(response => {
        if (response.data) {
          this.statistical = response.data;
        }
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
      this.queryParams.startTime = null;
      this.queryParams.endTime = null;
      this.handleQuery();
    },
    // 批量打款
    handlePayment() {
      this.$confirm('是否确认批量打款？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.errList = [];
        this.sucList = [];
        // this.$message({ type: 'success', message: '发起网商打款成功！' });
        this.payLoading = true;
        this.batchIndex = 0;
        this.getBatch();
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      });
    },
    // 打款接口
    async getBatch() {
      const len = this.ids;
      for (let index = 0; index < len.length; index++) {
        const e = len[index];
        try {
          await batch({ wayBillSettlementCodeList: [e] });
          this.sucList.push(e);
        } catch (error) {
          this.errList.push(e);
          continue;
        }
        // console.log(index, '----', this.ids.length, len.length);
      }
      this.getList(1);
      this.payLoading = false;
      console.log(this.errList);
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.errList.length > 0) {
        if (this.errList.includes(row.wayBillSettlementCode)) {
          return 'warning-row';
        }
      }
      if (this.sucList.length > 0) {
        if (this.sucList.includes(row.wayBillSettlementCode)) {
          return 'success-row';
        }
      }
    },
    handleTableBtn(row, index) {
      // console.log(row, index);

      this.visible = true;
      switch (index) {
        case 1:
          this.$refs.RejectDialog.reset();
          this.rejectdialog = true;
          this.title = '驳回财务打款申请';
          this.$refs.RejectDialog.setForm(row);
          break;
        case 2:
          this.$confirm('是否确认打款？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.bodyParams.wayBillSettlementCodeList = [];
            this.bodyParams.wayBillSettlementCodeList.push(row.wayBillSettlementCode);
            batch(this.bodyParams).then(response => {
              this.$message({ type: 'success', message: '发起网商打款成功！' });
              this.getList();
            });
          }).catch(() => {
            this.$message({ type: 'info', message: '已取消' });
          });
          break;
        case 3:
          this.title = '子单列表';
          this.childdialog = true;
          this.$refs.ChildDialog.setForm(row);
          break;
        case 4:
          this.$refs.DetailDialog.reset();
          this.currentId = row.wayBillCode;
          this.open = true;
          this.title = '运输单信息';
          this.formDisable = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .total_bg{
    background: #F8F9FA;
    border-radius: 4px;
    padding: 10px 20px;
    margin-bottom: 10px;
  }
  ::v-deep .warning-row{
    background: #fadbd9 !important;
  }
  ::v-deep .success-row{
    background: #d7f0dbff !important;
  }
</style>
