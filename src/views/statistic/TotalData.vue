<template>
  <div class="s-container ly-flex-pack-center">
    <div class="s-container__box">
      <div class="s-container__box__content top ly-flex-pack-center">
        <p>货单总数</p>
        <p>运单总数</p>
      </div>
      <div class="s-container__box__content bottom ly-flex-pack-center">
        <p><count-to :end-val="dataList.shipmentCount" /></p>
        <p><count-to :end-val="dataList.waybillCount" /></p>
      </div>
      <Time class="s-timer" @getTimeType="getData" />
    </div>
  </div>
</template>

<script>
import CountTo from '@/components/CountTo';
import Time from './components/time';
import { getShipmentWaybillCount } from '@/api/statistic/statistic';
export default {
  components: {
    CountTo,
    Time
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
  methods: {
    getData(timeType) {
      getShipmentWaybillCount(this.branchCode, timeType).then(response => {
        this.dataList = response.data || {};
        if (response.data.partitionListVo && response.data.partitionListVo.length > 0) {
          this.$emit('getPartitionListVo', response.data.partitionListVo);
        }
      });
    },
    // 处理实时数据-货单
    setOrderData(val) {
      // console.log('orderNotice-total: ', val);
      const { orderInfoNumber } = val;
      // 货单
      if (orderInfoNumber) {
        this.dataList.shipmentCount += orderInfoNumber;
      }
    },
    // 处理实时数据-运单
    setWaybillData(val) {
      // console.log('waybillNotice-total: ', val);
      const { newNum } = val;
      // 运单
      if (newNum) {
        this.dataList.waybillCount += newNum;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: 4.8rem;
  position: relative;
  &__box{
    width: 26rem;
    height: 100%;
    position: relative;
    &__content{
      text-align: center;
      padding-right: 6rem;
      >p{
        width: 9rem;
        text-align: center;
      }
      &.top{
        height: 1.8rem;
        line-height: 1.8rem;
        background: rgba(3, 252, 255, 0.05);
        border-left: 0.1rem solid rgba(3, 252, 255, 0.5);
        border-right: 0.1rem solid rgba(3, 252, 255, 0.5);
        >p{
          font-size: 0.9rem;
          font-family: 'PingFang Medium';
          font-weight: 500;
          color: #FFFFFF;
        }
      }
      &.bottom{
        height: 3rem;
        line-height: 3rem;
        background: rgba(0, 45, 93, 0.4);
        >p{
          font-size: 1.6rem;
          font-family: 'PingFang Medium';
          font-weight: bold;
          color: #01E3FF;
        }
      }
    }
    // &::after{
    //   content: '';
    //   position: absolute;
    //   bottom: 0.4rem;
    //   right: 0.8rem;
    //   width: 2.55rem;
    //   height: 0.15rem;
    //   background: url('~@/assets/images/statistic/card_after.png') no-repeat;
    //   background-size: 100% 100%;
    // }
    >.s-timer{
      position: absolute;
      top: 0;
      right: 1rem;
    }
  }
}
</style>
