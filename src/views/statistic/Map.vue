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
import echarts from 'echarts';
import maps from 'echarts/map/json/china.json';
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
      ]
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
      this.chart = echarts.init(this.$refs.map);
      echarts.registerMap('china', maps);
      console.log(maps);
      this.setOption();
      this.setFontOption();
    },
    refreshChart() {
      this.chart.resize();
      this.setFontOption();
    },
    setOption() {
      this.chart.setOption({
        geo: {
          map: 'china',
          zoom: 1.2,
          z: 2,
          aspectScale: 1,
          layoutCenter: ['47%', '50%'],
          layoutSize: '110%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(1, 227, 255, 1)',
              areaColor: 'rgba(16, 48, 131, 1)'
            },
            emphasis: {
              areaColor: 'rgba(0, 244, 255, 1)' // 鼠标移入高亮显颜色
            }
          },
          // 在地图中对特定的区域配置样式。
          regions: [{
            name: '广东',
            itemStyle: {
              areaColor: 'rgba(10, 187, 221, 1)'
            }
          }, {
            name: '湖北',
            itemStyle: {
              areaColor: 'rgba(3, 252, 255, 1)'
            }
          }, {
            name: '新疆',
            itemStyle: {
              areaColor: 'rgba(1, 227, 255, 1)'
            }
          }, {
            name: '四川',
            itemStyle: {
              areaColor: 'rgba(10, 187, 221, 1)'
            }
          }, {
            name: '辽宁',
            itemStyle: {
              areaColor: 'rgba(1, 227, 255, 1)'
            }
          }, {
            name: '江西',
            itemStyle: {
              areaColor: 'rgba(1, 227, 255, 1)'
            }
          }, {
            name: '山西',
            itemStyle: {
              areaColor: 'rgba(31, 137, 188, 1)'
            }
          }, {
            name: '山东',
            itemStyle: {
              areaColor: 'rgba(1, 227, 255, 1)'
            }
          }]
        },
        series: [{
          type: 'map',
          z: 1,
          map: 'china',
          zoom: 1.2,
          aspectScale: 1,
          layoutCenter: ['47%', '50%'],
          layoutSize: '110%',
          itemStyle: {
            normal: {
              borderColor: 'rgba(1, 227, 255, 1)',
              shadowColor: 'rgba(10, 187, 221, 1)',
              areaColor: 'rgba(16, 48, 131, 1)'
            }
          }
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
      font-family: PingFang SC;
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
        top: 0.6rem;
        right: 0.6rem;
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
          font-family: PingFang SC;
          font-weight: 500;
          color: #DDF5FF;
        }
      }
    }
  }
}
</style>
