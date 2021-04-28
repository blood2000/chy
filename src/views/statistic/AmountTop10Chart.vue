<template>
  <!-- TOP10省份交易额排名 -->
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
        title: {
          show: true,
          text: 'TOP 10省份交易额排名',
          textStyle: {
            color: '#FFFFFF',
            fontWeight: 'normal',
            fontSize: setfontSize(16)
          },
          left: setfontSize(15)
        },
        legend: {
          show: true,
          right: 0,
          top: setfontSize(6),
          icon: 'rect',
          itemWidth: setfontSize(10),
          itemHeight: setfontSize(8),
          textStyle: {
            fontSize: setfontSize(12),
            color: '#fff'
          },
          data: [{
            name: '交易总额（省）'
          }, {
            name: '票务总额（省）'
          }, {
            name: '票总额（省）'
          }]
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '6%',
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
              fontSize: setfontSize(12)
            }
            // rotate: '30' // 字体倾斜角度
          },
          // x轴颜色
          axisLine: {
            lineStyle: {
              color: '#3F5C84'
            }
          },
          data: ['内蒙古', '内蒙古', '内蒙古', '内蒙古', '内蒙古', '内蒙古', '内蒙古', '内蒙古', '内蒙古', '内蒙古']
        },
        yAxis: {
          name: '交易额(万）',
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
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        series: [{
          name: '交易总额（省）',
          type: 'bar',
          barWidth: setfontSize(8), // 柱体宽度
          itemStyle: {
            normal: {
              // 柱体颜色渐变
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 174, 255, 1)'
              }, {
                offset: 0.7,
                color: 'rgba(61, 79, 165, 1)'
              }, {
                offset: 0.8,
                color: 'rgba(61, 79, 165, 0.7)'
              }, {
                offset: 1,
                color: 'rgba(61, 79, 165, 0)'
              }])
            }
          },
          data: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
        }, {
          name: '票务总额（省）',
          type: 'bar',
          barWidth: setfontSize(8), // 柱体宽度
          itemStyle: {
            normal: {
              // 柱体颜色渐变
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(73, 234, 245, 1)'
              }, {
                offset: 0.7,
                color: 'rgba(0, 112, 199, 1)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 112, 199, 0.7)'
              }, {
                offset: 1,
                color: 'rgba(0, 112, 199, 0)'
              }])
            }
          },
          data: [3, 3, 3, 2, 2, 3, 3, 3, 2, 2]
        }, {
          name: '票总额（省）',
          type: 'bar',
          barWidth: setfontSize(8), // 柱体宽度
          itemStyle: {
            normal: {
              // 柱体颜色渐变
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(125, 132, 255, 1)'
              }, {
                offset: 0.7,
                color: 'rgba(79, 68, 179, 1)'
              }, {
                offset: 0.8,
                color: 'rgba(79, 68, 179, 0.7)'
              }, {
                offset: 1,
                color: 'rgba(79, 68, 179, 0)'
              }])
            }
          },
          data: [3, 3, 3, 2, 2, 3, 3, 3, 2, 2]
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
  height: 72.5%;
}
</style>
