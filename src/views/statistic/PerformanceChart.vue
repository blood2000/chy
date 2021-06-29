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
        this.transactionData.push(el.orderCount);
      });
      setTimeout(() => {
        this.$refs.chartRef.initChart();
      }, 0);
    },
    refreshChart() {
      this.$refs.chartRef.refreshChart();
      console.log(11);
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
