<template>
  <!-- 司机打款记录 -->
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="支付批次号" prop="bizNo">
        <el-input
          v-model="queryParams.bizNo"
          placeholder="请输入支付批次号"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付订单号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入支付订单号"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货源单号" prop="goodId">
        <el-input
          v-model="queryParams.goodId"
          placeholder="请输入货源单号"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运输单号" prop="tranId">
        <el-input
          v-model="queryParams.tranId"
          placeholder="请输入运输单号"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接单时间">
        <el-date-picker
          v-model="queryParams.tranBeginTime"
          clearable
          type="date"
          size="small"
          style="width: 130px"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
        至
        <el-date-picker
          v-model="queryParams.tranEndTime"
          clearable
          type="date"
          size="small"
          style="width: 130px"
          value-format="yyyy-MM-dd"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="licenseNumber">
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收款方姓名" prop="payeeName">
        <el-input
          v-model="queryParams.payeeName"
          placeholder="请输入收款方姓名"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运单关联企业" prop="campanyName">
        <el-input
          v-model="queryParams.campanyName"
          placeholder="请输入运单关联企业"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收款人电话" prop="payeeMobile">
        <el-input
          v-model="queryParams.payeeMobile"
          placeholder="请输入收款人电话"
          clearable
          size="small"
          class="input-width"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转账结果" prop="responseStatus">
        <el-select v-model="queryParams.responseStatus" placeholder="请选择" clearable filterable size="small" class="input-width">
          <el-option
            v-for="dict in resultOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="流水上报" prop="upRecordStatus">
        <el-select v-model="queryParams.upRecordStatus" placeholder="请选择" clearable filterable size="small" class="input-width">
          <el-option
            v-for="dict in reportOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="打款方式" prop="payByType">
        <el-select v-model="queryParams.payByType" placeholder="请选择" clearable filterable size="small" class="input-width">
          <el-option
            v-for="dict in payTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="电子路单上报" prop="upWaybillStatus">
        <el-select v-model="queryParams.upWaybillStatus" placeholder="请选择" clearable filterable size="small" class="input-width">
          <el-option
            v-for="dict in reportOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否分单" prop="isSplit">
        <el-select v-model="queryParams.isSplit" placeholder="请选择" clearable filterable size="small" class="input-width">
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否异常" prop="abnormal">
        <el-select v-model="queryParams.abnormal" placeholder="请选择" clearable filterable size="small" class="input-width">
          <el-option
            v-for="dict in isOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >流水批量导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-download"
          size="mini"
          @click="handleImportTemplate"
        >下载模板</el-button>
      </el-col>
      <el-tag type="warning" class="mb10">提示: 已打款、打款成功的运输单才能上报流水</el-tag>
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="addressList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" fixed="left" />
      <el-table-column label="是否超载" align="center" prop="" />
      <el-table-column label="是否分单" align="center" prop="" />
      <el-table-column label="是否异常" align="center" prop="" />
      <el-table-column label="支付批次号" align="center" prop="" />
      <el-table-column label="支付订单号" align="center" prop="" />
      <el-table-column label="运输单号" align="center" prop="" />
      <el-table-column label="车牌号" align="center" prop="" />
      <el-table-column label="调度" align="center" prop="" />
      <el-table-column label="运单关联企业" align="center" prop="" />
      <el-table-column label="收款方姓名" align="center" prop="" />
      <el-table-column label="收款方账户" align="center" prop="" />
      <el-table-column label="金额" align="center" prop="" />
      <el-table-column label="司机实际运费" align="center" prop="" />
      <el-table-column label="司机实收现金" align="center" prop="" />
      <el-table-column label="油气卡" align="center" prop="" />
      <el-table-column label="手续费" align="center" prop="" />
      <el-table-column label="收款方手机号" align="center" prop="" />
      <el-table-column label="银行名称" align="center" prop="" />
      <el-table-column label="转账请求状态" align="center" prop="" />
      <el-table-column label="转账结果" align="center" prop="" />
      <el-table-column label="流水上报" align="center" prop="" />
      <el-table-column label="电子路单上报状态" align="center" prop="" />
      <el-table-column label="货源单号" align="center" prop="" />
      <el-table-column label="接单时间" align="center" prop="time">
        <template slot-scope="scope">
          {{ parseTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="到账时间" align="center" prop="time">
        <template slot-scope="scope">
          {{ parseTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="最后操作人" align="center" prop="" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-sell"
            @click="handleReport(scope.row)"
          >上报流水</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改批次号</el-button>
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

    <!-- 编辑支付批次号 -->
    <modify-batch-dialog :open.sync="modifyBatchOpen" :title="title" />
  </div>
</template>

<script>
import { payRecordlistApi, payRecordlist } from '@/api/capital/payrecord';
import modifyBatchDialog from './modifyBatchDialog';

export default {
  name: 'Payrecord',
  components: {
    modifyBatchDialog
  },
  data() {
    return {
      tableColumnsConfig: [],
      api: payRecordlistApi,
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
      // 表格数据
      addressList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      modifyBatchOpen: false,
      // 转帐结果字典
      resultOptions: [
        { dictLabel: '处理中', dictValue: 0 },
        { dictLabel: '成功', dictValue: 1 },
        { dictLabel: '失败', dictValue: 2 },
        { dictLabel: '异常', dictValue: 3 }
      ],
      // 流水/电子路单上报字典
      reportOptions: [
        { dictLabel: '未上报', dictValue: 0 },
        { dictLabel: '成功', dictValue: 1 },
        { dictLabel: '失败', dictValue: 2 }
      ],
      // 打款方式字典
      payTypeOptions: [
        { dictLabel: '现金支付', dictValue: 0 },
        { dictLabel: '在线支付', dictValue: 1 }
      ],
      // 是否字典
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bizNo: undefined,
        orderId: undefined,
        goodId: undefined,
        tranId: undefined,
        tranBeginTime: undefined,
        tranEndTime: undefined,
        licenseNumber: undefined,
        payeeName: undefined,
        campanyName: undefined,
        payeeMobile: undefined,
        responseStatus: undefined,
        upRecordStatus: undefined,
        payByType: undefined,
        upWaybillStatus: undefined,
        isSplit: undefined,
        abnormal: undefined
      }
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, payRecordlistApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 200,
      fixed: 'right'
    });
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      payRecordlist(this.queryParams).then(response => {
        this.addressList = response.data.rows;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.resultOptions, row.status);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.tranBeginTime = undefined;
      this.queryParams.tranEndTime = undefined;
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 上报流水 */
    handleReport(row) {
      this.$confirm('请确认是否要发送资金流水到部无车承运人监测平台?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {

      }).then(() => {
        this.getList();
        this.msgSuccess('上报成功');
      });
    },
    /** 修改批次号 */
    handleUpdate(row) {
      this.title = '编辑支付批次号';
      this.modifyBatchOpen = true;
    },
    /** 导出按钮操作 */
    handleExport() {
      // this.download('assets/driver/export', {}, `driver_${new Date().getTime()}.xlsx`, 'application/json');
    },
    /** 流水批量导入 */
    handleImport() {

    },
    /** 下载模板 */
    handleImportTemplate() {
      // this.download('assets/driver/importTemplate', {}, `driver_${new Date().getTime()}.xlsx`);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    }
  }
};
</script>

<style scoped>
.input-width{
  width: 282px;
}
</style>
