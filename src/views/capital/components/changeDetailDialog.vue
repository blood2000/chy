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
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" border highlight-current-row :data="infoList">
      <el-table-column label="序号" align="center" type="index" min-width="5%" />
      <el-table-column label="客户名称" align="center" prop="userName" />
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
      <el-table-column label="变动时间" align="center" prop="createtime" min-width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createtime) }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" min-width="180" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </el-dialog>
</template>

<script>
// 变动明细用的是充值记录的接口
import { rechargelist } from '@/api/capital/recharge';

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
      isfullscreen: false,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 消费项目字典
      consumeOptions: [
        { dictLabel: '充值', dictValue: 0 },
        { dictLabel: '保证金', dictValue: 1 },
        { dictLabel: '运费', dictValue: 2 },
        { dictLabel: '保费', dictValue: 3 },
        { dictLabel: '罚款', dictValue: 4 },
        { dictLabel: '提现', dictValue: 5 },
        { dictLabel: '信息费', dictValue: 6 }
      ],
      // 交易类型字典
      typeOptions: [
        { dictLabel: '收入', dictValue: 0 },
        { dictLabel: '支出', dictValue: 1 }
      ],
      // 参数表格数据
      infoList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        paidItem: undefined,
        paidFeeType: undefined,
        updateTimeBegin: undefined,
        updateTimeEnd: undefined
      }
    };
  },
  computed: {
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
      }
    }
  },
  methods: {
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
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    }
  }
};
</script>

<style scoped>
.input-width{
  width: 200px;
}
</style>
