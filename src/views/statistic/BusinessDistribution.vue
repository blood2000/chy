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
    <ul class="s-container__right">
      <li v-for="(item, index) in goodList" :key="index" class="ly-flex-pack-start ly-flex-align-center">
        <p class="index">{{ index + 1 }}</p>
        <p class="text">{{ `${item.goodsBigTypeName}(${item.percentage}%)` }}</p>
      </li>
    </ul>
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
  &__left{
    width: 64%;
    height: 100%;
    padding: 0.3rem 1rem 0.3rem 0;
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
          width: 10.7rem;
          height: 0.4rem;
          .value{
            width: 0%;
            height: 100%;
            background: linear-gradient(93deg, #9C4DDC, #3397F4);
            border-radius: 0px 0.2rem 0.2rem 0px;
          }
          opacity: 0.4;
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
    border: 0.05rem solid rgba(82, 129, 237, 0.4);
    padding: 0.3rem 0.55rem;
    >li{
      height: 20%;
      .index{
        width: 0.9rem;
        height: 0.9rem;
        line-height: 0.9rem;
        background: linear-gradient(144deg, #1F91FF, #A965FD);
        border-radius: 50%;
        text-align: center;
        font-size: 0.6rem;
        font-family: PingFang Regular;
        font-weight: 500;
        color: #FFFFFF;
        margin-right: 0.6rem;
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
</style>
