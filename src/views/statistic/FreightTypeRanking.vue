<template>
  <!-- 货运类型排行 -->
  <div class="s-container ly-flex-pack-justify">
    <ul class="s-container__list ly-flex-v ly-flex-pack-justify">
      <li v-for="(item, index) in pieData" :key="index" class="s-container__list__item ly-flex-pack-start ly-flex-pack-center">
        <p class="index" :class="'index_' + (index + 1)">{{ index + 1 }}</p>
        <p class="text">{{ `${item.goodsBigTypeName}(${item.percentage}%)` }}</p>
      </li>
    </ul>
    <div ref="pie" class="s-container__pie" />
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { setfontSize } from '@/utils/fontSize';
import { getCargoTypeListV2 } from '@/api/statistic/statistic.js';

export default {
  props: {
    timeKey: {
      type: Number,
      default: 2
    },
    branchCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      pieData: []
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
    this.getData();
  },
  methods: {
    getData() {
      getCargoTypeListV2(this.branchCode, this.timeKey).then(response => {
        this.pieData = response.data || [];
        this.pieData.forEach(el => {
          el.value = el.waybillCount;
          el.name = el.goodsBigTypeName;
        });
        this.initChart();
      });
    },
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
            center: ['40%', '50%'],
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
    padding: 1rem 0;
    &__item{
      .index{
        width: 0.9rem;
        height: 0.9rem;
        line-height: 0.9rem;
        font-size: 0.6rem;
        text-align: center;
        color: #fff;
        border-radius: 50%;
        &.index_1{
          background: #019FF9;
        }
        &.index_2{
          background: #8267FC;
        }
        &.index_3{
          background: #FF6FBB;
        }
        &.index_4{
          background: #60DCEC;
        }
        &.index_5{
          background: #EE7BFF;
        }
      }
      .text{
        font-size: 0.7rem;
        font-family: 'PingFang Regular';
        font-weight: 500;
        color: #CDEDFF;
        padding-left: 0.6rem;
      }
    }
  }
  &__pie{
    width: 55%;
    height: 100%;
  }
}
</style>
