<template>
  <!-- 查询提现申请子单 -->
  <el-dialog title="详情" class="i-detail" :visible="visible" width="1300px" append-to-body :close-on-click-modal="false" @close="cancel">
    <RefactorTable
      ref="multipleTable"
      :loading="loading"
      :data="withdrawalList"
      :table-columns-config="tableColumnsConfig"
    >
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
        <i v-if="row.status === 3 || row.status === 6" class="el-icon-error g-color-error mr5" />
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
    </RefactorTable>

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
import { withDrawalListApi, getWithDrawalList } from '@/api/capital/withdrawal';
export default {
  props: {
    open: Boolean,
    code: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      withdrawalList: [],
      // 转账渠道字典
      payStatusOption: [
        { dictLabel: '线下', dictValue: 0 },
        { dictLabel: '线上', dictValue: 1 }
      ],
      // 转帐结果字典
      statusOptions: [
        { dictLabel: '提现申请', dictValue: 0 },
        { dictLabel: '提现成功', dictValue: 1 },
        { dictLabel: '转账成功', dictValue: 2 },
        { dictLabel: '转账失败', dictValue: 3 },
        { dictLabel: '处理中', dictValue: 4 },
        { dictLabel: '驳回', dictValue: 5 },
        { dictLabel: '部分失败', dictValue: 6 }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        masterCode: undefined
      },
      tableColumnsConfig: []
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
        this.reset();
        this.queryParams.masterCode = this.code;
        this.getList();
      }
    }
  },
  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, withDrawalListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 140,
      fixed: 'left'
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      getWithDrawalList(this.queryParams).then(response => {
        this.withdrawalList = response.data.rows;
        this.total = response.data.total;
        this.loading = false;
        this.searched = true;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 重置
    reset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        masterCode: undefined
      };
    }
  }
};
</script>
