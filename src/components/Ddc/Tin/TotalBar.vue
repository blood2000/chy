<template>
  <el-row
    :gutter="10"
    class="total_bg"
  >
    <el-col :span="1">
      <img src="~@/assets/images/icon/total.png" alt="">
    </el-col>
    <el-col v-for="(item, index) in totalList" :key="item.label + index" :span="index===0? 3: 5">
      <span style="line-height: 31px">{{ item.label }}：{{ item.value || 0 }}</span>
    </el-col>
    <!-- <el-col :span="3">
      <span style="line-height: 31px">运单数量：{{ statistical.waybillCount }}</span>
    </el-col>
    <el-col :span="3">
      <span style="line-height: 31px">运费金额：{{ statistical.waybillAmount }}</span>
    </el-col>
    <el-col :span="3">
      <span style="line-height: 31px">纳税金额：{{ statistical.taxPayment }}</span>
    </el-col>
    <el-col :span="3">
      <span style="line-height: 31px">服务费金额：{{ statistical.serviceFee }}</span>
    </el-col>
    <el-col :span="3">
      <span style="line-height: 31px">服务费税额：{{ statistical.serviceTaxFee }}</span>
    </el-col> -->
  </el-row>
</template>

<script>
export default {
  props: {
    totalList: {
      type: Array,
      default: () => []
    }
  }

};
</script>

<style lang="scss" scoped>
  .total_bg{
    background: #F8F9FA;
    border-radius: 4px;
    padding: 10px 20px;
    margin-bottom: 10px;
  }

</style>
