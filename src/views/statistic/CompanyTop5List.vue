<template>
  <!-- 总排名TOP5公司 -->
  <div class="container">
    <span class="container__time">最近30天内</span>
    <span class="container__title">TOP 5 企业</span>
    <ul class="container__list">
      <li v-for="(item, index) in dataList" :key="index" class="container__list__item">
        <div class="container__list__item__title">
          <span :class="index === 0 ? 'first' : ''" class="index">{{ index + 1 }}</span>
          <span class="text">福建省融谷供应链管理有限公司福建省融谷供应链管理有限公司</span>
        </div>
        <div class="container__list__item__content ly-flex-pack-justify">
          <div class="content__box">
            <p class="label">总货单量(万)</p>
            <p class="text">
              16.7
              <span class="arow_down" />
              <span class="value_down">12.6%</span>
            </p>
          </div>
          <div class="content__box">
            <p class="label">总货单量(万)</p>
            <p class="text">
              16.7
              <span class="arow_up" />
              <span class="value_up">12.6%</span>
            </p>
          </div>
          <div class="content__box">
            <p class="label">总货单量(万)</p>
            <p class="text">
              16.7
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
export default {
  data() {
    return {
      dataList: [{}, {}, {}, {}, {}]
    };
  }
};
</script>

<style lang="scss" scoped>
.container{
  height: 100%;
  position: relative;
  &__time{
    position: absolute;
    right: 0;
    top: -1.6rem;
    line-height: 0.8rem;
    font-size: 0.5rem;
    font-family: PingFang SC;
    font-weight: 300;
    color: #96CFD9;
  }
  &__title{
    position: absolute;
    right: 0.7rem;
    top: 0.4rem;
    font-size: 0.6rem;
    font-family: PingFang SC;
    font-weight: bold;
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
          margin: 0 0.4rem 0 0;
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
          width: 15.5rem;
          display: inline-block;
          vertical-align: middle;
          line-height: 1.6rem;
          font-size: 0.8rem;
          font-family: PingFang SC;
          font-weight: 300;
          color: #7CFFF4;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      &__content{
        >.content__box{
          width: 33.33%;
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
            }
            .value_down{
              font-size: 0.6rem;
              vertical-align: top;
              color: rgba(52, 163, 152, 1);
            }
          }
        }
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
</style>
