<template>
  <div class="total_bg" :class="isFixed? 'fixedBar': null">
    <el-row
      :gutter="10"
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
  </div>
</template>

<script>
export default {
  props: {
    totalList: {
      type: Array,
      default: () => []
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFixed: false
    };
  },

  created() {
    this.fixed && (this.throttle = this.ThrottleFun(this.handleScroll, 200));
  },

  mounted() {
    this.fixed && window.addEventListener('scroll', (e) => { this.throttle(e); }, true); // 监听滚动事件
  },

  methods: {

    handleScroll(e) {
      if (e.target.scrollTop > 350) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    // 节流
    ThrottleFun(callback, time) {
      let canFlag = true;
      return function(...argument) {
        if (!canFlag) return;
        canFlag = false;
        setTimeout(function() {
          canFlag = true;
          callback(...argument);
        }, time);
      };
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
  .fixedBar{
    width: calc(100% - 153px);
    position: fixed;
    z-index: 999;
    top: 116px;
    left: 107px;
  }

</style>
