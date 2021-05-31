<template>
  <!-- 运单明细对话框 -->
  <el-dialog :title="title" :visible="visible" width="1200px" append-to-body :close-on-click-modal="false" @close="cancel">
    <el-table v-loading="loading" :data="waybilllist" max-height="650" border stripe>
      <el-table-column type="index" label="序号" align="center" width="50" />
      <el-table-column width="170" label="运输单号" align="center" prop="waybillNo" />
      <el-table-column width="120" label="货物大类" align="center" prop="goodsName" />
      <el-table-column width="180" label="装货地址" align="center" show-overflow-tooltip prop="loadFormattedAddress" />
      <el-table-column width="180" label="卸货地址" align="center" show-overflow-tooltip prop="unloadFormattedAddress" />
      <el-table-column width="100" label="装货数量" align="center" prop="loadWeight">
        <template slot-scope="scope">
          <span v-if="scope.row.stowageStatus === '1'">{{ scope.row.loadWeight || '0.00' }} 方</span>
          <span v-if="scope.row.stowageStatus === '2'">{{ scope.row.loadWeight || '0.00' }} 车</span>
          <span v-if="scope.row.stowageStatus === '0' || !scope.row.stowageStatus">{{ scope.row.loadWeight || '0.00' }} 吨</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="卸货数量" align="center" prop="unloadWeight">
        <template slot-scope="scope">
          <span v-if="scope.row.stowageStatus === '1'">{{ scope.row.unloadWeight || '0.00' }} 方</span>
          <span v-if="scope.row.stowageStatus === '2'">{{ scope.row.unloadWeight || '0.00' }} 车</span>
          <span v-if="scope.row.stowageStatus === '0' || !scope.row.stowageStatus">{{ scope.row.unloadWeight || '0.00' }} 吨</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="货物损耗（kg）" align="center" prop="wastage" />
      <el-table-column width="100" label="实收运费" align="center" prop="deliveryFeePractical" />
      <el-table-column width="100" label="纳税金额" align="center" prop="taxPayment" />
      <el-table-column width="100" label="服务费" align="center" prop="serviceFee" />
      <el-table-column width="100" label="服务费税" align="center" prop="serviceTaxFee" />
    </el-table>
  </el-dialog>
</template>

<script>
import { getInvoiceWaybill } from '@/api/finance/list';

export default {
  name: 'WaybillDialog',
  components: {
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    currentid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      // total: 0,
      // 运单列表
      waybilllist: []
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
  created() {
  },
  methods: {
    /** 查询发票列表 */
    getList() {
      this.loading = true;
      getInvoiceWaybill(this.currentid).then(response => {
        console.log(response);
        this.waybilllist = response.data;
        // this.total = response.data.length;
        this.loading = false;
      });
    },
    /** 取消按钮 */
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

<style>
.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-input-number ::v-deep.el-input__inner {
  text-align: left;
}
</style>
