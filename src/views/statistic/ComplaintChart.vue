<template>
  <!-- 投诉统计 -->
  <div class="s-container ly-flex-pack-justify">
    <div class="s-container__info">
      <div class="s-container__info__box">
        <div class="content">
          <p class="label">总投诉量</p>
          <p class="text"><count-to :end-val="100" /></p>
        </div>
      </div>
      <div class="s-container__info__box ly-flex-pack-justify">
        <div class="content">
          <p class="label child">已解决投诉</p>
          <p class="text"><count-to :end-val="60" /></p>
        </div>
        <div class="content">
          <p class="label child">异常单</p>
          <p class="text"><count-to :end-val="40" /></p>
        </div>
      </div>
    </div>
    <div ref="pie" class="s-container__pie" />
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { setfontSize } from '@/utils/fontSize';
import CountTo from '@/components/CountTo';

export default {
  components: {
    CountTo
  },
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
      this.chart = echarts.init(this.$refs.pie, 'macarons');
      this.setOption();
      this.setFontOption();
    },
    refreshChart() {
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      this.chart.setOption({
        legend: {
          icon: 'roundRect',
          orient: 'vertical',
          top: '10%',
          textStyle: {
            color: '#D5EAFF'
          },
          data: [{
            name: '总投诉量'
          }, {
            name: '已解决投诉'
          }, {
            name: '异常单'
          }]
        },
        tooltip: {
          trigger: 'item',
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(70, 70, 70, 0.5)',
          textStyle: {
            color: '#ffffff'
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['48%', '70%'],
            center: ['35%', '50%'],
            data: [
              { value: 100, name: '总投诉量' },
              { value: 60, name: '已解决投诉' },
              { value: 40, name: '异常单' }
            ],
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
                      color: 'rgba(1, 138, 255, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(0, 254, 219, 1)'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(112, 97, 254, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(230, 136, 242, 1)'
                    }]),
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(255, 122, 203, 1)'
                    }, {
                      offset: 1,
                      color: 'rgba(255, 69, 125, 1)'
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
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: 23%;
  &__info{
    width: 45%;
    height: 100%;
    margin-left: 0.8rem;
    &__box{
      >.content{
        width: 50%;
        margin-top: 1rem;
        .label{
          font-size: 0.6rem;
          font-family: PingFang SC;
          font-weight: bold;
          color: #FFFFFF;
          margin-bottom: 0.1rem;
          &.child{
            font-weight: 300;
            color: #D5EAFF;
          }
        }
        .text{
          font-size: 1.1rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
        }
      }
    }
  }
  &__pie{
    width: 55%;
    height: 100%;
  }
}
</style>
