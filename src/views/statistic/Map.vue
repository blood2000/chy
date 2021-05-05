<template>
  <div class="s-container">
    <div ref="map" class="map-box" />
    <!-- 图例 -->
    <div class="map-legend">
      <h5>运单量</h5>
      <ul class="ly-flex-v ly-flex-pack-justify">
        <li v-for="(item, index) in legendList" :key="index">
          <span class="color" :style="{background: item.color}" />
          <span class="text">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
// import 'echarts-gl';
import maps from '@/assets/json/china.json';
import { setfontSize } from '@/utils/fontSize';

export default {
  data() {
    return {
      chart: null,
      legendList: [
        { name: '大于10万单', color: 'rgba(3, 252, 255, 1)' },
        { name: '5-10万单', color: 'rgba(16, 216, 227, 1)' },
        { name: '1-5万单', color: 'rgba(10, 187, 221, 1)' },
        { name: '小于1万单', color: 'rgba(31, 137, 188, 1)' }
      ],
      regionData: [{
        name: '广东省',
        itemStyle: {
          areaColor: 'rgba(10, 187, 221, 1)'
        }
      }, {
        name: '湖北省',
        itemStyle: {
          areaColor: 'rgba(3, 252, 255, 1)'
        }
      }, {
        name: '福建省',
        itemStyle: {
          areaColor: 'rgba(3, 252, 255, 1)'
        }
      }, {
        name: '四川省',
        itemStyle: {
          areaColor: 'rgba(10, 187, 221, 1)'
        }
      }, {
        name: '辽宁省',
        itemStyle: {
          areaColor: 'rgba(1, 227, 255, 1)'
        }
      }, {
        name: '浙江省',
        itemStyle: {
          areaColor: 'rgba(1, 227, 255, 1)'
        }
      }, {
        name: '山西省',
        itemStyle: {
          areaColor: 'rgba(31, 137, 188, 1)'
        }
      }, {
        name: '山东省',
        itemStyle: {
          areaColor: 'rgba(1, 227, 255, 1)'
        }
      }],
      timer: null,
      nows: -1,
      warnData: [
        { name: '海门', value: [121.15, 31.89, 1000] },
        { name: '鄂尔多斯', value: [109.781327, 39.608266, 1000] },
        { name: '招远', value: [120.38, 37.35, 1000] },
        { name: '舟山', value: [122.207216, 29.985295, 1000] }
      ]
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.map, null, {
        renderer: 'svg'
      });
      echarts.registerMap('china', maps);
      this.setOption();
      this.setFontOption();
      this.initData();
    },
    refreshChart() {
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      this.chart.setOption({
        tooltip: {
          show: true,
          showContent: true, // 是否显示提示框浮层
          enterable: true, // 鼠标是否可进入提示框浮层中
          alwaysShowContent: true, // 是否永远显示提示框内容
          // showDelay: 300, // 浮层显示的延迟，单位为 ms
          // hideDelay: 300, // 浮层隐藏的延迟，单位为 ms
          renderMode: 'html',
          appendToBody: true,
          className: 's-echart-map-tooltip',
          transitionDuration: 0, // 默认0.4
          // position: [10, 10],
          triggerOn: 'none',
          trigger: 'item',
          borderColor: 'rgba(0, 0, 0, 0)',
          backgroundColor: 'rgba(70, 70, 70, 0)',
          textStyle: {
            color: '#FFFFFF'
          },
          formatter: function(params) {
            const { value } = params;
            if (value) {
              // return `${params.name}: ${value[2]}`;
              return `<section class="s-echart-map-tooltip-content">
                        <div class="text">${params.name}：${value[2]}</div>
                      </section>`;
            } else {
              return `${params.name}`;
            }
          }
        },
        geo: {
          map: 'china',
          zoom: 1.2,
          z: 2,
          aspectScale: 0.8,
          layoutCenter: ['48%', '48%'],
          layoutSize: '100%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(1, 227, 255, 1)',
              areaColor: 'rgba(16, 48, 131, 1)'
            },
            emphasis: {
              areaColor: 'rgba(0, 244, 255, 1)' // 鼠标移入高亮显颜色
            }
          },
          label: {
            emphasis: {
              show: true,
              color: '#D5EAFF'
            }
          },
          // 在地图中对特定的区域配置样式
          regions: this.regionData
        },
        series: [{
          type: 'map',
          z: 0,
          map: 'china',
          zoom: 1.2,
          aspectScale: 0.8,
          layoutCenter: ['48%', '48%'],
          layoutSize: '100%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(1, 227, 255, 1)',
              shadowColor: 'rgba(10, 187, 221, 1)',
              areaColor: 'rgba(16, 48, 131, 1)'
            }
          }
        },
        {
          name: '散点',
          type: 'scatter',
          geoIndex: 0,
          coordinateSystem: 'geo',
          symbol: 'circle',
          symbolSize: setfontSize(14),
          animation: true,
          animationDelay: function(idx) {
            // 越往后的数据延迟越大
            return idx * 1000;
          },
          label: {
            formatter() {
              return '散点';
            }
          },
          data: this.warnData
        }]
      });
    },
    setFontOption() {
      this.chart.setOption({
        geo: {
          itemStyle: {
            normal: {
              borderWidth: setfontSize(1)
            }
          }
        },
        series: [{
          itemStyle: {
            normal: {
              borderWidth: setfontSize(2.5),
              shadowBlur: setfontSize(30)
            }
          }
        }]
      });
    },
    // 测试数据
    initData() {
      // this.showToolTip();
      if (this.timer) clearInterval(this.timer);
      this.timer = window.setInterval(() => {
        this.showToolTip();
        setTimeout(() => {
          this.removeDom();
        }, 3000);
      }, 4000);
    },
    showToolTip() {
      const length = this.warnData.length;
      this.nows = (this.nows + 1) % length;
      this.chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 1,
        dataIndex: this.nows
      });
    },
    hideToolTip() {
      this.chart.dispatchAction({
        type: 'hideTip'
      });
    },
    removeDom() {
      const toolDom = document.getElementsByClassName('s-echart-map-tooltip-content')[0];
      toolDom.classList.add('hide');
    },
    resetDom() {
      const toolDom = document.getElementsByClassName('s-echart-map-tooltip-content')[0];
      if (toolDom.classList.contains('hide')) {
        toolDom.classList.remove('hide');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  // 7.2 = scrollDataHeight
  // 4.8 = TotalDataHeight
  height: calc(100% - 7.2rem - 4.8rem);
  position: relative;
  >.map-box{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.2);
  }
  >.map-legend{
    position: absolute;
    right: 2rem;
    bottom: 2rem;
    height: 6.8rem;
    background: rgba(4, 28, 84, 0.4);
    border: 1px solid #387C94;
    padding: 0 0.6rem;
    >h5{
      height: 1.5rem;
      line-height: 1.5rem;
      font-size: 0.6rem;
      font-family: 'PingFang Medium';
      font-weight: 500;
      color: #01E3FF;
      position: relative;
      &::before{
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background: linear-gradient(to right, rgba(76, 203, 219, 0.5), rgba(76, 203, 219, 0));
      }
      &::after{
        content: '';
        position: absolute;
        top: 0.55rem;
        right: 0.8rem;
        width: 1.2rem;
        height: 0.35rem;
        background: url('~@/assets/images/statistic/legend_after.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    >ul{
      height: calc(100% - 1.5rem);
      padding: 0.4rem 0;
      >li{
        .color{
          display: inline-block;
          width: 0.7rem;
          height: 0.4rem;
          margin-right: 0.3rem;
        }
        .text{
          font-size: 0.5rem;
          font-family: 'PingFang Medium';
          font-weight: 500;
          color: #DDF5FF;
        }
      }
    }
  }
}
</style>

<style lang="scss">
/* 全局样式，谨慎使用类名 */
.s-echart-map-tooltip{
  box-shadow: none !important;
  padding: 0 !important;
  >section{
    background: rgba(70, 70, 70, 0.5);
    border-radius: 2%;
    padding: 0.5rem 1rem;
    // 消失动画
    transition: all 0.5s;
    transform: translate(0, 0);
    opacity: 1;
    &.hide{
      transition: all 0.5s;
      transform: translate(8rem, -5rem);
      opacity: 0;
    }
    >.text{
      font-size: 0.7rem;
    }
  }
  >div{
    display: none;
  }
}
</style>
