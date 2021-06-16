<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="90px">
        <el-form-item v-show="!isShipment" label="批次号" prop="batchNo">
          <el-input
            v-model="queryParams.batchNo"
            placeholder="请输入批次号"
            clearable
            size="small"
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="操作类型" prop="operate_type">
          <el-select
            v-model="queryParams.operate_type"
            placeholder="请选择操作类型"
            clearable
            filterable
            size="small"
            style="width: 230px"
          >
            <el-option
              v-for="dict in operate_typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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

      <RefactorTable :loading="loading" :data="rejectList" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
        <template #operateType="{row}">
          <span>{{ selectDictLabel(operate_typeOptions, row.operateType) }}</span>
        </template>
        <template #operateTime="{row}">
          <span>{{ parseTime(row.operateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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
  </div>

</template>

<script>
import { rejectList, rejectListApi } from '@/api/finance/reject';
import { getUserInfo } from '@/utils/auth';
// import tableColumnsConfig from './config';

export default {
  name: 'Nullify',
  components: {
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: rejectListApi,
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
      // 发票驳回表格数据
      rejectList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openNullify: false,
      // 操作类型
      operate_typeOptions: [
        { 'dictLabel': '驳回', 'dictValue': 0 },
        { 'dictLabel': '通过', 'dictValue': 1 }
      ],
      statusOptions: [
        { 'dictLabel': '已结算', 'dictValue': 0 },
        { 'dictLabel': '已申请对账', 'dictValue': 1 },
        { 'dictLabel': '已申请开票', 'dictValue': 2 },
        { 'dictLabel': '已申请打款', 'dictValue': 3 },
        { 'dictLabel': '已申请打款', 'dictValue': 4 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        operate_type: null,
        batchNo: null
      },
      receiveTime: [],
      // 表单是否禁用
      formDisable: false,
      // 当前选中的运单id
      currentId: null,
      isAdmin: false,
      user: {},
      shipment: {},
      isShipment: false
    };
  },
  created() {
    const { isAdmin = false, isShipment = false, user = {}, shipment = {}} = getUserInfo() || {};
    this.isAdmin = isAdmin;
    this.isShipment = isShipment;
    this.user = user;
    this.shipment = shipment;
    this.tableHeaderConfig(this.tableColumnsConfig, rejectListApi);
    this.getList();
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
    /** 查询发票驳回列表 */
    getList() {
      this.loading = true;
      rejectList(this.queryParams).then(response => {
        this.rejectList = response.data.list;
        this.total = response.data.total;
        console.log(this.rejectList);
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
      this.ids = selection.map(item => item.waybillCode);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    }
  }
};
</script>
