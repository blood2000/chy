<template>
  <!-- 业绩数据 -->
  <div class="s-container ly-flex-pack-justify">
    <div class="s-container__box ly-flex-pack-justify ly-flex-v" style="width: 35%">
      <InfoBox
        label="交易总额"
        unit="万"
        :count="myPerformance.transactionAmount"
        :places="2"
      />
      <InfoBox
        label="今日新增交易"
        unit="万"
        :count="myPerformance.newTransactionAmount"
        :last-count="myPerformance.lastTransactionAmount"
        :places="2"
        :has-yoy="true"
        :yoy.sync="myPerformance.newTransactionYoy"
        :yoy-type.sync="myPerformance.newTransactionYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v" style="width: 35%">
      <InfoBox
        label="开票总额"
        unit="万"
        :count="myPerformance.votesAmount"
        :places="2"
      />
      <InfoBox
        label="今日新增开票"
        unit="万"
        :count="myPerformance.newVotesAmount"
        :last-count="myPerformance.lastVotesAmount"
        :places="2"
        :has-yoy="true"
        :yoy.sync="myPerformance.newVotesYoy"
        :yoy-type.sync="myPerformance.newVotesYoyType"
        :yoy-places="1"
      />
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v" style="width: 30%">
      <InfoBox
        label="运费总额"
        unit="万"
        :count="myPerformance.waybillAmount"
        :places="2"
      />
      <InfoBox
        label="今日新增运费"
        unit="万"
        :count="!isScale ? myPerformance.newTransactionAmount * 0.9 : myPerformance.newWaybillAmount"
        :last-count="myPerformance.lastWaybillAmount"
        :places="2"
        :has-yoy="true"
        :yoy.sync="myPerformance.newWaybillYoy"
        :yoy-type.sync="myPerformance.newWaybillYoyType"
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
    isScale: Boolean
  },
  data() {
    return {
      myPerformance: {}
    };
  },
  watch: {
    performance(val) {
      this.myPerformance = val;
    }
  },
  methods: {
    // 处理实时数据-开票
    setInvoiceData(val) {
      // console.log('invoiceNotice: ', val);
      const { invoiceAmount } = val;
      if (invoiceAmount) {
        this.myPerformance.votesAmount += invoiceAmount;
        this.myPerformance.newVotesAmount += invoiceAmount;
      }
    },
    // 处理实时数据-运单
    setWaybillData(val) {
      const { shipperRealPay, deliveryCashFee } = val;
      // 交易
      if (shipperRealPay) {
        this.myPerformance.newTransactionAmount += shipperRealPay;
        this.myPerformance.transactionAmount += shipperRealPay;
      }
      // 运费
      if (deliveryCashFee) {
        this.myPerformance.newWaybillAmount += deliveryCashFee;
        this.myPerformance.waybillAmount += deliveryCashFee;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
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
      width: 0.05rem;
      background: linear-gradient(rgba(1, 227, 255, 0), rgba(1, 227, 255, 0.22), rgba(1, 227, 255, 0));
    }
  }
}
</style>
