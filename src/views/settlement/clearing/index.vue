
<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="90px"
    >
      <el-form-item
        label="司机姓名"
        prop="driverName"
      >
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入司机姓名"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="司机电话"
        prop="driverPhone"
      >
        <el-input
          v-model="queryParams.driverPhone"
          placeholder="请输入司机电话"
          clearable
          size="small"
          style="width: 225px"
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
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="调度名称"
        prop="teamName"
      >
        <el-input
          v-model="queryParams.teamName"
          placeholder="请输入调度名称"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="调度电话"
        prop="teamLeaderPhone"
      >
        <el-input
          v-model="queryParams.teamLeaderPhone"
          placeholder="请输入调度电话"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="关联企业"
        prop="companyName"
      >
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入运单关联企业"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="货主电话"
        prop="shipmentPhone"
      >
        <el-input
          v-model="queryParams.shipmentPhone"
          placeholder="请输入货主电话"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="清分订单号"
        prop="teamTransferNo"
      >
        <el-input
          v-model="queryParams.teamTransferNo"
          placeholder="请输入清分订单号"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="清分批次号"
        prop="teamBizNo"
      >
        <el-input
          v-model="queryParams.teamBizNo"
          placeholder="请输入清分批次号"
          clearable
          size="small"
          style="width: 225px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="清分状态" prop="clarifyStatus">
        <el-select
          v-model="queryParams.clarifyStatus"
          placeholder="请选择清分状态"
          filterable
          clearable
          size="small"
          style="width: 225px"
        >
          <el-option
            v-for="dict in clarifyStatusOptions"
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
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
        >导出</el-button>
        <el-button
          type="primary"
          icon="el-icon-document-remove"
          size="mini"
          :disabled="multiple"
          @click="handleClearing"
        >运单清分</el-button>
        <el-button
          type="success"
          icon="el-icon-refresh-right"
          size="mini"
          :disabled="multiple"
          @click="handleUpdate"
        >更新清分状态</el-button>
      </el-col>
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <RefactorTable :loading="loading" :data="clarifylist" :table-columns-config="tableColumnsConfig" @selection-change="handleSelectionChange">
      <!-- <template #goodsBigType="{row}">
        <span>{{ selectDictLabel(commodityCategoryCodeOptions, row.goodsBigType) }}</span>
      </template>
      <template #isReturn="{row}">
        <span>{{ selectDictLabel(isReturnOptions, row.isReturn) }}</span>
      </template> -->
      <!-- <template #isChild="{row}">
        <span>{{ selectDictLabel(isChildOptions, row.isChild) }}</span>
      </template> -->

      <template #edit="{row}">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document-remove"
          @click="handleTableBtn(row, 1)"
        >运单清分</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-refresh-right"
          @click="handleTableBtn(row, 2)"
        >更新清分状态</el-button>
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

    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />

  </div>
</template>

<script>
import { clarifyList, clarifyListApi, batch, batchStatus } from '@/api/settlement/clearing';
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';


export default {
  'name': 'ClarifyList',
  components: { DetailDialog },
  data() {
    return {
      tableColumnsConfig: [],
      api: clarifyListApi,
      createTime: '',
      // 遮罩层
      'loading': false,
      // 选中数组
      'ids': [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      'showSearch': true,
      // 总条数
      'total': 0,
      // 表格数据
      'clarifylist': [],

      // 查询参数
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10,
        'clarifyStatus': undefined,
        'companyName': undefined,
        'driverName': undefined,
        'driverPhone': undefined,
        'shipmentPhone': undefined,
        'teamBizNo': undefined,
        'teamLeaderPhone': undefined,
        'teamName': undefined,
        'teamTransferNo': undefined,
        'waybillNo': undefined
      },
      bodyParams: {
        wayBillSettlementCodeList: []
      },
      receiveTime: [],
      // 弹框 内容
      visible: false,
      open: false,
      title: '',
      dialogWidth: '800px',
      // 当前选中的运单id
      currentId: null,
      // 表单是否禁用
      formDisable: false,
      // 清分状态字典
      clarifyStatusOptions: [
        { 'dictLabel': '待清分', 'dictValue': '0' },
        { 'dictLabel': '清分中', 'dictValue': '1' },
        { 'dictLabel': '清分成功', 'dictValue': '2' },
        { 'dictLabel': '清分失败', 'dictValue': '3' }
      ]
    };
  },
  computed: {
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, clarifyListApi, {
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
      this.queryParams.orderStartTime = this.parseTime(date[0], '{y}-{m}-{d}');
      this.queryParams.orderEndTime = this.parseTime(date[1], '{y}-{m}-{d}');
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.wayBillSettlementCode);
      this.bodyParams.wayBillSettlementCodeList = this.ids;
      this.multiple = !selection.length;
    },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      clarifyList(this.queryParams).then(response => {
        this.clarifylist = response.rows;
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
    // 导出
    handleExport() {
      this.download(
        '/transportation/waybillSettlementClarify/export',
        {
          ...this.queryParams
        },
        `clearing_${new Date().getTime()}.xlsx`
      );
    },
    // 运单清分
    handleClearing() {
      this.$confirm('是否确认批量清分？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batch(this.bodyParams).then(response => {
          this.$message({ type: 'success', message: '批量运单清分成功！' });
          this.getList();
        });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      });
    },
    // 更新清分状态
    handleUpdate() {
      this.$confirm('是否确认批量更新清分状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchStatus(this.bodyParams).then(response => {
          this.$message({ type: 'success', message: '批量更新清分状态成功！' });
          this.getList();
        });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      });
    },

    handleTableBtn(row, index) {
      // console.log(row, index);

      this.visible = true;
      switch (index) {
        case 1:
          this.$confirm('是否确认运单清分?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.bodyParams.wayBillSettlementCodeList = [];
            this.bodyParams.wayBillSettlementCodeList.push(row.wayBillSettlementCode);
            batch(this.bodyParams).then(response => {
              this.$message({ type: 'success', message: '运单清分成功！' });
              this.getList();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
          break;
        case 2:
          this.$confirm('是否确认更新清分状态?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.bodyParams.wayBillSettlementCodeList = [];
            this.bodyParams.wayBillSettlementCodeList.push(row.wayBillSettlementCode);
            batchStatus(this.bodyParams).then(response => {
              this.$message({ type: 'success', message: '更新清分状态成功！' });
              this.getList();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
          break;
        case 3:
          this.$refs.DetailDialog.reset();
          this.currentId = row.wayBillCode;
          this.open = true;
          this.title = '运输单信息';
          this.formDisable = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>
