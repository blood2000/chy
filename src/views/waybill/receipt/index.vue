<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="下单客户" prop="orderClient">
        <el-input v-model="queryParams.orderClient" placeholder="请输入下单客户" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="货物类型" prop="goodsBigType">
        <el-select
          v-model="queryParams.goodsBigType"
          placeholder="请选择货物类型"
          clearable
          filterable
          size="small"
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
        <el-input v-model="queryParams.mainOrderNumber" placeholder="请输入货源单号" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="接单日期" prop="startReceiveTime">
        <el-date-picker
          v-model="queryParams.startReceiveTime"
          clearable
          size="small"
          style="width: 215px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择接单日期"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机姓名" prop="driverName">
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运输单号" prop="waybillNo">
        <el-input
          v-model="queryParams.waybillNo"
          placeholder="请输入运输单号"
          clearable
          size="small"
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
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column label="纸质回单状态" align="center" prop="isReturn" width="100" :formatter="isReturnFormat" />
      <el-table-column label="货源单号" align="center" prop="mainOrderNumber" width="150" />
      <el-table-column label="下单客户" align="center" prop="orderClient" width="150" />
      <el-table-column label="运输单号" align="center" prop="waybillNo" width="180" />
      <el-table-column label="承运调度" align="center" prop="teamName" width="130" />
      <el-table-column label="承运人" align="center" prop="driverName" width="80" />
      <el-table-column label="联系方式" align="center" prop="driverPhone" width="130" />
      <el-table-column label="货物类型" align="center" prop="goodsBigType" width="130" />
      <el-table-column label="货物类型分类" align="center" prop="goodsType" width="130" />
      <el-table-column label="货源商品备注" align="center" prop="goodsRemark" width="130" />
      <el-table-column label="重量（吨）" align="center" prop="weight" width="100" />
      <el-table-column label="车牌号" align="center" prop="licenseNumber" width="130" />
      <el-table-column label="装车重量" align="center" prop="loadWeight" width="100" />
      <el-table-column label="卸车重量" align="center" prop="unloadWeight" width="100" />
      <el-table-column label="数量（车）" align="center" prop="carNum" width="100" />
      <el-table-column label="公里数" align="center" prop="mileage" width="100" />
      <el-table-column label="用车类型" align="center" prop="carType" width="130" />
      <el-table-column label="货物单价（元/吨）" align="center" prop="goodsPrice" width="130" />
      <el-table-column label="运费（元）" align="center" prop="freightPrice" width="100" />
      <el-table-column label="货主保证金" align="center" prop="cashDeposit" width="100" />
      <el-table-column label="不含税价" align="center" prop="noTaxFee" width="100" />
      <el-table-column label="含税价" align="center" prop="taxFee" width="100" />
      <el-table-column label="异常说明" align="center" prop="description" width="130" />
      <el-table-column label="装货地址" align="center" prop="loadAddress" width="130" />
      <el-table-column label="卸货地址" align="center" prop="unloadAddress" width="130" />
      <el-table-column label="状态" align="center" prop="status" width="100" :formatter="statusFormat" />
      <el-table-column label="装货截止时间" align="center" prop="lastLoadingTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastLoadingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布货源时间" align="center" prop="orderTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接单时间" align="center" prop="receiveTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后操作时间" align="center" prop="wayBillUpdateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.wayBillUpdateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDEtail(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleReturn(scope.row)"
          >退押金</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDedution(scope.row)"
          >扣押金</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 详情 对话框 -->
    <detail-dialog ref="DetailDialog" :title="title" :open.sync="open" :disable="formDisable" :current-id="currentId" @refresh="getList" />

    <!-- 扣押金 对话框 -->
    <deduction-dialog :title="title" :open.sync="openDeduction" :current-id="currentId" @refresh="getList" />

    <!-- 退押金 对话框 -->
    <return-dialog :title="title" :open.sync="openReturn" :current-id="currentId" @refresh="getList" />
  </div>
</template>

<script>
import { listInfo } from '@/api/waybill/receipt';
import DetailDialog from '../components/detailDialog';
import DeductionDialog from './deductionDialog';
import ReturnDialog from './returnDialog';
export default {
  name: 'Receipt',
  components: {
    DetailDialog,
    DeductionDialog,
    ReturnDialog
  },
  data() {
    return {
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
        { 'dictLabel': '未标记回单', 'dictValue': false },
        { 'dictLabel': '已标记回单', 'dictValue': true }
      ],
      // 运单状态 0未接单/1已接单/2已签收/3已回单/4已结算/5已打款字典
      statusOptions: [
        { 'dictLabel': '未接单', 'dictValue': 0 },
        { 'dictLabel': '已接单', 'dictValue': 1 },
        { 'dictLabel': '已装货', 'dictValue': 2 },
        { 'dictLabel': '已签收', 'dictValue': 3 },
        { 'dictLabel': '已回单', 'dictValue': 4 },
        { 'dictLabel': '已结算', 'dictValue': 5 },
        { 'dictLabel': '已申请打款', 'dictValue': 6 },
        { 'dictLabel': '已打款', 'dictValue': 7 },
        { 'dictLabel': '已申请开票', 'dictValue': 8 },
        { 'dictLabel': '已开票', 'dictValue': 9 }
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
      }
    };
  },
  created() {
    this.getList();
    this.listByDict(this.goodsBigType).then(response => {
      this.goodsBigTypeOptions = response.data;
    });
  },
  methods: {
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
    handleDEtail(row) {
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
