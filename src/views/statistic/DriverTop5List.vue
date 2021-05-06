<template>
  <!-- 总排名TOP5司机 -->
  <div class="s-container">
    <span class="s-container__title">TOP 5 司机</span>
    <ul class="s-container__list">
      <li v-for="(item, index) in dataList" :key="index" class="s-container__list__item">
        <div class="s-container__list__item__title">
          <span :class="index === 0 ? 'first' : ''" class="index">{{ index + 1 }}</span>
          <span class="text">
            吴磊
            <span class="driver">司机</span>
          </span>
        </div>
        <div class="s-container__list__item__content ly-flex-pack-justify">
          <div class="content__box">
            <p class="label">接单次数(万)</p>
            <p class="text">
              <count-to :end-val="25.1" :decimal-places="1" />
              <span class="arow_down" />
              <span class="value_down">12.6%</span>
            </p>
          </div>
          <div class="content__box">
            <p class="label">结算总额(万)</p>
            <p class="text">
              <count-to :end-val="16.8" :decimal-places="1" />
              <span class="arow_up" />
              <span class="value_up">12.6%</span>
            </p>
          </div>
        </div>
      </li>
    </ul>
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
      dataList: [{}, {}, {}, {}, {}]
    };
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
  position: relative;
  &__title{
    position: absolute;
    right: 0.7rem;
    top: 0.4rem;
    font-size: 0.6rem;
    font-family: 'PingFang Bold';
    color: #01E3FF;
  }
  &__list{
    height: 100%;
    &__item{
      height: 20%;
      &__title{
        margin-bottom: 0.1rem;
        .index{
          display: inline-block;
          vertical-align: middle;
          margin: -0.3rem 0.3rem 0 0;
          padding-right: 0.1rem;
          width: 1.4rem;
          height: 1.6rem;
          line-height: 1.6rem;
          text-align: center;
          font-size: 0.7rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          background: url('~@/assets/images/statistic/index_default.png') no-repeat;
          background-size: 100% 100%;
          &.first{
            width: 1.45rem;
            background: url('~@/assets/images/statistic/index_first.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        .text{
          line-height: 1.6rem;
          font-size: 0.8rem;
          font-family: PingFang SC;
          font-weight: 300;
          color: #7CFFF4;
          .driver{
            font-size: 0.65rem;
            font-family: PingFang SC;
            font-weight: 300;
            color: #00D4FF;
            opacity: 0.55;
            margin-left: 0.2rem;
          }
        }
      }
      &__content{
        >.content__box{
          width: 50%;
          >.label{
            font-size: 0.6rem;
            font-family: PingFang SC;
            font-weight: 300;
            color: #D5EAFF;
          }
          >.text{
            font-size: 0.8rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 1.3rem;
            .arow_up{
              display: inline-block;
              width: 0.7rem;
              height: 0.45rem;
              background: url('~@/assets/images/statistic/arow_up_small.png') no-repeat;
              background-size: 100% 100%;
              margin-left: 0.3rem;
            }
            .arow_down{
              display: inline-block;
              width: 0.7rem;
              height: 0.45rem;
              background: url('~@/assets/images/statistic/arow_down_small.png') no-repeat;
              background-size: 100% 100%;
              margin-left: 0.3rem;
            }
            .value_up{
              font-size: 0.6rem;
              vertical-align: top;
              color: rgba(1, 156, 255, 1);
              margin-left: 0.15rem;
            }
            .value_down{
              font-size: 0.6rem;
              vertical-align: top;
              color: rgba(52, 163, 152, 1);
              margin-left: 0.15rem;
            }
          }
        }
      }
    }
  }
}
</style>
