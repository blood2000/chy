<template>
  <div class="g-statistic">
    <!-- title -->
    <div class="header-box">
      <img src="@/assets/images/statistic/title.png">
      <span class="line left" />
      <span class="line right" />
    </div>

    <!-- left -->
    <div class="ly-left ly-border">
      <div class="ly-left-top mb1rem ly-border">
        <Title class="title_3" icon="2">用户概览<span>User situation</span></Title>
        <UserInfo ref="UserInfoRef" :branch-code="branchCode" :is-second="true" />
      </div>
      <div class="ly-left-center mb1rem ly-border">
        <Title class="title_3" icon="3">运力情况<span>Capacity situation</span></Title>
        <CapacityInfo ref="CapacityInfoRef" :branch-code="branchCode" :is-scale="!!$route.query.isScale" />
      </div>
      <div class="ly-left-bottom ly-border">
        <div class="ly-left-bottom-box ly-flex-pack-justify">
          <div class="ly-left-bottom-left ly-border">
            <div class="ly-left-bottom-left-top ly-border">
              <Title class="title_4 mb05rem" icon="4" :show-time="true" :time-text="timeText">货运类型排行<span>Freight Type list</span></Title>
              <div class="ly-left-bottom-left-box ly-border">
                <FreightTypeRanking ref="FreightTypeRankingRef" :time-key="timeKey" :branch-code="branchCode" />
              </div>
            </div>
            <div class="ly-left-bottom-left-bottom ly-border">
              <Title class="title_4 mb05rem" icon="6">地域业务分布情况<span>Geographical Business Distribution</span></Title>
              <div class="ly-left-bottom-left-box ly-border">
                <BusinessDistribution ref="BusinessDistributionRef" :branch-code="branchCode" />
              </div>
            </div>
          </div>
          <div class="ly-left-bottom-right ly-border">
            <Title class="title_5 mb05rem" icon="4" :show-time="true" :time-text="timeText">承运排行<span>Shipping list</span></Title>
            <DriverTop5List ref="DriverTop5ListRef" :time-key="timeKey" :show-top="false" style="height: calc(100% - 2.1rem)" />
          </div>
        </div>
      </div>
    </div>

    <!-- center -->
    <div class="ly-center ly-border ly-flex-v ly-flex-pack-justify">
      <TotalDataSecond
        ref="TotalDataRef"
        :branch-code="branchCode"
        class="ly-border"
        @getTime="getTime"
        @getPartitionListVo="getPartitionListVo"
      />
      <Map ref="mapRef" :partition-list-vo="partitionListVo" :is-second="true" class="ly-border" />
      <ScrollData ref="ScrollDataRef" class="ly-border" style="margin: 0 1.4rem" />
    </div>

    <!-- right -->
    <div class="ly-right ly-flex-pack-justify ly-border">
      <div class="ly-right-left ly-border">
        <div class="ly-right-left-top mb1rem ly-border">
          <Title class="title_4 mb05rem" icon="5" :show-time="true" :time-text="timeText">运营情况<span>Operation situation</span></Title>
          <div class="ly-right-left-top-box">
            <OperationData
              ref="OperationDataRef"
              :order-vo="businessData.orderVo"
              :waill-bill-vo="businessData.waillBillVo"
              :week-vo-list="businessData.weekVoList"
              :is-second="true"
              :time-key="timeKey"
              style="height: 100%"
            />
          </div>
        </div>
        <div class="ly-right-left-bottom ly-border">
          <Title class="title_5 mb05rem" icon="6">目标达成情况<span>Achievement of Goals</span></Title>
          <TargetChart ref="TargetChartRef" :branch-code="branchCode" />
        </div>
      </div>
      <div class="ly-right-right ly-border">
        <Title class="title_4 mb05rem" icon="7" :show-time="true" :time-text="timeText">业绩数据<span>Performance data</span></Title>
        <div class="ly-right-right-box ly-border">
          <div class="ly-border mb05rem" style="height: 15%">
            <PerformanceInfo ref="PerformanceInfoRef" :performance="performanceData.performance" :time-key="timeKey" :is-scale="!!$route.query.isScale" />
          </div>
          <div class="ly-border mb07rem" style="height: calc(33% - 1.2rem)">
            <div class="ly-right-right-box-title mb05rem">TOP 5省份交易额排名</div>
            <AmountTop5Chart ref="AmountTop5ChartRef" :province-ranking="performanceData.provinceRanking" :time-key="timeKey" :show-title="false" style="height: calc(100% - 1.5rem)" />
          </div>
          <div class="ly-border" style="height: 52%">
            <CompanyTop10ListSecond ref="CompanyTop10ListSecondRef" :province-ranking="performanceData.provinceRanking" :time-key="timeKey" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ThrottleFun } from '@/utils/index.js';
import { mapState } from 'vuex';
import Title from './components/title';
import UserInfo from './UserInfo';// 用户情况
import CapacityInfo from './CapacityInfo';// 运力情况
import PerformanceInfo from './PerformanceInfo';// 业绩数据
import AmountTop5Chart from './AmountTop5Chart';// TOP5省份交易额排名
import CompanyTop10ListSecond from './CompanyTop10ListSecond';// TOP10省内十大公司
import OperationData from './OperationData';// 运营情况
import TargetChart from './TargetChart';// 目标达成情况
import DriverTop5List from './DriverTop5List';// 总排名TOP5司机
import TotalDataSecond from './TotalDataSecond';// 中间总数统计
import ScrollData from './ScrollData';// 中间滚屏数据
import Map from './Map';// 地图
import FreightTypeRanking from './FreightTypeRanking';// 货运类型排行
import BusinessDistribution from './BusinessDistribution';// 地区业务分布情况
import { getCompanyPerformance, getBusinessDetail } from '@/api/statistic/statistic.js';
// import { dataJson } from './data';

export default {
  name: 'Statistic',
  components: {
    Title,
    UserInfo,
    CapacityInfo,
    PerformanceInfo,
    AmountTop5Chart,
    CompanyTop10ListSecond,
    OperationData,
    TargetChart,
    DriverTop5List,
    TotalDataSecond,
    ScrollData,
    Map,
    FreightTypeRanking,
    BusinessDistribution
  },
  data() {
    return {
      branchCode: null,
      // websocket
      wsurl: 'ws://124.71.25.3:8080/websocket/chy',
      websock: null,
      lockReconnect: false,
      timerReconnect: null,
      heartTimeout: null,
      serverTimeout: null,
      // 地图对应省份运单数据
      partitionListVo: [],
      // 业绩数据
      performanceData: {
        performance: {}, // 数据
        provinceRanking: [] // Top5省份交易额
      },
      // 运营情况数据
      businessData: {
        orderVo: {}, // 货单
        waillBillVo: {}, // 运单
        weekVoList: [], // 近8周订单数
        complainVo: {} // 投诉
      },
      // 当前时间
      timeKey: 2,
      timeText: '最近30天'
    };
  },
  computed: {
    ...mapState({
      branch: state => state.user.branch
    })
  },
  created() {
    this.branchCode = this.branch.code;
  },
  mounted() {
    this.setHtmlFontSize();
    this.setScale();
    window.addEventListener('resize', this.resizeFun);
    this.getPerformanceData();
    this.getBusinessData();
    this.createWebSocket();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun);
    if (this.websock) this.websock.close();
    this.removeScale();
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
        // 拿到pong说明当前连接是正常的
        if (e.data === 'pong') {
          // console.log('pong');
          this.heartCheck();
        } else if (e.data && e.data.length > 10) {
          this.setData(JSON.parse(e.data));
        } else if (e.data === 'refresh') {
          // 判断凌晨后更新接口
          this.refreshData();
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
        // console.log('ping');
        this.websock.send('ping');
        // 计算答复的超时时间
        this.serverTimeout = setTimeout(() => {
          if (this.websock) this.websock.close();
          console.log('答复超时');
        }, 5 * 1000);
      }, 4 * 1000);
    },
    // 处理实时数据
    setData(dJson) {
      // console.log('实时Json：', dJson);
      const { userNotice, invoiceNotice, orderNoticeVo, waybillNotice, waybillSettlementNotice, insertTime } = dJson;
      // 用户√
      if (userNotice) {
        this.$refs.UserInfoRef.setData(userNotice);
        this.$refs.CapacityInfoRef.setVehicleData(userNotice);
        this.$refs.ScrollDataRef.setUserData(userNotice, insertTime);
      }
      // 开票√
      if (invoiceNotice) {
        this.$refs.PerformanceInfoRef.setInvoiceData(invoiceNotice);
        this.$refs.ScrollDataRef.setInvoiceData(invoiceNotice, insertTime);
      }
      // 货单√
      if (orderNoticeVo && orderNoticeVo.transportVo && orderNoticeVo.transportVo.orderBean) {
        const orderBean = orderNoticeVo.transportVo.orderBean;
        this.$refs.TotalDataRef.setOrderData(orderBean);
        this.$refs.OperationDataRef.setOrderData(orderBean);
        this.$refs.CapacityInfoRef.setOrderData(orderBean);
        this.$refs.ScrollDataRef.setOrderData(orderBean, insertTime);
      }
      // 运单√
      if (waybillNotice) {
        this.$refs.TotalDataRef.setWaybillData(waybillNotice);
        this.$refs.OperationDataRef.setWaybillData(waybillNotice);
        this.$refs.CapacityInfoRef.setWayBillData(waybillNotice);
        this.$refs.mapRef.setWayBillData(waybillNotice, insertTime);
      }
      // 打款√
      if (waybillSettlementNotice) {
        this.$refs.ScrollDataRef.setWaybillData(waybillSettlementNotice, insertTime);
        this.$refs.PerformanceInfoRef.setWaybillData(waybillSettlementNotice);
      }
    },
    // 图表自适应
    refreshChart() {
      this.setHtmlFontSize();
      this.$refs.AmountTop5ChartRef.refreshChart();
      this.$refs.TargetChartRef.refreshChart();
      this.$refs.OperationDataRef.refreshChart();
      this.$refs.mapRef.refreshChart();
      this.$refs.FreightTypeRankingRef.refreshChart();
    },
    // 计算根节点fontsize
    setHtmlFontSize() {
      // 设1rem = 20px
      // 160 = 3200 / 20
      // 96 = 1920 / 20
      // font-size: calc(100vw / 96);
      const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (!clientWidth) return;
      let size = clientWidth / 20;
      if (size < 96) size = 96;
      if (size > 160) size = 160;
      // console.log('clientWidth: ', clientWidth);
      // console.log('size: ', size);
      document.getElementsByTagName('html')[0].style.fontSize = `calc(100vw / ${size})`;
    },
    // 临时设置scale
    setScale() {
      const { isScale } = this.$route.query;
      console.log('isScale: ', isScale);
      if (!isScale) {
        document.getElementById('app').style.transform = 'scaleX(0.6)'; // 0.6 = 1920 / 3200
        document.getElementById('app').style.transformOrigin = '0px 0px';
      } else {
        this.removeScale();
      }
    },
    removeScale() {
      document.getElementById('app').style.transform = '';
    },
    // 获取地图对应省份运单数据
    getPartitionListVo(data = []) {
      this.partitionListVo = data;
    },
    // 获取时间
    getTime(timeKey, timeText) {
      // 初始化的时候不加载
      if (timeKey === this.timeKey) return;
      this.timeKey = timeKey;
      this.timeText = timeText;
      // 切换时间后的处理
      console.log('==============>timeKey: ', this.timeKey);
      this.$nextTick(() => {
        this.$refs.FreightTypeRankingRef.getData();
        this.$refs.DriverTop5ListRef.getData();
      });
    },
    // 获取业绩数据
    getPerformanceData() {
      getCompanyPerformance(this.branchCode).then(response => {
        const data = response.data || {};
        this.performanceData = {
          performance: data.performance || {}, // 数据
          provinceRanking: data.provinceRanking || [] // Top5省份交易额
        };
        this.$nextTick(() => {
          this.$refs.AmountTop5ChartRef.initChart();
          this.$refs.CompanyTop10ListSecondRef.rollTooltip();
        });
      });
    },
    // 获取运营情况的数据
    getBusinessData() {
      getBusinessDetail(this.branchCode).then(response => {
        const data = response.data || {};
        this.businessData = {
          orderVo: data.orderVo || {}, // 货单
          waillBillVo: data.waillBillVo || {}, // 运单
          weekVoList: data.weekVoList || [], // 近8周订单数
          complainVo: data.complainVo || {} // 投诉
        };
        this.$nextTick(() => {
          this.$refs.OperationDataRef.initChart();
        });
      });
    },
    // 零点更新接口
    refreshData() {
      this.getPerformanceData(); // 业绩
      this.getBusinessData(); // 运营
      this.$refs.UserInfoRef.getData(); // 用户
      this.$refs.CapacityInfoRef.getData(); // 运力
      this.$refs.TargetChartRef.getData(); // 目标
      this.$refs.TotalDataRef.getCount(); // 地图运单
      this.$refs.FreightTypeRankingRef.getData(); // 货运类型排行
      this.$refs.DriverTop5ListRef.getData(); // 承运排名
      this.$refs.BusinessDistributionRef.getData(); // 地域业务分布情况
    }
  }
};
</script>

<style lang="scss" scoped>
// 辅助线
.ly-border {
  box-sizing: border-box;
  // border: 0.05rem dashed rgba(255, 255, 255, 0.2);
}

// 设计稿大小：3200*1080
// 1rem = 20px;
.g-statistic {
  //variabbles
  $width: 160rem;
  $width_left: 47.2rem;
  $width_right: 48rem;
  $mb1rem: 1rem;
  $mb05rem: 0.5rem;
  $mb07rem: 0.7rem;

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
  .mb07rem{
    margin-bottom: $mb07rem;
  }
  .ly-left {
    width: $width_left;
    height: 100%;
    float: left;
    .ly-left-top, .ly-left-center {
      height: calc(21.87% - #{$mb1rem});
    }
    .ly-left-bottom {
      height: calc(100% - 21.87% * 2);
      .ly-left-bottom-box{
        height: 100%;
        .ly-left-bottom-left {
          width: 26.3rem;
          height: 100%;
          .ly-left-bottom-left-top, .ly-left-bottom-left-bottom{
            height: 50%;
            .ly-left-bottom-left-box{
              height: calc(100% - 2.1rem);
            }
          }
        }
        .ly-left-bottom-right {
          width: 17.8rem;
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
      .ly-right-right-box {
        height: calc(100% - 2.1rem);
        .ly-right-right-box-title{
          height: 1rem;
          font-size: 0.8rem;
          font-family: 'PingFang Regular';
          font-weight: 500;
          color: #FFFFFF;
        }
      }
    }
  }

  //style
  .header-box {
    display: inline-block;
    position: absolute;
    width: 26rem;
    top: 1.4rem;
    left: 50%;
    margin-left: -13rem;
    font-size: 1.6rem;
    font-family: 'PingFang Regular';
    font-weight: bold;
    color: #FFFFFF;
    text-align: center;
    >img{
      width: 21.35rem;
      height: 2.4rem;
    }
    >.line {
      width: 6rem;
      height: 0.1rem;
      background: linear-gradient(to right, rgba(3, 252, 255, 0) 0%, rgba(3, 252, 255, 0.5) 50%, rgba(3, 252, 255, 0) 100%);
      position: absolute;
      top: 1.1rem;
      &.left {
        left: -4rem;
      }
      &.right {
        right: -4rem;
      }
    }
    &::before {
      content: '';
      width: 6.1rem;
      height: 2.1rem;
      position: absolute;
      top: 0.1rem;
      left: -4rem;
      background: url('~@/assets/images/statistic/header_left.gif') no-repeat;
      background-size: 100% 100%;
    }
    &::after {
      content: '';
      width: 6.1rem;
      height: 2.1rem;
      position: absolute;
      top: 0.1rem;
      right: -4rem;
      background: url('~@/assets/images/statistic/header_right.gif') no-repeat;
      background-size: 100% 100%;
    }
  }

}
</style>
