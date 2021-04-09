<template>
  <!-- 评价对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body @close="cancel">
    <el-row :gutter="10" class="mb8">
      <el-col :span="10">
        <span class="mr3">司机实收金额</span>
        <!-- v-model="adjustlist.deliveryCashFee" -->
        <el-input
          placeholder="请输入司机实收金额"
          clearable
          size="small"
          style="width: 180px"
          class="mr3"
          @keyup.enter.native="handleQuery"
        />
        <el-button type="primary">批量修改</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="adjustlist">
      <el-table-column label="运输单号" align="center" prop="waybillNo" />
      <el-table-column label="装车重量" align="center" prop="loadWeight" />
      <el-table-column label="卸车重量" align="center" prop="unloadWeight" />
      <el-table-column label="路耗（吨）" align="center" prop="loss" />
      <el-table-column label="路耗允许范围" align="center" prop="lossAllowScope" />
      <el-table-column label="司机姓名" align="center" prop="driverName" />
      <el-table-column label="司机电话" align="center" prop="driverPhone" />
      <el-table-column label="车牌号" align="center" prop="licenseNumber" />
      <el-table-column label="司机应收运费" align="center" prop="deliveryFeeDeserved" />
      <el-table-column label="司机实收运费" align="center" prop="deliveryFeePractical" />
      <el-table-column label="司机减项费用" align="center" prop="driverReductionFee" />
      <el-table-column label="司机增项费用" align="center" prop="driverAddFee" />
      <el-table-column label="货物单价" align="center" prop="goodsPrice" />
      <el-table-column label="运费单价" align="center" prop="freightPrice" />
      <el-table-column label="亏涨扣费" align="center" prop="deduction" />
      <el-table-column label="抹零金额" align="center" prop="m0Amount" />

      <el-table-column label="服务费" align="center" prop="serviceFee" fixed="right" />
      <el-table-column label="司机实收现金" align="center" prop="deliveryCashFee" fixed="right" />
      <el-table-column label="要扣的货主金额" align="center" prop="deductShipmentAmount" fixed="right" />
      <el-table-column label="核算规则" align="center" prop="freightList.enName" fixed="right" />
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即核算</el-button>
      <el-button @click="cancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { adjustDetail } from '@/api/settlement/adjust';
// import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'AdjustDialog',
  components: {
    // UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // disable: Boolean
  },
  data() {
    return {
      // tableColumnsConfig: [],
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 评价列表
      adjustlist: [{ waybillNo: 123 }],
      // 查询参数
      queryParams: {
        waybillCodeList: []
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
  created() {
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      console.log('点击');
    },
    /** 查询核算列表 */
    getList() {
      // this.loading = true;
      // adjustDetail(this.queryParams).then(response => {
      //   console.log(response);
      //   this.adjustlist = response.rows;
      //   this.total = response.total;
      //   this.loading = false;
      // });
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
    // 获取列表
    setForm(data) {
      console.log(data);
      this.queryParams.waybillCodeList = data;
      this.getList();
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
