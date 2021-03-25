<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="78px">
      <el-form-item label="下单客户" prop="orderClient">
        <el-input
          v-model="queryParams.orderClient"
          placeholder="请输入下单客户"
          clearable
          size="small"
          style="width: 278px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发货企业" prop="deliveryCompany">
        <el-input
          v-model="queryParams.deliveryCompany"
          placeholder="请输入发货企业"
          clearable
          size="small"
          style="width: 278px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="装货信息" prop="loadInfo">
        <el-input
          v-model="queryParams.loadInfo"
          placeholder="装货地/装货电话/发货人"
          clearable
          size="small"
          style="width: 278px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货信息" prop="receivedInfo">
        <el-input
          v-model="queryParams.receivedInfo"
          placeholder="目的地/收货电话/收货人"
          clearable
          size="small"
          style="width: 278px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接单时间">
        <el-date-picker
          v-model="queryParams.startReceiveTime"
          size="small"
          style="width: 128px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        至
        <el-date-picker
          v-model="queryParams.endReceiveTime"
          size="small"
          style="width: 128px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="货源单号" prop="mainOrderNumber">
        <el-input
          v-model="queryParams.mainOrderNumber"
          placeholder="请输入货源单号"
          clearable
          size="small"
          style="width: 278px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运输单号" prop="waybillNo">
        <el-input
          v-model="queryParams.waybillNo"
          placeholder="请输入运输单号"
          clearable
          size="small"
          style="width: 278px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          style="width: 278px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机姓名" prop="driverName">
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          style="width: 278px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机电话" prop="driverPhone">
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入司机电话"
          clearable
          size="small"
          style="width: 278px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运单状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择运单状态"
          clearable
          size="small"
          style="width: 278px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否分单" prop="isSplit">
        <el-select
          v-model="queryParams.isSplit"
          placeholder="请选择是否分单"
          clearable
          size="small"
          style="width: 278px"
        >
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
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

    <!-- table -->
    <el-table v-loading="loading" :data="managesList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column label="货源单号" align="center" prop="mainOrderNumber" />
      <el-table-column label="发货企业" align="center" prop="shipperFactory" />
      <el-table-column label="下单客户" align="center" prop="orderClient" />
      <el-table-column label="运输单号" align="center" prop="waybillNo" />
      <el-table-column label="运单状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="是否分单" align="center" prop="isSplit" :formatter="isSplitFormat" />
      <el-table-column label="承运调度" align="center" prop="teamName" />
      <el-table-column label="承运人" align="center" prop="driverName" />
      <el-table-column label="司机电话" align="center" prop="driverPhone" />
      <el-table-column label="货物类型" align="center" prop="goodsBigType" />
      <el-table-column label="货物类型分类" align="center" prop="goodsType" />
      <el-table-column label="装车重量" align="center" prop="loadWeight" />
      <el-table-column label="卸车重量" align="center" prop="unloadWeight" />
      <el-table-column label="数量(车)" align="center" prop="carNum" />
      <el-table-column label="用车类型" align="center" prop="carType" />
      <el-table-column label="货物单价" align="center" prop="goodsPrice" />
      <el-table-column label="运费单价" align="center" prop="freightPrice" />
      <el-table-column label="公里数" align="center" prop="mileage" />
      <el-table-column label="含税价" align="center" prop="taxFee" />
      <el-table-column label="不含税价" align="center" prop="noTaxFee" />
      <el-table-column label="装货地" align="center" prop="loadAddress" />
      <el-table-column label="卸货地" align="center" prop="unloadAddress" />
      <el-table-column label="发布货源时间" align="center" prop="orderTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接单时间" align="center" prop="receiveTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后操作时间" align="center" prop="wayBillUpdateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.wayBillUpdateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="240">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['waybill:manages:detail']"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleUpdate(scope.row)"
          >
            详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-lock"
            @click="handleMark(scope.row)"
          >
            标记异常
          </el-button>
          <el-button
            v-if="scope.row.isChild === 2"
            size="mini"
            type="text"
            icon="el-icon-date"
            @click="handleSeperate(scope.row)"
          >
            分单列表
          </el-button>
          <el-button
            v-hasPermi="['waybill:manages:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >
            作废运单
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="handleRemarks(scope.row)"
          >
            备注
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 详情对话框 -->
    <detail-dialog
      :title="title"
      :open.sync="open"
      :current-id="currentId"
      :disable="formDisable"
      @refresh="getList"
    />
    <!-- 标记异常对话框 -->
    <mark-abnormal-dialog
      :title="title"
      :open.sync="openMarkAbanormal"
      :current-id="currentId"
      @refresh="getList"
    />
    <!-- 分单列表对话框 -->
    <seperate-list-dialog
      :title="title"
      :open.sync="openSeperateList"
      :current-id="currentId"
      @refresh="getList"
    />
    <!-- 备注对话框 -->
    <remark-dialog
      :title="title"
      :open.sync="openRemark"
      :current-id="currentId"
      @refresh="getList"
    />
  </div>
</template>

<script>
import { listManages, waybillInvalid } from '@/api/waybill/manages';
import DetailDialog from '../components/detailDialog';
import MarkAbnormalDialog from './markAbnormalDialog';
import SeperateListDialog from './seperateListDialog';
import RemarkDialog from './remarkDialog';

export default {
  name: 'Manages',
  components: {
    DetailDialog,
    MarkAbnormalDialog,
    SeperateListDialog,
    RemarkDialog
  },
  data() {
    return {
      // 遮罩层
      'loading': true,
      // 选中数组
      'ids': [],
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'managesList': [],
      // 弹出层标题
      'title': '',
      // 是否显示弹出层
      'open': false,
      'openMarkAbanormal': false,
      'openSeperateList': false,
      'openRemark': false,
      // 是否字典
      'isOptions': [
        { 'dictLabel': '否', 'dictValue': 0 },
        { 'dictLabel': '是', 'dictValue': 1 }
      ],
      // 是否结算字典
      'isSettleOptions': [
        { 'dictLabel': '未结算', 'dictValue': 0 },
        { 'dictLabel': '已结算', 'dictValue': 1 }
      ],
      // 回单确认状态字典
      'isReturnOptions': [
        { 'dictLabel': '未标记回单', 'dictValue': 0 },
        { 'dictLabel': '已标记回单', 'dictValue': 1 }
      ],
      // 支付给司机运费状态字典
      'isPayOptions': [
        { 'dictLabel': '未支付', 'dictValue': 0 },
        { 'dictLabel': '已支付字典', 'dictValue': 1 }
      ],
      // 标记打款状态字典
      'isMarkStatusOptions': [
        { 'dictLabel': '未打款', 'dictValue': 0 },
        { 'dictLabel': '已打款', 'dictValue': 1 },
        { 'dictLabel': '打款处理中', 'dictValue': 2 }
      ],
      // 月结订单结算状态字典
      'monthlySettlementStatusOptions': [
        { 'dictLabel': '未结算', 'dictValue': 0 },
        { 'dictLabel': '已结算', 'dictValue': 1 }
      ],
      // 给超载的子单排序用字典
      'childSortOptions': [
        { 'dictLabel': '车辆核载装货重量的子单', 'dictValue': 1 },
        { 'dictLabel': '其余重量子单', 'dictValue': 2 }
      ],
      // 是否删除字典
      'isDelOptions': [
        { 'dictLabel': '正常', 'dictValue': 0 },
        { 'dictLabel': '删除', 'dictValue': 1 }
      ],
      // 运单状态字典
      'statusOptions': [
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
      // 司机取消订单字典
      'cancelStatusOptions': [
        { 'dictLabel': '正常', 'dictValue': 0 },
        { 'dictLabel': '司机撤单申请', 'dictValue': 1 },
        { 'dictLabel': '货主同意撤销', 'dictValue': 2 },
        { 'dictLabel': '货主拒绝撤销', 'dictValue': 3 }
      ],
      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'isInvalid': 0, // 0正常 1作废
        'isAbnormal': 0, // 0正常 1异常
        'isChildList': '0,2', // 是否子单 0不是 1是 2超载的主单
        'code': null,
        'orderCode': null,
        'goodsCode': null,
        'waybillNo': null,
        'dispatchOrderCode': null,
        'drvierCode': null,
        'vehicleCode': null,
        'loadWeight': null,
        'unloadWeight': null,
        'wastage': null,
        'isReceive': null,
        'receiveTime': null,
        'isFill': null,
        'fillTime': null,
        'isSign': null,
        'signTime': null,
        'isSettle': null,
        'settleTime': null,
        'isReturn': null,
        'returnRemarkTime': null,
        'returnRemark': null,
        'isPay': null,
        'payTime': null,
        'isMarkStatus': null,
        'markTime': null,
        'isPrintOrder': null,
        'prinTime': null,
        'isMultiOrder': null,
        'isCash': null,
        'cashDeposit': null,
        'shipperDeliveryFee': null,
        'monthlySettlementStatus': null,
        'isChild': null,
        'childSort': null,
        'isDel': null,
        'status': null,
        'createCode': null,
        'updateCode': null,
        'weight': null,
        'cancelStatus': null,
        'driverApplyRemark': null,
        'shipperDealRemark': null
      },
      // 表单参数
      'form': {},
      // 表单校验
      'rules': {},
      'formDisable': false,
      // 当前选中的运单id
      'currentId': null
    };
  },
  created() {
    this.getList();
  },
  'methods': {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listManages(this.queryParams).then(response => {
        this.managesList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 是否接单字典翻译
    isReceiveFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isReceive);
    },
    // 是否装货字典翻译
    isFillFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isFill);
    },
    // 是否签收字典翻译
    isSignFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isSign);
    },
    // 是否结算字典翻译
    isSettleFormat(row, column) {
      return this.selectDictLabel(this.isSettleOptions, row.isSettle);
    },
    // 回单确认状态字典翻译
    isReturnFormat(row, column) {
      return this.selectDictLabel(this.isReturnOptions, row.isReturn);
    },
    // 支付给司机运费状态字典翻译
    isPayFormat(row, column) {
      return this.selectDictLabel(this.isPayOptions, row.isPay);
    },
    // 标记打款状态字典翻译
    isMarkStatusFormat(row, column) {
      return this.selectDictLabel(this.isMarkStatusOptions, row.isMarkStatus);
    },
    // 运单是否已打印字典翻译
    isPrintOrderFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isPrintOrder);
    },
    // 是否批量接单订单字典翻译
    isMultiOrderFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isMultiOrder);
    },
    // 是否使用保证金字典翻译
    isCashFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isCash);
    },
    // 月结订单结算状态字典翻译
    monthlySettlementStatusFormat(row, column) {
      return this.selectDictLabel(this.monthlySettlementStatusOptions, row.monthlySettlementStatus);
    },
    // 是否分单字典翻译
    isSplitFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isSplit);
    },
    // 给超载的子单排序用字典翻译
    childSortFormat(row, column) {
      return this.selectDictLabel(this.childSortOptions, row.childSort);
    },
    // 是否删除字典翻译
    isDelFormat(row, column) {
      return this.selectDictLabel(this.isDelOptions, row.isDel);
    },
    // 运单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 司机取消订单字典翻译
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
      this.ids = selection.map(item => item.code);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 详情按钮操作 */
    handleUpdate(row) {
      this.currentId = row.wayBillCode;
      this.open = true;
      this.title = '查看运单详情';
      this.formDisable = true;
    },
    /** 标记异常按钮操作 */
    handleMark(row) {
      this.currentId = row.wayBillCode;
      this.openMarkAbanormal = true;
      this.title = '标记异常';
    },
    /** 分单列表按钮操作 */
    handleSeperate(row) {
      this.currentId = row.wayBillCode;
      this.openSeperateList = true;
      this.title = '子单列表';
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const code = row.wayBillCode;
      this.$confirm('是否确认作废编号为"' + code + '"的运单?', '警告', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(function() {
        return waybillInvalid(code);
      }).then(() => {
        this.getList();
        this.msgSuccess('操作成功');
      });
    },
    /** 备注按钮操作 */
    handleRemarks(row) {
      this.currentId = row.wayBillCode;
      this.openRemark = true;
      this.title = '编辑货主运单备注';
    }
  }
};
</script>
