<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="货源编号" prop="orderCode">
        <el-input
          v-model="queryParams.orderCode"
          placeholder="请输入货源编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接单时间" prop="receiveTime">
        <el-date-picker
          v-model="queryParams.receiveTime"
          clearable
          size="small"
          style="width: 215px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择接单时间"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="vehicleCode">
        <el-input
          v-model="queryParams.vehicleCode"
          placeholder="请输入实际承运车辆CODE"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机姓名" prop="drvierCode">
        <el-input
          v-model="queryParams.drvierCode"
          placeholder="请输入实际承运人CODE"
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
          placeholder="请选择运单状态 0未接单/1已接单/2已签收/3已回单/4已结算/5已打款"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
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
          size="small"
        >
          <el-option
            v-for="dict in isReturnOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="code" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入code"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品编码" prop="goodsCode">
        <el-input
          v-model="queryParams.goodsCode"
          placeholder="请输入商品编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="调度单号" prop="dispatchOrderCode">
        <el-input
          v-model="queryParams.dispatchOrderCode"
          placeholder="请输入调度单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="装货时间" prop="fillTime">
        <el-date-picker
          v-model="queryParams.fillTime"
          clearable
          size="small"
          style="width: 200px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择装货时间"
        />
      </el-form-item>
      <el-form-item label="签收时间" prop="signTime">
        <el-date-picker
          v-model="queryParams.signTime"
          clearable
          size="small"
          style="width: 200px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择签收时间"
        />
      </el-form-item>
      <el-form-item label="结算时间" prop="settleTime">
        <el-date-picker
          v-model="queryParams.settleTime"
          clearable
          size="small"
          style="width: 200px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择结算时间"
        />
      </el-form-item>
      <el-form-item label="回单确认时间" prop="returnRemarkTime">
        <el-date-picker
          v-model="queryParams.returnRemarkTime"
          clearable
          size="small"
          style="width: 200px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择回单确认时间"
        />
      </el-form-item>
      <el-form-item label="与司机结账时间" prop="payTime">
        <el-date-picker
          v-model="queryParams.payTime"
          clearable
          size="small"
          style="width: 200px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择与司机结账时间"
        />
      </el-form-item>
      <el-form-item label="标记打款状态 0未打款/1已打款/2打款处理中" prop="isMarkStatus">
        <el-select v-model="queryParams.isMarkStatus" placeholder="请选择标记打款状态 0未打款/1已打款/2打款处理中" clearable size="small">
          <el-option
            v-for="dict in isMarkStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标记打款时间" prop="markTime">
        <el-date-picker
          v-model="queryParams.markTime"
          clearable
          size="small"
          style="width: 200px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择标记打款时间"
        />
      </el-form-item>
      <el-form-item label="打印时间" prop="prinTime">
        <el-date-picker
          v-model="queryParams.prinTime"
          clearable
          size="small"
          style="width: 200px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择打印时间"
        />
      </el-form-item>
      <el-form-item label="月结订单结算状态 0-未结算 1-已结算" prop="monthlySettlementStatus">
        <el-select v-model="queryParams.monthlySettlementStatus" placeholder="请选择月结订单结算状态 0-未结算 1-已结算" clearable size="small">
          <el-option
            v-for="dict in monthlySettlementStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人" prop="createCode">
        <el-input
          v-model="queryParams.createCode"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="修改人" prop="updateCode">
        <el-input
          v-model="queryParams.updateCode"
          placeholder="请输入修改人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机取消订单  0-》正常，1-》司机撤单申请 2-》货主同意撤销 3-》货主拒绝撤销" prop="cancelStatus">
        <el-select v-model="queryParams.cancelStatus" placeholder="请选择司机取消订单  0-》正常，1-》司机撤单申请 2-》货主同意撤销 3-》货主拒绝撤销" clearable size="small">
          <el-option
            v-for="dict in cancelStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
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
      <!-- <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:info:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:info:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:info:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['system:info:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table
      v-loading="loading"
      :data="infoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column
        label="回单确认状态"
        align="center"
        prop="isReturn"
        width="130"
        :formatter="isReturnFormat"
      />
      <el-table-column
        label="货源编号"
        align="center"
        prop="orderCode"
        width="130"
      />
      <el-table-column
        label="创建人"
        align="center"
        prop="createCode"
        width="130"
      />
      <el-table-column
        label="运输单号"
        align="center"
        prop="waybillNo"
        width="130"
      />
      <el-table-column
        label="调度单号"
        align="center"
        prop="dispatchOrderCode"
        width="130"
      />
      <el-table-column
        label="实际承运人"
        align="center"
        prop="drvierCode"
        width="130"
      />
      <el-table-column
        label="货物重量"
        align="center"
        prop="weight"
        width="130"
      />
      <el-table-column
        label="实际承运车辆"
        align="center"
        prop="vehicleCode"
        width="130"
      />
      <el-table-column
        label="装车重量"
        align="center"
        prop="loadWeight"
        width="130"
      />
      <el-table-column
        label="卸车重量"
        align="center"
        prop="unloadWeight"
        width="130"
      />
      <el-table-column
        label="货物损耗"
        align="center"
        prop="wastage"
        width="130"
      />
      <el-table-column
        label="给货主结算的和展示的每车总费"
        align="center"
        prop="shipperDeliveryFee"
        width="210"
      />
      <el-table-column
        label="运单状态"
        align="center"
        prop="status"
        width="130"
        :formatter="statusFormat"
      />
      <el-table-column
        label="装货时间"
        align="center"
        prop="fillTime"
        width="130"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fillTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="接单时间"
        align="center"
        prop="receiveTime"
        width="130"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiveTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="code" align="center" prop="code" :formatter="codeFormat" />
      <el-table-column label="商品编码" align="center" prop="goodsCode" :formatter="goodsCodeFormat" />
      <el-table-column label="是否接单  0-否  1-是" align="center" prop="isReceive" :formatter="isReceiveFormat" />
      <el-table-column label="是否装货  0-否  1-是" align="center" prop="isFill" :formatter="isFillFormat" />
      <el-table-column label="是否签收 0-否  1-是" align="center" prop="isSign" :formatter="isSignFormat" />
      <el-table-column label="签收时间" align="center" prop="signTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.signTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否结算 0未结算，1已结算" align="center" prop="isSettle" :formatter="isSettleFormat" />
      <el-table-column label="结算时间" align="center" prop="settleTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.settleTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回单确认时间" align="center" prop="returnRemarkTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.returnRemarkTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回单确认备注" align="center" prop="returnRemark" :formatter="returnRemarkFormat" />
      <el-table-column label="支付给司机运费状态 0-未支付 1-已支付" align="center" prop="isPay" :formatter="isPayFormat" />
      <el-table-column label="与司机结账时间" align="center" prop="payTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标记打款状态 0未打款/1已打款/2打款处理中" align="center" prop="isMarkStatus" :formatter="isMarkStatusFormat" />
      <el-table-column label="标记打款时间" align="center" prop="markTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.markTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运单是否已打印 0-否  1-是" align="center" prop="isPrintOrder" :formatter="isPrintOrderFormat" />
      <el-table-column label="打印时间" align="center" prop="prinTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.prinTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否批量接单订单 0-否  1-是" align="center" prop="isMultiOrder" :formatter="isMultiOrderFormat" />
      <el-table-column label="是否使用保证金 0-否  1-是" align="center" prop="isCash" :formatter="isCashFormat" />
      <el-table-column label="保证金" align="center" prop="cashDeposit" :formatter="cashDepositFormat" />
      <el-table-column label="月结订单结算状态 0-未结算 1-已结算" align="center" prop="monthlySettlementStatus" :formatter="monthlySettlementStatusFormat" />
      <el-table-column label="是否子单 0不是 " align="center" prop="isChild" :formatter="isChildFormat" />
      <el-table-column label="给超载的子单排序用 1车辆核载装货重量的子单，2其余重量子单" align="center" prop="childSort" :formatter="childSortFormat" />
      <el-table-column label="是否删除 0-正常 1-删除" align="center" prop="isDel" :formatter="isDelFormat" />
      <el-table-column label="修改人" align="center" prop="updateCode" :formatter="updateCodeFormat" />
      <el-table-column label="司机取消订单  0-》正常，1-》司机撤单申请 2-》货主同意撤销 3-》货主拒绝撤销" align="center" prop="cancelStatus" :formatter="cancelStatusFormat" />
      <el-table-column label="司机取消理由" align="center" prop="driverApplyRemark" :formatter="driverApplyRemarkFormat" />
      <el-table-column label="货主处理司机申请取消备注" align="center" prop="shipperDealRemark" :formatter="shipperDealRemarkFormat" /> -->
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
    <detail-dialog
      ref="DetailDialog"
      :title="title"
      :open.sync="open"
      :disable="formDisable"
      @refresh="getList"
    />
    <!-- 扣押金 对话框 -->
    <deduction-dialog
      :title="title"
      :open.sync="openDeduction"
      :current-id="currentId"
      @refresh="getList"
    />
    <!-- 退押金 对话框 -->
    <return-dialog
      :title="title"
      :open.sync="openReturn"
      :current-id="currentId"
      @refresh="getList"
    />
  </div>
</template>

<script>
import { listInfo, getInfo } from '@/api/waybill/receipt';
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
      // 是否结算字典
      'isOptions': [
        { 'dictLabel': '否', 'dictValue': 0 },
        { 'dictLabel': '是', 'dictValue': 1 }
      ],
      // 是否结算 0未结算，1已结算字典
      isSettleOptions: [
        { 'dictLabel': '未结算', 'dictValue': 0 },
        { 'dictLabel': '已结算', 'dictValue': 1 }
      ],
      // 回单确认状态 0未标记回单，1-已标记回单字典
      isReturnOptions: [
        { 'dictLabel': '未标记回单', 'dictValue': 0 },
        { 'dictLabel': '已标记回单', 'dictValue': 1 }
      ],
      // 支付给司机运费状态 0-未支付 1-已支付字典
      isPayOptions: [
        { 'dictLabel': '未支付', 'dictValue': 0 },
        { 'dictLabel': '已支付', 'dictValue': 1 }
      ],
      // 标记打款状态 0未打款/1已打款/2打款处理中字典
      isMarkStatusOptions: [
        { 'dictLabel': '未打款', 'dictValue': 0 },
        { 'dictLabel': '已打款', 'dictValue': 1 },
        { 'dictLabel': '打款处理中', 'dictValue': 2 }
      ],
      // 月结订单结算状态 0-未结算 1-已结算字典
      monthlySettlementStatusOptions: [
        { 'dictLabel': '未结算', 'dictValue': 0 },
        { 'dictLabel': '已结算', 'dictValue': 1 }
      ],
      // 给超载的子单排序用 1车辆核载装货重量的子单，2其余重量子单字典
      childSortOptions: [
        { 'dictLabel': '车辆核载装货重量的子单', 'dictValue': 1 },
        { 'dictLabel': '其余重量子单字典', 'dictValue': 2 }
      ],
      // 运单状态 0未接单/1已接单/2已签收/3已回单/4已结算/5已打款字典
      statusOptions: [
        { 'dictLabel': '未接单', 'dictValue': 0 },
        { 'dictLabel': '已接单', 'dictValue': 1 },
        { 'dictLabel': '已签收', 'dictValue': 2 },
        { 'dictLabel': '已回单', 'dictValue': 3 },
        { 'dictLabel': '已结算', 'dictValue': 4 },
        { 'dictLabel': '已打款', 'dictValue': 5 }
      ],
      // 货物重量字典
      weightOptions: [],
      // 司机取消订单  0-》正常，1-》司机撤单申请 2-》货主同意撤销 3-》货主拒绝撤销字典
      cancelStatusOptions: [
        { 'dictLabel': '正常', 'dictValue': 0 },
        { 'dictLabel': '司机撤单申请', 'dictValue': 1 },
        { 'dictLabel': '货主同意撤销', 'dictValue': 2 },
        { 'dictLabel': '货主拒绝撤销', 'dictValue': 3 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderCode: null,
        receiveTime: null,
        vehicleCode: null,
        drvierCode: null,
        waybillNo: null,
        status: null,
        isReturn: null,
        code: null,
        goodsCode: null,
        dispatchOrderCode: null,
        loadWeight: null,
        unloadWeight: null,
        wastage: null,
        isReceive: null,
        isFill: null,
        fillTime: null,
        isSign: null,
        signTime: null,
        isSettle: null,
        settleTime: null,
        returnRemarkTime: null,
        returnRemark: null,
        isPay: null,
        payTime: null,
        isMarkStatus: null,
        markTime: null,
        isPrintOrder: null,
        prinTime: null,
        isMultiOrder: null,
        isCash: null,
        cashDeposit: null,
        shipperDeliveryFee: null,
        monthlySettlementStatus: null,
        isChild: null,
        childSort: null,
        isDel: null,
        createCode: null,
        updateCode: null,
        weight: null,
        cancelStatus: null,
        driverApplyRemark: null,
        shipperDealRemark: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      formDisable: false,
      // 当前选中的运单id
      'currentId': null
    };
  },
  created() {
    this.getList();
    // this.getDicts('${column.dictType}').then(response => {
    //   this.idOptions = response.data;
    // });
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
    // 是否接单  0-否  1-是字典翻译
    isReceiveFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isReceive);
    },
    // 是否装货  0-否  1-是字典翻译
    isFillFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isFill);
    },
    // 是否签收 0-否  1-是字典翻译
    isSignFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isSign);
    },
    // 是否结算 0未结算，1已结算字典翻译
    isSettleFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isSettle);
    },
    // 回单确认状态 0未标记回单，1-已标记回单字典翻译
    isReturnFormat(row, column) {
      return this.selectDictLabel(this.isReturnOptions, row.isReturn);
    },
    // 支付给司机运费状态 0-未支付 1-已支付字典翻译
    isPayFormat(row, column) {
      return this.selectDictLabel(this.isPayOptions, row.isPay);
    },
    // 标记打款状态 0未打款/1已打款/2打款处理中字典翻译
    isMarkStatusFormat(row, column) {
      return this.selectDictLabel(this.isMarkStatusOptions, row.isMarkStatus);
    },
    // 运单是否已打印 0-否  1-是字典翻译
    isPrintOrderFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isPrintOrder);
    },
    // 是否批量接单订单 0-否  1-是字典翻译
    isMultiOrderFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isMultiOrder);
    },
    // 是否使用保证金 0-否  1-是字典翻译
    isCashFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isCash);
    },
    // 月结订单结算状态 0-未结算 1-已结算字典翻译
    monthlySettlementStatusFormat(row, column) {
      return this.selectDictLabel(
        this.monthlySettlementStatusOptions,
        row.monthlySettlementStatus
      );
    },
    // 是否子单 0不是 字典翻译
    isChildFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isChild);
    },
    // 给超载的子单排序用 1车辆核载装货重量的子单，2其余重量子单字典翻译
    childSortFormat(row, column) {
      return this.selectDictLabel(this.childSortOptions, row.childSort);
    },
    // 运单状态 0未接单/1已接单/2已签收/3已回单/4已结算/5已打款字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 司机取消订单  0-》正常，1-》司机撤单申请 2-》货主同意撤销 3-》货主拒绝撤销字典翻译
    cancelStatusFormat(row, column) {
      return this.selectDictLabel(this.cancelStatusOptions, row.cancelStatus);
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
      const id = row.id || this.ids;
      getInfo(id).then((response) => {
        this.$refs.DetailDialog.setForm(response.data);
        this.open = true;
        this.title = '详情';
        this.formDisable = true;
      });
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
