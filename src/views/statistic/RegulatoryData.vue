<template>
  <!-- 监管数据 -->
  <div class="container ly-flex-pack-justify">
    <div class="container__box">
      <p class="container__box__line">
        <label>已上报司机信息:</label>
        <span>1515</span>
      </p>
      <p class="container__box__line">
        <label>已上报车辆信息:</label>
        <span>1515</span>
      </p>
      <p class="container__box__line">
        <label>已上报运单信息:</label>
        <span>1515</span>
      </p>
      <p class="container__box__line">
        <label>已上报轨迹信息:</label>
        <span>1515</span>
      </p>
      <p class="container__box__line">
        <label>来自硬件的轨迹信息:</label>
        <span>1515</span>
      </p>
    </div>
    <div class="container__box">
      <p class="container__box__line">
        <label>已上报装货信息:</label>
        <span>1515</span>
      </p>
      <p class="container__box__line">
        <label>已上报卸货信息:</label>
        <span>1515</span>
      </p>
      <p class="container__box__line">
        <label>已上报资金信息:</label>
        <span>1515</span>
      </p>
      <p class="container__box__line">
        <label>来自APP的轨迹信息:</label>
        <span>1515</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.container{
  padding-left: 0.2rem;
  &__box{
    width: 48%;
    height: 100%;
    &__line{
      width: 100%;
      line-height: 1.2rem;
      >label{
        font-size: 0.6rem;
        font-weight: 200;
        color: #9CAFD0;
        margin-right: 0.4rem;
      }
      >span{
        font-size: 0.9rem;
        font-weight: 400;
        color: #FFFFFF;
      }
    }
  }
}
</style>
