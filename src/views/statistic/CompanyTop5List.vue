<template>
  <!-- 总排名TOP5公司 -->
  <div class="s-container">
    <span class="s-container__title">TOP 5 企业</span>
    <ul class="s-container__list">
      <li v-for="(item, index) in companyRankData" :key="item.orgCode + index" class="s-container__list__item">
        <div class="s-container__list__item__title">
          <span :class="index === 0 ? 'first' : ''" class="index">{{ index + 1 }}</span>
          <span class="text">{{ item.orgName }}</span>
        </div>
        <div class="s-container__list__item__content ly-flex-pack-justify">
          <InfoBox
            label="总货单量"
            :count="item.orderCount"
            :has-yoy="true"
            :yoy="item.orderCountYoy"
            :yoy-type="item.orderCountYoyType"
            :yoy-places="1"
            :is-small="true"
            :is-small-size="true"
          />
          <InfoBox
            label="总运单量"
            :count="item.waybillCount"
            :has-yoy="true"
            :yoy="item.waybillCountYoy"
            :yoy-type="item.waybillCountYoyType"
            :yoy-places="1"
            :is-small="true"
            :is-small-size="true"
          />
          <InfoBox
            label="总运输费"
            unit="万"
            :count="item.freightFee"
            :places="2"
            :has-yoy="true"
            :yoy="item.freightFeeYoy"
            :yoy-type="item.freightFeeYoyType"
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
    companyRankData: {
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
          margin: 0 0.4rem 0 0;
          padding-right: 0.1rem;
          width: 1.4rem;
          height: 1.6rem;
          line-height: 1.6rem;
          text-align: center;
          font-size: 0.7rem;
          font-family: PingFang Regular;
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
          width: 15.5rem;
          display: inline-block;
          vertical-align: middle;
          line-height: 1.6rem;
          font-size: 0.8rem;
          font-family: PingFang Regular;
          font-weight: 300;
          color: #7CFFF4;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  &::after{
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 0.05rem;
    background: linear-gradient(to right, rgba(76, 203, 219, 0.5), rgba(76, 203, 219, 0));
  }
}
</style>
