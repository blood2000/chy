<template>
  <!-- 运营情况 -->
  <div class="container">
    <!-- 货单 -->
    <div class="container__box top ly-flex-v ly-flex-pack-justify">
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
        <!-- card -->
        <div class="card-content ly-flex-pack-justify">
          <div class="card ly-flex-v ly-flex-pack-center">
            <p class="label">已发布</p>
            <p class="text">2333</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 运单 -->
    <div class="container__box bottom ly-flex-v ly-flex-pack-justify">
      <div class="container__box__content ly-flex-pack-start">
        <div class="content">
          <p class="label">运单总数(万)</p>
          <p class="text">677</p>
        </div>
        <!-- card -->
        <div class="card-content ly-flex-pack-justify">
          <div class="card ly-flex-v ly-flex-pack-center">
            <p class="label">已接单</p>
            <p class="text">2333</p>
          </div>
          <div class="card ly-flex-v ly-flex-pack-center">
            <p class="label">已装货</p>
            <p class="text">2333</p>
          </div>
          <div class="card ly-flex-v ly-flex-pack-center">
            <p class="label">已卸货</p>
            <p class="text">2333</p>
          </div>
        </div>
      </div>
      <div class="container__box__content ly-flex-pack-start">
        <div class="content">
          <p class="label">今日新增运单</p>
          <p class="text">126</p>
        </div>
        <!-- card -->
        <div class="card-content ly-flex-pack-justify">
          <div class="card ly-flex-v ly-flex-pack-center">
            <p class="label">已复核</p>
            <p class="text">2333</p>
          </div>
          <div class="card ly-flex-v ly-flex-pack-center">
            <p class="label">已结算</p>
            <p class="text">2333</p>
          </div>
          <div class="card ly-flex-v ly-flex-pack-center">
            <p class="label">已打款</p>
            <p class="text">2333</p>
          </div>
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
  height: 46%;
  margin-left: 0.2rem;
  &__box{
    position: relative;
    height: 50%;
    &__content{
      >.content{
        width: 6.8rem;
        margin-right: 1rem;
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
      >.card-content{
        width: calc(100% - 7.8rem);
        margin-right: 1.2rem;
        .card{
          height: 2.6rem;
          padding-left: 1rem;
          border-radius: 26px 0px 0px 0px;
          .label{
            font-size: 0.6rem;
            font-family: PingFang SC;
            font-weight: 300;
            color: #D5EAFF;
          }
          .text{
            font-size: 0.8rem;
            font-family: PingFang SC;
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
      .container__box__content >.card-content .card{
        width: 6.6rem;
        background: linear-gradient(to right, rgba(1, 227, 255, 0.03), rgba(1, 227, 255, 0.01));
      }
    }
    // 运单
    &.bottom{
      height: calc(50% + 0.5rem);
      padding: 1rem 0;
      .container__box__content >.card-content .card{
        width: 4.4rem;
        background: linear-gradient(to right, rgba(1, 227, 255, 0.05), rgba(1, 227, 255, 0.015));
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
