<template>
  <div class="chart-box">
    <OrderChart ref="chartRef" type="transaction" :time-data="timeData" :order-data="transactionData" />
  </div>
</template>

<script>
import OrderChart from './OrderChart';
export default {
  components: {
    OrderChart
  },
  props: {
    weekVoList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      timeData: [],
      transactionData: []
    };
  },
  methods: {
    // chart
    initChart() {
      this.timeData = [];
      this.transactionData = [];
      this.weekVoList.forEach(el => {
        this.timeData.push(el.dataTime);
        const num = ((el.transactionAmount / 100) / 100).toFixed(2);
        this.transactionData.push(num);
      });
      setTimeout(() => {
        this.$refs.chartRef.initChart();
      }, 0);
    },
    refreshChart() {
      this.$refs.chartRef.refreshChart();
    },
    keepTwoDecimalFull(num) {
      let result = num / 10000;
      result = Math.floor(result * 100) / 100;
      var s_x = result.toString(); // 将数字转换为字符串
      var pos_decimal = s_x.indexOf('.'); // 小数点的索引值
      // 当整数时，pos_decimal=-1 自动补0
      if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
      }
      // 当数字的长度< 小数点索引+2时，补0
      while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
      }
      return s_x;
    }
  }
};
</script>

<style lang="scss" scoped>
.chart-box{
  width: 100%;
  height: 100%;
  padding-left: 1rem;
}
</style>
