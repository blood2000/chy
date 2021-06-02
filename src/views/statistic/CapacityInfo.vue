<template>
  <!-- 运力情况 -->
  <div class="s-container ly-flex-pack-justify">
    <div class="s-container__box ly-flex-pack-justify ly-flex-v" style="width: 16%">
      <InfoBox
        label="总车辆"
        :count="dataList.vehicleCount"
      />
      <InfoBox
        label="今日新增车辆"
        :count="dataList.newVehicleCount"
        :last-count="dataList.lastNewVehicleCount"
        :has-yoy="true"
        :yoy.sync="dataList.newVehicleYoy"
        :yoy-type.sync="dataList.newVehicleYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v" style="width: 14%">
      <InfoBox
        label="总路线"
        :count="dataList.lienCount"
      />
      <InfoBox
        label="今日新增路线"
        :count="!isScale ? 9 : dataList.newLineCount"
        :last-count="dataList.lastNewLineCount"
        :has-yoy="true"
        :yoy.sync="dataList.newLineYoy"
        :yoy-type.sync="dataList.newLineYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v" style="width: 14%">
      <InfoBox
        label="总网点"
        :count="!isScale ? 983: dataList.branchCount"
      />
      <InfoBox
        label="今日新增网点"
        :count="!isScale ? 23 : dataList.newBranchCount"
        :last-count="dataList.lastNewBranchCount"
        :has-yoy="true"
        :yoy.sync="dataList.newBranchYoy"
        :yoy-type.sync="dataList.newBranchYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v" style="width: 20%">
      <InfoBox
        label="运输总量"
        unit="吨"
        :count="dataList.transportCount"
        :places="2"
      />
      <InfoBox
        label="今日新增吨数"
        :count="dataList.newTransportCount"
        :last-count="dataList.lastNewTransportCount"
        :places="2"
        :has-yoy="true"
        :yoy.sync="dataList.newTransportYoy"
        :yoy-type.sync="dataList.newTransportYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v" style="width: 24%">
      <InfoBox
        label="行驶里程"
        unit="公里"
        :count="dataList.kilometreCount"
        :places="2"
      />
      <InfoBox
        label="今日新增里程"
        :count="dataList.newKilometreCount"
        :last-count="dataList.lastNewKilometreCount"
        :places="2"
        :has-yoy="true"
        :yoy.sync="dataList.newKilometreYoy"
        :yoy-type.sync="dataList.newKilometreYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v" style="width: 15%">
      <InfoBox
        label="行驶时长"
        unit="月"
        :count="dataList.haulageTimeCount"
        :places="2"
      />
      <InfoBox
        label="今日新增时长"
        unit="时"
        :count="dataList.newHaulageTimeCount"
        :last-count="dataList.lastNewHaulageTimeCount"
        :places="2"
        :has-yoy="true"
        :yoy.sync="dataList.newHaulageTimeYoy"
        :yoy-type.sync="dataList.newHaulageTimeYoyType"
        :yoy-places="1"
      />
    </div>
  </div>
</template>

<script>
import InfoBox from './components/infoBox';
import { getCapacityData } from '@/api/statistic/statistic.js';

export default {
  components: {
    InfoBox
  },
  props: {
    branchCode: {
      type: String,
      default: null
    },
    isScale: Boolean
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
      getCapacityData(this.branchCode).then(response => {
        this.dataList = response.data || {};
      });
    },
    // 处理实时数据-车辆
    setVehicleData(val) {
      // console.log('userNotice-car: ', val);
      if (val.car) {
        const { carNum } = val.car;
        if (carNum) {
          this.dataList.vehicleCount += carNum;
          this.dataList.newVehicleCount += carNum;
        }
      }
    },
    // 处理实时数据-路线,网点
    setOrderData(val) {
      // console.log('orderNotice-capacity: ', val);
      const { newLineNum, newPointNum } = val;
      if (newLineNum) {
        if (!this.isScale) return;
        this.dataList.newLineCount += newLineNum;
        this.dataList.lienCount += newLineNum;
      }
      if (newPointNum) {
        this.dataList.newBranchCount += newPointNum;
        this.dataList.branchCount += newPointNum;
      }
    },
    // 处理实时数据-吨数,里程,时长
    setWayBillData(val) {
      const { tunnage, mileage, hour } = val;
      if (tunnage) {
        this.dataList.newTransportCount += tunnage;
        this.dataList.transportCount += tunnage;
      }
      if (mileage) {
        this.dataList.newKilometreCount += mileage;
        this.dataList.kilometreCount += mileage;
      }
      if (hour) {
        this.dataList.newHaulageTimeCount += hour;
        // 单位: 时 => 月
        const changeHour = hour / 24 / 30;
        this.dataList.haulageTimeCount += changeHour;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: calc(100% - 2.9rem);
  &__box{
    height: 100%;
    position: relative;
    padding-left: 0.2rem;
    font-family: PingFang Regular;
    &:not(:last-child)::before{
      content: '';
      position: absolute;
      right: 1.59rem;
      top: 0;
      bottom: 0;
      width: 0.05rem;
      background: linear-gradient(rgba(1, 227, 255, 0), rgba(1, 227, 255, 0.22), rgba(1, 227, 255, 0));
    }
  }
}
</style>
