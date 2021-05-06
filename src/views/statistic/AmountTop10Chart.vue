<template>
  <!-- TOP10省份交易额排名 -->
  <div class="s-container" />
</template>

<script>
import * as echarts from 'echarts';
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
      this.setFontOption();
    },
    refreshChart() {
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      this.chart.setOption({
        title: {
          show: true,
          text: 'TOP 10省份交易额排名',
          textStyle: {
            color: '#FFFFFF',
            fontWeight: 'normal',
            fontFamily: 'PingFang Regular'
          }
        },
        legend: {
          show: true,
          right: 0,
          icon: 'rect',
          textStyle: {
            color: '#D5EAFF',
            fontFamily: 'PingFang Regular'
          },
          data: [{
            name: '交易总额（省）'
          }, {
            name: '开票总额（省）'
          }, {
            name: '运费总额（省）'
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
              fontFamily: 'PingFang Regular'
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
            paddingLeft: '2%',
            fontFamily: 'PingFang Regular'
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
              fontFamily: 'PingFang Regular'
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
        },
        series: [{
          name: '交易总额（省）',
          type: 'bar',
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
          name: '开票总额（省）',
          type: 'bar',
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
          name: '运费总额（省）',
          type: 'bar',
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
    setFontOption() {
      this.chart.setOption({
        title: {
          textStyle: {
            fontSize: setfontSize(16)
          },
          left: setfontSize(15)
        },
        legend: {
          top: setfontSize(6),
          itemWidth: setfontSize(10),
          itemHeight: setfontSize(8),
          textStyle: {
            fontSize: setfontSize(12)
          }
        },
        tooltip: {
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
  height: 72.5%;
}
</style>
