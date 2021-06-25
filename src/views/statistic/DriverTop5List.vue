<template>
  <!-- 总排名TOP5司机 -->
  <div class="s-container">
    <span v-if="showTop" class="s-container__title">TOP 5 司机</span>
    <ul class="s-container__list">
      <li v-for="(item, index) in driverRankData" :key="item.driverName + index" class="s-container__list__item">
        <div class="s-container__list__item__title">
          <span :class="index === 0 ? 'first' : ''" class="index">{{ index + 1 }}</span>
          <span class="text">
            {{ item.driverName }}
            <span class="driver">司机</span>
          </span>
        </div>
        <div class="s-container__list__item__content ly-flex-pack-justify">
          <InfoBox
            label="接单次数"
            :count="item.waybillCount"
            :has-yoy="true"
            :yoy="item.waybillCountPercentage"
            :yoy-type="item.waybillCountPercentageStatus"
            :yoy-places="1"
            :is-small="true"
            :is-small-size="true"
          />
          <InfoBox
            style="padding-left: 2rem"
            label="实收总额"
            unit="万"
            :count="item.amount"
            :places="2"
            :has-yoy="true"
            :yoy="item.amountPercentage"
            :yoy-type="item.amountPercentageStatus"
            :yoy-places="1"
            :is-small="true"
            :is-small-size="true"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import InfoBox from './components/infoBox';
import { getCarrierRankingV2 } from '@/api/statistic/statistic.js';

export default {
  components: {
    InfoBox
  },
  props: {
    showTop: {
      type: Boolean,
      default: true
    },
    timeKey: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      driverRankData: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getCarrierRankingV2(this.timeKey).then(response => {
        this.driverRankData = response.data || [];
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
  position: relative;
  &__title{
    position: absolute;
    right: 0.7rem;
    top: 0.4rem;
    font-size: 0.6rem;
    font-family: 'PingFang Bold';
    color: #01E3FF;
  }
  &__list{
    height: 100%;
    &__item{
      height: 20%;
      &__title{
        margin-bottom: 0.1rem;
        .index{
          display: inline-block;
          vertical-align: middle;
          margin: -0.3rem 0.3rem 0 0;
          padding-right: 0.1rem;
          width: 1.4rem;
          height: 1.6rem;
          line-height: 1.6rem;
          text-align: center;
          font-size: 0.7rem;
          font-family: PingFang Medium;
          font-weight: 500;
          color: #FFFFFF;
          background: url('~@/assets/images/statistic/index_default.png') no-repeat;
          background-size: 100% 100%;
          &.first{
            width: 1.45rem;
            background: url('~@/assets/images/statistic/index_first.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        .text{
          line-height: 1.6rem;
          font-size: 0.8rem;
          font-family: PingFang Regular;
          font-weight: 300;
          color: #00E4FF;
          .driver{
            font-size: 0.65rem;
            font-family: PingFang Regular;
            font-weight: 300;
            color: #00D4FF;
            opacity: 0.8;
            vertical-align: baseline;
          }
        }
      }
    }
  }
}
</style>
