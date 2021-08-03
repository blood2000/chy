<template>
  <!-- 充值记录 -->
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
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
        <el-form-item label="用户姓名" prop="userName">
          <el-input
            v-model.trim="queryParams.userName"
            placeholder="请输入用户姓名"
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
        <el-form-item label="收支类型" prop="paidFeeType">
          <el-select v-model="queryParams.paidFeeType" placeholder="请选择收支类型" clearable filterable size="small">
            <el-option
              v-for="dict in incomeTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="支付类型" prop="paidLineType">
          <el-select v-model="queryParams.paidLineType" placeholder="请选择支付类型" clearable filterable size="small">
            <el-option
              v-for="dict in paidLineTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="消费项目" prop="paidItem">
          <el-select v-model="queryParams.paidItem" placeholder="请选择消费项目" clearable filterable size="small">
            <el-option
              v-for="dict in consumeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="变动时间">
          <el-date-picker
            v-model="queryParams.updateTimeBegin"
            clearable
            type="date"
            size="small"
            style="width: 130px"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
          />
          至
          <el-date-picker
            v-model="queryParams.updateTimeEnd"
            clearable
            type="date"
            size="small"
            style="width: 130px"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
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
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable :loading="loading" :data="rechargeList" :table-columns-config="tableColumnsConfig">
        <!-- 支付类型 -->
        <template #paidLineType="{row}">
          <span>{{ selectDictLabel(paidLineTypeOptions, row.paidLineType) }}</span>
        </template>
        <!-- 消费项目 -->
        <template #paidItem="{row}">
          <span>{{ selectDictLabel(consumeOptions, row.paidItem) }}</span>
        </template>
        <!-- 支付状态 -->
        <template #payStatus="{row}">
          <span>{{ selectDictLabel(payStatusOptions, row.payStatus) }}</span>
        </template>
        <!-- 交易类型 -->
        <template #payType="{row}">
          <span>{{ selectDictLabel(payTypeOptions, row.payType) }}</span>
        </template>
        <!-- 收支类型 -->
        <template #paidFeeType="{row}">
          <p v-if="row.paidFeeType === '0'">
            <span class="g-color-success g-pot" />
            收入
          </p>
          <p v-if="row.paidFeeType === '1'">
            <span class="g-color-error g-pot" />
            支出
          </p>
        </template>
        <!-- 变动金额 -->
        <template #paidAmount="{row}">
          <p v-if="row.paidFeeType === '0'" class="g-color-success">
            +{{ floor(row.paidAmount) }}
          </p>
          <p v-else-if="row.paidFeeType === '1'" class="g-color-error">
            -{{ floor(row.paidAmount) }}
          </p>
          <p v-else>
            {{ floor(row.paidAmount) }}
          </p>
        </template>
        <!-- 账户余额 -->
        <template #accountAmount="{row}">
          <span>{{ floor(row.accountAmount) }}</span>
        </template>
        <template #createTime="{row}">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
        <template #updateTime="{row}">
          <span>{{ parseTime(row.updateTime) }}</span>
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
import { rechargelistApi, rechargelist } from '@/api/capital/recharge';

export default {
  name: 'Recharge',
  data() {
    return {
      tableColumnsConfig: [],
      api: rechargelistApi,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      rechargeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 收支类型字典
      incomeTypeOptions: [
        { dictLabel: '收入', dictValue: 0 },
        { dictLabel: '支出', dictValue: 1 }
      ],
      // 支付类型字典
      paidLineTypeOptions: [
        { dictLabel: '在线支付', dictValue: 0 },
        { dictLabel: '现金支付', dictValue: 1 }
      ],
      // 消费项目字典
      consumeOptions: [
        { dictLabel: '充值', dictValue: 0 },
        // { dictLabel: '保证金', dictValue: 1 },
        { dictLabel: '运费', dictValue: 2 },
        // { dictLabel: '保费', dictValue: 3 },
        // { dictLabel: '罚款', dictValue: 4 },
        { dictLabel: '提现', dictValue: 5 },
        // { dictLabel: '信息费', dictValue: 6 },
        { dictLabel: '油费', dictValue: 7 }
      ],
      // 平台角色字典
      roleOptions: [
        { dictLabel: '货主', dictValue: 0 },
        { dictLabel: '调度者', dictValue: 1 },
        { dictLabel: '司机', dictValue: 2 }
      ],
      // 交易类型
      payTypeOptions: [
        { dictLabel: '现金', dictValue: 0 },
        { dictLabel: '油点', dictValue: 1 },
        { dictLabel: '汽点', dictValue: 2 },
        { dictLabel: '宝付', dictValue: 3 }
      ],
      // 支付状态
      payStatusOptions: [
        { dictLabel: '支付中', dictValue: 1 },
        { dictLabel: '支付失败', dictValue: 2 },
        { dictLabel: '已完成', dictValue: 3 },
        { dictLabel: '无此交易', dictValue: 4 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        userName: undefined,
        userPhone: undefined,
        paidFeeType: undefined,
        paidLineType: undefined,
        paidItem: undefined,
        updateTimeBegin: undefined,
        updateTimeEnd: undefined
      },
      exportLoading: false
    };
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, rechargelistApi);
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      rechargelist(this.queryParams).then(response => {
        this.rechargeList = response.data.rows;
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
      this.queryParams.updateTimeBegin = null;
      this.queryParams.updateTimeEnd = null;
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportLoading = true;
      const params = Object.assign({}, this.queryParams);
      params.pageSize = undefined;
      params.pageNum = undefined;
      this.download('payment/shipmentPaidRecord/export', params, `充值记录`).then(() => {
        this.exportLoading = false;
      });
    }
  }
};
</script>
