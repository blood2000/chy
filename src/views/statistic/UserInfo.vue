<template>
  <!-- 用户情况 -->
  <div class="s-container ly-flex-pack-justify">
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="总用户数"
        unit="万"
        :count="dataList.userCount"
        :places="2"
        :is-user="true"
      />
      <InfoBox
        label="今日新增用户"
        :count="dataList.newUserCount"
        :places="2"
        :has-yoy="true"
        :yoy="dataList.newUserYoy"
        :yoy-type="dataList.newUserYoyType"
        :yoy-places="1"
        :is-user="true"
        :is-blod="true"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="总货主数"
        unit="万"
        :count="dataList.shipmentUserCount"
        :places="2"
        :is-user="true"
      />
      <InfoBox
        label="今日新增货主"
        :count="dataList.newShipmentCount"
        :places="2"
        :has-yoy="true"
        :yoy="dataList.newShipmentYoy"
        :yoy-type="dataList.newShipmentYoyType"
        :yoy-places="1"
        :is-user="true"
        :is-blod="true"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="总调度者"
        unit="万"
        :count="dataList.teamUserCount"
        :places="2"
        :is-user="true"
      />
      <InfoBox
        label="今日新增调度者"
        :count="dataList.newTeamCount"
        :places="2"
        :has-yoy="true"
        :yoy="dataList.newTeamYoy"
        :yoy-type="dataList.newTeamYoyType"
        :yoy-places="1"
        :is-user="true"
        :is-blod="true"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="总司机"
        unit="万"
        :count="dataList.driverUserCount"
        :places="2"
        :is-user="true"
      />
      <InfoBox
        label="今日新增司机"
        :count="dataList.newDriverCount"
        :places="2"
        :has-yoy="true"
        :yoy="dataList.newDriverYoy"
        :yoy-type="dataList.newDriverYoyType"
        :yoy-places="1"
        :is-user="true"
        :is-blod="true"
      />
    </div>
  </div>
</template>

<script>
import InfoBox from './components/infoBox';
import { getUserData } from '@/api/statistic/statistic.js';

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
      getUserData(this.branchCode).then(response => {
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
    width: 25%;
    height: 100%;
    padding-left: 1.59rem;
    position: relative;
    font-family: PingFang Regular;
    &::before{
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: linear-gradient(rgba(1, 227, 255, 0), rgba(1, 227, 255, 0.22), rgba(1, 227, 255, 0));
    }
  }
}
</style>
