<template>
  <div>
    <!-- 司机打款记录 -->
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
        <el-form-item label="支付批次号" prop="bizNo">
          <el-input
            v-model.trim="queryParams.bizNo"
            placeholder="请输入支付批次号"
            clearable
            size="small"
            class="input-width"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="支付订单号" prop="orderId">
          <el-input
            v-model.trim="queryParams.orderId"
            placeholder="请输入支付订单号"
            clearable
            size="small"
            class="input-width"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="货源单号" prop="goodId">
          <el-input
            v-model.trim="queryParams.goodId"
            placeholder="请输入货源单号"
            clearable
            size="small"
            class="input-width"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="运输单号" prop="tranId">
          <el-input
            v-model.trim="queryParams.tranId"
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
            v-model.trim="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            class="input-width"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="收款方姓名" prop="payeeName">
          <el-input
            v-model.trim="queryParams.payeeName"
            placeholder="请输入收款方姓名"
            clearable
            size="small"
            class="input-width"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="运单关联企业" prop="campanyName">
          <el-input
            v-model.trim="queryParams.campanyName"
            placeholder="请输入运单关联企业"
            clearable
            size="small"
            class="input-width"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="收款人电话" prop="payeeMobile">
          <el-input
            v-model.trim="queryParams.payeeMobile"
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
              v-for="dict in responseStatusOptions"
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
              v-for="dict in payByTypeOptions"
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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
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
        <el-tag type="warning" class="mb10">提示: 已打款、打款成功的运输单才能上报流水</el-tag> -->
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable :loading="loading" :data="recordList" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
        <!-- 金额：单位分转为元 -->
        <template #amount="{row}">
          <span>{{ row.amount ? (row.amount/100).toFixed(2) : row.amount }}</span>
        </template>
        <!-- 付款类型 -->
        <template #payType="{row}">
          <span>{{ selectDictLabel(payTypeOptions, row.payType) }}</span>
        </template>
        <!-- 收款方类型 -->
        <template #payeeType="{row}">
          <span>{{ selectDictLabel(payeeTypeOptions, row.payeeType) }}</span>
        </template>
        <!-- 处理状态 -->
        <template #status="{row}">
          <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
        </template>
        <!-- 是否进行过回调处理 -->
        <template #isHandle="{row}">
          <span>{{ selectDictLabel(isHandleOptions, row.isHandle) }}</span>
        </template>
        <!-- 转账回调状态 -->
        <template #responseStatus="{row}">
          <i v-if="row.responseStatus === 0" class="g-icon-deal mr5" />
          <i v-if="row.responseStatus === 1" class="el-icon-success g-color-success mr5" />
          <i v-if="row.responseStatus === 2" class="el-icon-error g-color-error mr5" />
          <i v-if="row.responseStatus === 3" class="el-icon-warning g-color-light-gray mr5" />
          <span>{{ selectDictLabel(responseStatusOptions, row.responseStatus) }}</span>
        </template>
        <!-- 付款方式 -->
        <template #payBy="{row}">
          <span>{{ selectDictLabel(payByOptions, row.payBy) }}</span>
        </template>
        <!-- 是否子单 -->
        <template #isChild="{row}">
          <span>{{ selectDictLabel(isChildOptions, row.isChild) }}</span>
        </template>
        <!-- 是否异常 -->
        <template #isAbnormal="{row}">
          <span>{{ selectDictLabel(isAbnormalOptions, row.isAbnormal) }}</span>
        </template>
        <!-- 打款时间 -->
        <template #payTime="{row}">
          <span>{{ parseTime(row.payTime) }}</span>
        </template>
        <!-- 到账时间 -->
        <template #finishDate="{row}">
          <span>{{ parseTime(row.finishDate) }}</span>
        </template>
        <!-- 预付网商支付时间 -->
        <template #payMybankTime="{row}">
          <span>{{ parseTime(row.payMybankTime) }}</span>
        </template>
        <!-- 接单时间 -->
        <template #receiveTime="{row}">
          <span>{{ parseTime(row.receiveTime) }}</span>
        </template>
        <template #createTime="{row}">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
        <template #updateTime="{row}">
          <span>{{ parseTime(row.updateTime) }}</span>
        </template>
        <template #edit="{row}">
          <!-- <el-button
            size="mini"
            type="text"
            @click="handleReport(row)"
          >上报流水</el-button> -->
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(row)"
          >修改批次号</el-button>
        </template>
      </RefactorTable>

      <!-- 上报相关字段还没有 -->
      <!-- <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column label="流水上报" align="center" prop="" />
      <el-table-column label="电子路单上报状态" align="center" prop="" />
    </el-table> -->

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 编辑支付批次号 -->
      <modify-batch-dialog ref="modifyBatchRef" :open.sync="modifyBatchOpen" :title="title" @refresh="getList" />
    </div>
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
      recordList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      modifyBatchOpen: false,
      // 转帐结果字典
      responseStatusOptions: [
        { dictLabel: '处理中', dictValue: 0 },
        { dictLabel: '转账成功', dictValue: 1 },
        { dictLabel: '转账失败', dictValue: 2 },
        { dictLabel: '转账异常', dictValue: 3 }
      ],
      // 流水/电子路单上报字典
      reportOptions: [
        { dictLabel: '未上报', dictValue: 0 },
        { dictLabel: '上报成功', dictValue: 1 },
        { dictLabel: '上报失败', dictValue: 2 }
      ],
      // 打款方式字典
      payByTypeOptions: [
        { dictLabel: '现金支付', dictValue: 0 },
        { dictLabel: '在线支付', dictValue: 1 }
      ],
      // 是否字典
      isOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是', dictValue: 1 }
      ],
      // 付款类型字典
      payTypeOptions: [
        { dictLabel: '付款到银行', dictValue: 1 },
        { dictLabel: '付款到新生账户', dictValue: 2 }
      ],
      // 处理状态字典
      statusOptions: [
        { dictLabel: '提交失败', dictValue: 0 },
        { dictLabel: '提交成功', dictValue: 1 }
      ],
      // 是否进行过回调处理字典
      isHandleOptions: [
        { dictLabel: '未处理', dictValue: 0 },
        { dictLabel: '已处理', dictValue: 1 }
      ],
      // 付款方式字典
      payByOptions: [
        { dictLabel: '现金支付', dictValue: 0 },
        { dictLabel: '京东支付', dictValue: 1 },
        { dictLabel: '交通银行', dictValue: 2 },
        { dictLabel: '新生支付', dictValue: 3 },
        { dictLabel: '工商银行', dictValue: 4 },
        { dictLabel: '传化支付', dictValue: 5 },
        { dictLabel: '建行支付', dictValue: 6 },
        { dictLabel: '环迅', dictValue: 7 }
      ],
      // 收款方类型
      payeeTypeOptions: [
        { dictLabel: '个人', dictValue: 1 },
        { dictLabel: '企业', dictValue: 2 }
      ],
      // 是否子单
      isChildOptions: [
        { dictLabel: '正常单', dictValue: 0 },
        { dictLabel: '子单', dictValue: 1 },
        { dictLabel: '超载的主单', dictValue: 1 }
      ],
      // 是否异常
      isAbnormalOptions: [
        { dictLabel: '正常', dictValue: 0 },
        { dictLabel: '异常', dictValue: 1 }
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
      },
      exportLoading: false
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, payRecordlistApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 100,
      fixed: 'left'
    });
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      payRecordlist(this.queryParams).then(response => {
        this.recordList = response.data.rows;
        this.total = response.data.total;
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
      this.$refs.modifyBatchRef.setForm(row);
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportLoading = true;
      const params = Object.assign({}, this.queryParams);
      params.pageSize = undefined;
      params.pageNum = undefined;
      this.download('/payment/wallet/remit/export', params, `打款记录`).then(() => {
        this.exportLoading = false;
      });
    },
    /** 流水批量导入 */
    handleImport() {

    },
    /** 下载模板 */
    handleImportTemplate() {
      // this.download('assets/driver/importTemplate', {}, `模板`);
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
