<template>
  <!-- 变动明细表 -->
  <el-dialog
    :visible="visible"
    :fullscreen="isfullscreen"
    width="1300px"
    title="变动明细"
    append-to-body
    class="i-detail"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="变动明细" name="mx">
        <!-- 变动明细 -->
        <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
          <el-form-item label="运输单号" prop="waybillNo">
            <el-input
              v-model.trim="queryParams.waybillNo"
              placeholder="请输入运输单号"
              clearable
              size="small"
              class="input-width"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="变动时间">
            <el-date-picker
              v-model="queryParams.updateTimeBegin"
              clearable
              size="small"
              class="input-width"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择"
            />
            至
            <el-date-picker
              v-model="queryParams.updateTimeEnd"
              clearable
              size="small"
              class="input-width"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择"
            />
          </el-form-item>
          <el-form-item label="变动原因" prop="paidItem">
            <el-select v-model="queryParams.paidItem" placeholder="请选择变动原因" filterable clearable size="small" class="input-width">
              <el-option
                v-for="dict in consumeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="变动类型" prop="paidFeeType">
            <el-select v-model="queryParams.paidFeeType" placeholder="请选择变动类型" filterable clearable size="small" class="input-width">
              <el-option
                v-for="dict in typeOptions"
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-download" size="mini" :loading="exportLoading" @click="handleExport">导出</el-button>
          </el-col>
          <el-col :span="1.5" class="fr">
            <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" /><!-- api 使用computed -->
          </el-col>
          <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
        </el-row>

        <RefactorTable :loading="loading" :data="infoList" :table-columns-config="tableColumnsConfig">
          <template #accountAmount="{row}">
            <span>{{ floor(row.accountAmount) }}</span>
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
          <template #paidItem="{row}">
            <span>{{ selectDictLabel(consumeOptions, row.paidItem) }}</span>
          </template>
          <template #createTime="{row}">
            {{ parseTime(row.createTime) }}
          </template>
        </RefactorTable>

        <el-table v-if="false" v-loading="loading" border highlight-current-row :data="infoList">
          <el-table-column label="序号" align="center" fixed="left" type="index" min-width="5%" />
          <el-table-column label="客户名称" align="center" prop="userName" min-width="150" />
          <el-table-column label="运输单号" align="center" prop="waybillNo" min-width="180" />
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
          <el-table-column label="变动类型" align="center" prop="paidFeeType">
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
          <el-table-column label="变动原因" align="center" prop="paidItem">
            <template slot-scope="scope">
              <span>{{ selectDictLabel(consumeOptions, scope.row.paidItem) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="账户余额" align="center" prop="accountAmount" />
          <el-table-column label="操作人" align="center" prop="operatorName" />
          <el-table-column label="变动时间" align="center" prop="createTime" min-width="180">
            <template slot-scope="scope">
              {{ parseTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" min-width="150" />
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 300]"
          @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="冻结记录" name="dj">
        <!-- 冻结记录 -->
        <el-form v-show="showSearchFrreeze" ref="frreezeQueryForm" :model="frreezeQueryParams" :inline="true" label-width="80px">
          <el-form-item label="运输单号" prop="waybillNo">
            <el-input
              v-model.trim="frreezeQueryParams.waybillNo"
              placeholder="请输入运输单号"
              clearable
              size="small"
              class="input-width"
              @keyup.enter.native="handleQueryFrreeze"
            />
          </el-form-item>
          <el-form-item label="交易日期">
            <el-date-picker
              v-model="frreezeQueryParams.startTime"
              clearable
              type="date"
              size="small"
              value-format="yyyy-MM-dd"
              class="input-width"
              placeholder="请选择"
            />
            至
            <el-date-picker
              v-model="frreezeQueryParams.endTime"
              clearable
              type="date"
              size="small"
              value-format="yyyy-MM-dd"
              class="input-width"
              placeholder="请选择"
            />
          </el-form-item>
          <el-form-item label="资金类型" prop="capitalType">
            <el-select v-model="frreezeQueryParams.capitalType" placeholder="请选择资金类型" filterable clearable size="small" class="input-width">
              <el-option
                v-for="dict in capitalTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="操作类型" prop="operType">
            <el-select v-model="frreezeQueryParams.operType" placeholder="请选择操作类型" filterable clearable size="small" class="input-width">
              <el-option
                v-for="dict in operTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryFrreeze">搜索</el-button>
            <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQueryFrreeze">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-download" size="mini" :loading="frreezeExportLoading" @click="handleExportFrreeze">导出</el-button>
          </el-col>
          <right-toolbar :show-search.sync="showSearchFrreeze" @queryTable="getFrreezeList" />
        </el-row>
        <el-table v-loading="frreezeLoading" highlight-current-row border :data="dataList">
          <el-table-column label="运输单号" align="center" prop="waybillNo" />
          <el-table-column label="类型" align="center" prop="type">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 1" class="g-color-error">冻结</span>
              <span v-if="scope.row.type === 2" class="g-color-success">解冻</span>
            </template>
          </el-table-column>
          <el-table-column label="资金类型" align="center" prop="capitalType">
            <template slot-scope="scope">
              <span>{{ selectDictLabel(capitalTypeOptions, scope.row.capitalType) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作类型" align="center" prop="operType">
            <template slot-scope="scope">
              <span>{{ selectDictLabel(operTypeOptions, scope.row.operType) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额（元）" align="center" prop="amount">
            <template slot-scope="scope">
              <span>{{ floor(scope.row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作后金额（元）" align="center" prop="beforeFreezeAmount">
            <template slot-scope="scope">
              <span>{{ floor(scope.row.beforeFreezeAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作时间" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="frreezeTotal>0"
          :total="frreezeTotal"
          :page.sync="frreezeQueryParams.pageNum"
          :limit.sync="frreezeQueryParams.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 300]"
          @pagination="getFrreezeList"
        />
      </el-tab-pane>
    </el-tabs>

  </el-dialog>
</template>

<script>
// 变动明细用的是充值记录的接口
import { rechargelist } from '@/api/capital/recharge';
import { frreezeAmountLog } from '@/api/capital/payrecord';

export default {
  props: {
    open: Boolean,
    userCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      'tableColumnsConfig': [],
      showSearch: true,
      showSearchFrreeze: true,
      isfullscreen: false,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
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
      // 交易类型字典
      typeOptions: [
        { dictLabel: '收入', dictValue: 0 },
        { dictLabel: '支出', dictValue: 1 }
      ],
      // 资金类型字典
      capitalTypeOptions: [
        { dictLabel: '余额', dictValue: 1 },
        { dictLabel: '授信金额', dictValue: 2 }
      ],
      // 操作类型字典
      operTypeOptions: [
        { dictLabel: '接单或卸货', dictValue: 1 },
        { dictLabel: '打款', dictValue: 2 },
        { dictLabel: '提现', dictValue: 3 },
        { dictLabel: '重置', dictValue: 4 },
        { dictLabel: '取消运单', dictValue: 5 },
        { dictLabel: '增加授信金额', dictValue: 6 },
        { dictLabel: '扣除授信额度', dictValue: 7 },
        { dictLabel: '预付解冻', dictValue: 8 }
      ],
      // 参数表格数据
      infoList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        waybillNo: undefined,
        paidItem: undefined,
        paidFeeType: undefined,
        updateTimeBegin: undefined,
        updateTimeEnd: undefined,
        capitalType: undefined,
        operType: undefined
      },
      frreezeQueryParams: {
        pageNum: 1,
        pageSize: 10,
        waybillNo: undefined,
        startTime: undefined,
        endTime: undefined
      },
      dataList: [],
      frreezeTotal: 0,
      frreezeLoading: false,
      activeName: 'mx',
      // 导出
      exportLoading: false,
      frreezeExportLoading: false
    };
  },
  computed: {
    api() {
      return '/payment/shipmentPaidRecord/changeDetailVoList';
    },
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.getList();
        this.getFrreezeList();
      }
    }
  },

  created() {
    this.tableColumnsInit();
  },

  methods: {
    /** 初始化表头 */
    tableColumnsInit() {
      this.tableColumnsConfig = [];
      this.tableHeaderConfig(this.tableColumnsConfig, this.api);
    },
    // 获取变动明细列表
    getList() {
      this.loading = true;
      this.queryParams.userCode = this.userCode;
      rechargelist(this.queryParams).then(response => {
        this.infoList = response.data.rows;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 重置按钮操作
    resetQuery() {
      this.reset();
      this.handleQuery();
    },
    // 表单重置
    reset() {
      this.queryParams.updateTimeBegin = undefined;
      this.queryParams.updateTimeEnd = undefined;
      this.resetForm('queryForm');
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
      this.resetFrreeze();
      this.activeName = 'mx';
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    /** 冻结记录 */
    getFrreezeList() {
      this.frreezeLoading = true;
      this.frreezeQueryParams.userCode = this.userCode;
      frreezeAmountLog(this.frreezeQueryParams).then(response => {
        this.dataList = response.rows;
        this.frreezeTotal = response.total;
        this.frreezeLoading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQueryFrreeze() {
      this.frreezeQueryParams.pageNum = 1;
      this.getFrreezeList();
    },
    /** 重置按钮操作 */
    resetQueryFrreeze() {
      this.resetFrreeze();
      this.handleQueryFrreeze();
    },
    resetFrreeze() {
      this.frreezeQueryParams.startTime = undefined;
      this.frreezeQueryParams.endTime = undefined;
      this.resetForm('frreezeQueryForm');
    },
    /** 明细-导出按钮操作 */
    async handleExport() {
      this.exportLoading = true;
      const params = Object.assign({}, this.queryParams);
      params.pageSize = undefined;
      params.pageNum = undefined;
      // 7/28 导出接口变化 --chj
      await this.download('payment/shipmentPaidRecord/changeDetailVoExport', params, `变动明细`);
      this.exportLoading = false;
    },
    /** 冻结-导出按钮操作 */
    async handleExportFrreeze() {
      this.frreezeExportLoading = true;
      const params = Object.assign({}, this.frreezeQueryParams);
      params.pageSize = undefined;
      params.pageNum = undefined;
      await this.download('payment/frreezeAmountLog/export', params, `冻结记录`);
      this.frreezeExportLoading = false;
    }
  }
};
</script>

<style scoped>
.input-width{
  width: 200px;
}
::v-deep .el-dialog .el-dialog__body{
  padding-top: 10px;
}
</style>
