<template>
  <div>
    <div class="app-container">
      <!-- <el-row :gutter="20" style="padding-bottom:30px">
      <el-col :span="2">
        <el-row type="flex" :gutter="20" justify="center" style="margin-bottom:10px">
          <i class="el-icon-office-building" style="font-size: 1.5em" />
        </el-row>
        <el-row type="flex" :gutter="20" justify="center">
          <span class="">货主信息</span>
        </el-row>
      </el-col>
      <el-col :span="22">
        <el-row type="flex" :gutter="20" style="margin-bottom:10px">
          <el-col :span="3">
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                公司名称<i class="el-icon-caret-bottom el-icon--right" />
              </span>
              <template #dropdown>
                <el-dropdown-menu class="dropdown-menu" style="height:250px; overflow-y: scroll;">
                  <el-dropdown-item v-for="dict in shipmentlist" :key="dict.code" :command="dict.code">{{ dict.adminName }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>
        <el-row type="flex" :gutter="20">
          <el-col :span="2">
            <span class=""><i class="el-icon-s-custom" />范荣凯</span>
          </el-col>
          <el-col :span="2">
            <span class=""><i class="el-icon-phone" />15980277723</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row> -->
      <el-form
        v-show="showSearch"
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item v-show="isAdmin" label="货主" prop="shipmentCode">
          <!-- filterable开启可搜索 remote远程搜索 reserve-keyword 保存搜索关键词 -->
          <el-select
            v-model="queryParams.shipmentCode"
            v-el-select-loadmore="loadmore"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请先搜索选择货主"
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
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="货源单号"
          prop="orderNo"
        >
          <el-input
            v-model="queryParams.orderNo"
            placeholder="请输入货源单号"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="货物类型" prop="goodsBigType">
          <el-select
            v-model="queryParams.goodsBigType"
            placeholder="请选择货物类型"
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
            v-model="queryParams.loading"
            placeholder="请输入装货地/装货电话/装货人"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="收获信息"
          prop="receiving"
        >
          <el-input
            v-model="queryParams.receiving"
            placeholder="请输入目的地/收货电话/收货人"
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
            v-model="queryParams.waybillNo"
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
            type="cyan"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >
            搜索
          </el-button>
          <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:vehicle:edit']"
            type="success"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="multiple"
            @click="handleAskfor"
          >批量索票</el-button>
          <el-button
            v-hasPermi="['assets:vehicle:edit']"
            type="info"
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

      <RefactorTable :loading="loading" :data="askforlist" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
        <template #stowageStatus="{row}">
          <span>{{ selectDictLabel(stowageStatusOptions, row.stowageStatus) }}</span>
        </template>
        <template #status="{row}">
          <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
        </template>
        <template #isChild="{row}">
          <span>{{ selectDictLabel(isChildOptions, row.isChild) }}</span>
        </template>

        <template #edit="{row}">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
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
    <el-row
      :gutter="10"
      class="feeinfo"
    >
      <el-col :span="3">
        <span>运单数量：{{ feeinfo.waybillNum }}</span>
      </el-col>
      <el-col :span="3">
        <span>运费金额：{{ feeinfo.deliveryFee }}</span>
      </el-col>
      <el-col :span="3">
        <span>运费税额：{{ feeinfo.taxPayment }}</span>
      </el-col>
      <el-col :span="3">
        <span>服务费金额：{{ feeinfo.serviceFee }}</span>
      </el-col>
      <el-col :span="3">
        <span>服务费税额：{{ feeinfo.serviceTaxFee }}</span>
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
  'name': 'AskforList',
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
        { 'dictLabel': '车数配载', 'dictValue': '1' }
      ],
      // 运单状态字典
      statusOptions: [
        { 'dictLabel': '未接单', 'dictValue': '0' },
        { 'dictLabel': '已接单', 'dictValue': '1' },
        { 'dictLabel': '已装货', 'dictValue': '2' },
        { 'dictLabel': '已签收(已卸货)', 'dictValue': '3' },
        { 'dictLabel': '已回单(收单复核)', 'dictValue': '4' },
        { 'dictLabel': '已结算', 'dictValue': '5' },
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
      rules: {
        shipmentCode: [
          { required: true, message: '请选择货主', trigger: 'blur' }
        ]
      },
      // 账号信息
      isAdmin: false,
      user: {},
      shipment: {},
      // 数据统计
      feeinfo: {
        waybillNum: 0,
        deliveryFee: 0,
        taxPayment: 0,
        serviceFee: 0,
        serviceTaxFee: 0
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
  },
  created() {
    const { isAdmin = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.user = user;
    this.shipment = shipment;
    if (this.isShipment) {
      this.queryParams.shipmentCode = shipment.info.code;
      this.getList();
    }
    this.tableHeaderConfig(this.tableColumnsConfig, askforListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'right'
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
      this.queryParams.loadTimeBegin = this.parseTime(date[0], '{y}-{m}-{d}');
      this.queryParams.loadTimeEnd = this.parseTime(date[1], '{y}-{m}-{d}');
    },
    datechoose2(date) {
      this.queryParams.receiveDateBegin = this.parseTime(date[0], '{y}-{m}-{d}');
      this.queryParams.receiveDateEnd = this.parseTime(date[1], '{y}-{m}-{d}');
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.feeinfo = {
        waybillNum: selection.length,
        deliveryFee: 0,
        taxPayment: 0,
        serviceFee: 0,
        serviceTaxFee: 0
      };
      selection.map((item) => { this.feeinfo.deliveryFee += item.deliveryFeePractical; });
      selection.map((item) => { this.feeinfo.taxPayment += item.taxPayment; });
      selection.map((item) => { this.feeinfo.serviceFee += item.serviceFee; });
      selection.map((item) => { this.feeinfo.serviceTaxFee += item.serviceTaxFee; });
      this.ids = selection.map((item) => item.code).join(',');
      this.multiple = !selection.length;
      console.log(this.ids);
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      askforList(this.queryParams).then(response => {
        this.askforlist = response.data.rows;
        this.total = response.data.total;
        this.loading = false;
      });
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
    },
    // 批量索票
    handleAskfor() {
      askInvoice({ shipmentCode: this.queryParams.shipmentCode, waybillCodes: this.ids }).then(response => {});
      this.getList();
    },
    handleTableBtn(row, index) {
      // console.log(row, index);

      this.visible = true;
      switch (index) {
        case 1:
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
.dropdown-menu::-webkit-scrollbar {display:none}

.feeinfo{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
