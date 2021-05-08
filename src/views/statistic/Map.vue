<template>
  <div class="s-container s-map-container-relative">
    <div ref="map" class="map-box" />
    <!-- 图例 -->
    <div class="map-legend">
      <h5 @click="initData">运单量</h5>
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
      warnData: [
        { name: '鄂尔多斯', value: [109.78, 39.60] },
        { name: '招远', value: [120.38, 37.35] },
        { name: '这是六字名字', value: [122.20, 29.98] },
        { name: '青岛', value: [101.74, 36.56] },
        { name: '四川', value: [104.06, 30.67] },
        { name: '这是七个字名字', value: [121.15, 31.89] },
        { name: '黑龙江', value: [133.68, 47.57] },
        { name: '西藏', value: [91.11, 29.97] },
        { name: '新疆', value: [74.68, 39.27] }
      ],
      // 模拟实时数据
      warnIndex: 0
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
      this.chart = echarts.init(this.$refs.map, null, {
        renderer: 'svg'
      });
      echarts.registerMap('china', maps);
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
          // 测试数据
          name: '散点',
          type: 'scatter',
          geoIndex: 0,
          coordinateSystem: 'geo',
          symbol: 'circle',
          symbolSize: 0,
          animation: false,
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
    // 模拟实时数据
    initData() {
      const data = this.warnData[this.warnIndex];
      this.createPrompt(data.value[0], data.value[1], data.name);
      if (this.warnIndex < this.warnData.length - 1) {
        this.warnIndex++;
      } else {
        this.warnIndex = 0;
      }
    },
    // 地图新增一条提示
    createPrompt(lng, lat, name) {
      const id = new Date().getTime();
      // 经纬度转换成屏幕xy坐标
      const pixel = this.chart.convertToPixel('geo', [lng, lat]); // return Array
      if (!pixel || !pixel.length || pixel.length < 2) return;
      // createDom-box
      const box = document.createElement('div');
      box.setAttribute('class', 's-echart-map-tooltip-wrap');
      box.setAttribute('id', 's-echart-map-tooltip-wrap' + id);
      document.getElementsByClassName('s-map-container-relative')[0].appendChild(box);
      // createDom-content
      const section = document.createElement('section');
      section.setAttribute('class', 's-echart-map-tooltip-content');
      section.setAttribute('id', 's-echart-map-tooltip-content' + id);
      box.appendChild(section);
      // createDom-text
      const text = document.createElement('div');
      text.setAttribute('class', 's-echart-map-tooltip-text');
      text.setAttribute('id', 's-echart-map-tooltip-text' + id);
      section.appendChild(text);
      // createDom-circle
      const circle = document.createElement('div');
      circle.setAttribute('class', 's-echart-map-tooltip-circle');
      section.appendChild(circle);
      // 设置弹窗位置
      box.style.left = pixel[0] + 'px';
      box.style.top = pixel[1] + 'px';
      // 设置文字框内容
      text.innerHTML = `${name}新增100个运单`;
      // 文字框出现
      setTimeout(() => {
        this.showText(id);
      }, 1 * 1000);
      // 文字框和点一起消失动画
      setTimeout(() => {
        this.hideDom(id, lng);
      }, 3.5 * 1000);
      // 移除dom
      setTimeout(() => {
        this.removeDom(id);
      }, 6 * 1000);
    },
    showText(id) {
      const textDom = document.getElementById('s-echart-map-tooltip-text' + id);
      textDom.classList.add('show');
    },
    hideDom(id, lng) {
      const toolDom = document.getElementById('s-echart-map-tooltip-content' + id);
      // 以经度108为界
      if (lng < 108) {
        toolDom.classList.add('hide_left');
      } else {
        toolDom.classList.add('hide_right');
      }
    },
    removeDom(id) {
      const promptDom = document.getElementById('s-echart-map-tooltip-wrap' + id);
      promptDom.remove();
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
    // background: rgba(0,0,0,0.4); // 辅助线
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
          margin-right: 0.2rem;
        }
        .text{
          display: inline-block;
          font-size: 0.6rem;
          font-family: 'PingFang Medium';
          font-weight: 500;
          color: #DDF5FF;
          transform: scale(0.9, 0.9);
        }
      }
    }
  }
}
</style>

<style lang="scss">
/* 全局样式，谨慎使用类名 */
.s-echart-map-tooltip-wrap{
  position: absolute;
  >section{
    transition: all 2.5s;
    transform: translate(0, 0);
    opacity: 1;
    // tooltip消失动画
    &.hide_left{
      transition: all 2.5s;
      transform: translate(-8rem, -6rem);
      opacity: 0;
    }
    &.hide_right{
      transition: all 2.5s;
      transform: translate(8rem, -6rem);
      opacity: 0;
    }
    // 圆点闪烁动画
    >.s-echart-map-tooltip-circle{
      position: absolute;
      top: -0.4rem;
      left: 50%;
      margin-left: -0.33rem;
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      background: url('~@/assets/images/statistic/circle.png') no-repeat;
      background-size: 100% 100%;
      animation: s-echart-map-tooltip-text-flashing 1.6s;
      animation-iteration-count: 1;
    }
    @keyframes s-echart-map-tooltip-text-flashing {
      0% { opacity: 0; }
      30% { opacity: 1; }
      63% { opacity: 0; }
      100% { opacity: 1; }
    }
    // 消息框出现动画
    >.s-echart-map-tooltip-text{
      position: absolute;
      top: -2rem;
      left: 50%;
      transform: translateX(-50%);
      max-width: 8.5rem;
      height: 1.45rem;
      line-height: 1.5rem;
      text-align: center;
      background: url('~@/assets/images/statistic/tooltip_box.png') no-repeat;
      background-size: 100% 100%;
      font-size: 0.6rem;
      opacity: 0;
      padding: 0 0.4rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &.show{
        transition: opacity 0.6s;
        opacity: 1;
      }
      &::before{
        content: '';
        position: absolute;
        top: -0.1rem;
        left: 0;
        width: 0.7rem;
        height: 0.7rem;
        background: url('~@/assets/images/statistic/tooltip_box_before.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
