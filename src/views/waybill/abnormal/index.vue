<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <!-- <el-form-item label="运单编号" prop="waybillCode">
        <el-input
          v-model="queryParams.waybillCode"
          placeholder="请输入运单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="异常状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择异常标记状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in isWarningOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="标记时间" prop="warningTime">
        <el-date-picker
          v-model="queryParams.warningTime"
          clearable
          size="small"
          style="width: 200px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择标记时间"
        />
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
      <el-form-item label="异常说明" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入异常说明"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="abnormalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="运单编号" align="center" prop="waybillCode" />
      <el-table-column label="异常标记状态" align="center" prop="isWarning" :formatter="isWarningFormat" />
      <el-table-column label="标记时间" align="center" prop="warningTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.warningTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否删除 0.正常 1.删除" align="center" prop="isDel" :formatter="isDelFormat" />
      <el-table-column label="创建人" align="center" prop="createCode" :formatter="createCodeFormat" />
      <el-table-column label="修改人" align="center" prop="updateCode" :formatter="updateCodeFormat" /> -->
      <el-table-column label="异常说明" align="center" prop="description" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['waybill:abnormal:edit']"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleWaybill(scope.row)"
          >查看运单</el-button>
          <el-button
            v-hasPermi="['waybill:abnormal:remove']"
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="handleLog(scope.row)"
          >查看日志</el-button>
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

    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
    <!-- 运单详情 对话框 -->
    <abnormal-dialog ref="AbnormalDialog" :title="title" :open.sync="openAbnormal" :disable="formDisable" @refresh="getList" />
  </div>
</template>

<script>
import { listAbnormal, getAbnormal, getWaybill } from '@/api/waybill/abnormal';
import DetailDialog from '../components/detailDialog';
import AbnormalDialog from './abnormalDialog';

export default {
  name: 'Abnormal',
  components: {
    DetailDialog,
    AbnormalDialog
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
      // 运输异常表格数据
      abnormalList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openAbnormal: false,
      // 异常标记状态  0正常，1异常，2取消字典
      isWarningOptions: [
        { 'dictLabel': '正常', 'dictValue': 0 },
        { 'dictLabel': '异常', 'dictValue': 1 },
        { 'dictLabel': '取消', 'dictValue': 2 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverName: null,
        waybillCode: null,
        isWarning: null,
        orderCode: null
      },
      // 表单是否禁用
      formDisable: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 异常标记状态字典翻译
    isWarningFormat(row, column) {
      return this.selectDictLabel(this.isWarningOptions, row.driverType);
    },
    /** 查询运输异常列表 */
    getList() {
      this.loading = true;
      listAbnormal(this.queryParams).then(response => {
        this.abnormalList = response.rows;
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
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.waybillCode);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 查看运单按钮操作 */
    handleWaybill(row) {
      this.$refs.DetailDialog.reset();
      const id = row.waybillCode;
      getWaybill(id).then((response) => {
        this.$refs.DetailDialog.setForm(response.data);
        this.open = true;
        this.title = '运输单信息';
        this.formDisable = true;
      });
    },
    /** 查看日志按钮操作 */
    handleLog(row) {
      this.$refs.AbnormalDialog.reset();
      const id = row.id;
      getAbnormal(id).then((response) => {
        this.$refs.AbnormalDialog.setForm(response.data);
        this.open = true;
        this.title = '查看日志';
        this.formDisable = true;
      });
    }
  }
};
</script>
