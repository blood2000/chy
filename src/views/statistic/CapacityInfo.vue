<template>
  <!-- 运力情况 -->
  <div class="s-container ly-flex-pack-justify">
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="总车辆"
        unit="万"
        :count="dataList.vehicleCount"
        :places="2"
      />
      <InfoBox
        label="今日新增车辆"
        :count="dataList.newVehicleCount"
        :places="2"
        :has-yoy="true"
        :yoy="dataList.newVehicleYoy"
        :yoy-type="dataList.newVehicleYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="总路线"
        unit="条"
        :count="dataList.lienCount"
        :places="2"
      />
      <InfoBox
        label="今日新增路线"
        :count="dataList.newLineCount"
        :places="2"
        :has-yoy="true"
        :yoy="dataList.newLineYoy"
        :yoy-type="dataList.newLineYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="运输总量"
        unit="吨"
        :count="dataList.transportCount"
        :places="2"
      />
      <InfoBox
        label="今日新增吨数"
        :count="dataList.newTransportCount"
        :places="2"
        :has-yoy="true"
        :yoy="dataList.newTransportYoy"
        :yoy-type="dataList.newTransportYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="行驶里程"
        unit="公里"
        :count="dataList.kilometreCount"
        :places="2"
      />
      <InfoBox
        label="今日新增里程"
        :count="dataList.newKilometreCount"
        :places="2"
        :has-yoy="true"
        :yoy="dataList.newKilometreYoy"
        :yoy-type="dataList.newKilometreYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="行驶时长"
        unit="月"
        :count="dataList.haulageTimeCount"
        :places="2"
      />
      <InfoBox
        label="今日新增时长"
        :count="dataList.newHaulageTimeCount"
        :places="2"
        :has-yoy="true"
        :yoy="dataList.newHaulageTimeYoy"
        :yoy-type="dataList.newHaulageTimeYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="总网点"
        :count="dataList.branchCount"
        :places="2"
      />
      <InfoBox
        label="今日新增网点"
        :count="dataList.newBranchCount"
        :places="2"
        :has-yoy="true"
        :yoy="dataList.newBranchYoy"
        :yoy-type="dataList.newBranchYoyType"
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
      getCapacityData(this.branchCode).then(response => {
        this.dataList = response.data || {};
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: calc(100% - 2.9rem);
  &__box{
    width: 16.66%;
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
      width: 1px;
      background: linear-gradient(rgba(1, 227, 255, 0), rgba(1, 227, 255, 0.22), rgba(1, 227, 255, 0));
    }
  }
}
</style>
