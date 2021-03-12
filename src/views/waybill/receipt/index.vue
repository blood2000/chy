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
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="回单确认状态 0未标记回单，1-已标记回单"
        align="center"
        prop="isReturn"
        :formatter="isReturnFormat"
      />
      <el-table-column
        label="货源编号"
        align="center"
        prop="orderCode"
        :formatter="orderCodeFormat"
      />
      <el-table-column
        label="创建人"
        align="center"
        prop="createCode"
        :formatter="createCodeFormat"
      />
      <el-table-column
        label="运输单号"
        align="center"
        prop="waybillNo"
        :formatter="waybillNoFormat"
      />
      <el-table-column
        label="调度单号"
        align="center"
        prop="dispatchOrderCode"
        :formatter="dispatchOrderCodeFormat"
      />
      <el-table-column
        label="实际承运人CODE"
        align="center"
        prop="drvierCode"
        :formatter="drvierCodeFormat"
      />
      <el-table-column
        label="货物重量"
        align="center"
        prop="weight"
        :formatter="weightFormat"
      />
      <el-table-column
        label="实际承运车辆CODE"
        align="center"
        prop="vehicleCode"
        :formatter="vehicleCodeFormat"
      />
      <el-table-column
        label="装车重量"
        align="center"
        prop="loadWeight"
        :formatter="loadWeightFormat"
      />
      <el-table-column
        label="卸车重量"
        align="center"
        prop="unloadWeight"
        :formatter="unloadWeightFormat"
      />
      <el-table-column
        label="货物损耗"
        align="center"
        prop="wastage"
        :formatter="wastageFormat"
      />
      <el-table-column
        label="给货主结算的和展示的每车总费"
        align="center"
        prop="shipperDeliveryFee"
        :formatter="shipperDeliveryFeeFormat"
      />
      <el-table-column
        label="运单状态 0未接单/1已接单/2已签收/3已回单/4已结算/5已打款"
        align="center"
        prop="status"
        :formatter="statusFormat"
      />
      <el-table-column
        label="装货时间"
        align="center"
        prop="fillTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fillTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="接单时间"
        align="center"
        prop="receiveTime"
        width="180"
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
            @click="handleDelete(scope.row)"
          >退押金</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
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

    <!-- 新增/修改/详情 对话框 -->
    <detail-dialog
      ref="DetailDialog"
      :title="title"
      :open.sync="open"
      :disable="formDisable"
      @refresh="getList"
    />
  </div>
</template>

<script>
import { listInfo, getInfo } from '@/api/waybill/receipt';
import DetailDialog from '../components/detailDialog';

export default {
  name: 'Receipt',
  components: {
    DetailDialog
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
      // 货源编号字典
      orderCodeOptions: [],
      // 商品编码字典
      goodsCodeOptions: [],
      // 运输单号字典
      waybillNoOptions: [],
      // 调度单号字典
      dispatchOrderCodeOptions: [],
      // 实际承运人CODE字典
      drvierCodeOptions: [],
      // 实际承运车辆CODE字典
      vehicleCodeOptions: [],
      // 装车重量字典
      loadWeightOptions: [],
      // 卸车重量字典
      unloadWeightOptions: [],
      // 货物损耗字典
      wastageOptions: [],
      // 是否接单  0-否  1-是字典
      isReceiveOptions: [],
      // 接单时间字典
      receiveTimeOptions: [],
      // 是否装货  0-否  1-是字典
      isFillOptions: [],
      // 装货时间字典
      fillTimeOptions: [],
      // 是否签收 0-否  1-是字典
      isSignOptions: [],
      // 签收时间字典
      signTimeOptions: [],
      // 是否结算 0未结算，1已结算字典
      isSettleOptions: [],
      // 结算时间字典
      settleTimeOptions: [],
      // 回单确认状态 0未标记回单，1-已标记回单字典
      isReturnOptions: [],
      // 回单确认时间字典
      returnRemarkTimeOptions: [],
      // 回单确认备注字典
      returnRemarkOptions: [],
      // 支付给司机运费状态 0-未支付 1-已支付字典
      isPayOptions: [],
      // 与司机结账时间字典
      payTimeOptions: [],
      // 标记打款状态 0未打款/1已打款/2打款处理中字典
      isMarkStatusOptions: [],
      // 标记打款时间字典
      markTimeOptions: [],
      // 运单是否已打印 0-否  1-是字典
      isPrintOrderOptions: [],
      // 打印时间字典
      prinTimeOptions: [],
      // 是否批量接单订单 0-否  1-是字典
      isMultiOrderOptions: [],
      // 是否使用保证金 0-否  1-是字典
      isCashOptions: [],
      // 保证金字典
      cashDepositOptions: [],
      // 给货主结算的和展示的每车总费字典
      shipperDeliveryFeeOptions: [],
      // 月结订单结算状态 0-未结算 1-已结算字典
      monthlySettlementStatusOptions: [],
      // 是否子单 0不是 字典
      isChildOptions: [],
      // 给超载的子单排序用 1车辆核载装货重量的子单，2其余重量子单字典
      childSortOptions: [],
      // 是否删除 0-正常 1-删除字典
      isDelOptions: [],
      // 运单状态 0未接单/1已接单/2已签收/3已回单/4已结算/5已打款字典
      statusOptions: [],
      // 创建人字典
      createCodeOptions: [],
      // 创建时间字典
      createTimeOptions: [],
      // 修改人字典
      updateCodeOptions: [],
      // 修改时间字典
      updateTimeOptions: [],
      // 货物重量字典
      weightOptions: [],
      // 司机取消订单  0-》正常，1-》司机撤单申请 2-》货主同意撤销 3-》货主拒绝撤销字典
      cancelStatusOptions: [],
      // 司机取消理由字典
      driverApplyRemarkOptions: [],
      // 货主处理司机申请取消备注字典
      shipperDealRemarkOptions: [],
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
      formDisable: false
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
    // id字典翻译
    idFormat(row, column) {
      return this.selectDictLabel(this.idOptions, row.id);
    },
    // code字典翻译
    codeFormat(row, column) {
      return this.selectDictLabel(this.codeOptions, row.code);
    },
    // 货源编号字典翻译
    orderCodeFormat(row, column) {
      return this.selectDictLabel(this.orderCodeOptions, row.orderCode);
    },
    // 商品编码字典翻译
    goodsCodeFormat(row, column) {
      return this.selectDictLabel(this.goodsCodeOptions, row.goodsCode);
    },
    // 运输单号字典翻译
    waybillNoFormat(row, column) {
      return this.selectDictLabel(this.waybillNoOptions, row.waybillNo);
    },
    // 调度单号字典翻译
    dispatchOrderCodeFormat(row, column) {
      return this.selectDictLabel(
        this.dispatchOrderCodeOptions,
        row.dispatchOrderCode
      );
    },
    // 实际承运人CODE字典翻译
    drvierCodeFormat(row, column) {
      return this.selectDictLabel(this.drvierCodeOptions, row.drvierCode);
    },
    // 实际承运车辆CODE字典翻译
    vehicleCodeFormat(row, column) {
      return this.selectDictLabel(this.vehicleCodeOptions, row.vehicleCode);
    },
    // 装车重量字典翻译
    loadWeightFormat(row, column) {
      return this.selectDictLabel(this.loadWeightOptions, row.loadWeight);
    },
    // 卸车重量字典翻译
    unloadWeightFormat(row, column) {
      return this.selectDictLabel(this.unloadWeightOptions, row.unloadWeight);
    },
    // 货物损耗字典翻译
    wastageFormat(row, column) {
      return this.selectDictLabel(this.wastageOptions, row.wastage);
    },
    // 是否接单  0-否  1-是字典翻译
    isReceiveFormat(row, column) {
      return this.selectDictLabel(this.isReceiveOptions, row.isReceive);
    },
    // 接单时间字典翻译
    receiveTimeFormat(row, column) {
      return this.selectDictLabel(this.receiveTimeOptions, row.receiveTime);
    },
    // 是否装货  0-否  1-是字典翻译
    isFillFormat(row, column) {
      return this.selectDictLabel(this.isFillOptions, row.isFill);
    },
    // 装货时间字典翻译
    fillTimeFormat(row, column) {
      return this.selectDictLabel(this.fillTimeOptions, row.fillTime);
    },
    // 是否签收 0-否  1-是字典翻译
    isSignFormat(row, column) {
      return this.selectDictLabel(this.isSignOptions, row.isSign);
    },
    // 签收时间字典翻译
    signTimeFormat(row, column) {
      return this.selectDictLabel(this.signTimeOptions, row.signTime);
    },
    // 是否结算 0未结算，1已结算字典翻译
    isSettleFormat(row, column) {
      return this.selectDictLabel(this.isSettleOptions, row.isSettle);
    },
    // 结算时间字典翻译
    settleTimeFormat(row, column) {
      return this.selectDictLabel(this.settleTimeOptions, row.settleTime);
    },
    // 回单确认状态 0未标记回单，1-已标记回单字典翻译
    isReturnFormat(row, column) {
      return this.selectDictLabel(this.isReturnOptions, row.isReturn);
    },
    // 回单确认时间字典翻译
    returnRemarkTimeFormat(row, column) {
      return this.selectDictLabel(
        this.returnRemarkTimeOptions,
        row.returnRemarkTime
      );
    },
    // 回单确认备注字典翻译
    returnRemarkFormat(row, column) {
      return this.selectDictLabel(this.returnRemarkOptions, row.returnRemark);
    },
    // 支付给司机运费状态 0-未支付 1-已支付字典翻译
    isPayFormat(row, column) {
      return this.selectDictLabel(this.isPayOptions, row.isPay);
    },
    // 与司机结账时间字典翻译
    payTimeFormat(row, column) {
      return this.selectDictLabel(this.payTimeOptions, row.payTime);
    },
    // 标记打款状态 0未打款/1已打款/2打款处理中字典翻译
    isMarkStatusFormat(row, column) {
      return this.selectDictLabel(this.isMarkStatusOptions, row.isMarkStatus);
    },
    // 标记打款时间字典翻译
    markTimeFormat(row, column) {
      return this.selectDictLabel(this.markTimeOptions, row.markTime);
    },
    // 运单是否已打印 0-否  1-是字典翻译
    isPrintOrderFormat(row, column) {
      return this.selectDictLabel(this.isPrintOrderOptions, row.isPrintOrder);
    },
    // 打印时间字典翻译
    prinTimeFormat(row, column) {
      return this.selectDictLabel(this.prinTimeOptions, row.prinTime);
    },
    // 是否批量接单订单 0-否  1-是字典翻译
    isMultiOrderFormat(row, column) {
      return this.selectDictLabel(this.isMultiOrderOptions, row.isMultiOrder);
    },
    // 是否使用保证金 0-否  1-是字典翻译
    isCashFormat(row, column) {
      return this.selectDictLabel(this.isCashOptions, row.isCash);
    },
    // 保证金字典翻译
    cashDepositFormat(row, column) {
      return this.selectDictLabel(this.cashDepositOptions, row.cashDeposit);
    },
    // 给货主结算的和展示的每车总费字典翻译
    shipperDeliveryFeeFormat(row, column) {
      return this.selectDictLabel(
        this.shipperDeliveryFeeOptions,
        row.shipperDeliveryFee
      );
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
      return this.selectDictLabel(this.isChildOptions, row.isChild);
    },
    // 给超载的子单排序用 1车辆核载装货重量的子单，2其余重量子单字典翻译
    childSortFormat(row, column) {
      return this.selectDictLabel(this.childSortOptions, row.childSort);
    },
    // 是否删除 0-正常 1-删除字典翻译
    isDelFormat(row, column) {
      return this.selectDictLabel(this.isDelOptions, row.isDel);
    },
    // 运单状态 0未接单/1已接单/2已签收/3已回单/4已结算/5已打款字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 创建人字典翻译
    createCodeFormat(row, column) {
      return this.selectDictLabel(this.createCodeOptions, row.createCode);
    },
    // 创建时间字典翻译
    createTimeFormat(row, column) {
      return this.selectDictLabel(this.createTimeOptions, row.createTime);
    },
    // 修改人字典翻译
    updateCodeFormat(row, column) {
      return this.selectDictLabel(this.updateCodeOptions, row.updateCode);
    },
    // 修改时间字典翻译
    updateTimeFormat(row, column) {
      return this.selectDictLabel(this.updateTimeOptions, row.updateTime);
    },
    // 货物重量字典翻译
    weightFormat(row, column) {
      return this.selectDictLabel(this.weightOptions, row.weight);
    },
    // 司机取消订单  0-》正常，1-》司机撤单申请 2-》货主同意撤销 3-》货主拒绝撤销字典翻译
    cancelStatusFormat(row, column) {
      return this.selectDictLabel(this.cancelStatusOptions, row.cancelStatus);
    },
    // 司机取消理由字典翻译
    driverApplyRemarkFormat(row, column) {
      return this.selectDictLabel(
        this.driverApplyRemarkOptions,
        row.driverApplyRemark
      );
    },
    // 货主处理司机申请取消备注字典翻译
    shipperDealRemarkFormat(row, column) {
      return this.selectDictLabel(
        this.shipperDealRemarkOptions,
        row.shipperDealRemark
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
