<template>
  <div class="g-statistic">
    <!-- title -->
    <div class="header-box">
      至简数字科技大数据
      <span class="line left" />
      <span class="line right" />
    </div>

    <!-- left -->
    <div class="ly-left ly-border">
      <div class="ly-left-top mb1rem ly-flex-pack-justify ly-border">
        <div class="ly-left-top-left ly-border">
          <Title class="title_1" icon="1">监管数据<span>Regulatory data</span></Title>
          <RegulatoryData :branch-code="branchCode" />
        </div>
        <div class="ly-left-top-right ly-border">
          <Title class="title_2" icon="2">用户情况<span>User situation</span></Title>
          <UserInfo :branch-code="branchCode" />
        </div>
      </div>
      <div class="ly-left-center mb1rem ly-border">
        <Title class="title_3" icon="3">运力情况<span>Capacity situation</span></Title>
        <CapacityInfo :branch-code="branchCode" />
      </div>
      <div class="ly-left-bottom ly-border">
        <Title class="title_3" icon="4">业绩数据<span>Performance data</span></Title>
        <div class="ly-left-bottom-box ly-flex-pack-justify">
          <div class="ly-left-bottom-left ly-border">
            <PerformanceInfo class="mb1rem" />
            <AmountTop10Chart ref="AmountTop10ChartRef" />
          </div>
          <div class="ly-left-bottom-right ly-border">
            <CompanyTop10List />
          </div>
        </div>
      </div>
    </div>

    <!-- center -->
    <div class="ly-center ly-border ly-flex-v ly-flex-pack-justify">
      <TotalData :branch-code="branchCode" class="ly-border" @getPartitionListVo="getPartitionListVo" />
      <Map ref="mapRef" :partition-list-vo="partitionListVo" class="ly-border" />
      <ScrollData class="ly-border" />
    </div>

    <!-- right -->
    <div class="ly-right ly-flex-pack-justify ly-border">
      <div class="ly-right-left ly-border">
        <div class="ly-right-left-top mb1rem ly-border">
          <Title class="title_4 mb05rem" icon="5">运营情况<span>Operation situation</span></Title>
          <div class="ly-right-left-top-box">
            <OperationData />
            <OrderChart ref="OrderChartRef" />
            <ComplaintChart ref="ComplaintChartRef" />
          </div>
        </div>
        <div class="ly-right-left-bottom ly-border">
          <Title class="title_5 mb05rem" icon="6">目标达成情况<span>Achievement of Goals</span></Title>
          <TargetChart ref="TargetChartRef" />
        </div>
      </div>
      <div class="ly-right-right ly-border">
        <Title class="title_4 mb05rem" icon="7">总排名<span>Total number</span></Title>
        <div class="ly-right-right-top mb1rem ly-border">
          <CompanyTop5List />
        </div>
        <div class="ly-right-right-bottom mb1rem ly-border">
          <DriverTop5List />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ThrottleFun } from '@/utils/index.js';
import { mapState } from 'vuex';
import Title from './components/title';
import RegulatoryData from './RegulatoryData';// 监管数据
import UserInfo from './UserInfo';// 用户情况
import CapacityInfo from './CapacityInfo';// 运力情况
import PerformanceInfo from './PerformanceInfo';// 业绩数据
import AmountTop10Chart from './AmountTop10Chart';// TOP10省份交易额排名
import CompanyTop10List from './CompanyTop10List';// TOP10省内十大公司
import OperationData from './OperationData';// 运营情况
import OrderChart from './OrderChart';// 订单统计
import ComplaintChart from './ComplaintChart';// 投诉统计
import TargetChart from './TargetChart';// 目标达成情况
import CompanyTop5List from './CompanyTop5List';// 总排名TOP5公司
import DriverTop5List from './DriverTop5List';// 总排名TOP5司机
import TotalData from './TotalData';// 中间总数统计
import ScrollData from './ScrollData';// 中间滚屏数据
import Map from './Map.vue';// 地图
import { dataJson } from './data';

export default {
  name: 'Statistic',
  components: {
    Title,
    RegulatoryData,
    UserInfo,
    CapacityInfo,
    PerformanceInfo,
    AmountTop10Chart,
    CompanyTop10List,
    OperationData,
    OrderChart,
    ComplaintChart,
    TargetChart,
    CompanyTop5List,
    DriverTop5List,
    TotalData,
    ScrollData,
    Map
  },
  data() {
    return {
      branchCode: null,
      // websocket
      wsurl: 'ws://192.168.30.134:8083/chy',
      // wsurl: 'ws://127.0.0.1:8080',
      websock: null,
      lockReconnect: false,
      timerReconnect: null,
      heartTimeout: null,
      serverTimeout: null,
      // 地图对应省份运单数据
      partitionListVo: []
    };
  },
  computed: {
    ...mapState({
      branch: state => state.user.branch
    })
  },
  created() {
    this.branchCode = this.branch.code;
    // this.createWebSocket();
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun);
    if (this.websock) this.websock.close();
  },
  methods: {
    resizeFun() {
      const throttle = ThrottleFun(this.refreshChart, 300);
      throttle();
    },
    // 创建websocket
    createWebSocket() {
      try {
        this.websock = new WebSocket(this.wsurl);
        this.initWebSocket();
      } catch (e) {
        console.log('catch', e);
        this.reconnect();
      }
    },
    initWebSocket() {
      this.websock.onmessage = (e) => {
        console.log('数据接收', e);
        // 拿到pong说明当前连接是正常的
        if (e.data === 'pong') {
          this.heartCheck();
        }
      };
      this.websock.onopen = () => {
        console.log('连接成功', this.websock);
        this.heartCheck();
      };
      this.websock.onerror = () => {
        console.log('连接失败');
        this.reconnect();
      };
      this.websock.onclose = (e) => {
        console.log('断开连接', e);
        this.reconnect();
      };
    },
    // 重连
    reconnect() {
      if (this.lockReconnect) {
        return;
      }
      console.log('发起重连');
      this.lockReconnect = true;
      // 没连接上会一直重连，设置延迟
      this.timerReconnect && clearTimeout(this.timerReconnect);
      this.timerReconnect = setTimeout(() => {
        this.createWebSocket();
        this.lockReconnect = false;
      }, 3 * 1000);
    },
    // 心跳检测
    heartCheck() {
      this.heartTimeout && clearTimeout(this.heartTimeout);
      this.serverTimeout && clearTimeout(this.serverTimeout);
      this.heartTimeout = setTimeout(() => {
        // 发送一个心跳包
        console.log('发送ping');
        this.websock.send('ping');
        // 计算答复的超时时间
        this.serverTimeout = setTimeout(() => {
          this.websock.close();
          console.log('答复超时');
        }, 5 * 1000);
      }, 4 * 1000);
    },
    // 图表自适应
    refreshChart() {
      this.$refs.AmountTop10ChartRef.refreshChart();
      this.$refs.TargetChartRef.refreshChart();
      this.$refs.OrderChartRef.refreshChart();
      this.$refs.ComplaintChartRef.refreshChart();
      this.$refs.mapRef.refreshChart();
    },
    // 获取地图对应省份运单数据
    getPartitionListVo(data = []) {
      this.partitionListVo = data;
    }
  }
};
</script>

<style lang="scss" scoped>
// 辅助线
.ly-border {
  box-sizing: border-box;
  // border: 1px dashed rgb(255, 255, 255, 0.2);
}

// 设计稿大小：3200*1080
// 1rem = 20px;
.g-statistic {
  //variabbles
  $width: 160rem;
  $width_left: 53.8rem;
  $width_right: 48rem;
  $mb1rem: 1rem;
  $mb05rem: 0.5rem;

  //base
  position: relative;
  color: #fff;
  font-size: 0.7rem;
  background-color: #011c5f;
  box-sizing: border-box;
  background: #011c5f url('~@/assets/images/statistic/map_bg.png') no-repeat;
  background-size: 100% 100%;

  //unSelect
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  //layout
  width: $width;
  height: 100%;
  padding: 2.3rem 1.6rem 1.4rem;
  overflow: hidden;
  .mb1rem{
    margin-bottom: $mb1rem;
  }
  .mb05rem{
    margin-bottom: $mb05rem;
  }
  .ly-left {
    width: $width_left;
    height: 100%;
    float: left;
    .ly-left-top, .ly-left-center {
      height: calc(21.87% - #{$mb1rem});
      .ly-left-top-left {
        width: 19.6rem;
      }
      .ly-left-top-right {
        width: 32.6rem;
      }
    }
    .ly-left-bottom {
      height: calc(100% - 21.87% * 2);
      .ly-left-bottom-box{
        // 2.6 = titleHeight + mb1rem
        height: calc(100% - 2.6rem);
        .ly-left-bottom-left {
          width: 28.4rem;
          height: 100%;
        }
        .ly-left-bottom-right {
          width: 23.8rem;
          height: 100%;
        }
      }
    }
  }
  .ly-center {
    position: relative;
    width: calc(100% - #{$width_left} - #{$width_right});
    height: 100%;
    float: left;
    padding-top: 2.8rem;
  }
  .ly-right {
    width: $width_right;
    height: 100%;
    float: right;
    .ly-right-left {
      width: 23.4rem;
      .ly-right-left-top {
        height: calc(100% - 26.5% - #{$mb1rem});
        .ly-right-left-top-box{
          height: calc(100% - #{$mb05rem} - 1.6rem);
        }
      }
      .ly-right-left-bottom {
        height: 26.5%;
      }
    }
    .ly-right-right {
      width: 22.6rem;
      .ly-right-right-top, .ly-right-right-bottom {
        // 0.75 = [mb1 + mb0.5] / 2
        // 0.95 = titleHeight / 2
        height: calc(50% - 0.75rem - 0.8rem);
      }
    }
  }

  //style
  .header-box {
    display: inline-block;
    position: absolute;
    width: 26rem;
    top: 1.6rem;
    left: 50%;
    margin-left: -13rem;
    font-size: 1.6rem;
    font-family: 'PingFang Regular';
    font-weight: bold;
    color: #FFFFFF;
    text-align: center;
    >.line {
      width: 6rem;
      height: 0.1rem;
      background: linear-gradient(to right, rgba(3, 252, 255, 0) 0%, rgba(3, 252, 255, 0.5) 50%, rgba(3, 252, 255, 0) 100%);
      position: absolute;
      top: 1.1rem;
      &.left {
        left: -0.5rem;
      }
      &.right {
        right: -0.5rem;
      }
    }
    &::before {
      content: '';
      width: 6.1rem;
      height: 2.1rem;
      position: absolute;
      top: 0.1rem;
      left: -0.5rem;
      background: url('~@/assets/images/statistic/header_left.gif') no-repeat;
      background-size: 100% 100%;
    }
    &::after {
      content: '';
      width: 6.1rem;
      height: 2.1rem;
      position: absolute;
      top: 0.1rem;
      right: -0.5rem;
      background: url('~@/assets/images/statistic/header_right.gif') no-repeat;
      background-size: 100% 100%;
    }
  }

}
</style>
