<template>
  <!-- TOP10团队排名 -->
  <div class="s-container">
    <ul class="s-container__list">
      <li v-for="(item, index) in dataList" :key="index" class="s-container__list__item">
        <div class="s-container__list__item__title">
          <span :class="index === 0 ? 'first' : ''" class="index">{{ index + 1 }}</span>
          <span class="text">
            {{ item.salesmanName }}
          </span>
        </div>
        <div class="s-container__list__item__content ly-flex-pack-justify">
          <InfoBox
            label="货主数"
            :count="item.shipmentNum"
            :is-small="true"
            :is-small-size="true"
          />
          <InfoBox
            label="运单量"
            :count="item.waybillNum"
            :is-small="true"
            :is-small-size="true"
          />
          <InfoBox
            label="运费额"
            :count="item.waybillAmount"
            :is-small="true"
            :is-small-size="true"
            :places="2"
            unit="万"
          />
          <InfoBox
            label="开票额"
            :count="item.votesAmount"
            :is-small="true"
            :is-small-size="true"
            :places="2"
            unit="万"
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
      this.clearTimer();
      this.timer = setInterval(() => {
        this.showToolTip();
      }, 15 * 1000);
    },
    clearTimer() {
      if (this.timer) clearInterval(this.timer);
    },
    showToolTip() {
      this.dataList = this.provinceRanking[this.dataIndex].companyInfoList || [];
      this.dataList.splice(3);
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
  padding-left: 0.5rem;
  &__list{
    height: 100%;
    &__item{
      height: 33.33%;
      &__title{
        margin-bottom: 0.1rem;
        .index{
          display: inline-block;
          vertical-align: middle;
          padding-left: 0.05rem;
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
