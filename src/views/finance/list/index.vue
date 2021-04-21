<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="80px"
    >
      <el-form-item
        label="发票抬头"
        prop="invoiceTitle"
      >
        <el-input
          v-model="queryParams.invoiceTitle"
          placeholder="请输入发票抬头"
          clearable
          size="small"
          style="width: 230px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="发票类型" prop="goodsBigType">
        <el-select
          v-model="queryParams.goodsBigType"
          placeholder="请选择发票类型"
          filterable
          clearable
          style="width: 230px"
          size="small"
        >
          <el-option
            v-for="dict in billTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item
        label="发票编号"
        prop="askForNo"
      >
        <el-input
          v-model="queryParams.askForNo"
          placeholder="请输入发票编号"
          clearable
          size="small"
          style="width: 230px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="申请日期"
        prop="invoiceApplyTime"
      >
        <el-date-picker
          v-model="invoiceApplyTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 230px"
          @change="datechoose"
        />
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
      <el-col v-if="activeName == '1'" :span="1.5">
        <el-button
          v-hasPermi="['assets:vehicle:edit']"
          type="primary"
          icon="el-icon-document-checked"
          size="mini"
          :disabled="multiple"
          @click="handleVerify"
        >批量审核</el-button>
      </el-col>
      <el-col v-if="activeName == '3'" :span="1.5">
        <el-button
          v-hasPermi="['assets:vehicle:remove']"
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          @click="handleExportFreight"
        >导出运费明细</el-button>
      </el-col>
      <el-col v-if="activeName == '3'" :span="1.5">
        <el-button
          v-hasPermi="['assets:vehicle:export']"
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          @click="handleExportService"
        >导出服务费明细</el-button>
      </el-col>
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="已申请" name="1" />
      <el-tab-pane label="已审核" name="2,3,4" />
      <el-tab-pane label="已开票" name="5" />
    </el-tabs>

    <RefactorTable :loading="loading" :data="billlist" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
      <template #invoiceStatus="{row}">
        <span>{{ selectDictLabel(invoiceStatusOptions, row.invoiceStatus) }}</span>
      </template>
      <template #invoiceFrom="{row}">
        <span>{{ selectDictLabel(invoiceFromOptions, row.invoiceFrom) }}</span>
      </template>
      <template #invoiceApplyTime="{row}">
        <span>{{ parseTime(row.invoiceApplyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>

      <template #edit="{row}">
        <el-button
          v-if="activeName == '1'"
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-document-checked"
          @click="handleTableBtn(row, 1)"
        >审核</el-button>
        <el-button
          v-if="row.invoiceStatus == '4'"
          v-hasPermi="['system:menu:edit']"
          size="mini"
          type="text"
          icon="el-icon-tickets"
          @click="handleTableBtn(row, 2)"
        >开票</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleTableBtn(row, 3)"
        >详情</el-button>
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 审核弹窗 -->
    <verify-dialog ref="VerifyDialog" :open.sync="verifydialog" :title="title" :disable="formDisable" @refresh="getList" />
    <!-- 开票弹窗 -->
    <billing-dialog ref="BillingDialog" :open.sync="billingdialog" :title="title" @refresh="getList" />
    <!-- 详情弹窗 -->
    <!-- <detail-dialog ref="DetailDialog" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" /> -->

  </div>
</template>

<script>
import { billList, billListApi } from '@/api/finance/list';
// 审核弹窗
import VerifyDialog from './verifyDialog';
// 开票弹窗
import BillingDialog from './billingDialog';
// 详情弹窗
// import DetailDialog from './detail';


export default {
  'name': 'BillList',
  components: { VerifyDialog, BillingDialog },
  data() {
    return {
      tableColumnsConfig: [],
      api: billListApi,
      activeName: '1',
      createTime: '',
      // 遮罩层
      'loading': false,
      // 选中数组
      'ids': null,
      // 非多个禁用
      multiple: true,
      // 选中数量
      'selectlenght': '',
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'billlist': [],

      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'askForNo': undefined,
        'invoiceTitle': undefined,
        'invoiceApplyTimeBegin': undefined,
        'invoiceApplyTimeEnd': undefined,
        'invoiceStatus': '1'
      },
      invoiceApplyTime: [],
      // 弹框 内容
      visible: false,
      open: false,
      verifydialog: false,
      billingdialog: false,
      title: '',
      dialogWidth: '800px',
      // 当前选中的运单id
      currentId: null,
      // 表单是否禁用
      formDisable: false,
      // 发票状态字典
      invoiceStatusOptions: [
        { 'dictLabel': '未开票', 'dictValue': '0' },
        { 'dictLabel': '已申请', 'dictValue': '1' },
        { 'dictLabel': '已取消', 'dictValue': '2' },
        { 'dictLabel': '已拒绝', 'dictValue': '3' },
        { 'dictLabel': '已通过', 'dictValue': '4' },
        { 'dictLabel': '已开票', 'dictValue': '5' }
      ],
      // 发票来源字典
      invoiceFromOptions: [
        { 'dictLabel': '货主向平台索取', 'dictValue': '0' },
        { 'dictLabel': '货主向承运商索取', 'dictValue': '1' }
      ]
    };
  },
  computed: {
    lcokey() {
      return this.$route.name + this.activeName;
    }
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, billListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 180,
      fixed: 'right'
    });
    this.getList();
  },
  'methods': {
    datechoose(date) {
      if (date) {
        this.queryParams.invoiceApplyTimeBegin = this.parseTime(date[0], '{y}-{m}-{d}');
        this.queryParams.invoiceApplyTimeEnd = this.parseTime(date[1], '{y}-{m}-{d}');
      } else {
        this.queryParams.invoiceApplyTimeBegin = null;
        this.queryParams.invoiceApplyTimeEnd = null;
      }
    },
    /** handleClick */
    handleClick(tab) {
      this.queryParams.invoiceStatus = tab.name;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.selectlenght = selection.length;
      this.ids = selection.map((item) => item.code).join(',');
      this.multiple = !selection.length;
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      billList(this.queryParams).then(response => {
        this.billlist = response.data.rows;
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
      this.resetForm('queryForm');
      this.invoiceApplyTime = [];
      this.queryParams.invoiceApplyTimeBegin = null;
      this.queryParams.invoiceApplyTimeEnd = null;
      this.handleQuery();
    },
    // 批量审核
    handleVerify() {
      this.formDisable = true;
      this.$refs.VerifyDialog.reset();
      this.verifydialog = true;
      this.title = '批量审批';
      this.$refs.VerifyDialog.setForm(this.ids);
      this.$refs.VerifyDialog.setNum(this.selectlenght);
    },
    // 导出运费明细
    handleExportFreight() {
    },
    // 导出服务费明细
    handleExportService() {
    },

    handleTableBtn(row, index) {
      this.visible = true;
      switch (index) {
        case 1:
          this.$refs.VerifyDialog.reset();
          this.verifydialog = true;
          this.title = '审批';
          this.$refs.VerifyDialog.setForm(row.code);
          break;
        case 2:
          this.$refs.BillingDialog.reset();
          this.billingdialog = true;
          this.title = '开发票';
          this.formDisable = false;
          this.$refs.BillingDialog.setForm(row);
          break;
        case 3:
          this.$router.push({ name: 'Statement', query: { id: row.code }});
          break;
        default:
          break;
      }
    }
  }
};
</script>
