<template>
  <el-dialog :title="title" :visible="visible" width="1300px" append-to-body :modal-append-to-body="false" class="waybill-seperate-list-dialog" @close="cancel">
    <el-table v-loading="loading" highlight-current-row border :data="etcList">
      <el-table-column label="序号" align="center" fixed="left" type="index" width="50" />
      <el-table-column label="发票图片" align="center" fixed="left" prop="invoiceHtmlUrl">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.invoiceHtmlUrl"
            size="mini"
            type="text"
            @click="handleInvoiceHtmlUrl(scope.row.invoiceHtmlUrl)"
          >
            查看
          </el-button>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="发票地址" fixed="left" align="center" prop="invoiceUrl">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.invoiceUrl"
            size="mini"
            type="text"
            @click="handleInvoiceUrl(scope.row.invoiceUrl)"
          >
            查看
          </el-button>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="运输单号" align="center" prop="waybillNum" width="150" />
      <el-table-column label="索票人" align="center" prop="askUserName" width="120" />
      <el-table-column label="索票时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购方名称" align="center" prop="buyerName" width="120" />
      <el-table-column label="购方税号" align="center" prop="buyerTaxpayerCode" width="120" />
      <el-table-column label="入口收费站" show-overflow-tooltip align="center" prop="enStation" width="150" />
      <el-table-column label="入站日期" align="center" prop="enDate" width="120" />
      <el-table-column label="出口收费站" show-overflow-tooltip align="center" prop="exStation" width="150" />
      <el-table-column label="出站日期" align="center" prop="exDate" width="120" />
      <el-table-column label="出站时间" align="center" prop="exTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.exTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易金额" align="center" prop="fee" width="120" />
      <el-table-column label="发票代码" align="center" prop="invoiceCode" width="120" />

      <el-table-column label="开票时间" align="center" prop="invoiceMakeTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.invoiceMakeTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票号码" align="center" prop="invoiceNum" width="120" />
      <el-table-column label="发票种类" align="center" prop="invoiceType" width="120" />

      <!-- <el-table-column label="牛卡福信息" show-overflow-tooltip align="center" prop="message" width="120" /> -->
      <el-table-column label="车牌号" align="center" prop="plateNum" width="120" />
      <el-table-column label="销方名称" show-overflow-tooltip align="center" prop="sellerName" width="120" />
      <el-table-column label="销方税号" align="center" prop="sellerTaxpayerCode" width="130" />
      <el-table-column label="发票状态" align="center" prop="status" width="120" :formatter="statusFormat" />
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="价税合计" align="center" prop="totalAmount" width="120" />
      <el-table-column label="税额" align="center" prop="totalTaxAmount" />
      <el-table-column label="车辆类型" align="center" prop="vehicleType" />
      <el-table-column label="运单开始时间" align="center" prop="waybillStartTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.waybillStartTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运单结束时间" align="center" prop="waybillEndTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.waybillEndTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" fixed="left" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

  </el-dialog>
</template>

<script>
import { etcInvoice } from '@/api/finance/etc';

export default {
  components: {
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    currentId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 运单状态字典
      statusOptions: [
        { 'dictLabel': '未索票', 'dictValue': 0 },
        { 'dictLabel': '索票中', 'dictValue': 1 },
        { 'dictLabel': '索票成功', 'dictValue': 2 },
        { 'dictLabel': '索票失败', 'dictValue': 3 },
        { 'dictLabel': '无发票数据', 'dictValue': 4 }
      ],
      loading: false,
      etcList: []
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
    handleInvoiceHtmlUrl(e) {
      window.open(e);
    },
    handleInvoiceUrl(e) {
      window.open(e);
    },
    // 运单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 获取子单列表
    getList() {
      this.loading = true;
      etcInvoice(this.currentId).then(response => {
        this.etcList = response.data;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    }
  }
};
</script>

<style lang="scss">
.waybill-seperate-list-dialog{
  .el-dialog__body{
    min-height: 70vh;
  }
}
</style>
