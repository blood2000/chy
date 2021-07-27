<template>
  <!-- 出入账记录 -->
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
        <el-form-item label="收支类型" prop="paidFeeType">
          <el-select v-model="queryParams.paidFeeType" placeholder="请选择收支类型" clearable filterable size="small">
            <el-option
              v-for="dict in paidFeeTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型" prop="paidItem">
          <el-select v-model="queryParams.paidItem" placeholder="请选择交易类型" clearable filterable size="small">
            <el-option
              v-for="dict in consumeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交易日期">
          <el-date-picker
            v-model="queryParams.updateTimeBegin"
            clearable
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
            @change="changeDatePicker"
          />
          至
          <el-date-picker
            v-model="queryParams.updateTimeEnd"
            clearable
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="请选择"
            @change="changeDatePicker"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="g-radio-group">
      <el-radio-group v-model="activeName" size="small" @change="handleClick">
        <el-radio-button label="近三月" />
        <el-radio-button label="近半年" />
        <el-radio-button label="近一年" />
      </el-radio-group>
    </div>
    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" /><!-- api 使用computed -->
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <RefactorTable
        :loading="loading"
        :data="dataList"
        :table-columns-config="tableColumnsConfig"
      >
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

        <template #paidLineType="{row}">
          <span>{{ selectDictLabel(paidLineTypeOptions, row.paidLineType) }}</span>
        </template>

        <template #paidItem="{row}">
          <span>{{ selectDictLabel(consumeOptions, row.paidItem) }}</span>
        </template>

        <template #payStatus="{row}">
          <span>{{ selectDictLabel(payStatusOptions, row.payStatus) }}</span>
        </template>

        <template #payType="{row}">
          <span>{{ selectDictLabel(payTypeOptions, row.payType) }}</span>
        </template>

        <template #staffType="{row}">
          <span>{{ selectDictLabel(staffTypeOptions, row.staffType) }}</span>
        </template>

        <template #paidAmount="{row}">
          <p v-if="row.paidFeeType === '0'" class="g-color-success">
            +{{ row.paidAmount }}
          </p>
          <p v-else-if="row.paidFeeType === '1'" class="g-color-error">
            -{{ row.paidAmount }}
          </p>
          <p v-else>
            {{ row.paidAmount }}
          </p>
        </template>

        <template #updateTime="{row}">
          <span>{{ parseTime(row.updateTime) }}</span>
        </template>

      </RefactorTable>

      <!-- <el-table v-if="false" v-loading="loading" highlight-current-row border :data="dataList">
        <el-table-column label="平台角色" align="center" prop="roleName" />
        <el-table-column label="操作员" align="center" prop="operatorName" />
        <el-table-column label="手机号" align="center" prop="phonenumber" />
        <el-table-column label="收支类型" align="center" prop="paidFeeType">
          <template slot-scope="scope">
            <p v-if="scope.row.paidFeeType === '0'">
              <span class="g-color-success g-pot" />
              收入
            </p>
            <p v-if="scope.row.paidFeeType === '1'">
              <span class="g-color-error g-pot" />
              支出
            </p>
          </template>
        </el-table-column>
        <el-table-column label="支付类型" align="center" prop="paidLineType">
          <template slot-scope="scope">
            <span>{{ selectDictLabel(paidLineTypeOptions, scope.row.paidLineType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="银行卡类型" align="center" prop="bankType" width="100" />
        <el-table-column label="银行卡号" align="center" prop="bankNumber" width="180" />
        <el-table-column label="交易类型" align="center" prop="paidItem">
          <template slot-scope="scope">
            <span>{{ selectDictLabel(consumeOptions, scope.row.paidItem) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变动金额" align="center" prop="paidAmount">
          <template slot-scope="scope">
            <p v-if="scope.row.paidFeeType === '0'" class="g-color-success">
              +{{ scope.row.paidAmount }}
            </p>
            <p v-else-if="scope.row.paidFeeType === '1'" class="g-color-error">
              -{{ scope.row.paidAmount }}
            </p>
            <p v-else>
              {{ scope.row.paidAmount }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="账户余额" align="center" prop="accountAmount" />
        <el-table-column label="备注" align="center" prop="remark" width="180" />
        <el-table-column label="变动时间" align="center" prop="updateTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
      </el-table> -->

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
import { getUserInfo } from '@/utils/auth';
import { rechargelist } from '@/api/capital/recharge';
import { getTimeRange } from '@/utils/timeRange';

export default {
  name: 'WithdrawalsRecord',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      // 表头 7/26 --chj
      tableColumnsConfig: [],

      // 收支类型字典
      paidFeeTypeOptions: [
        { dictLabel: '收入', dictValue: 0 },
        { dictLabel: '支出', dictValue: 1 }
      ],
      // 交易类型字典
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
      // 支付类型字典
      paidLineTypeOptions: [
        { dictLabel: '在线支付', dictValue: 0 },
        { dictLabel: '现金支付', dictValue: 1 }
      ],
      // 支付状态:1-支付中 2-支付失败 3-已完成 4-无此交易
      payStatusOptions: [
        { dictLabel: '支付中', dictValue: 1 },
        { dictLabel: '支付失败', dictValue: 2 },
        { dictLabel: '已完成', dictValue: 3 },
        { dictLabel: '无此交易', dictValue: 4 }
      ],
      // payType 交易类型:0-现金,1-油点,2-汽点,3-宝付
      payTypeOptions: [
        { dictLabel: '现金', dictValue: 0 },
        { dictLabel: '油点', dictValue: 1 },
        { dictLabel: '汽点', dictValue: 2 },
        { dictLabel: '宝付', dictValue: 3 }
      ],
      // staffType 员工类型 0-独立货主，1-企业货主，2-企业发货人，3-企业财务，4-企业收货人，5-上游客户
      staffTypeOptions: [
        { dictLabel: '独立货主', dictValue: 0 },
        { dictLabel: '企业货主', dictValue: 1 },
        { dictLabel: '企业发货人', dictValue: 2 },
        { dictLabel: '企业财务', dictValue: 3 },
        { dictLabel: '企业收货人', dictValue: 4 },
        { dictLabel: '上游客户', dictValue: 5 }
      ],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        paidFeeType: undefined,
        paidItem: undefined,
        updateTimeBegin: undefined,
        updateTimeEnd: undefined,
        isTranfer: '1' // 只查充值和提现
      },
      activeName: '近三月',
      updateTimeBegin: undefined,
      updateTimeEnd: undefined
    };
  },

  computed: {
    api() {
      // 这个地址只处理表头
      return '/payment/shipmentPaidRecord/expenditureList';
    }
  },
  created() {
    this.tableColumnsInit();
    this.changeTimeFormate();
    this.getList();
  },

  methods: {
    /** 初始化表头 */
    tableColumnsInit() {
      this.tableColumnsConfig = [];

      this.tableHeaderConfig(this.tableColumnsConfig, this.api);
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      const { user = {}} = getUserInfo() || {};
      const { userCode } = user;
      rechargelist(
        Object.assign(
          {},
          this.queryParams,
          { userCode: userCode },
          {
            updateTimeBegin: this.queryParams.updateTimeBegin ? this.queryParams.updateTimeBegin : this.updateTimeBegin,
            updateTimeEnd: this.queryParams.updateTimeEnd ? this.queryParams.updateTimeEnd : this.updateTimeEnd
          }
        )
      ).then(response => {
        this.dataList = response.data.rows;
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
      this.changeTimeFormate();
      this.resetForm('queryForm');
      this.handleQuery();
    },
    handleClick() {
      this.queryParams.pageNum = 1;
      this.changeTimeFormate();
      this.getList();
    },
    changeTimeFormate() {
      if (this.activeName === '') this.activeName = '近三月';
      this.queryParams.updateTimeBegin = undefined;
      this.queryParams.updateTimeEnd = undefined;
      let t = 0;
      if (this.activeName === '近三月') {
        t = 3;
      } else if (this.activeName === '近半年') {
        t = 6;
      } else if (this.activeName === '近一年') {
        t = 12;
      }
      const { start, end } = getTimeRange(t);
      this.updateTimeBegin = start;
      this.updateTimeEnd = end;
    },
    changeDatePicker() {
      this.activeName = '';
      this.updateTimeBegin = undefined;
      this.updateTimeEnd = undefined;
    }
  }
};
</script>
