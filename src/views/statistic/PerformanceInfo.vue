<template>
  <!-- 业绩数据 -->
  <div class="s-container ly-flex-pack-justify">
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="交易总额"
        unit="万"
        :count="performance.transactionAmount"
        :places="2"
      />
      <InfoBox
        label="今日新增交易"
        unit="万"
        :count="performance.newTransactionAmount"
        :last-count="performance.lastTransactionAmount"
        :places="2"
        :has-yoy="true"
        :yoy.sync="performance.newTransactionYoy"
        :yoy-type.sync="performance.newTransactionYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="开票总额"
        unit="万"
        :count="performance.votesAmount"
        :places="2"
      />
      <InfoBox
        label="今日新增开票"
        unit="万"
        :count="performance.newVotesAmount"
        :last-count="performance.lastVotesAmount"
        :places="2"
        :has-yoy="true"
        :yoy.sync="performance.newVotesYoy"
        :yoy-type.sync="performance.newVotesYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <InfoBox
        label="运费总额"
        unit="万"
        :count="performance.waybillAmount"
        :places="2"
      />
      <InfoBox
        label="今日新增运费"
        unit="万"
        :count="performance.newWaybillAmount"
        :last-count="performance.lastWaybillAmount"
        :places="2"
        :has-yoy="true"
        :yoy.sync="performance.newWaybillYoy"
        :yoy-type.sync="performance.newWaybillYoyType"
        :yoy-places="1"
      />
    </div>
  </div>
</template>

<script>
import InfoBox from './components/infoBox';

export default {
  components: {
    InfoBox
  },
  props: {
    performance: {
      type: Object,
      default: () => {
        return {};
      }
    },
    invoiceNotice: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    invoiceNotice: {
      handler(val) {
        console.log('invoiceNotice: ', val);
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: 26.5%;
  &__box{
    width: 33.33%;
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
