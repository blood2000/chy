<template>
  <!-- 监管数据 -->
  <div class="s-container ly-flex-pack-justify">
    <div class="s-container__box">
      <p class="s-container__box__line">
        <label>已上报司机信息:</label>
        <span>
          <count-to :end-val="dataList.reportDriver" />
        </span>
      </p>
      <p class="s-container__box__line">
        <label>已上报车辆信息:</label>
        <span>
          <count-to :end-val="dataList.reportCar" />
        </span>
      </p>
      <p class="s-container__box__line">
        <label>已上报运单信息:</label>
        <span>
          <count-to :end-val="dataList.reportWaybill" />
        </span>
      </p>
      <p class="s-container__box__line">
        <label>已上报轨迹信息:</label>
        <span>
          <count-to :end-val="dataList.reportTrajectory" />
        </span>
      </p>
      <p class="s-container__box__line">
        <label>来自硬件的轨迹信息:</label>
        <span>
          <count-to :end-val="dataList.reportHardwareTrajectory" />
        </span>
      </p>
    </div>
    <div class="s-container__box">
      <p class="s-container__box__line">
        <label>已上报装货信息:</label>
        <span>
          <count-to :end-val="dataList.reportLoadInfo" />
        </span>
      </p>
      <p class="s-container__box__line">
        <label>已上报卸货信息:</label>
        <span>
          <count-to :end-val="dataList.reportLandInfo" />
        </span>
      </p>
      <p class="s-container__box__line">
        <label>已上报资金信息:</label>
        <span>
          <count-to :end-val="dataList.reportAmount" />
        </span>
      </p>
      <p class="s-container__box__line">
        <label>来自APP的轨迹信息:</label>
        <span>
          <count-to :end-val="dataList.reportAppTrajectory" />
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import CountTo from '@/components/CountTo';
import { getRegulatoryData } from '@/api/statistic/statistic.js';

export default {
  components: {
    CountTo
  },
  props: {
    branchCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dataList: {}
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getRegulatoryData(this.branchCode).then(response => {
        this.dataList = response.data || {};
      });
    },
    // 处理实时数据
    setData(val) {
      // console.log('reportVo: ', val);
      const {
        driverReportNum, // 已上报司机信息
        carReportNum, // 已上报车辆信息
        waybillReportNum, // 已上报运单信息
        trackReportNum, //	已上报轨迹信息
        hardwareTrackReportNum, // 已上硬件轨迹信息
        loadReportNum, // 已上报装货信息
        unLoadReportNum, // 已上报卸货信息
        fundReportNum, // 已上报资金信息
        appTrackReportNum // 已上报APP轨迹信息
      } = val;
      if (driverReportNum) {
        this.dataList.reportDriver += driverReportNum;
      }
      if (carReportNum) {
        this.dataList.reportCar += carReportNum;
      }
      if (waybillReportNum) {
        this.dataList.reportWaybill += waybillReportNum;
      }
      if (trackReportNum) {
        this.dataList.reportTrajectory += trackReportNum;
      }
      if (hardwareTrackReportNum) {
        this.dataList.reportHardwareTrajectory += hardwareTrackReportNum;
      }
      if (loadReportNum) {
        this.dataList.reportLoadInfo += loadReportNum;
      }
      if (unLoadReportNum) {
        this.dataList.reportLandInfo += unLoadReportNum;
      }
      if (fundReportNum) {
        this.dataList.reportAmount += fundReportNum;
      }
      if (appTrackReportNum) {
        this.dataList.reportAppTrajectory += appTrackReportNum;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  padding-left: 0.2rem;
  &__box{
    width: 48%;
    height: 100%;
    font-family: PingFang Regular;
    &__line{
      width: 100%;
      line-height: 1.2rem;
      >label{
        font-size: 0.6rem;
        font-weight: 200;
        color: #9CAFD0;
        margin-right: 0.4rem;
      }
      >span{
        font-size: 0.9rem;
        font-weight: 400;
        color: #FFFFFF;
        vertical-align: middle;
      }
    }
  }
}
</style>
