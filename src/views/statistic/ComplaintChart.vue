<template>
  <!-- 投诉统计 -->
  <div class="s-container ly-flex-pack-justify">
    <!-- <div class="s-container__info">
      <div class="s-container__info__box">
        <div class="content">
          <p class="label">总投诉量</p>
          <p class="text"><count-to :end-val="complainVo.complaintCount" /></p>
        </div>
      </div>
      <div class="s-container__info__box ly-flex-pack-justify">
        <div class="content">
          <p class="label child">已解决投诉</p>
          <p class="text"><count-to :end-val="complainVo.complaintSolve" /></p>
        </div>
        <div class="content">
          <p class="label child">异常单</p>
          <p class="text"><count-to :end-val="complainVo.complaintAbnormal" /></p>
        </div>
      </div>
    </div>
    <div ref="pie" class="s-container__pie" /> -->

    <!-- new -->
    <div class="s-container__box">
      <div class="title title_1">评价</div>
      <div class="count">
        <count-to :end-val="complainVo.commentCount" />
      </div>
    </div>
    <div class="s-container__box">
      <div class="title title_2">投诉</div>
      <div class="count">
        <count-to :end-val="complainVo.complaintCount" />
      </div>
    </div>
    <div class="s-container__box">
      <div class="title title_3">异常单</div>
      <div class="count">
        <count-to :end-val="complainVo.complaintAbnormalCount" />
      </div>
    </div>
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
  props: {
    complainVo: {
      type: Object,
      default: () => {
        return {};
      }
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
          icon: 'roundRect',
          orient: 'vertical',
          top: '10%',
          textStyle: {
            color: '#D5EAFF',
            fontFamily: 'PingFang Regular'
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
            data: [
              { value: this.complainVo.complaintCount, name: '总投诉量' },
              { value: this.complainVo.complaintSolve, name: '已解决投诉' },
              { value: this.complainVo.complaintAbnormal, name: '异常单' }
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
  height: 12%;
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
          font-family: PingFang Regular;
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
          font-family: 'PingFang Medium';
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
  // 新样式
  margin-right: 1.4rem;
  &__box{
    >.title{
      font-size: 0.6rem;
      font-family: PingFang Regular;
      font-weight: 300;
      color: #D5EAFF;
      margin: 0.6rem 0 0.3rem;
      padding-left: 0.8rem;
      position: relative;
      &::before{
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -0.175rem;
        width: 0.7rem;
        height: 0.35rem;
      }
      &.title_1{
        &::before{
          background: url('~@/assets/images/statistic/complaint_1.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      &.title_2{
        &::before{
          background: url('~@/assets/images/statistic/complaint_2.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      &.title_3{
        &::before{
          background: url('~@/assets/images/statistic/complaint_3.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    >.count{
      font-size: 1.1rem;
      font-family: 'PingFang Medium';
      font-weight: 500;
      color: #FFFFFF;
    }
  }
}
</style>
