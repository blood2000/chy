<template>
  <!-- 运力情况 -->
  <div class="s-container ly-flex-pack-justify">
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">总车辆(万)</p>
        <p class="text"><count-to :end-val="0.211" :decimal-places="3" /></p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增司机</p>
        <p class="text blod">
          <count-to :end-val="0.211" :decimal-places="3" />
          <span class="arow_down" />
          <span class="value_down">12.6%</span>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">总路线(条)</p>
        <p class="text"><count-to :end-val="0.211" :decimal-places="3" /></p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增路线</p>
        <p class="text blod">
          <count-to :end-val="0.211" :decimal-places="3" />
          <span class="arow_up" />
          <span class="value_up">12.6%</span>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">运输总量(吨)</p>
        <p class="text"><count-to :end-val="0.211" :decimal-places="3" /></p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增吨数</p>
        <p class="text blod">
          <count-to :end-val="0.211" :decimal-places="3" />
          <span class="arow_up" />
          <span class="value_up">12.6%</span>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">行驶里程(公里)</p>
        <p class="text"><count-to :end-val="0.211" :decimal-places="3" /></p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增里程</p>
        <p class="text blod">
          <count-to :end-val="0.211" :decimal-places="3" />
          <span class="arow_up" />
          <span class="value_up">12.6%</span>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">行驶时长(天)</p>
        <p class="text"><count-to :end-val="0.211" :decimal-places="3" /></p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增时长</p>
        <p class="text blod">
          <count-to :end-val="0.211" :decimal-places="3" />
          <span class="arow_up" />
          <span class="value_up">12.6%</span>
        </p>
      </div>
    </div>
    <div class="s-container__box ly-flex-pack-justify ly-flex-v">
      <div class="s-container__box__content">
        <p class="label">总网点</p>
        <p class="text"><count-to :end-val="0.211" :decimal-places="3" /></p>
      </div>
      <div class="s-container__box__content">
        <p class="label">今日新增网点</p>
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
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: calc(100% - 2.9rem);
  &__box{
    width: 16.66%;
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
        color: rgba(213, 234, 255, 1);
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
          font-family: 'PingFang Bold';
          opacity: 1;
        }
        .arow_up{
          display: inline-block;
          width: 0.9rem;
          height: 0.6rem;
          background: url('~@/assets/images/statistic/arow_up.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 0.3rem;
        }
        .arow_down{
          display: inline-block;
          width: 0.9rem;
          height: 0.6rem;
          background: url('~@/assets/images/statistic/arow_down.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 0.3rem;
        }
        .value_up{
          font-size: 0.6rem;
          vertical-align: top;
          color: rgba(0, 210, 255, 1);
          margin-left: 0.15rem;
        }
        .value_down{
          font-size: 0.6rem;
          vertical-align: top;
          color: rgba(52, 213, 192, 1);
          margin-left: 0.15rem;
        }
      }
    }
  }
}
</style>
