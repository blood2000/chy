<template>
  <!-- 地域业务分布情况 -->
  <div class="s-container ly-flex-pack-justify">
    <ul class="s-container__left ly-flex-v ly-flex-pack-justify">
      <li v-for="(item, index) in dataList" :key="index" class="ly-flex-pack-start ly-flex-align-center">
        <div class="label">{{ item.regionName }}</div>
        <div class="line" :class="index === currentIndex ? 'current' : ''">
          <div v-if="item.waybillCount / maxCount * 100 > 1" class="value" :style="`width: ${item.waybillCount / maxCount * 100}%;`" />
          <!-- 避免百分比太小不显示 -->
          <div v-else class="value" :style="`width: 1%;`" />
        </div>
        <div class="text">{{ item.percentage + '%' }}</div>
      </li>
    </ul>
    <div v-show="goodList.length > 0" class="s-container__right">
      <h5 class="g-single-row">
        <img src="@/assets/images/statistic/arrow_before.png">
        {{ dataList.length > 0 ? dataList[currentIndex].regionName : '' }}
      </h5>
      <ul>
        <li v-for="(item, index) in goodList" :key="index" class="ly-flex-pack-start ly-flex-align-center">
          <p class="index">{{ index + 1 }}</p>
          <p class="text">{{ `${item.goodsBigTypeName}(${item.percentage}%)` }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getBusinessListV2 } from '@/api/statistic/statistic.js';
export default {
  props: {
    branchCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      timer: null,
      maxCount: 1,
      currentIndex: 0,
      dataList: [],
      goodList: []
    };
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    getData() {
      getBusinessListV2(this.branchCode).then(response => {
        this.dataList = response.data || [];
        this.createProgress();
        this.roll();
      });
    },
    // 模拟进度条
    createProgress() {
      if (this.dataList && this.dataList.length > 0) {
        this.maxCount = this.dataList[0].waybillCount;
      }
    },
    // 定时选中
    roll() {
      this.changeGoodList();
      this.setTimer();
    },
    setTimer() {
      this.clearTimer();
      this.timer = setInterval(() => {
        if (this.currentIndex >= this.dataList.length - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex++;
        }
        this.changeGoodList();
      }, 5 * 1000);
    },
    clearTimer() {
      if (this.timer) clearInterval(this.timer);
    },
    changeGoodList() {
      this.goodList = this.dataList[this.currentIndex].bigScreenRegionGoodsVoList;
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  width: 100%;
  height: 100%;
  padding-top: 0.5rem;
  &__left{
    width: 64%;
    height: 100%;
    padding: 0.3rem 2rem 0.3rem 0;
    >li{
      >.label{
          width: 1.5rem;
          margin-right: 0.5rem;
          font-size: 0.7rem;
          font-family: PingFang Regular;
          font-weight: 500;
          color: #CDEDFF;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        >.line{
          width: 10.5rem;
          height: 0.4rem;
          .value{
            width: 0%;
            height: 100%;
            background: linear-gradient(93deg, #0070E3, #60DCEC);
            border-radius: 0px 0.2rem 0.2rem 0px;
          }
          opacity: 0.3;
          transition: opacity 0.3s;
          &.current{
            opacity: 1;
            transition: opacity 0.3s;
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
  &__right{
    width: 36%;
    height: 100%;
    padding-top: 0.5rem;
    >h5{
      height: 1.1rem;
      line-height: 0.6rem;
      font-size: 0.75rem;
      font-family: PingFang SC;
      font-weight: bold;
      color: #01B6F9;
      background: url('~@/assets/images/statistic/arrow_bg.png') no-repeat;
      background-size: 100% 100%;
      padding-right: 60%;
      margin-bottom: 0.4rem;
      >img{
        width: 0.25rem;
        height: 0.4rem;
        vertical-align: middle;
        margin-top: -0.2rem;
        margin-right: 0.1rem;
      }
    }
    >ul{
      height: calc(100% - 1.5rem);
      >li{
        height: 20%;
        .index{
          width: 0.9rem;
          height: 0.9rem;
          line-height: 0.7rem;
          background: rgba(26, 73, 129, 0.6);
          border-radius: 50%;
          text-align: center;
          font-size: 0.6rem;
          font-family: PingFang Regular;
          font-weight: 500;
          color: #FFFFFF;
          margin-right: 0.5rem;
          border: 0.1rem solid rgba(44, 211, 240, 0.6);
        }
        .text{
          width: calc(100% - 1rem);
          font-size: 13px;
          font-family: PingFang Regular;
          font-weight: 500;
          color: #CDEDFF;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
