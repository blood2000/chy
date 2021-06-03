<template>
  <!-- 出入账记录 -->
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
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
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <el-table v-loading="loading" highlight-current-row stripe border :data="dataList">
        <el-table-column label="平台角色" align="center" prop="roleName" />
        <el-table-column label="操作员" align="center" prop="updateName" />
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
      </el-table>

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
      // 交易类型字典
      consumeOptions: [
        { dictLabel: '充值', dictValue: 0 },
        { dictLabel: '提现', dictValue: 5 }
      ],
      // 支付类型字典
      paidLineTypeOptions: [
        { dictLabel: '在线支付', dictValue: 0 },
        { dictLabel: '现金支付', dictValue: 1 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
  created() {
    this.changeTimeFormate();
    this.getList();
  },
  methods: {
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
