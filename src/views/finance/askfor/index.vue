<template>
  <div>
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="90px"
    >
      <div v-if="!isShipment" class="app-container" style="display: flex; align-items: center;">
        <el-form-item label="货主信息" prop="shipmentCode" style="margin-bottom:0">
          <!-- filterable开启可搜索 remote远程搜索 reserve-keyword 保存搜索关键词 -->
          <el-select
            v-model="queryParams.shipmentCode"
            v-el-select-loadmore="loadmore"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请选择货主"
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
                <span style="margin-right:10px">{{ dict.adminName }}（{{ dict.telphone }}）</span>
                <span>{{ dict.companyName }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <span v-if="!queryParams.shipmentCode" class="g-color-warning">
          <i class="el-icon-warning" />
          您还未选择货主
        </span>
      </div>

      <div v-show="showSearch" class="app-container app-container--search">
        <el-form-item
          label="货源单号"
          prop="orderNo"
        >
          <el-input
            v-model.trim="queryParams.orderNo"
            placeholder="请输入货源单号"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="货物大类" prop="goodsBigType">
          <el-select
            v-model="queryParams.goodsBigType"
            placeholder="请选择货物大类"
            filterable
            clearable
            style="width: 230px"
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
          label="装货信息"
          prop="loading"
        >
          <el-input
            v-model.trim="queryParams.loading"
            placeholder="装货地/装货电话/装货人"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="卸货信息"
          prop="receiving"
        >
          <el-input
            v-model.trim="queryParams.receiving"
            placeholder="卸货地/卸货电话/卸货人"
            clearable
            size="small"
            style="width: 230px"
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
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="装货日期"
          prop="loadTime"
        >
          <el-date-picker
            v-model="loadTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 230px"
            @change="datechoose1"
          />
        </el-form-item>
        <el-form-item
          label="卸货日期"
          prop="unloadTime"
        >
          <el-date-picker
            v-model="unloadTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 230px"
            @change="datechoose2"
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
            v-hasPermi="['askfor:invoice:batch']"
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="multiple"
            @click="handleAskfor"
          >批量索票</el-button>
          <el-button
            v-hasPermi="['askfor:invoice:export']"
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
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>
      <!-- :max-height="isAdmin ? '380':'500'" -->
      <RefactorTable :loading="loading" :data="askforlist" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
        <template #stowageStatus="{row}">
          <span>{{ selectDictLabel(stowageStatusOptions, row.stowageStatus) }}</span>
        </template>
        <template #status="{row}">
          <span>
            <span v-if="row.status == 5" class="g-statusDot g-color-success">●</span>
            <span v-if="row.status == 7" class="g-statusDot g-color-blue">●</span>
            {{ selectDictLabel(statusOptions, row.status) }}
          </span>
        </template>
        <template #loadWeight="{row}">
          <span v-if="row.stowageStatus === '1'">{{ row.loadWeight || '0.00' }} 方</span>
          <span v-if="row.stowageStatus === '2'">{{ row.loadWeight || '0.00' }} 车</span>
          <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.loadWeight || '0.00' }} 吨</span>
        </template>
        <template #unloadWeight="{row}">
          <span v-if="row.stowageStatus === '1'">{{ row.unloadWeight || '0.00' }} 方</span>
          <span v-if="row.stowageStatus === '2'">{{ row.unloadWeight || '0.00' }} 车</span>
          <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.unloadWeight || '0.00' }} 吨</span>
        </template>
        <template #fillTime="{row}">
          <span>{{ parseTime(row.fillTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #signTime="{row}">
          <span>{{ parseTime(row.signTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>

        <template #edit="{row}">
          <el-button
            v-hasPermi="['askfor:invoice:detail']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 1)"
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

      <!-- 运单详情 对话框 -->
      <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />

    </div>
    <div style="height:80px" />
    <el-row type="flex" :gutter="10" class="g-statistics-bg">
      <el-col :span="1">
        <img src="../../../../src/assets/images/icon/total.png" alt="">
      </el-col>
      <el-col :span="2">
        <div class="g-statistics-tag">运单数量：</div>
        <div class="g-statistics-num">{{ feeinfo.waybillNum.toFixed(2) }}</div>
      </el-col>
      <el-col :span="2">
        <div class="g-statistics-tag">运费金额：</div>
        <div class="g-statistics-num">{{ feeinfo.deliveryCashFee.toFixed(2) }}</div>
      </el-col>
      <el-col :span="2">
        <div class="g-statistics-tag">运费税额：</div>
        <div class="g-statistics-num">{{ feeinfo.taxPayment.toFixed(2) }}</div>
      </el-col>
      <el-col :span="2">
        <div class="g-statistics-tag">服务费金额：</div>
        <div class="g-statistics-num">{{ feeinfo.serviceFee.toFixed(2) }}</div>
      </el-col>
      <el-col :span="2">
        <div class="g-statistics-tag">服务费税额：</div>
        <div class="g-statistics-num">{{ feeinfo.serviceTaxFee.toFixed(2) }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { askforList, askforListApi, shipmentList, askInvoice } from '@/api/finance/askfor';
import { getUserInfo } from '@/utils/auth';
// import ChildDialog from '../components/childDialog';
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';


export default {
  'name': 'Askfor',
  components: { DetailDialog },
  data() {
    return {
      tableColumnsConfig: [],
      api: askforListApi,
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
        'pageNum': 1,
        'pageSize': 10,
        // 'companyCode': undefined,
        'goodsBigType': undefined,
        // 'goodsType': undefined,
        'loadTimeBegin': undefined,
        'loadTimeEnd': undefined,
        'loading': undefined,
        'receiving': undefined,
        'orderNo': undefined,
        'receiveDateBegin': undefined,
        'receiveDateEnd': undefined,
        'shipmentCode': undefined,
        'waybillNo': undefined
      },
      loadTime: [],
      unloadTime: [],
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
      // 配载方式字典
      stowageStatusOptions: [
        { 'dictLabel': '吨', 'dictValue': '0' },
        { 'dictLabel': '方', 'dictValue': '1' },
        { 'dictLabel': '车数配载', 'dictValue': '2' }
      ],
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
      // 是否子单字典
      isChildOptions: [
        { 'dictLabel': '正常单', 'dictValue': '0' },
        { 'dictLabel': '子单', 'dictValue': '1' },
        { 'dictLabel': '超载的主单', 'dictValue': '2' }
      ],
      // 表单校验
      // rules: {
      //   shipmentCode: [
      //     { required: true, message: '请选择货主', trigger: 'blur' }
      //   ]
      // },
      // 账号信息
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
        keywords: null
      },
      shipmentloading: false,
      dataOver: false, // 是否请求完了
      loadingExport: false
    };
  },
  computed: {
  },
  created() {
    const { isAdmin = false, isShipment = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.isShipment = isShipment;
    this.user = user;
    this.shipment = shipment;
    this.getList();
    /* if (this.isShipment) {
      this.queryParams.shipmentCode = shipment.info.code;
      this.getList();
    }*/
    this.tableHeaderConfig(this.tableColumnsConfig, askforListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'left'
    });
    // this.getShipment();
    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
    // this.getList();
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
        this.shipmentInfoQuery.keywords = query;
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
      console.log(selection);
      this.feeinfo = {
        waybillNum: selection.length,
        // deliveryFee: 0,
        taxPayment: 0,
        serviceFee: 0,
        serviceTaxFee: 0,
        deliveryCashFee: 0
      };
      // selection.map((item) => { this.feeinfo.deliveryFee += item.deliveryFeePractical; });
      selection.map((item) => { this.feeinfo.taxPayment += item.taxPayment; });
      selection.map((item) => { this.feeinfo.serviceFee += item.serviceFee; });
      selection.map((item) => { this.feeinfo.serviceTaxFee += item.serviceTaxFee; });
      selection.map((item) => { this.feeinfo.deliveryCashFee += item.deliveryCashFee; });
      this.ids = selection.map((item) => item.code).join(',');
      this.multiple = !selection.length;
      console.log(this.ids);
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      if (this.isShipment) {
        this.queryParams.shipmentCode = this.shipment.info.code;
      }
      if (this.queryParams.shipmentCode) {
        this.loading = true;
        askforList(this.queryParams).then(response => {
          this.askforlist = response.data.rows;
          this.total = response.data.total;
          this.loading = false;
        });
      } else {
        this.$message({ type: 'warning', message: '请选择货主查询列表！' });
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
      this.loadingExport = true;
      this.download('/transportation/invoice/export', { ...this.queryParams }, `invoiceAskfor_${new Date().getTime()}.xlsx`).then(res => {
        this.loadingExport = false;
      });
    },
    // 批量索票
    handleAskfor() {
      this.$confirm('是否立即批量索票?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        askInvoice({ shipmentCode: this.queryParams.shipmentCode, waybillCodes: this.ids }).then(response => {
          this.msgSuccess('索票申请成功');
          this.ids = null;
        });
        this.getList();
      });
    },
    handleTableBtn(row, index) {
      // console.log(row, index);

      this.visible = true;
      switch (index) {
        case 1:
          this.$refs.DetailDialog.reset();
          this.currentId = row.code;
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
.dropdown-menu::-webkit-scrollbar {display:none}
</style>
