
<template>
  <div v-loading="payLoading" element-loading-background="rgba(255, 255, 255, 0.3)">
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form
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
            v-model.trim="queryParams.driverName"
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
            v-model.trim="queryParams.driverPhone"
            placeholder="请输入司机电话"
            clearable
            size="small"
            style="width: 225px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="清分日期"
          prop="transferTime"
        >
          <el-date-picker
            v-model="transferTime"
            type="datetimerange"
            unlink-panels
            :picker-options="pickerTimeOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            :default-time="defaultTime"
            @change="datechoose"
          />
        </el-form-item>
        <el-form-item
          label="装货日期"
          prop="loadTime"
        >
          <el-date-picker
            v-model="loadTime"
            type="datetimerange"
            unlink-panels
            :picker-options="pickerTimeOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="defaultTime"
            @change="loadDateChoose"
          />
        </el-form-item>
        <el-form-item
          label="卸货日期"
          prop="unloadTime"
        >
          <el-date-picker
            v-model="unloadTime"
            type="datetimerange"
            unlink-panels
            :picker-options="pickerTimeOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 228px"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="defaultTime"
            @change="unloadDateChoose"
          />
        </el-form-item>
        <el-form-item label="货源单号" prop="mainOrderNumber">
          <el-input
            v-model.trim="queryParams.mainOrderNumber"
            placeholder="请输入货源单号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item
          label="运输单号"
          prop="waybillNo"
        >
          <el-input
            v-model.trim="queryParams.waybillNo"
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
            v-model.trim="queryParams.teamName"
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
            v-model.trim="queryParams.teamLeaderPhone"
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
            v-model.trim="queryParams.companyName"
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
            v-model.trim="queryParams.shipmentPhone"
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
            v-model.trim="queryParams.teamTransferNo"
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
            v-model.trim="queryParams.teamBizNo"
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
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >
            搜索
          </el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container">
      <TotalBar :total-list="totalList" />
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['transportation:waybillSettlementClarify:export']"
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="loadingExport"
            @click="handleExport"
          >导出</el-button>
          <el-button
            v-hasPermi="['transportation:waybillSettlementClarify:batch']"
            type="primary"
            icon="el-icon-document"
            size="mini"
            :disabled="multiple || loading"
            @click="handleClearing"
          >运单清分</el-button>
          <!-- <el-button
            v-hasPermi="['transportation:waybillSettlementClarify:batchStatus']"
            type="primary"
            icon="el-icon-refresh"
            size="mini"
            :disabled="multiple || loading"
            @click="handleUpdate"
          >更新清分状态</el-button> -->
        </el-col>
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <RefactorTable :loading="loading" :data="clarifylist" :table-columns-config="tableColumnsConfig" :row-class-name="tableRowClassName" :selectable="checkboxT" @selection-change="handleSelectionChange">
        <template #clarifyStatus="{row}">
          <span>
            <i v-if="row.clarifyStatus === '0'" class="el-icon-info g-color-gray" />
            <i v-if="row.clarifyStatus === '1'" class="g-icon-deal" />
            <i v-if="row.clarifyStatus === '2'" class="el-icon-success g-color-success" />
            <i v-if="row.clarifyStatus === '3'" class="el-icon-error g-color-error" />
            <i v-if="row.clarifyStatus === '99'" class="el-icon-info g-color-gray" />
            {{ selectDictLabel(clarifyStatusOptions, row.clarifyStatus) }}
          </span>
        </template>
        <template #shipperRealPay="{row}">
          <span>{{ floor(row.shipperRealPay) }}</span>
        </template>
        <template #teamTransferAmount="{row}">
          <span>{{ floor(row.teamTransferAmount) }}</span>
        </template>
        <template #totalFee="{row}">
          <span>{{ floor(row.totalFee) }}</span>
        </template>
        <template #edit="{row}">
          <el-button
            v-if="row.clarifyStatus !== '2' && row.clarifyStatus !== '99'"
            v-hasPermi="['transportation:waybillSettlementClarify:batch']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 1)"
          >运单清分</el-button>
          <!-- <el-button
            v-if="row.clarifyStatus !== '2' && row.clarifyStatus !== '99'"
            v-hasPermi="['transportation:waybillSettlementClarify:batchStatus']"
            size="mini"
            type="text"
            @click="handleTableBtn(row, 2)"
          >更新清分状态</el-button> -->
          <el-button
            v-hasPermi="['transportation:waybillSettlementClarify:detail']"
            size="mini"
            type="text"
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
    </div>
    <!-- 运单详情 对话框 -->
    <detail-dialog ref="DetailDialog" :current-id="currentId" :title="title" :open.sync="open" :disable="formDisable" @refresh="getList" />
  </div>
</template>

<script>
import { clarifyList, clarifyListApi, batch, batchStatus } from '@/api/settlement/clearing';
// 运单详情弹窗
import DetailDialog from '@/views/waybill/components/detailDialog';

import TotalBar from '@/components/Ddc/Tin/TotalBar';

import { pickerTimeOptions } from '@/utils/dateRange';

export default {
  'name': 'Clearing',
  components: { DetailDialog, TotalBar },
  data() {
    return {
      defaultTime: ['00:00:00', '23:59:59'], // '00:00:00', '23:59:59'
      pickerTimeOptions,
      tableColumnsConfig: [],
      transferTime: [],
      loadTime: [],
      unloadTime: [],
      api: clarifyListApi,
      createTime: '',
      // 遮罩层
      'loading': false,
      // 选中数组
      'ids': [],
      commentlist: [],
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
        'mainOrderNumber': undefined,
        'clarifyStatus': undefined,
        'companyName': undefined,
        'driverName': undefined,
        'driverPhone': undefined,
        'shipmentPhone': undefined,
        'teamBizNo': undefined,
        'teamLeaderPhone': undefined,
        'teamName': undefined,
        'teamTransferNo': undefined,
        'startTeamTransferTime': undefined,
        'endTeamTransferTime': undefined,
        'startLoadTime': undefined,
        'endLoadTime': undefined,
        'startUnLoadTime': undefined,
        'endUnLoadTime': undefined,
        'waybillNo': undefined
      },
      bodyParams: {
        wayBillSettlementCodeList: []
      },
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
        { 'dictLabel': '清分失败', 'dictValue': '3' },
        { 'dictLabel': '无需清分', 'dictValue': '99' }
      ],
      loadingExport: false,
      payLoading: false,
      batchIndex: 0,
      errList: [],
      sucList: []
    };
  },
  computed: {
    totalList() {
      const arr = [
        {
          label: '运单数量',
          value: this.commentlist.length,
          key: 'waybillCount'
        },
        {
          label: '货主实付金额',
          value: 0,
          key: 'shipperRealPay'
        },
        {
          label: '调度者实收金额',
          value: 0,
          key: 'teamTransferAmount'
        },
        // {
        //   label: '留存运费',
        //   value: 0,
        //   key: 'taxPayment'
        // },
        {
          label: '打款金额',
          value: 0,
          key: 'totalFee'
        }
      ];

      this.commentlist.forEach(e => {
        arr.forEach(ee => {
          if (e[ee.key]) {
            ee.value += (e[ee.key] - 0);
          }
        });
      });

      arr.map(e => {
        e.value = this.floor(e.value);
        return e;
      });

      return arr;
    }
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, clarifyListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 200,
      fixed: 'left'
    });
    this.getList();
  },
  'methods': {
    checkboxT(row) {
      if (row.clarifyStatus === '2' || row.clarifyStatus === '99') {
			  return false;
      } else {
			  return true;
      }
    },
    datechoose(date) {
      if (date) {
        this.queryParams.startTeamTransferTime = this.parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
        this.queryParams.endTeamTransferTime = this.parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
      } else {
        this.queryParams.startTeamTransferTime = null;
        this.queryParams.endTeamTransferTime = null;
      }
    },
    loadDateChoose(date) {
      if (date) {
        this.queryParams.startLoadTime = this.parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
        this.queryParams.endLoadTime = this.parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
      } else {
        this.queryParams.startLoadTime = null;
        this.queryParams.endLoadTime = null;
      }
    },
    unloadDateChoose(date) {
      if (date) {
        this.queryParams.startUnLoadTime = this.parseTime(date[0], '{y}-{m}-{d} {h}:{i}:{s}');
        this.queryParams.endUnLoadTime = this.parseTime(date[1], '{y}-{m}-{d} {h}:{i}:{s}');
      } else {
        this.queryParams.startUnLoadTime = null;
        this.queryParams.endUnLoadTime = null;
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.commentlist = selection;
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
      this.transferTime = [];
      this.queryParams.startTeamTransferTime = null;
      this.queryParams.endTeamTransferTime = null;
      this.loadTime = [];
      this.queryParams.startLoadTime = null;
      this.queryParams.endLoadTime = null;
      this.unloadTime = [];
      this.queryParams.startUnLoadTime = null;
      this.queryParams.endUnLoadTime = null;
      this.handleQuery();
    },
    // 导出
    handleExport() {
      this.loadingExport = true;
      this.download(
        '/transportation/waybillSettlementClarify/export',
        {
          ...this.queryParams
        },
        `运输清分`
      ).then(res => {
        this.loadingExport = false;
      });
    },
    // 运单清分
    handleClearing() {
      this.$confirm('是否确认批量清分？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.errList = [];
        this.sucList = [];
        this.$message({ type: 'warning', message: '发起批量清分成功，请勿关闭或刷新页面！' });
        this.payLoading = true;
        this.batchIndex = 0;
        this.getBatch();
        // batch(this.bodyParams).then(response => {
        //   this.$message({ type: 'success', message: '批量运单清分成功！' });
        //   this.getList();
        // });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      });
    },
    // 清分接口
    async getBatch() {
      const len = this.ids;
      // console.log(len);
      const batchNo = new Date().getTime();
      for (let index = 0; index < len.length; index++) {
        const e = len[index];
        try {
          await batch({ wayBillSettlementCodeList: [e], batchNo: batchNo });
          this.sucList.push(e);
        } catch (error) {
          this.errList.push(e);
          continue;
        }
        // console.log(index, '----', this.ids.length, len.length);
      }
      setTimeout(() => {
        this.getList();
      }, 2000);
      this.payLoading = false;
      // console.log(this.sucList, this.errList);
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.errList.length > 0) {
        if (this.errList.includes(row.wayBillSettlementCode)) {
          return 'warning-row';
        }
      }
      if (this.sucList.length > 0) {
        if (this.sucList.includes(row.wayBillSettlementCode)) {
          return 'success-row';
        }
      }
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
              this.getList();
              this.$message({ type: 'success', message: '运单清分成功！' });
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

<style lang="scss" scoped>
  .total_bg{
    background: #F8F9FA;
    border-radius: 4px;
    padding: 10px 20px;
    margin-bottom: 10px;
  }
  ::v-deep .warning-row{
    background: #fadbd9 !important;
  }
  ::v-deep .success-row{
    background: #d7f0dbff !important;
  }
</style>
