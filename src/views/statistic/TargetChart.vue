<template>
  <!-- 目标达成情况 -->
  <div class="s-container" />
</template>

<script>
import * as echarts from 'echarts';
import { setfontSize } from '@/utils/fontSize';
import { getTarget } from '@/api/statistic/statistic.js';

export default {
  props: {
    branchCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      targetList: []
    };
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    getData() {
      getTarget(this.branchCode).then((response) => {
        const data = response.data;
        if (data) {
          this.targetList = data.targetList || [];
        }
        this.$nextTick(() => {
          this.initChart();
        });
      });
    },
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
      const timeData = [];
      const desireData = [];
      const transactionData = [];
      this.targetList.forEach(el => {
        timeData.push(el.desireMonth + '月');
        desireData.push(el.desireAmount); // 目标业绩
        transactionData.push(el.transactionAmount); // 完成业绩
      });
      this.chart.setOption({
        legend: {
          show: true,
          right: 0,
          icon: 'rect',
          textStyle: {
            color: '#D5EAFF',
            fontFamily: 'PingFang Medium'
          },
          data: [{
            name: '完成业绩'
          }, {
            name: '目标业绩'
          }]
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '2%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // x轴字体样式
          axisLabel: {
            show: true,
            textStyle: {
              color: '#CDEDFF',
              fontFamily: 'PingFang Medium'
            }
            // rotate: '30' // 字体倾斜角度
          },
          // x轴颜色
          axisLine: {
            lineStyle: {
              color: '#3F5C84'
            }
          },
          data: timeData
        },
        yAxis: {
          name: '业绩(万)',
          nameTextStyle: {
            color: '#CDEDFF',
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
              color: '#CDEDFF',
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
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(70, 70, 70, 0.5)',
          textStyle: {
            color: '#ffffff',
            fontFamily: 'PingFang Regular'
          }
          // formatter: `{b0}月：<br />{a0}: {c0}<br />{a1}: {c1}`
        },
        series: [{
          name: '完成业绩',
          type: 'bar',
          itemStyle: {
            normal: {
              // 柱体颜色渐变
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 156, 255, 1)'
              }, {
                offset: 0.7,
                color: 'rgba(51, 54, 187, 1)'
              }, {
                offset: 0.8,
                color: 'rgba(51, 54, 187, 0.7)'
              }, {
                offset: 1,
                color: 'rgba(51, 54, 187, 0)'
              }])
            }
          },
          data: transactionData
        }, {
          name: '目标业绩',
          type: 'bar',
          itemStyle: {
            normal: {
              // 柱体颜色渐变
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 244, 255, 1)'
              }, {
                offset: 0.7,
                color: 'rgba(23, 95, 203, 1)'
              }, {
                offset: 0.8,
                color: 'rgba(23, 95, 203, 0.7)'
              }, {
                offset: 1,
                color: 'rgba(23, 95, 203, 0)'
              }])
            }
          },
          data: desireData
        }]
      });
    },
    setFontOption() {
      this.chart.setOption({
        legend: {
          top: setfontSize(2),
          itemWidth: setfontSize(8),
          itemHeight: setfontSize(8),
          textStyle: {
            fontSize: setfontSize(12)
          },
          itemGap: setfontSize(36)
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
          barWidth: setfontSize(8)
        }, {
          barWidth: setfontSize(8)
        }]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: calc(100% - 2.4rem);
}
</style>
