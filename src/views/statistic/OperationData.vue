<template>
  <!-- 运营情况 -->
  <div class="s-container">
    <!-- 货单 -->
    <div class="s-container__box top ly-flex-v ly-flex-pack-justify">
      <div class="s-container__box__content">
        <InfoBox
          class="op-content"
          label="货单总数"
          :count="orderVo.orderCount"
        />
      </div>
      <div class="s-container__box__content ly-flex-pack-start">
        <InfoBox
          class="op-content"
          label="今日新增货单"
          :count="orderVo.newOrderCount"
          :has-yoy="true"
          :yoy="orderVo.newOrderYoy"
          :yoy-type="orderVo.newOrderYoyType"
          :yoy-places="1"
          :is-blod="true"
          :is-small="true"
        />
        <!-- card -->
        <div class="card-content ly-flex-pack-justify">
          <div class="card ly-flex-v ly-flex-pack-justify">
            <p class="label">已发布</p>
            <p class="text"><count-to :end-val="orderVo.publishedNum" /></p>
          </div>
        </div>
      </div>
    </div>

    <!-- 运单 -->
    <div class="s-container__box bottom ly-flex-v ly-flex-pack-justify">
      <div class="s-container__box__content ly-flex-pack-start">
        <InfoBox
          class="op-content"
          label="运单总数"
          :count="waillBillVo.wallBillCount"
        />
        <!-- card -->
        <div class="card-content ly-flex-pack-justify">
          <div class="card ly-flex-v ly-flex-pack-justify">
            <p class="label">已接单</p>
            <p class="text"><count-to :end-val="waillBillVo.orderReceiving" /></p>
          </div>
          <div class="card ly-flex-v ly-flex-pack-justify">
            <p class="label">已装货</p>
            <p class="text"><count-to :end-val="waillBillVo.orderLoading" /></p>
          </div>
          <div class="card ly-flex-v ly-flex-pack-justify">
            <p class="label">已卸货</p>
            <p class="text"><count-to :end-val="waillBillVo.orderUnload" /></p>
          </div>
        </div>
      </div>
      <div class="s-container__box__content ly-flex-pack-start">
        <InfoBox
          class="op-content"
          label="今日新增运单"
          :count="waillBillVo.newWallBillCount"
          :has-yoy="true"
          :yoy="waillBillVo.newWallBillYoy"
          :yoy-type="waillBillVo.newWallBillYoyType"
          :yoy-places="1"
          :is-blod="true"
          :is-small="true"
        />
        <!-- card -->
        <div class="card-content ly-flex-pack-justify">
          <div class="card ly-flex-v ly-flex-pack-justify">
            <p class="label">已复核</p>
            <p class="text"><count-to :end-val="waillBillVo.orderReviewer" /></p>
          </div>
          <div class="card ly-flex-v ly-flex-pack-justify">
            <p class="label">已结算</p>
            <p class="text"><count-to :end-val="waillBillVo.orderBalance" /></p>
          </div>
          <div class="card ly-flex-v ly-flex-pack-justify">
            <p class="label">已打款</p>
            <p class="text"><count-to :end-val="waillBillVo.orderRemit" /></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from '@/components/CountTo';
import InfoBox from './components/infoBox';

export default {
  components: {
    CountTo,
    InfoBox
  },
  props: {
    // 货单
    orderVo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 运单
    waillBillVo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: 46%;
  margin-left: 0.2rem;
  &__box{
    position: relative;
    height: 50%;
    &__content{
      >.op-content{
        width: 6.8rem;
        margin-right: 1rem;
      }
      >.card-content{
        width: calc(100% - 7.8rem);
        margin-right: 1.2rem;
        .card{
          height: 2.6rem;
          padding: 0.3rem 0 0.3rem 1rem;
          border-radius: 26px 0px 0px 0px;
          .label{
            font-size: 0.6rem;
            font-family: PingFang Regular;
            font-weight: 300;
            color: #D5EAFF;
          }
          .text{
            font-size: 0.8rem;
            font-family: PingFang Regular;
            font-weight: 400;
            color: #FFFFFF;
          }
        }
      }
    }
    // 货单
    &.top{
      height: calc(50% - 0.5rem);
      padding-bottom: 1rem;
      .s-container__box__content >.card-content .card{
        width: 6.6rem;
        background: linear-gradient(to right, rgba(1, 227, 255, 0.05), rgba(1, 227, 255, 0.01));
      }
    }
    // 运单
    &.bottom{
      height: calc(50% + 0.5rem);
      padding: 1rem 0;
      .s-container__box__content >.card-content .card{
        width: 4.4rem;
        background: linear-gradient(to right, rgba(1, 227, 255, 0.08), rgba(1, 227, 255, 0.015));
      }
    }
    &::after{
      content: '';
      position: absolute;
      bottom: 0;
      left: -0.2rem;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, rgba(76, 203, 219, 0.5), rgba(76, 203, 219, 0));
    }
  }
}
</style>
