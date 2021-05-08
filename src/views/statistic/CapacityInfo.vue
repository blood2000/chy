<template>
  <!-- 运力情况 -->
  <div class="s-container ly-flex-pack-justify">
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">总车辆(万)</p>
        <p class="text">
          <count-to :end-val="dataList.vehicleCount" :decimal-places="2" />
        </p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增车辆</p>
        <p class="text">
          <count-to :end-val="dataList.newVehicleCount" :decimal-places="2" />
          <template v-if="dataList.newVehicleYoyType !== 2">
            <span :class="dataList.newVehicleYoyType===1 ? 'arow_down' : 'arow_up'" />
            <span :class="dataList.newVehicleYoyType===1 ? 'value_down' : 'value_up'">
              <count-to :end-val="dataList.newVehicleYoy" :decimal-places="1" />%
            </span>
          </template>
          <template v-else>
            <span class="arow_line" />
          </template>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">总路线(条)</p>
        <p class="text">
          <count-to :end-val="dataList.lienCount" :decimal-places="2" />
        </p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增路线</p>
        <p class="text">
          <count-to :end-val="dataList.newLineCount" :decimal-places="2" />
          <template v-if="dataList.newLineYoyType !== 2">
            <span :class="dataList.newLineYoyType===1 ? 'arow_down' : 'arow_up'" />
            <span :class="dataList.newLineYoyType===1 ? 'value_down' : 'value_up'">
              <count-to :end-val="dataList.newLineYoy" :decimal-places="1" />%
            </span>
          </template>
          <template v-else>
            <span class="arow_line" />
          </template>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">运输总量(吨)</p>
        <p class="text">
          <count-to :end-val="dataList.transportCount" :decimal-places="2" />
        </p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增吨数</p>
        <p class="text">
          <count-to :end-val="dataList.newTransportCount" :decimal-places="2" />
          <template v-if="dataList.newTransportYoyType !== 2">
            <span :class="dataList.newTransportYoyType===1 ? 'arow_down' : 'arow_up'" />
            <span :class="dataList.newTransportYoyType===1 ? 'value_down' : 'value_up'">
              <count-to :end-val="dataList.newTransportYoy" :decimal-places="1" />%
            </span>
          </template>
          <template v-else>
            <span class="arow_line" />
          </template>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">行驶里程(公里)</p>
        <p class="text">
          <count-to :end-val="dataList.kilometreCount" :decimal-places="2" />
        </p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增里程</p>
        <p class="text">
          <count-to :end-val="dataList.newKilometreCount" :decimal-places="2" />
          <template v-if="dataList.newKilometreYoyType !== 2">
            <span :class="dataList.newKilometreYoyType===1 ? 'arow_down' : 'arow_up'" />
            <span :class="dataList.newKilometreYoyType===1 ? 'value_down' : 'value_up'">
              <count-to :end-val="dataList.newKilometreYoy" :decimal-places="1" />%
            </span>
          </template>
          <template v-else>
            <span class="arow_line" />
          </template>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">行驶时长(月)</p>
        <p class="text">
          <count-to :end-val="dataList.haulageTimeCount" :decimal-places="2" />
        </p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增时长</p>
        <p class="text">
          <count-to :end-val="dataList.newHaulageTimeCount" :decimal-places="2" />
          <template v-if="dataList.newHaulageTimeYoyType !== 2">
            <span :class="dataList.newHaulageTimeYoyType===1 ? 'arow_down' : 'arow_up'" />
            <span :class="dataList.newHaulageTimeYoyType===1 ? 'value_down' : 'value_up'">
              <count-to :end-val="dataList.newHaulageTimeYoy" :decimal-places="1" />%
            </span>
          </template>
          <template v-else>
            <span class="arow_line" />
          </template>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">总网点</p>
        <p class="text">
          <count-to :end-val="dataList.branchCount" :decimal-places="2" />
        </p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增网点</p>
        <p class="text">
          <count-to :end-val="dataList.newBranchCount" :decimal-places="2" />
          <template v-if="dataList.newBranchYoyType !== 2">
            <span :class="dataList.newBranchYoyType===1 ? 'arow_down' : 'arow_up'" />
            <span :class="dataList.newBranchYoyType===1 ? 'value_down' : 'value_up'">
              <count-to :end-val="dataList.newBranchYoy" :decimal-places="1" />%
            </span>
          </template>
          <template v-else>
            <span class="arow_line" />
          </template>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from '@/components/CountTo';
import { getCapacityData } from '@/api/statistic/statistic.js';

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
    &__content{
      width: 100%;
      height: 50%;
      >.label{
        font-size: 0.6rem;
        font-weight: 200;
        color: rgba(213, 234, 255, 1);
        line-height: 1rem;
      }
      >.text{
        font-size: 1.1rem;
        font-weight: normal;
        color: #FFFFFF;
        line-height: 1.3rem;
        font-family: 'PingFang Medium';
        .arow_up{
          display: inline-block;
          width: 0.9rem;
          height: 0.6rem;
          background: url('~@/assets/images/statistic/arow_up.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 0.3rem;
        }
        .arow_down{
          display: inline-block;
          width: 0.9rem;
          height: 0.6rem;
          background: url('~@/assets/images/statistic/arow_down.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 0.3rem;
        }
        .arow_line{
          display: inline-block;
          width: 0.9rem;
          height: 0.02rem;
          background: #00d2ff;
          margin-left: 0.4rem;
          vertical-align: top;
          margin-top: 0.65rem;
        }
        .value_up{
          font-size: 0.6rem;
          vertical-align: top;
          color: rgba(0, 210, 255, 1);
          margin-left: 0.15rem;
        }
        .value_down{
          font-size: 0.6rem;
          vertical-align: top;
          color: rgba(52, 213, 192, 1);
          margin-left: 0.15rem;
        }
      }
    }
  }
}
</style>
