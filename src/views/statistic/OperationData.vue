<template>
  <!-- 运营情况 -->
  <div class="container">
    <!-- 货单 -->
    <div class="container__box">
      <div class="container__box__content">
        <div class="content">
          <p class="label">货单总数(万)</p>
          <p class="text">677</p>
        </div>
      </div>
      <div class="container__box__content ly-flex-pack-start">
        <div class="content">
          <p class="label">今日新增货单</p>
          <p class="text">126</p>
        </div>
        <div class="content">
          <p class="label">XXX</p>
          <p class="text">100</p>
        </div>
      </div>
    </div>
    <!-- 运单 -->
    <div class="container__box" style="margin-top: 1rem">
      <div class="container__box__content">
        <div class="content">
          <p class="label">运单总数(万)</p>
          <p class="text">677</p>
        </div>
      </div>
      <div class="container__box__content ly-flex-pack-start">
        <div class="content">
          <p class="label">今日新增运单</p>
          <p class="text">126</p>
        </div>
        <div class="content">
          <p class="label">XXX</p>
          <p class="text">100</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
.container{
  height: 43%;
  margin-left: 0.2rem;
  &__box{
    position: relative;
    height: calc(50% - 0.5rem);
    &__content{
      margin-bottom: 1rem;
      >.content{
        width: 6.9rem;
        .label{
          font-size: 0.6rem;
          font-family: PingFang SC;
          font-weight: 200;
          color: #D5EAFF;
          margin-bottom: 0.1rem;
        }
        .text{
          font-size: 1.1rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
        }
      }
    }
    &::after{
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, rgba(76, 203, 219, 0.5), rgba(76, 203, 219, 0));
    }
  }
}
</style>
