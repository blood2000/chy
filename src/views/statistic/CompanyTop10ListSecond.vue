<template>
  <!-- TOP10团队排名 -->
  <div class="s-container">
    <h5 class="s-container__title">{{ `TOP 10${title}团队排名` }}</h5>
    <ul class="s-container__list">
      <li v-for="(item, index) in dataList" :key="item.compayCode + index" class="s-container__list__item">
        <div class="s-container__list__item__title">
          <span :class="index === 0 ? 'first' : ''" class="index">{{ index + 1 }}</span>
          <span class="text">
            {{ item.companyName }}
          </span>
        </div>
        <div class="s-container__list__item__content ly-flex-pack-justify">
          <InfoBox
            label="货主数"
            :count="item.transactionAmount"
            :is-small="true"
            :is-small-size="true"
          />
          <InfoBox
            label="运单量"
            :count="item.transactionAmount"
            :is-small="true"
            :is-small-size="true"
            :unit="'万'"
          />
          <InfoBox
            label="运费额"
            :count="item.transactionAmount"
            :is-small="true"
            :is-small-size="true"
            :unit="'万'"
          />
          <InfoBox
            label="开票额"
            :count="item.transactionAmount"
            :is-small="true"
            :is-small-size="true"
            :unit="'万'"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import InfoBox from './components/infoBox.vue';
export default {
  components: {
    InfoBox
  },
  props: {
    provinceRanking: {
      type: Array,
      default: () => {
        return [];
      }
    },
    timeKey: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      maxCount: 1,
      dataList: [],
      title: '',
      timer: null,
      dataIndex: 0,
      isChage: false,
      isShow: false
    };
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    // 定时选中
    rollTooltip() {
      this.showToolTip();
      this.setTimer();
    },
    setTimer() {
      this.timer = setInterval(() => {
        this.showToolTip();
      }, 15 * 1000);
    },
    clearTimer() {
      if (this.timer) clearInterval(this.timer);
    },
    showToolTip() {
      this.dataList = this.provinceRanking[this.dataIndex].companyRankingList || [];
      this.dataList.splice(5);
      this.title = this.provinceRanking[this.dataIndex].provinceName || '';
      if (this.dataIndex >= this.provinceRanking.length - 1) {
        this.dataIndex = 0;
      } else {
        this.dataIndex++;
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
    margin-bottom: 0.5rem;
  }
  &__list{
    height: calc(100% - 1.7rem);
    &__item{
      height: 20%;
      &__title{
        margin-bottom: 0.1rem;
        .index{
          display: inline-block;
          vertical-align: middle;
          margin: -0.3rem 0.2rem 0 0;
          padding-right: 0.1rem;
          width: 1.4rem;
          height: 1.6rem;
          line-height: 1.6rem;
          text-align: center;
          font-size: 0.7rem;
          font-family: PingFang Medium;
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
          font-family: PingFang Regular;
          font-weight: 300;
          color: rgba(124, 255, 244, 1);
        }
      }
    }
  }
}
</style>
