<template>
  <!-- 业绩数据 -->
  <div class="container ly-flex-pack-justify">
    <div class="container__box ly-flex-pack-justify ly-flex-v">
      <div class="container__box__content">
        <p class="label">交易总额(亿)</p>
        <p class="text">0.211</p>
      </div>
      <div class="container__box__content">
        <p class="label">今日新增交易</p>
        <p class="text blod">
          0.211
          <img src="@/assets/images/statistic/arow_up.png">
          <span>12.6%</span>
        </p>
      </div>
    </div>
    <div class="container__box ly-flex-pack-justify ly-flex-v">
      <div class="container__box__content">
        <p class="label">交易总额(亿)</p>
        <p class="text">0.211</p>
      </div>
      <div class="container__box__content">
        <p class="label">今日新增交易</p>
        <p class="text blod">
          0.211
          <img src="@/assets/images/statistic/arow_up.png">
          <span>12.6%</span>
        </p>
      </div>
    </div>
    <div class="container__box ly-flex-pack-justify ly-flex-v">
      <div class="container__box__content">
        <p class="label">运输总额(亿)</p>
        <p class="text">0.211</p>
      </div>
      <div class="container__box__content">
        <p class="label">今日新增运费</p>
        <p class="text blod">
          0.211
          <img src="@/assets/images/statistic/arow_up.png">
          <span>12.6%</span>
        </p>
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
  height: 26.5%;
  &__box{
    width: 33.33%;
    height: 100%;
    position: relative;
    padding-left: 0.2rem;
    &:not(:last-child)::before{
      content: '';
      position: absolute;
      right: 1.59rem;
      top: 0;
      bottom: 0;
      width: 1px;
      background: linear-gradient(rgba(1, 227, 255, 0), rgba(1, 227, 255, 0.22), rgba(1, 227, 255, 0));
    }
    &__content{
      width: 100%;
      height: 50%;
      >.label{
        font-size: 0.6rem;
        font-weight: 200;
        color: #9CAFD0;
        line-height: 1rem;
        opacity: 0.7;
      }
      >.text{
        font-size: 1.1rem;
        font-weight: normal;
        color: #FFFFFF;
        line-height: 1.3rem;
        opacity: 0.9;
        &.blod{
          font-weight: 700;
          opacity: 1;
        }
        >img{
          width: 0.9rem;
          height: 0.6rem;
        }
        >span{
          font-size: 0.6rem;
          color: rgba(0, 210, 255, 1);
          vertical-align: top;
        }
      }
    }
  }
}
</style>
