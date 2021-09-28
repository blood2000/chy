<template>
  <div>
    <!-- 提现申请 -->
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
        <el-form-item label="平台角色" prop="roleName">
          <el-select v-model="queryParams.roleName" placeholder="请选择平台角色" clearable filterable size="small">
            <el-option
              v-for="dict in roleOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人信息" prop="applyerName">
          <el-input
            v-model.trim="queryParams.applyerName"
            placeholder="请输入申请人电话/姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="收款人姓名" prop="bankAcountName">
          <el-input
            v-model.trim="queryParams.bankAcountName"
            placeholder="请输入收款人姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="userPhone">
          <el-input
            v-model.trim="queryParams.userPhone"
            placeholder="请输入手机号码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankNumber">
          <el-input
            v-model.trim="queryParams.bankNumber"
            placeholder="请输入银行卡号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="车牌号" prop="licenseNumber">
          <el-input
            v-model.trim="queryParams.licenseNumber"
            placeholder="请输入车牌号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <el-form-item label="支付批次号" prop="bizNo">
          <el-input
            v-model.trim="queryParams.bizNo"
            placeholder="请输入支付批次号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="转账结果" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable filterable size="small">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="转账日期" prop="transferTime">
          <el-date-picker
            v-model="transferTime"
            clearable
            unlink-panels
            type="datetimerange"
            :picker-options="pickerTimeOptions"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="small"
            style="width: 215px"
            :default-time="defaultTime"
            @change="transferTimeChoose"
          />
        </el-form-item>
        <el-form-item label="申请日期" prop="applyTime">
          <el-date-picker
            v-model="applyTime"
            clearable
            unlink-panels
            type="datetimerange"
            :picker-options="pickerTimeOptions"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="small"
            style="width: 215px"
            :default-time="defaultTime"
            @change="applyTimeChoose"
          />
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
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-upload2"
            size="mini"
            :disabled="multiple"
            :loading="importLoading"
            @click="handleImport"
          >网商批量提现</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            icon="el-icon-upload2"
            size="mini"
            :disabled="multiple"
            :loading="rejectLoading"
            @click="handleReject"
          >网商批量驳回</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-download"
            size="mini"
            :disabled="multiple"
            @click="handleRefreshStatus"
          >更新网商提现状态</el-button>
        </el-col> -->
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable
        ref="multipleTable"
        :loading="loading"
        :data="withdrawalList"
        :table-columns-config="tableColumnsConfig"
        :row-class-name="tableRowClassName"
        :selectable="selectableFn"
        @selection-change="handleSelectionChange"
      >
        <!-- 批次号 -->
        <!-- <template #bizNo="{row}">
          <span v-if="(row.status === 1 || row.status === 2) && row.elecrecepitUrl && row.elecrecepitUrl !== ''" class="link-type" title="点击下载电子回单" @click="lookOrder(row)">{{ row.bizNo }}</span>
          <span v-else>{{ row.bizNo }}</span>
        </template> -->
        <!-- 金额 -->
        <template #money="{row}">
          <span>{{ floor(row.money) }}</span>
        </template>
        <!-- 转账渠道 -->
        <template #payStatus="{row}">
          <span>{{ selectDictLabel(payStatusOption, row.payStatus) }}</span>
        </template>
        <!-- 转账结果 -->
        <template #status="{row}">
          <i v-if="row.status === 0" class="g-icon-money mr5" />
          <i v-if="row.status === 1" class="g-icon-push mr5" />
          <i v-if="row.status === 2" class="el-icon-success g-color-success mr5" />
          <i v-if="row.status === 3" class="el-icon-error g-color-error mr5" />
          <i v-if="row.status === 4" class="g-icon-deal mr5" />
          <i v-if="row.status === 5" class="el-icon-remove g-color-light-gray mr5" />
          <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
        </template>
        <template #transferTime="{row}">
          <span>{{ parseTime(row.transferTime) }}</span>
        </template>
        <template #applyDate="{row}">
          <span>{{ parseTime(row.applyDate) }}</span>
        </template>
        <template #edit="{row}">
          <el-button
            size="mini"
            type="text"
            @click="handleReBindCard(row)"
          >重新绑卡</el-button>
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

    <!-- 查看回单 -->
    <PdfLook :src="pdfSrc" :open.sync="pdfOpen" title="查看回单" />
  </div>
</template>

<script>
import { withDrawalListApi, getWithDrawalList, toCard, reject, reBindCard } from '@/api/capital/withdrawal';
import PdfLook from '@/views/system/media/pdfLook';
import { pickerTimeOptions } from '@/utils/dateRange';

export default {
  name: 'Withdrawal',
  components: {
    PdfLook
  },
  data() {
    return {
      defaultTime: ['00:00:00', '23:59:59'],
      pickerTimeOptions,
      applyTime: [],
      transferTime: [],
      tableColumnsConfig: [],
      api: withDrawalListApi,
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
      withdrawalList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 平台角色字典
      roleOptions: [
        { dictLabel: '货主', dictValue: 0 },
        { dictLabel: '调度者', dictValue: 1 },
        { dictLabel: '司机', dictValue: 2 }
      ],
      // 转帐结果字典
      statusOptions: [
        { dictLabel: '提现申请', dictValue: 0 },
        { dictLabel: '提现成功', dictValue: 1 },
        { dictLabel: '转账成功', dictValue: 2 },
        { dictLabel: '转账失败', dictValue: 3 },
        { dictLabel: '处理中', dictValue: 4 },
        { dictLabel: '驳回', dictValue: 5 }
      ],
      // 转账渠道字典
      payStatusOption: [
        { dictLabel: '线下', dictValue: 0 },
        { dictLabel: '线上', dictValue: 1 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        applyerName: undefined,
        bankAcountName: undefined,
        userPhone: undefined,
        bankNumber: undefined,
        licenseNumber: undefined,
        status: undefined,
        transferTimeBegin: undefined,
        transferTimeEnd: undefined,
        applyTimeBegin: undefined,
        applyTimeEnd: undefined,
        bizNo: undefined
      },
      searched: false,
      exportLoading: false,
      importLoading: false,
      rejectLoading: false,
      errList: [],
      sucList: [],
      // 查看回单
      pdfSrc: '',
      pdfOpen: false
    };
  },
  computed: {
    routeName() {
      return this.$store.state.settings.quickEntryName;
    },
    roles() {
      return this.$store.state.user.roles;
    }
  },
  watch: {
    routeName: {
      handler: function(val) {
        if (val === 'Withdrawal') {
          this.resetQueryForm();
          this.queryParams.status = JSON.parse(this.$route.query.data).status;
          this.handleQuery();
        }
      },
      deep: true
    }
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, withDrawalListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 100,
      fixed: 'left'
    });

    const routeData = this.$route.query.data;
    if (routeData) {
      this.queryParams.status = JSON.parse(routeData).status;
    }

    this.getList();
    // this.getRouterQuery(this.$route);
    console.log(this.roles);

    // 如果是ddc_admin账号，搜索条件不显示调度者
    const is_ddc_admin = this.roles.find(value => {
      return value === 'd1f7988f060c4f00b2861b37693bd384';
    });
    if (is_ddc_admin) {
      this.roleOptions = [
        { dictLabel: '货主', dictValue: 0 },
        { dictLabel: '司机', dictValue: 2 }
      ];
    }
  },
  methods: {
    // 时间选择
    transferTimeChoose(date) {
      if (date) {
        this.queryParams.transferTimeBegin = this.parseTime(date[0], '{y}-{m}-{d} {m}:{i}:{s}');
        this.queryParams.transferTimeEnd = this.parseTime(date[0], '{y}-{m}-{d} {m}:{i}:{s}');
      } else {
        this.queryParams.transferTimeBegin = null;
        this.queryParams.transferTimeEnd = null;
      }
    },
    applyTimeChoose(date) {
      if (date) {
        this.queryParams.applyTimeBegin = this.parseTime(date[0], '{y}-{m}-{d} {m}:{i}:{s}');
        this.queryParams.applyTimeEnd = this.parseTime(date[0], '{y}-{m}-{d} {m}:{i}:{s}');
      } else {
        this.queryParams.applyTimeBegin = null;
        this.queryParams.applyTimeEnd = null;
      }
    },
    /** 从快捷入口进 */
    getRouterQuery(route) {
      if (route.name !== this.$options.name) return;
      const { query } = route;
      const data = JSON.parse(query.data || '{}');
      // 页面缓存
      if (this.searched) return;
      Object.assign(this.queryParams, data);
      this.getList();
    },
    /** 查询列表 */
    getList(e) {
      if (e !== 1) {
        this.errList = [];
        this.sucList = [];
        this.loading = true;
      }
      this.$store.dispatch('settings/changeQuick', null);
      const params = { ...this.queryParams };
      if (params.licenseNumber) {
        params.licenseNumber = params.licenseNumber.toUpperCase();
      }
      getWithDrawalList(params).then(response => {
        this.withdrawalList = response.data.rows;
        this.total = response.data.total;
        this.loading = false;
        this.searched = true;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetQueryForm();
      this.handleQuery();
    },
    resetQueryForm() {
      this.transferTime = [];
      this.applyTime = [];
      this.queryParams.transferTimeBegin = null;
      this.queryParams.transferTimeEnd = null;
      this.queryParams.applyTimeBegin = null;
      this.queryParams.applyTimeEnd = null;
      this.resetForm('queryForm');
      this.queryParams.status = undefined;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportLoading = true;
      const params = Object.assign({}, this.queryParams);
      params.pageSize = undefined;
      params.pageNum = undefined;
      this.download('/payment/transferApply/export', params, `提现申请`).then(() => {
        this.exportLoading = false;
      });
    },
    /** 网商批量提现 */
    handleImport() {
      // const _this = this;
      this.$confirm('是否确认网商批量提现?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.errList = [];
        this.sucList = [];
        this.$message({ type: 'warning', message: '发起网商提现成功，请勿关闭或刷新页面！' });
        this.importLoading = true;
        this.getToCard();
        // toCard(_this.ids).then(response => {
        //   _this.importLoading = false;
        //   _this.msgSuccess('操作成功');
        //   _this.$refs.multipleTable.m2ToggleSelection();
        //   _this.getList();
        // }).catch(() => {
        //   _this.importLoading = false;
        // });
      });
    },
    // 提现接口
    async getToCard() {
      const len = this.ids;
      // console.log(len);
      for (let index = 0; index < len.length; index++) {
        const e = len[index];
        try {
          await toCard([e]);
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
      this.$refs.multipleTable.m2ToggleSelection();
      this.importLoading = false;
      console.log(this.sucList, this.errList);
    },
    // 列表颜色
    tableRowClassName({ row, rowIndex }) {
      if (this.errList.length > 0) {
        if (this.errList.includes(row.id)) {
          return 'warning-row';
        }
      }
      if (this.sucList.length > 0) {
        if (this.sucList.includes(row.id)) {
          return 'success-row';
        }
      }
    },
    /** 网商批量驳回 */
    handleReject() {
      const _this = this;
      this.$confirm('是否确认网商批量驳回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        _this.rejectLoading = true;
        reject(_this.ids).then(response => {
          _this.rejectLoading = false;
          _this.msgSuccess('操作成功');
          _this.$refs.multipleTable.m2ToggleSelection();
          _this.getList();
        }).catch(() => {
          _this.rejectLoading = false;
        });
      });
    },
    /** 更新网商提现状态 */
    handleRefreshStatus() {

    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 只有状态是“提现申请”才能发起提现申请
    selectableFn(row, index) {
      if (row.status === 0) {
        return true;
      } else {
        return false;
      }
    },
    /** 查看回单 */
    lookOrder(row) {
      // row.elecrecepitUrl = 'https://elec-receipt.obs.cn-south-1.myhuaweicloud.com/20210729/2021072910130010111013040011450035529955+8c89923840464e5e85e91b99ac6a8dd7.pdf';
      this.pdfSrc = row.elecrecepitUrl;
      this.pdfOpen = true;
    },
    /** 重新绑卡 */
    handleReBindCard(row) {
      const _this = this;
      this.$confirm('是否确认重新绑卡?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        _this.msgInfo('绑定中，请稍后');
        reBindCard(row.id).then(res => {
          if (res.code === 200) {
            _this.msgSuccess('操作成功');
            _this.getList();
          } else {
            _this.msgError(res.msg || '操作失败');
          }
        });
      });
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
