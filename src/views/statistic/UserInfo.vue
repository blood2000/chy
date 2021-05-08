<template>
  <!-- 用户情况 -->
  <div class="s-container ly-flex-pack-justify">
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">总用户数(万)</p>
        <p class="text"><count-to :end-val="0.211" :decimal-places="3" /></p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增用户</p>
        <p class="text blod">
          <count-to :end-val="0.211" :decimal-places="3" />
          <span class="arow_down" />
          <span class="value_down">12.6%</span>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">总货主数(万)</p>
        <p class="text"><count-to :end-val="0.211" :decimal-places="3" /></p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增货主</p>
        <p class="text blod">
          <count-to :end-val="0.211" :decimal-places="3" />
          <span class="arow_up" />
          <span class="value_up">12.6%</span>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">总调度者(万)</p>
        <p class="text"><count-to :end-val="0.211" :decimal-places="3" /></p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增调度者</p>
        <p class="text blod">
          <count-to :end-val="0.211" :decimal-places="3" />
          <span class="arow_up" />
          <span class="value_up">12.6%</span>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">总司机(万)</p>
        <p class="text"><count-to :end-val="0.211" :decimal-places="3" /></p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增司机</p>
        <p class="text blod">
          <count-to :end-val="0.211" :decimal-places="3" />
          <span class="arow_up" />
          <span class="value_up">12.6%</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from '@/components/CountTo';
export default {
  components: {
    CountTo
  },
  data() {
    return {

    };
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: calc(100% - 2.9rem);
  &__box{
    width: 25%;
    height: 100%;
    padding-left: 1.59rem;
    position: relative;
    font-family: PingFang Regular;
    &::before{
      content: '';
      position: absolute;
      left: 0;
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
        // opacity: 0.7;
      }
      >.text{
        font-size: 1.1rem;
        font-weight: normal;
        color: #FFFFFF;
        line-height: 1.3rem;
        // opacity: 0.9;
        &.blod{
          font-family: 'PingFang Bold';
          opacity: 1;
        }
        .arow_up{
          display: inline-block;
          width: 0.9rem;
          height: 0.6rem;
          background: url('~@/assets/images/statistic/arow_up.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 0.4rem;
        }
        .arow_down{
          display: inline-block;
          width: 0.9rem;
          height: 0.6rem;
          background: url('~@/assets/images/statistic/arow_down.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 0.4rem;
        }
        .value_up{
          font-size: 0.6rem;
          vertical-align: top;
          color: rgba(0, 210, 255, 1);
          margin-left: 0.15rem;
          font-family: 'PingFang Medium';
        }
        .value_down{
          font-size: 0.6rem;
          vertical-align: top;
          color: rgba(52, 213, 192, 1);
          margin-left: 0.15rem;
          font-family: 'PingFang Medium';
        }
      }
    }
  }
}
</style>
