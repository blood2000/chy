<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item v-show="isAdmin" label="下单企业" prop="orderClient">
          <el-input
            v-model="queryParams.orderClient"
            placeholder="请输入下单企业"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="货物类型" prop="goodsBigType">
          <el-select
            v-model="queryParams.goodsBigType"
            placeholder="请选择货物类型"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="(dict, index) in goodsBigTypeOptions"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="货源单号" prop="mainOrderNumber">
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
        <el-form-item label="车牌号" prop="licenseNumber">
          <el-input
            v-model="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="司机姓名" prop="driverName">
          <el-input
            v-model="queryParams.driverName"
            placeholder="请输入司机姓名"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="运输单号" prop="waybillNo">
          <el-input
            v-model="queryParams.waybillNo"
            placeholder="请输入运输单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="运单状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择运单状态"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="(dict, index) in statusOptions"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="纸质回单" prop="isReturn">
          <el-select
            v-model="queryParams.isReturn"
            placeholder="请选择纸质回单状态"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="(dict, index) in isReturnOptions"
              :key="index"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >搜索</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" style="float: right;">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable :loading="loading" :data="infoList" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
        <template #isReturn="{row}">
          <span>{{ selectDictLabel(isReturnOptions, row.isReturn) }}</span>
        </template>
        <template #status="{row}">
          <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
        </template>
        <template #lastLoadingTime="{row}">
          <span>{{ parseTime(row.lastLoadingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #orderTime="{row}">
          <span>{{ parseTime(row.orderTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #receiveTime="{row}">
          <span>{{ parseTime(row.receiveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
        <template #wayBillUpdateTime="{row}">
          <span>{{ parseTime(row.wayBillUpdateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>

        <template #edit="{row}">
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleReturn(row)"
          >退押金</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDedution(row)"
          >扣押金</el-button>
        </template>
      </RefactorTable>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <!-- 详情 对话框 -->
    <detail-dialog ref="DetailDialog" :title="title" :open.sync="open" :disable="formDisable" :current-id="currentId" @refresh="getList" />
    <!-- 扣押金 对话框 -->
    <deduction-dialog :title="title" :open.sync="openDeduction" :current-id="currentId" @refresh="getList" />
    <!-- 退押金 对话框 -->
    <return-dialog :title="title" :open.sync="openReturn" :current-id="currentId" @refresh="getList" />
  </div>

</template>

<script>
import { listInfo, listInfoApi } from '@/api/waybill/receipt';
import DetailDialog from '../components/detailDialog';
import DeductionDialog from './deductionDialog';
import ReturnDialog from './returnDialog';
import { getUserInfo } from '@/utils/auth';
// import tableColumnsConfig from './config';
export default {
  name: 'Receipt',
  components: {
    DetailDialog,
    DeductionDialog,
    ReturnDialog
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: listInfoApi,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 纸质回单表格数据
      infoList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openDeduction: false,
      openReturn: false,
      // 是否字典
      isOptions: [
        { 'dictLabel': '否', 'dictValue': 0 },
        { 'dictLabel': '是', 'dictValue': 1 }
      ],
      // 回单确认状态 0未标记回单，1-已标记回单字典
      isReturnOptions: [
        { 'dictLabel': '未标记回单', 'dictValue': 0 },
        { 'dictLabel': '已标记回单', 'dictValue': 1 }
      ],
      // 运单状态 0未接单/1已接单/2已签收/3已回单/4已结算/5已打款字典
      statusOptions: [
        { 'dictLabel': '未接单', 'dictValue': '0' },
        { 'dictLabel': '已接单', 'dictValue': '1' },
        { 'dictLabel': '已装货', 'dictValue': '2' },
        { 'dictLabel': '已签收', 'dictValue': '3' },
        { 'dictLabel': '已回单', 'dictValue': '4' },
        { 'dictLabel': '已结算', 'dictValue': '5' },
        { 'dictLabel': '已申请打款', 'dictValue': '6' },
        { 'dictLabel': '已打款', 'dictValue': '7' },
        { 'dictLabel': '已申请开票', 'dictValue': '8' },
        { 'dictLabel': '已开票', 'dictValue': '9' }
      ],
      // 货物类型字典
      goodsBigTypeOptions: [],
      // 货物重量字典
      weightOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverName: null,
        driverPhone: null,
        endReceiveTime: null,
        goodsBigType: null,
        goodsType: null,
        isFill: null,
        isReturn: null,
        licenseNumber: null,
        mainOrderNumber: null,
        orderClient: null,
        startReceiveTime: null,
        status: null,
        waybillNo: null
      },
      receiveTime: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      formDisable: false,
      // 当前选中的运单id
      currentId: null,
      // 大类字典类型
      goodsBigType: {
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      isAdmin: false,
      user: {},
      shipment: {}
    };
  },
  created() {
    const { isAdmin = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.user = user;
    this.shipment = shipment;
    this.tableHeaderConfig(this.tableColumnsConfig, listInfoApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'right'
    });
    this.getList();
    this.listByDict(this.goodsBigType).then(response => {
      this.goodsBigTypeOptions = response.data;
    });
  },
  methods: {
    datechoose(date) {
      if (date) {
        this.queryParams.startReceiveTime = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.endReceiveTime = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.startReceiveTime = null;
        this.queryParams.endReceiveTime = null;
      }
    },
    /** 查询纸质回单列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 回单确认状态 0未标记回单，1-已标记回单字典翻译
    isReturnFormat(row, column) {
      return this.selectDictLabel(this.isReturnOptions, row.isReturn);
    },
    // 货物类型大类字典翻译
    // goodsBigTypeFormat(row, column) {
    //   return this.selectDictLabel(this.goodsBigTypeOptions, row.goodsBigType);
    // },
    // 运单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.$refs.DetailDialog.reset();
      this.currentId = row.wayBillCode;
      console.log(row);
      this.open = true;
      this.title = '运输单信息';
      this.formDisable = true;
    },
    /** 扣押金按钮操作 */
    handleDedution(row) {
      this.currentId = row.code;
      this.openDeduction = true;
      this.title = '扣押金';
    },
    /** 退押金按钮操作 */
    handleReturn(row) {
      this.currentId = row.code;
      this.openReturn = true;
      this.title = '退押金';
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/info/export',
        {
          ...this.queryParams
        },
        `system_info.xlsx`
      );
    }
  }
};
</script>
