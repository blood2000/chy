<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
      <el-form-item v-show="isAdmin" label="下单客户" prop="orderClient">
        <el-input
          v-model="queryParams.orderClient"
          placeholder="请输入下单客户"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item v-show="isAdmin" label="发货企业" prop="deliveryCompany">
        <el-input
          v-model="queryParams.deliveryCompany"
          placeholder="请输入发货企业"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="装货信息" prop="loadInfo">
        <el-input
          v-model="queryParams.loadInfo"
          placeholder="装货地/装货电话/发货人"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货信息" prop="receivedInfo">
        <el-input
          v-model="queryParams.receivedInfo"
          placeholder="目的地/收货电话/收货人"
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
      <el-form-item label="司机电话" prop="driverPhone">
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入司机电话"
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
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分单" prop="isChildList">
        <el-select
          v-model="queryParams.isChildList"
          placeholder="请选择是否分单"
          clearable
          filterable
          size="small"
          style="width: 228px"
        >
          <el-option
            v-for="dict in isChildOptions"
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
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <!-- table -->
    <RefactorTable :loading="loading" :data="managesList" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
      <template #status="{row}">
        <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
      </template>
      <!-- <template #isChild="{row}">
        <span>{{ selectDictLabel(isChildOptions, row.isChild) }}</span>
      </template> -->
      <template #isWarning="{row}">
        <span>{{ selectDictLabel(isWarningOptions, row.isWarning) }}</span>
      </template>
      <template #orderTime="{row}">
        <span>{{ parseTime(row.orderTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #receiveTime="{row}">
        <span>{{ parseTime(row.receiveTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #wayBillUpdateTime="{row}">
        <span>{{ parseTime(row.wayBillUpdateTime, '{y}-{m}-{d}') }}</span>
      </template>
      <template #edit="{row}">
        <el-button
          v-hasPermi="['transportation:waybill:getWayBillByCode']"
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleUpdate(row)"
        >
          详情
        </el-button>
        <el-button
          v-has-permi="['transportation:waybillAbnormal:add']"
          size="mini"
          type="text"
          icon="el-icon-lock"
          @click="handleMark(row)"
        >
          标记异常
        </el-button>
        <el-button
          v-if="row.isChild === 2"
          size="mini"
          type="text"
          icon="el-icon-date"
          @click="handleSeperate(row)"
        >
          分单列表
        </el-button>
        <el-button
          v-hasPermi="['transportation:waybillOper:invalid']"
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(row)"
        >
          作废运单
        </el-button>
        <el-button
          v-has-permi="['transportation:waybillOper:shipperRemark']"
          size="mini"
          type="text"
          icon="el-icon-edit-outline"
          @click="handleRemarks(row)"
        >
          备注
        </el-button>
      </template>
    </RefactorTable>

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
      :current-row="currentRow"
      @refresh="getList"
    />
    <!-- 标记异常对话框 -->
    <mark-abnormal-dialog
      ref="MarkAbnormalDialog"
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
import { listManagesApi, listManages, waybillInvalid } from '@/api/waybill/manages';
import DetailDialog from '../components/detailDialog';
import MarkAbnormalDialog from './markAbnormalDialog';
import SeperateListDialog from './seperateListDialog';
import RemarkDialog from './remarkDialog';
import { getUserInfo } from '@/utils/auth';

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
      receiveTime: [],
      tableColumnsConfig: [],
      api: listManagesApi,
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
      // 回单确认状态字典
      'isReturnOptions': [
        { 'dictLabel': '未标记回单', 'dictValue': 0 },
        { 'dictLabel': '已标记回单', 'dictValue': 1 }
      ],
      // 异常标记状态字典
      'isWarningOptions': [
        { 'dictLabel': '正常', 'dictValue': 0 },
        { 'dictLabel': '异常', 'dictValue': 1 },
        { 'dictLabel': '取消', 'dictValue': 2 }
      ],
      // 是否子单字典
      'isChildOptions': [
        { 'dictLabel': '否', 'dictValue': 0 },
        // { 'dictLabel': '子单', 'dictValue': 1 },
        { 'dictLabel': '是', 'dictValue': 2 }
      ],
      // 给超载的子单排序用字典
      'childSortOptions': [
        { 'dictLabel': '车辆核载装货重量的子单', 'dictValue': 1 },
        { 'dictLabel': '其余重量子单', 'dictValue': 2 }
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
        'isAbnormal': 0,
        'isInvalid': 0,
        'isChildList': [0, 2],
        'orderClient': null,
        'deliveryCompany': null,
        'loadInfo': null,
        'receivedInfo': null,
        'startReceiveTime': null,
        'endReceiveTime': null,
        'mainOrderNumber': null,
        'waybillNo': null,
        'licenseNumber': null,
        'driverName': null,
        'driverPhone': null,
        'status': null
      },
      // 表单参数
      'form': {},
      // 表单校验
      'rules': {},
      'formDisable': false,
      // 当前选中的运单id
      'currentId': null,
      'currentRow': null,
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
    this.tableHeaderConfig(this.tableColumnsConfig, listManagesApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 285,
      fixed: 'right'
    });
    this.getList();
  },
  methods: {
    datechoose(date) {
      this.queryParams.startReceiveTime = this.parseTime(date[0], '{y}-{m}-{d}');
      this.queryParams.endReceiveTime = this.parseTime(date[1], '{y}-{m}-{d}');
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      listManages(this.queryParams).then(response => {
        this.managesList = response.rows;
        this.total = response.total;
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
      this.receiveTime = [];
      this.queryParams.startReceiveTime = null;
      this.queryParams.endReceiveTime = null;
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
      this.currentRow = row;
      this.open = true;
      this.title = '查看运单详情';
      this.formDisable = true;
    },
    /** 标记异常按钮操作 */
    handleMark(row) {
      this.$refs.MarkAbnormalDialog.reset();
      // this.currentId = row.wayBillCode;
      this.openMarkAbanormal = true;
      this.title = '标记异常';
      this.$refs.MarkAbnormalDialog.setForm(row);
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
