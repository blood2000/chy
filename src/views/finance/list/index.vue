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
        prop="loadInfo"
      >
        <el-input
          v-model="queryParams.loadInfo"
          placeholder="请输入发票抬头"
          clearable
          size="small"
          style="width: 230px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发票类型" prop="goodsBigType">
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
      </el-form-item>
      <el-form-item
        label="发票编号"
        prop="receivedInfo"
      >
        <el-input
          v-model="queryParams.receivedInfo"
          placeholder="请输入发票编号"
          clearable
          size="small"
          style="width: 230px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="申请日期"
        prop="createTime"
      >
        <el-date-picker
          v-model="createTime"
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
          type="success"
          icon="el-icon-document-checked"
          size="mini"
          @click="handleVerify"
        >批量审核</el-button>
      </el-col>
      <el-col v-if="activeName == '3'" :span="1.5">
        <el-button
          v-hasPermi="['assets:vehicle:remove']"
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleExportFreight"
        >导出运费明细</el-button>
      </el-col>
      <el-col v-if="activeName == '3'" :span="1.5">
        <el-button
          v-hasPermi="['assets:vehicle:export']"
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleExportService"
        >导出服务费明细</el-button>
      </el-col>
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" />
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="已申请" name="1" />
      <el-tab-pane label="已审核" name="2" />
      <el-tab-pane label="已开票" name="3" />
    </el-tabs>

    <RefactorTable :loading="loading" :data="adjustlist" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
      <template #goodsBigType="{row}">
        <span>{{ selectDictLabel(commodityCategoryCodeOptions, row.goodsBigType) }}</span>
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
          v-if="activeName == '2'"
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
    <!-- 子单弹窗 -->
    <billing-dialog ref="BillingDialog" :open.sync="billingdialog" title="title" :disable="formDisable" @refresh="getList" />
    <!-- 运单详情 对话框 -->
    <!-- <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" /> -->

  </div>
</template>

<script>
import { adjustList, adjustListApi } from '@/api/settlement/adjust';
// 审核弹窗
import VerifyDialog from './verifyDialog';
// 子单弹窗
import BillingDialog from './billingDialog';
// 运单详情弹窗
// import DetailDialog from '@/views/waybill/components/detailDialog';


export default {
  'name': 'AdjustList',
  components: { VerifyDialog, BillingDialog },
  data() {
    return {
      tableColumnsConfig: [],
      activeName: '1',
      createTime: '',
      // 遮罩层
      'loading': false,
      // 选中数组
      'ids': [],
      // 选中数量
      'selectlenght': '',
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'adjustlist': [],

      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'receivedInfo': undefined,
        'goodsBigType': undefined,
        'mainOrderNumber': undefined,
        'orderEndTime': undefined,
        'orderStartTime': undefined
      },
      receiveTime: [],
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
      // 商品类别编码字典
      commodityCategoryCodeOptions: [],
      // 大类字典类型
      commodityCategory: {
        'dictPid': '0',
        'dictType': 'goodsType'
      },
      // 发票类型字典
      billTypeOptions: [
        { 'dictLabel': '运费发票', 'dictValue': '0' },
        { 'dictLabel': '服务费发票', 'dictValue': '1' }
      ]
    };
  },
  computed: {
    lcokey() {
      return this.$route.name + this.activeName;
    }
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, adjustListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 240,
      fixed: 'right'
    });
    this.getList();
    this.listByDict(this.commodityCategory).then(response => {
      this.commodityCategoryCodeOptions = response.data;
    });
  },
  'methods': {
    datechoose(date) {
      this.queryParams.orderEndTime = this.parseTime(date[0], '{y}-{m}-{d}');
      this.queryParams.orderStartTime = this.parseTime(date[1], '{y}-{m}-{d}');
    },
    /** handleClick */
    handleClick(tab) {
      this.queryParams.statusList[0] = tab.name;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.selectlenght = selection.length;
      this.ids = selection.map((item) => item.id);
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      adjustList(this.queryParams).then(response => {
        this.adjustlist = response.rows;
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
    // 批量审核
    handleVerify() {
      if (this.ids) {
        const id = this.ids;
        this.formDisable = true;
        this.$refs.VerifyDialog.reset();
        this.verifydialog = true;
        this.title = '批量审核';
        this.$refs.VerifyDialog.setForm(id);
      } else {
        this.msgError('请先选择数据!');
      }
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
          this.title = '审核';
          break;
        case 2:
          this.$refs.BillingDialog.reset();
          this.billingdialog = true;
          this.title = '开票';
          this.formDisable = false;
          this.$refs.BillingDialog.setForm(row);
          break;
        case 3:
          this.$refs.BillingDialog.reset();
          this.billingdialog = true;
          this.formDisable = true;
          this.title = '开票详情';
          this.$refs.BillingDialog.setForm(row);
          break;
        default:
          break;
      }
    }
  }
};
</script>
