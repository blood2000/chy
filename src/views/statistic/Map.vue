<template>
  <div class="s-container s-map-container-relative">
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
    <!-- 运单 -->
    <WaybillCard ref="WaybillCardRef" />
  </div>
</template>

<script>
import * as echarts from 'echarts';
// import 'echarts-gl';
import maps from '@/assets/json/china.json';
import { setfontSize } from '@/utils/fontSize';
import WaybillCard from './WaybillCard';

export default {
  components: {
    WaybillCard
  },
  props: {
    partitionListVo: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      chart: null,
      legendList: [
        { name: '大于10万单', color: '#03fcff' },
        { name: '5-10万单', color: '#10c8da' },
        { name: '1-5万单', color: '#067bab' },
        { name: '小于1万单', color: '#105296' }
      ],
      regionData: [],
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
  watch: {
    partitionListVo: {
      handler(value) {
        if (!this.chart) return;
        this.setRegionData();
      },
      deep: true
    }
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
      this.setRegionData();
    },
    refreshChart() {
      if (!this.chart) return;
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
          layoutCenter: ['49%', '48%'],
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
              color: '#000' // 亮色: #D5EAFF
            }
          }
        },
        series: [{
          type: 'map',
          z: 0,
          map: 'china',
          zoom: 1.2,
          aspectScale: 0.8,
          layoutCenter: ['49%', '48%'],
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
    // 设置地图对应省份运单数据
    setRegionData() {
      // 处理数据 [{provinceName: '', waybillCount: 0}] => [{name: '', itemStyle: {areaColor: ''}]
      this.regionData = [];
      this.partitionListVo.forEach(el => {
        const { provinceName, waybillCount } = el;
        let color = '';
        if (waybillCount < 10000) {
          color = '#105296';
        } else if (waybillCount >= 10000 && waybillCount < 50000) {
          color = '#067bab';
        } else if (waybillCount >= 50000 && waybillCount < 100000) {
          color = '#10c8da';
        } else if (waybillCount >= 100000) {
          color = '#03fcff';
        }
        this.regionData.push({
          name: provinceName,
          itemStyle: {
            areaColor: color
          }
        });
      });
      // 在地图中对特定的区域配置样式
      this.chart.setOption({
        geo: {
          regions: this.regionData
        }
      });
    },
    // 处理实时数据-运单
    setWayBillData(val, time) {
      const { status } = val;
      if (status) {
        const driver = val.driver.name ? val.driver.name : '';
        const licenseNumber = val.vehicle.licenseNumber ? val.vehicle.licenseNumber : '';
        // 接单
        if (status === 1) {
          const title = `[ 接单 ] ${driver} ${licenseNumber}`;
          const address = val.address.loadFormattedAddress ? val.address.loadFormattedAddress : '';
          this.$refs.WaybillCardRef.setData(status, title, address, time);
          this.createMapData(status, val, time);
        }
        // 装货
        if (status === 2) {
          const title = `[ 装货 ] ${driver} ${licenseNumber}`;
          const address = val.address.loadFormattedAddress ? val.address.loadFormattedAddress : '';
          this.$refs.WaybillCardRef.setData(status, title, address, time);
          this.createMapData(status, val, time);
        }
        // 卸货
        if (status === 3) {
          const title = `[ 卸货 ] ${driver} ${licenseNumber}`;
          const address = val.address.unloadFormattedAddress ? val.address.unloadFormattedAddress : '';
          this.$refs.WaybillCardRef.setData(status, title, address, time);
          this.createMapData(status, val, time);
        }
      }
    },
    // 地图新增一条提示-弃用
    createPrompt(lng, lat, name) {
      if (!lng || !lat) return;
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
      console.log(pixel);
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
    },
    // 模拟地图实时数据
    mockData() {
      const data = this.warnData[this.warnIndex];
      const title = '【 测试 】';
      const text = '吴敬东 闽A510AY';
      const time = '14:26:25';
      this.createTooltip(2, data.value[0], data.value[1], title, text, time);
      if (this.warnIndex < this.warnData.length - 1) {
        this.warnIndex++;
      } else {
        this.warnIndex = 0;
      }
    },
    // 处理地图实时数据
    createMapData(status, val, time) {
      let contentTitle = '';
      const contentText = `${val.driver.name ? val.driver.name : ''} ${val.vehicle.licenseNumber ? val.vehicle.licenseNumber : ''}`;
      const contentTime = this.parseTime(time, '{h}:{i}:{s}');
      let location = [];
      if (status === 1) {
        contentTitle = '【 接单 】';
        location = val.address.loadLocations;
      } else if (status === 2) {
        contentTitle = '【 装货 】';
        location = val.address.loadLocations;
      } else if (status === 3) {
        contentTitle = '【 卸货 】';
        location = val.address.unloadLocations;
      }
      if (location && location.length === 2) {
        this.createTooltip(status, location[0], location[1], contentTitle, contentText, contentTime);
      }
    },
    // 地图新增一条运单信息-现用
    createTooltip(status, lng, lat, contentTitle, contentText, contentTime) {
      if (!lng || !lat) return;
      // 经纬度转换成屏幕xy坐标
      const pixel = this.chart.convertToPixel('geo', [lng, lat]); // return Array
      if (!pixel || !pixel.length || pixel.length < 2) return;
      // createDom-box
      const wrap = document.createElement('div');
      wrap.setAttribute('class', 's-echart-map-waybill-tooltip-wrap');
      document.getElementsByClassName('s-map-container-relative')[0].appendChild(wrap);
      // createDom-circle
      const circle = document.createElement('div');
      wrap.appendChild(circle);
      // 动画-圆点闪烁1s
      circle.setAttribute('class', 's-echart-map-waybill-tooltip-circle');
      // createDom-line
      const line = document.createElement('div');
      line.setAttribute('class', 's-echart-map-waybill-tooltip-line');
      wrap.appendChild(line);
      // createDom-content
      const content = document.createElement('div');
      content.setAttribute('class', 's-echart-map-waybill-tooltip-content color' + status);
      wrap.appendChild(content);
      // 设置content基础宽度
      if (status === 1) {
        content.style.width = 14.35 + 1.35 + 'rem';
      } else if (status === 2) {
        content.style.width = 12.25 + 1.35 + 'rem';
      } else if (status === 3) {
        content.style.width = 12.25 + 1.35 + 'rem';
      }
      // createDom-car-head
      const carHead = document.createElement('div');
      carHead.setAttribute('class', 's-echart-map-waybill-tooltip-car-head');
      content.appendChild(carHead);
      // createDom-car-body
      const carBody = document.createElement('div');
      carBody.setAttribute('class', 's-echart-map-waybill-tooltip-car-body');
      content.appendChild(carBody);
      // createDom-car-body-box 文字盒子
      const carBodyBox = document.createElement('div');
      carBodyBox.setAttribute('class', 's-echart-map-waybill-tooltip-car-body-box');
      carBody.appendChild(carBodyBox);
      // createDom-title
      const title = document.createElement('div');
      title.setAttribute('class', 's-echart-map-waybill-tooltip-title');
      carBodyBox.appendChild(title);
      // createDom-text
      const text = document.createElement('div');
      text.setAttribute('class', 's-echart-map-waybill-tooltip-text');
      carBodyBox.appendChild(text);
      // createDom-time
      const time = document.createElement('div');
      time.setAttribute('class', 's-echart-map-waybill-tooltip-time');
      carBodyBox.appendChild(time);
      // 设置弹窗位置
      wrap.style.left = pixel[0] + 'px';
      wrap.style.top = pixel[1] + 'px';
      // 设置文字框内容
      title.innerHTML = contentTitle;
      text.innerHTML = contentText;
      time.innerHTML = contentTime;
      // 设置车头初始位置：取最右边经度134
      const carHeadPixel = this.chart.convertToPixel('geo', [134, lat]);
      const carHeadTranslateWidth = carHeadPixel[0] - pixel[0] + content.offsetWidth / 2;
      if (carHeadTranslateWidth < content.offsetWidth) {
        carHead.style.transform = 'translateX(' + content.offsetWidth + 'px)';
      } else {
        carHead.style.transform = 'translateX(' + carHeadTranslateWidth + 'px)';
      }
      // 动画-车头飞出
      setTimeout(() => {
        carHead.style.transform = 'translateX(0px)';
        carHead.style.opacity = 1;
      }, 0.9 * 1000);
      // 动画-线出现
      setTimeout(() => {
        line.style.height = '0.8rem';
      }, 1.4 * 1000);
      // 动画-背景展开
      setTimeout(() => {
        if (status === 1) {
          carBody.style.width = '14.35rem';
        } else if (status === 2) {
          carBody.style.width = '12.25rem';
        } else if (status === 3) {
          carBody.style.width = '12.25rem';
        }
      }, 1.6 * 1000);
      // 动画-边框线条出现
      setTimeout(() => {
        carBody.classList.add('border');
      }, 1.9 * 1000);
      // 动画-文字出现
      setTimeout(() => {
        carBodyBox.style.opacity = 1;
      }, 2 * 1000);
      // 动画-消失
      setTimeout(() => {
        wrap.classList.add('hide');
      }, 5.4 * 1000);
      // 移除dom
      setTimeout(() => {
        wrap.remove();
      }, 6 * 1000);
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
  // 图例
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
// 弃用
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
// 现用
.s-echart-map-waybill-tooltip-wrap{
  position: absolute;
  opacity: 1;
  // 圆点闪烁动画
  >.s-echart-map-waybill-tooltip-circle{
    position: absolute;
    top: -0.4rem;
    left: 50%;
    margin-left: -0.33rem;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: url('~@/assets/images/statistic/circle.png') no-repeat;
    background-size: 100% 100%;
    animation: s-echart-map-waybill-tooltip-text-flashing 1s;
    animation-iteration-count: 1;
  }
  @keyframes s-echart-map-waybill-tooltip-text-flashing {
    0% { opacity: 0; }
    30% { opacity: 1; }
    63% { opacity: 0; }
    100% { opacity: 1; }
  }
  // 线条
  >.s-echart-map-waybill-tooltip-line{
    width: 0.05rem;
    border-left: 0.05rem dashed rgba(255, 255, 255, 0.6);
    position: absolute;
    left: 50%;
    bottom: 0.2rem;
    height: 0;
    transition: height 0.3s;
  }
  // 消息框
  >.s-echart-map-waybill-tooltip-content{
    position: absolute;
    top: -2.4rem;
    left: 50%;
    transform: translateX(-50%);
    height: 1.35rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    // 车头
    >.s-echart-map-waybill-tooltip-car-head{
      width: 1.35rem;
      height: 1.35rem;
      opacity: 0;
      transition: all 0.6s;
    }
    // 车身
    >.s-echart-map-waybill-tooltip-car-body{
      height: 1.1rem;
      width: 0;
      overflow: hidden;
      transition: width 0.4s;
      border-left: 0.05rem solid rgba(255, 255, 255, 0);
      position: relative;
      &::before{
        content: '';
        position: absolute;
        left: 0;
        bottom: -0.05rem;
        height: 0.1rem;
        width: 0;
        background: linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
      }
      &.border{
        border-left: 0.05rem solid rgba(255, 255, 255, 0.5);
        transition: border-left 0.1s;
        &::before{
          width: 100%;
          transition: width 0.5s;
        }
      }
      >.s-echart-map-waybill-tooltip-car-body-box{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #FFFFFF;
        font-family: PingFang Regular;
        opacity: 0;
        transition: opacity 0.5s;
        >.s-echart-map-waybill-tooltip-title{
          font-size: 0.7rem;
          font-weight: 400;
        }
        >.s-echart-map-waybill-tooltip-text{
          font-size: 0.6rem;
          font-weight: bold;
          padding-right: 0.4rem;
        }
        >.s-echart-map-waybill-tooltip-time{
          font-size: 0.6rem;
          font-weight: 400;
        }
      }
    }
    // 区分不同状态
    &.color1{
      >.s-echart-map-waybill-tooltip-car-head{
        background: url('~@/assets/images/statistic/waybill_car_1.png') no-repeat;
        background-size: 100% 100%;
      }
      >.s-echart-map-waybill-tooltip-car-body{
        background: linear-gradient(to right, rgba(2, 74, 181, 0.7) 0%, rgba(3, 119, 85, 0.6) 70%, rgba(3, 119, 85, 0) 100%);
      }
    }
    &.color2{
      >.s-echart-map-waybill-tooltip-car-head{
        background: url('~@/assets/images/statistic/waybill_car_2.png') no-repeat;
        background-size: 100% 100%;
      }
      >.s-echart-map-waybill-tooltip-car-body{
        margin-top: -0.1rem;
        background: linear-gradient(to right, rgba(126, 53, 184, 0.8) 0%, rgba(24, 121, 212, 0.6) 70%, rgba(24, 121, 212, 0) 100%);
      }
    }
    &.color3{
      >.s-echart-map-waybill-tooltip-car-head{
        background: url('~@/assets/images/statistic/waybill_car_3.png') no-repeat;
        background-size: 100% 100%;
      }
      >.s-echart-map-waybill-tooltip-car-body{
        margin-top: -0.1rem;
        background: linear-gradient(to right, rgba(255, 126, 0, 0.5) 0%, rgba(246, 220, 4, 0.3) 70%, rgba(246, 220, 4, 0) 100%);
      }
    }
  }
  // 消失动画
  &.hide{
    opacity: 0;
    transition: opacity 0.6s;
  }
}
</style>
