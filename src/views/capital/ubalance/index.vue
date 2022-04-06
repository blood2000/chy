<template>
  <!-- 平台用户余额 -->
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="平台角色" prop="roleName">
          <el-select
            v-model="queryParams.roleName"
            placeholder="请选择平台角色"
            clearable
            filterable
            size="small"
            style="width: 228px"
          >
            <el-option
              v-for="dict in roleOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="企业名称" prop="orgName">
          <el-input
            v-model.trim="queryParams.orgName"
            placeholder="请输入企业名称"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="用户姓名" prop="nickName">
          <el-input
            v-model.trim="queryParams.nickName"
            placeholder="请输入用户姓名"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model.trim="queryParams.phonenumber"
            placeholder="请输入手机号码"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        
        <el-form-item label="余额区间">
          <el-input
            v-model.trim="queryParams.minAmount"
            placeholder="最小值"
            clearable
            size="small"
            style="width: 103px"
            @keyup.enter.native="handleQuery"
          />
          至
          <el-input
            v-model.trim="queryParams.maxAmount"
            placeholder="最大值"
            clearable
            size="small"
            style="width: 103px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="打款时间" prop="queryTime">
          <el-date-picker
            v-model="queryTime"
            type="datetimerange"
            unlink-panels
            :picker-options="pickerTimeOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 360px"
            :default-time="defaultTime"
            @change="datechoose"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button
            type="primary"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container">
      <el-row :gutter="10" class="total_bg">
        <el-col :span="1">
          <img src="~@/assets/images/icon/total.png" />
        </el-col>
        <el-col :span="4">
          <span style="line-height: 31px"
            >总账号余额：{{ statistical.amount ? statistical.amount : 0 }}</span
          >
        </el-col>
        <el-col :span="4">
          <span style="line-height: 31px"
            >总保证金：{{
              statistical.freezeAmount ? statistical.freezeAmount : 0
            }}</span
          >
        </el-col>
        <el-col :span="4">
          <span style="line-height: 31px"
            >总可用余额：{{
              statistical.availableBalance ? statistical.availableBalance : 0
            }}</span
          >
        </el-col>
        <el-col :span="4">
          <span style="line-height: 31px"
            >总授信余额：{{
              statistical.crediBalance ? statistical.crediBalance : 0
            }}</span
          >
        </el-col>
      </el-row>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['data:platform:export']"
            type="primary"
            icon="el-icon-download"
            size="mini"
            :loading="loadingExport"
            @click="handleExport"
          >导出</el-button>
        </el-col>
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable
        :loading="loading"
        :data="dataList"
        :table-columns-config="tableColumnsConfig"
      >
        <!-- 余额 -->
        <template #amount="{row}">
          <span>{{ money(row.amount) }}</span>
        </template>
        <!-- 保证金 -->
        <template #freezeAmount="{row}">
          <span>{{ money(row.freezeAmount) }}</span>
        </template>
        <!-- 可用余额 -->
        <template #availableBalance="{row}">
          <span>{{ money(row.availableBalance) }}</span>
        </template>
        <!-- 授信余额 -->
        <template #crediBalance="{row}">
          <span>{{ money(row.crediBalance) }}</span>
        </template>
        <!-- 本月已申请提现金额 -->
        <template #monthMoney="{row}">
          <span>{{ money(row.monthMoney) }}</span>
        </template>
        <!-- 本月剩余可提现金额 -->
        <template #residueMonthMoney="{row}">
          <span>{{ money(row.residueMonthMoney) }}</span>
        </template>
        <template #updateTime="{ row }">
          <span>{{ parseTime(row.updateTime) }}</span>
        </template>
        <template #edit="{ row }">
          <el-button size="mini" type="text" @click="handleBalance(row)"
            >网商余额</el-button
          >
          <el-button size="mini" type="text" @click="handleDetail(row)"
            >明细</el-button
          >
        </template>
      </RefactorTable>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 变动明细 对话框 -->
    <change-detail-dialog
      :open.sync="detailOpen"
      :title="title"
      :user-code="userCode"
    />
    <!-- 查询网商余额 对话框 -->
    <check-balance-dialog
      :open.sync="balanceOpen"
      :title="title"
      :user-code="userCode"
    />
  </div>
</template>

<script>
import {
  balanceListApi,
  balanceList,
  getTotalMoney,
} from "@/api/capital/ubalance";
import ChangeDetailDialog from "../components/changeDetailDialog";
import CheckBalanceDialog from "../components/checkBalanceDialog";
import { pickerTimeOptions } from "@/utils/dateRange";
export default {
  name: "Ubalance",
  components: {
    ChangeDetailDialog,
    CheckBalanceDialog,
  },
  data() {
    return {
      pickerTimeOptions,
      defaultTime: ['00:00:00', '23:59:59'],
      queryTime: [],
      tableColumnsConfig: [],
      api: balanceListApi,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      balanceOpen: false,
      detailOpen: false,
      loadingExport: false,
      // 平台角色字典
      roleOptions: [
        { dictLabel: "货主", dictValue: 0 },
        { dictLabel: "调度者", dictValue: 1 },
        { dictLabel: "司机", dictValue: 2 },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        roleName: undefined,
        orgName: undefined,
        nickName: undefined,
        phonenumber: undefined,
        minAmount: undefined,
        maxAmount: undefined,
      },
      // 选中的用户
      userCode: null,
      // 统计值
      statistical: {},
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, balanceListApi, {
      prop: "edit",
      isShow: true,
      label: "操作",
      width: 140,
      fixed: "left",
    });
    this.getList();
    this.getTotalMoney();
  },
  methods: {
    /** 查询用户金额统计 */
    getTotalMoney() {
      const params = Object.assign({}, this.queryParams);
      params.pageNum = undefined;
      params.pageSize = undefined;
      getTotalMoney(params).then((res) => {
        this.statistical = res.data || {};
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      balanceList(this.queryParams).then((response) => {
        this.dataList = response.data.rows;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 搜索时间选择
    datechoose(date) {
      console.log(date)
      if (date) {
        this.queryParams.startTime = this.parseTime(date[0]);
        this.queryParams.endTime = this.parseTime(date[1]);
      } else {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      console.log(this.queryParams)
      this.getList();
      this.getTotalMoney();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryTime = [];
      this.queryParams.startTime = null;
      this.queryParams.endTime = null;
      this.handleQuery();
    },
    // 导出
    handleExport() {
      this.loadingExport = true;
      this.download(
        '/payment/wallet/userAmout/export',
        { ...this.queryParams },
        `用户余额报表`
      ).then(res => {
        this.loadingExport = false;
      });
    },
    /** 网商余额按钮 */
    handleBalance(row) {
      this.title = "查询网商余额";
      this.userCode = row.userCode;
      this.balanceOpen = true;
    },
    /** 明细按钮 */
    handleDetail(row) {
      this.title = "明细";
      this.userCode = row.userCode;
      this.detailOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.total_bg {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 10px 20px;
  margin-bottom: 10px;
}
</style>
