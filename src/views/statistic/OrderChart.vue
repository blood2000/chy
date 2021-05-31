<template>
  <!-- 订单统计 -->
  <div class="s-container-chart" />
</template>

<script>
import * as echarts from 'echarts';
import { setfontSize } from '@/utils/fontSize';

export default {
  props: {
    timeData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    orderData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 判断货单or运单
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null
    };
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
      this.setFontOption();
    },
    refreshChart() {
      if (!this.chart) return;
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      // 构造数据
      let typeName = '';
      let pointColor = '';
      let lineColot = '';
      if (this.type === 'shipment') {
        typeName = '货单';
        pointColor = '#18B8C5';
        lineColot = '#267BB7';
      } else if (this.type === 'wayBill') {
        typeName = '运单';
        pointColor = '#F6BE61';
        lineColot = '#E68D27';
      }
      this.chart.setOption({
        legend: {
          show: true,
          right: 0,
          top: '5%',
          icon: 'circle',
          textStyle: {
            color: '#D5EAFF',
            fontFamily: 'PingFang Medium'
          },
          data: [{
            name: typeName + '订单数'
          }]
        },
        grid: {
          left: '0%',
          right: '3%',
          bottom: '0%',
          top: '22%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // x轴字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: '#D5EAFF',
              fontFamily: 'PingFang Regular'
            }
          },
          // x轴颜色
          axisLine: {
            lineStyle: {
              color: '#3F5C84'
            }
          },
          data: this.timeData
        },
        yAxis: {
          name: '订单数',
          nameTextStyle: {
            color: '#D5EAFF',
            paddingLeft: '2%',
            fontFamily: 'PingFang Medium'
          },
          type: 'value',
          minInterval: 1, // 只显示整数
          axisLine: {
            show: true,
            lineStyle: {
              color: '#3F5C84'
            }
          },
          // y轴字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: '#D5EAFF',
              fontFamily: 'PingFang Medium'
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
          },
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(70, 70, 70, 0.5)',
          textStyle: {
            color: '#ffffff',
            fontFamily: 'PingFang Regular'
          }
        },
        series: [{
          name: typeName + '订单数',
          data: this.orderData,
          type: 'line',
          symbol: 'circle',
          color: pointColor, // 拐点颜色
          // 折线样式
          itemStyle: {
            normal: {
              lineStyle: {
                color: lineColot
              }
            }
          }
        }]
      });
    },
    setFontOption() {
      this.chart.setOption({
        legend: {
          itemWidth: setfontSize(8),
          itemHeight: setfontSize(8),
          textStyle: {
            fontSize: setfontSize(12)
          }
        },
        tooltip: {
          padding: setfontSize(10),
          textStyle: {
            fontSize: setfontSize(14)
          }
        },
        xAxis: {
          axisLabel: {
            textStyle: {
              fontSize: setfontSize(12)
            }
          }
        },
        yAxis: {
          nameTextStyle: {
            fontSize: setfontSize(12)
          },
          axisLabel: {
            textStyle: {
              fontSize: setfontSize(12)
            }
          }
        },
        series: [{
          symbolSize: setfontSize(8),
          itemStyle: {
            normal: {
              lineStyle: {
                width: setfontSize(2)
              }
            }
          }
        }]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container-chart{
  height: 100%;
  // position: relative;
  // &::after{
  //   content: '';
  //   position: absolute;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  //   height: 0.05rem;
  //   background: linear-gradient(to right, rgba(76, 203, 219, 0.5), rgba(76, 203, 219, 0));
  // }
}
</style>
