<template>
  <!-- 总排名TOP5司机 -->
  <div class="s-container">
    <span class="s-container__title">TOP 5 司机</span>
    <ul class="s-container__list">
      <li v-for="(item, index) in driverRankData" :key="item.driverCode + index" class="s-container__list__item">
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
            :count="item.orderCount"
            :has-yoy="true"
            :yoy="item.orderCountYoy"
            :yoy-type="item.orderCountYoyType"
            :yoy-places="1"
            :is-small="true"
            :is-small-size="true"
          />
          <InfoBox
            label="结算总额"
            unit="万"
            :count="item.amount"
            :places="2"
            :has-yoy="true"
            :yoy="item.amountYoy"
            :yoy-type="item.amountYoyType"
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

export default {
  components: {
    InfoBox
  },
  props: {
    driverRankData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {

    };
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
