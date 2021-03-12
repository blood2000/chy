<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="130px"
    >
      <el-form-item
        label="货源编号"
        prop="orderCode"
      >
        <el-input
          v-model="queryParams.orderCode"
          placeholder="请输入货源编号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="商品编码"
        prop="goodsCode"
      >
        <el-input
          v-model="queryParams.goodsCode"
          placeholder="请输入商品编码"
          clearable
          size="small"
          style="width: 240px"
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
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="调度单号"
        prop="dispatchOrderCode"
      >
        <el-input
          v-model="queryParams.dispatchOrderCode"
          placeholder="请输入调度单号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="实际承运人"
        prop="drvierCode"
      >
        <el-input
          v-model="queryParams.drvierCode"
          placeholder="请输入实际承运人"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="实际承运车辆"
        prop="vehicleCode"
      >
        <el-input
          v-model="queryParams.vehicleCode"
          placeholder="请输入实际承运车辆"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="接单时间"
        prop="receiveTime"
      >
        <el-date-picker
          v-model="queryParams.receiveTime"
          clearable
          size="small"
          style="width: 240px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择接单时间"
        />
      </el-form-item>
      <el-form-item
        label="装货时间"
        prop="fillTime"
      >
        <el-date-picker
          v-model="queryParams.fillTime"
          clearable
          size="small"
          style="width: 240px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择装货时间"
        />
      </el-form-item>
      <el-form-item
        label="签收时间"
        prop="signTime"
      >
        <el-date-picker
          v-model="queryParams.signTime"
          clearable
          size="small"
          style="width: 240px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择签收时间"
        />
      </el-form-item>
      <el-form-item
        label="结算时间"
        prop="settleTime"
      >
        <el-date-picker
          v-model="queryParams.settleTime"
          clearable
          size="small"
          style="width: 240px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择结算时间"
        />
      </el-form-item>
      <el-form-item
        label="回单确认时间"
        prop="returnRemarkTime"
      >
        <el-date-picker
          v-model="queryParams.returnRemarkTime"
          clearable
          size="small"
          style="width: 240px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择回单确认时间"
        />
      </el-form-item>
      <el-form-item
        label="与司机结账时间"
        prop="payTime"
      >
        <el-date-picker
          v-model="queryParams.payTime"
          clearable
          size="small"
          style="width: 240px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择与司机结账时间"
        />
      </el-form-item>
      <el-form-item
        label="标记打款状态"
        prop="isMarkStatus"
      >
        <el-select
          v-model="queryParams.isMarkStatus"
          placeholder="请选择标记打款状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in isMarkStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="标记打款时间"
        prop="markTime"
      >
        <el-date-picker
          v-model="queryParams.markTime"
          clearable
          size="small"
          style="width: 240px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择标记打款时间"
        />
      </el-form-item>
      <el-form-item
        label="打印时间"
        prop="prinTime"
      >
        <el-date-picker
          v-model="queryParams.prinTime"
          clearable
          size="small"
          style="width: 240px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择打印时间"
        />
      </el-form-item>
      <el-form-item
        label="月结订单结算状态"
        prop="monthlySettlementStatus"
      >
        <el-select
          v-model="queryParams.monthlySettlementStatus"
          placeholder="请选择月结订单结算状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in monthlySettlementStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="运单状态"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          placeholder="请选择运单状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="司机取消订单"
        prop="cancelStatus"
      >
        <el-select
          v-model="queryParams.cancelStatus"
          placeholder="请选择司机取消订单"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in cancelStatusOptions"
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
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="managesList"
    >
      <el-table-column
        label="货源编号"
        align="center"
        prop="orderCode"
      />
      <el-table-column
        label="商品编码"
        align="center"
        prop="goodsCode"
      />
      <el-table-column
        label="运输单号"
        align="center"
        prop="waybillNo"
      />
      <el-table-column
        label="调度单号"
        align="center"
        prop="dispatchOrderCode"
      />
      <el-table-column
        label="实际承运人"
        align="center"
        prop="drvierCode"
      />
      <el-table-column
        label="实际承运车辆"
        align="center"
        prop="vehicleCode"
      />
      <el-table-column
        label="装车重量"
        align="center"
        prop="loadWeight"
      />
      <el-table-column
        label="卸车重量"
        align="center"
        prop="unloadWeight"
      />
      <el-table-column
        label="货物损耗"
        align="center"
        prop="wastage"
      />
      <el-table-column
        label="是否接单"
        align="center"
        prop="isReceive"
        :formatter="isReceiveFormat"
      />
      <el-table-column
        label="接单时间"
        align="center"
        prop="receiveTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.receiveTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否装货"
        align="center"
        prop="isFill"
        :formatter="isFillFormat"
      />
      <el-table-column
        label="装货时间"
        align="center"
        prop="fillTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.fillTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否签收"
        align="center"
        prop="isSign"
        :formatter="isSignFormat"
      />
      <el-table-column
        label="签收时间"
        align="center"
        prop="signTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.signTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否结算"
        align="center"
        prop="isSettle"
        :formatter="isSettleFormat"
      />
      <el-table-column
        label="结算时间"
        align="center"
        prop="settleTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.settleTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="回单确认状态"
        align="center"
        prop="isReturn"
        :formatter="isReturnFormat"
      />
      <el-table-column
        label="回单确认时间"
        align="center"
        prop="returnRemarkTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.returnRemarkTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="回单确认备注"
        align="center"
        prop="returnRemark"
      />
      <el-table-column
        label="支付给司机运费状态"
        align="center"
        prop="isPay"
        :formatter="isPayFormat"
      />
      <el-table-column
        label="与司机结账时间"
        align="center"
        prop="payTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.payTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标记打款状态"
        align="center"
        prop="isMarkStatus"
        :formatter="isMarkStatusFormat"
      />
      <el-table-column
        label="标记打款时间"
        align="center"
        prop="markTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.markTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="运单是否已打印"
        align="center"
        prop="isPrintOrder"
        :formatter="isPrintOrderFormat"
      />
      <el-table-column
        label="打印时间"
        align="center"
        prop="prinTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.prinTime), '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否批量接单订单"
        align="center"
        prop="isMultiOrder"
        :formatter="isMultiOrderFormat"
      />
      <el-table-column
        label="是否使用保证金"
        align="center"
        prop="isCash"
        :formatter="isCashFormat"
      />
      <el-table-column
        label="保证金"
        align="center"
        prop="cashDeposit"
      />
      <el-table-column
        label="给货主结算的和展示的每车总费"
        align="center"
        prop="shipperDeliveryFee"
      />
      <el-table-column
        label="月结订单结算状态"
        align="center"
        prop="monthlySettlementStatus"
        :formatter="monthlySettlementStatusFormat"
      />
      <el-table-column
        label="是否子单"
        align="center"
        prop="isChild"
        :formatter="isChildFormat"
      />
      <el-table-column
        label="给超载的子单排序用"
        align="center"
        prop="childSort"
        :formatter="childSortFormat"
      />
      <el-table-column
        label="是否删除"
        align="center"
        prop="isDel"
        :formatter="isDelFormat"
      />
      <el-table-column
        label="运单状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
      />
      <el-table-column
        label="创建人"
        align="center"
        prop="createCode"
      />
      <el-table-column
        label="修改人"
        align="center"
        prop="updateCode"
      />
      <el-table-column
        label="货物重量"
        align="center"
        prop="weight"
      />
      <el-table-column
        label="司机取消订单"
        align="center"
        prop="cancelStatus"
        :formatter="cancelStatusFormat"
      />
      <el-table-column
        label="司机取消理由"
        align="center"
        prop="driverApplyRemark"
      />
      <el-table-column
        label="货主处理司机申请取消备注"
        align="center"
        prop="shipperDealRemark"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="240"
      >
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
import { listManages, delManages } from '@/api/waybill/manages';
import DetailDialog from '../components/detailDialog';
import MarkAbnormalDialog from './markAbnormalDialog';
import SeperateListDialog from './seperateListDialog';
import RemarkDialog from './remarkDialog';

export default {
  'name': 'Manages',
  'components': {
    DetailDialog,
    MarkAbnormalDialog,
    SeperateListDialog,
    RemarkDialog
  },
  data() {
    return {
      // 遮罩层
      'loading': true,
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
        { 'dictLabel': '未接单', 'dictValue': 0 },
        { 'dictLabel': '已接单', 'dictValue': 1 },
        { 'dictLabel': '已签收', 'dictValue': 2 },
        { 'dictLabel': '已回单', 'dictValue': 3 },
        { 'dictLabel': '已结算', 'dictValue': 4 },
        { 'dictLabel': '已打款', 'dictValue': 5 }
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
    // 是否子单字典翻译
    isChildFormat(row, column) {
      return this.selectDictLabel(this.isOptions, row.isChild);
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
    /** 详情按钮操作 */
    handleUpdate(row) {
      this.currentId = row.code;
      this.open = true;
      this.title = '查看运单详情';
      this.formDisable = true;
    },
    /** 标记异常按钮操作 */
    handleMark(row) {
      this.currentId = row.code;
      this.openMarkAbanormal = true;
      this.title = '标记异常';
    },
    /** 分单列表按钮操作 */
    handleSeperate(row) {
      this.currentId = row.code;
      this.openSeperateList = true;
      this.title = '子单列表';
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.code;

      this.$confirm('是否确认作废编号为"' + id + '"的运单?', '警告', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(function() {
        return delManages(id);
      }).then(() => {
        this.getList();
        this.msgSuccess('作废成功');
      });
    },
    /** 备注按钮操作 */
    handleRemarks(row) {
      this.currentId = row.code;
      this.openRemark = true;
      this.title = '编辑货主运单备注';
    }
  }
};
</script>
