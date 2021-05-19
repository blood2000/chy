<template>
  <!-- TOP10全国十大公司 -->
  <div class="s-container">
    <h5 class="s-container__title">TOP 10全国十大公司</h5>
    <p class="s-container__legend">交易额(万)</p>
    <div class="s-container__list">
      <ul class="ly-flex-v ly-flex-pack-justify">
        <li v-for="(item, index) in companyRankingList" :key="item.compayCode + index" class="s-container__list__item ly-flex-pack-start ly-flex-align-center">
          <div class="index">{{ index + 1 }}</div>
          <div class="label">{{ item.companyName }}</div>
          <div class="line">
            <div v-if="item.transactionAmount / maxCount * 100 > 1" class="value" :style="`width: ${item.transactionAmount / maxCount * 100}%;`" />
            <!-- 避免百分比太小不显示 -->
            <div v-else class="value" :style="`width: 1%;`" />
          </div>
          <div class="text"><count-to :end-val="item.transactionAmount / 10000" :decimal-places="2" /></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import CountTo from '@/components/CountTo';

export default {
  components: {
    CountTo
  },
  props: {
    companyRankingList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      maxCount: 1
    };
  },
  methods: {
    // 模拟进度条
    createProgress() {
      if (this.companyRankingList && this.companyRankingList.length > 0) {
        this.maxCount = this.companyRankingList[0].transactionAmount;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  height: 100%;
  &__title{
    height: 1.2rem;
    font-size: 0.8rem;
    font-weight: 500;
    color: #FFFFFF;
    font-family: 'PingFang Medium';
  }
  &__legend{
    height: 1.2rem;
    text-align: right;
    font-size: 0.6rem;
    font-family: 'PingFang Medium';
    font-weight: 500;
    color: #CDEDFF;
  }
  &__list{
    height: calc(100% - 2.8rem);
    >ul{
      height: 100%;
      .s-container__list__item{
        >.index{
          width: 0.9rem;
          margin-right: 0.4rem;
          height: 0.9rem;
          line-height: 0.9rem;
          background: linear-gradient(144deg, #1F91FF, #A965FD);
          border-radius: 50%;
          font-size: 0.6rem;
          font-family: 'PingFang Medium';
          font-weight: 500;
          color: #FFFFFF;
          text-align: center;
        }
        >.label{
          width: 7.4rem;
          margin-right: 0.4rem;
          font-size: 0.6rem;
          font-family: PingFang Regular;
          font-weight: 500;
          color: #CDEDFF;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        >.line{
          width: 11rem;
          height: 0.4rem;
          .value{
            width: 0%;
            height: 100%;
            background: linear-gradient(93deg, #9C4DDC, #3397F4);
            border-radius: 0px 4px 4px 0px;
            transition: width 0.5s;
          }
        }
        >.text{
          flex: 1;
          text-align: right;
          font-size: 0.7rem;
          font-family: 'PingFang Medium';
          font-weight: 500;
          color: #E1F3FF;
        }
      }
    }
  }
}
</style>
