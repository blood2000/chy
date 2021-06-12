<template>
  <!-- 货运类型排行 -->
  <div class="s-container ly-flex-pack-justify">
    <ul class="s-container__list">
      <li v-for="(item, index) in pieData" :key="index" class="s-container__list__item ly-flex-pack-start ly-flex-pack-center">
        <p class="index">{{ index + 1 }}</p>
        <p class="text">{{ item.name }}</p>
      </li>
    </ul>
    <div ref="pie" class="s-container__pie" />
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { setfontSize } from '@/utils/fontSize';

export default {
  data() {
    return {
      chart: null,
      pieData: [
        { value: 200, name: '煤炭及制品' },
        { value: 100, name: '钢材' },
        { value: 80, name: '渣土' },
        { value: 60, name: '原料' },
        { value: 30, name: '汽车制品' }
      ]
    };
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.pie, 'macarons');
      this.setOption();
      this.setFontOption();
    },
    refreshChart() {
      if (!this.chart) return;
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      this.chart.setOption({
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'item',
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(70, 70, 70, 0.5)',
          textStyle: {
            color: '#ffffff',
            fontFamily: 'PingFang Regular'
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['48%', '70%'],
            center: ['35%', '50%'],
            data: this.pieData,
            // 标示线
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                // 设置饼图的颜色
                color: function(params) {
                  // 自定义颜色
                  var colorList = [
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#018AFF'
                    }, {
                      offset: 1,
                      color: '#5FE6FE'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#37FFF8'
                    }, {
                      offset: 1,
                      color: '#9DD9FF'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#7061FE'
                    }, {
                      offset: 1,
                      color: '#9D6EFF'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#FB86FF'
                    }, {
                      offset: 1,
                      color: '#CF5FFF'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#FF7ACB'
                    }, {
                      offset: 1,
                      color: '#FF457D'
                    }])
                  ];
                  return colorList[params.dataIndex];
                }
              }
            }
          }
        ]
      });
    },
    setFontOption() {
      this.chart.setOption({
        legend: {
          itemWidth: setfontSize(8),
          itemHeight: setfontSize(8),
          itemGap: setfontSize(15),
          right: setfontSize(10),
          textStyle: {
            fontSize: setfontSize(12)
          }
        },
        tooltip: {
          textStyle: {
            fontSize: setfontSize(14)
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
  &__list{
    width: 45%;
    height: 100%;
    &__item{
      .index{
        width: 0.9rem;
        height: 0.9rem;
        line-height: 0.9rem;
        font-size: 0.6rem;
        text-align: center;
        color: #fff;
      }
      .text{
        font-size: 0.7rem;
        font-family: 'PingFang Regular';
        font-weight: 500;
        color: #CDEDFF;
      }
    }
  }
  &__pie{
    width: 55%;
    height: 100%;
  }
}
</style>
