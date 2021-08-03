<template>
  <!-- 用户情况 -->
  <div class="s-container ly-flex-pack-justify" :class="{isSecond: isSecond}">
    <div class="s-container__box ly-flex-pack-start small">
      <div class="s-container__box__info ly-flex-pack-justify ly-flex-v">
        <InfoBox
          label="总用户数"
          :count="dataList.userCount"
          :is-user="true"
        />
        <InfoBox
          label="今日新增用户"
          :count="dataList.newUserCount"
          :last-count="dataList.lastNewUserCount"
          :has-yoy="true"
          :yoy.sync="dataList.newUserYoy"
          :yoy-type.sync="dataList.newUserYoyType"
          :yoy-places="1"
          :is-user="true"
          :is-blod="true"
        />
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-start big">
      <div class="s-container__box__info left ly-flex-pack-justify ly-flex-v">
        <InfoBox
          label="总货主数"
          :count="dataList.shipmentUserCount"
          :is-user="true"
        />
        <InfoBox
          label="今日新增货主"
          :count="dataList.newShipmentCount"
          :last-count="dataList.lastNewShipmentCount"
          :has-yoy="true"
          :yoy.sync="dataList.newShipmentYoy"
          :yoy-type.sync="dataList.newShipmentYoyType"
          :yoy-places="1"
          :is-user="true"
          :is-blod="true"
        />
      </div>
      <div v-if="isSecond" class="s-container__box__info right ly-flex-pack-justify ly-flex-v">
        <InfoBox
          label="月活跃数"
          :count="dataList.activeShipment"
          :is-user="true"
        />
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-start big">
      <div class="s-container__box__info left ly-flex-pack-justify ly-flex-v">
        <InfoBox
          label="总调度者"
          :count="dataList.teamUserCount"
          :is-user="true"
        />
        <InfoBox
          label="今日新增调度者"
          :count="dataList.newTeamCount"
          :last-count="dataList.lastNewTeamCount"
          :has-yoy="true"
          :yoy.sync="dataList.newTeamYoy"
          :yoy-type.sync="dataList.newTeamYoyType"
          :yoy-places="1"
          :is-user="true"
          :is-blod="true"
        />
      </div>
      <div v-if="isSecond" class="s-container__box__info right ly-flex-pack-justify ly-flex-v">
        <InfoBox
          label="月活跃数"
          :count="dataList.activeTeam"
          :is-user="true"
        />
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-start big last">
      <div class="s-container__box__info left ly-flex-pack-justify ly-flex-v">
        <InfoBox
          label="总司机"
          :count="dataList.driverUserCount"
          :is-user="true"
        />
        <InfoBox
          label="今日新增司机"
          :count="dataList.newDriverCount"
          :last-count="dataList.lastNewDriverCount"
          :has-yoy="true"
          :yoy.sync="dataList.newDriverYoy"
          :yoy-type.sync="dataList.newDriverYoyType"
          :yoy-places="1"
          :is-user="true"
          :is-blod="true"
        />
      </div>
      <div v-if="isSecond" class="s-container__box__info right ly-flex-pack-justify ly-flex-v">
        <InfoBox
          label="月活跃数"
          :count="dataList.activeDriver"
          :is-user="true"
        />
      </div>
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
    },
    isSecond: {
      type: Boolean,
      default: false
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
    },
    // 处理实时数据
    setData(val) {
      // console.log('userNotice-user: ', val);
      if (val.user) {
        const { shipmentNum, teamNum, driverNum } = val.user;
        if (shipmentNum) {
          this.dataList.shipmentUserCount += shipmentNum;
          this.dataList.newShipmentCount += shipmentNum;
          this.dataList.userCount += shipmentNum;
          this.dataList.newUserCount += shipmentNum;
        }
        if (teamNum) {
          this.dataList.teamUserCount += teamNum;
          this.dataList.newTeamCount += teamNum;
          this.dataList.userCount += teamNum;
          this.dataList.newUserCount += teamNum;
        }
        if (driverNum) {
          this.dataList.driverUserCount += driverNum;
          this.dataList.newDriverCount += driverNum;
          this.dataList.userCount += driverNum;
          this.dataList.newUserCount += driverNum;
        }
      }
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
      width: 0.05rem;
      background: linear-gradient(rgba(1, 227, 255, 0), rgba(1, 227, 255, 0.22), rgba(1, 227, 255, 0));
    }
    &__info{
      height: 100%;
    }
  }
  &.isSecond{
    >.s-container__box{
      padding-left: 0;
      padding-right: 1.59rem;
      &::before{
        left: -1.59rem;
      }
      &:first-child::before{
        opacity: 0;
      }
      &.small{
        width: 20%;
      }
      &.big{
        width: 27%;
        >.s-container__box__info{
          &.left{
            width: 60%;
          }
          &.right{
            width: 40%;
          }
        }
      }
      &.last{
        width: 26%;
      }
    }
  }
}
</style>
