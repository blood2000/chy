<template>
  <!-- TOP10省份交易额排名 -->
  <div class="s-container" />
</template>

<script>
import * as echarts from 'echarts';
import { setfontSize } from '@/utils/fontSize';

export default {
  props: {
    provinceRanking: {
      type: Array,
      default: () => {
        return [];
      }
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    timeKey: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      chart: null,
      timer: null,
      dataIndex: 0
    };
  },
  beforeDestroy() {
    this.clearTimer();
    if (!this.chart) return;
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOption();
      this.setFontOption();
      this.rollTooltip();
    },
    refreshChart() {
      if (!this.chart) return;
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      // 构造数据
      const provinceData = [];
      const transactionData = [];
      const votesData = [];
      const waybillData = [];
      this.provinceRanking.forEach(el => {
        provinceData.push(el.provinceName);
        transactionData.push((el.transactionAmount / 10000).toFixed(2)); // 交易
        votesData.push((el.votesAmount / 10000).toFixed(2)); // 开票
        waybillData.push((el.waybillAmount / 10000).toFixed(2)); // 运费
      });
      this.chart.setOption({
        title: {
          show: this.showTitle,
          text: 'TOP 5区域交易额排名',
          textStyle: {
            color: '#FFFFFF',
            fontWeight: 'normal',
            fontFamily: 'PingFang Medium'
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
          left: '1%',
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
          data: provinceData
        },
        yAxis: {
          name: '交易额(万)',
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
          backgroundColor: 'rgba(70, 70, 70, 0.3)',
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
          data: transactionData
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
          data: votesData
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
          data: waybillData
        }]
      });
      // 绑定事件
      // this.chart.on('mouseover', 'series', function(params) {
      //   console.log('mouseover:', params);
      // });
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
          barWidth: setfontSize(10)
        }, {
          barWidth: setfontSize(10)
        }, {
          barWidth: setfontSize(10)
        }]
      });
    },
    // 定时选中
    rollTooltip() {
      this.showToolTip();
      this.setTimer();
    },
    setTimer() {
      this.timer = setInterval(() => {
        this.showToolTip();
      }, 15 * 1000);
    },
    clearTimer() {
      if (this.timer) clearInterval(this.timer);
    },
    showToolTip() {
      this.chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: this.dataIndex,
        position: [-1000, 100]
      });
      if (this.dataIndex >= this.provinceRanking.length - 1) {
        this.dataIndex = 0;
      } else {
        this.dataIndex++;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  overflow: hidden;
  height: 100%;
}
</style>
