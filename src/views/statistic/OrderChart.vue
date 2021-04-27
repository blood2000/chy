<template>
  <!-- 订单统计 -->
  <div class="container" />
</template>

<script>
import echarts from 'echarts';
import { setfontSize } from '@/utils/fontSize';

export default {
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOption();
    },
    setOption() {
      this.chart.setOption({
        legend: {
          show: true,
          right: 0,
          top: '10%',
          icon: 'circle',
          itemWidth: setfontSize(8),
          itemHeight: setfontSize(8),
          textStyle: {
            fontSize: setfontSize(12),
            color: '#D5EAFF'
          },
          data: [{
            name: '货单订单数'
          }, {
            name: '运单订单数'
          }]
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '10%',
          top: '26%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // x轴字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: '#CDEDFF',
              fontSize: setfontSize(12)
            }
          },
          // x轴颜色
          axisLine: {
            lineStyle: {
              color: '#3F5C84'
            }
          },
          data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周']
        },
        yAxis: {
          name: '订单数(万)',
          nameTextStyle: {
            color: '#CDEDFF',
            fontSize: setfontSize(12),
            paddingLeft: '2%'
          },
          type: 'value',
          minInterval: 1, // 只显示整数
          axisLine: {
            lineStyle: {
              color: '#3F5C84'
            }
          },
          // y轴字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: '#CDEDFF',
              fontSize: setfontSize(12)
            }
          },
          // 网格样式
          splitLine: {
            show: false
          },
          axisTick: {
            show: false// 隐藏y坐标轴刻度
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#3F5C84'
            }
          }
        },
        series: [{
          name: '货单订单数',
          data: [2, 4, 5, 8, 6, 2, 6, 2, 6, 2],
          type: 'line',
          symbol: 'circle',
          symbolSize: setfontSize(8), // 拐点大小
          color: 'rgba(38, 123, 183, 1)', // 拐点颜色
          // 折线样式
          itemStyle: {
            normal: {
              lineStyle: {
                width: setfontSize(2),
                color: 'rgba(38, 123, 183, 1)'
              }
            }
          }
        }, {
          name: '运单订单数',
          data: [5, 3, 4, 8, 5, 6, 5, 6],
          type: 'line',
          symbol: 'circle',
          symbolSize: setfontSize(8), // 拐点大小
          color: 'rgba(255, 158, 44, 1)', // 拐点颜色
          // 折线样式
          itemStyle: {
            normal: {
              lineStyle: {
                width: setfontSize(2),
                color: 'rgba(255, 158, 44, 1)'
              }
            }
          }
        }]
      });
    },
    refreshChart() {
      this.chart.resize();
      this.setOption();
    }
  }
};
</script>

<style lang="scss" scoped>
.container{
  height: 32%;
  position: relative;
  &::after{
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, rgba(76, 203, 219, 0.5), rgba(76, 203, 219, 0));
  }
}
</style>
