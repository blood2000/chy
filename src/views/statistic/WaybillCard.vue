<template>
  <div class="s-waybill-card">
    <div ref="box" class="s-scroll-box">
      <ul :class="{isRoll: isRoll}" class="content__list">
        <!-- 1接单 2装货 3卸货 -->
        <li
          v-for="(item, index) in dataList"
          :key="index"
          :class="[{isOpacity: isOpacity}, 'color' + item.status, {isSecond: isSecond}]"
          class="content__list__item"
        >
          <div class="title">{{ item.title }}</div>
          <div class="content ly-flex-pack-justify ly-flex-align-center">
            <p class="text">{{ item.address }}</p>
            <p class="time">{{ item.time }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isSecond: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataList: [],
      storageList: [], // 缓存数据
      storageTimer: null,
      isRoll: false,
      rollTimer: null,
      isOpacity: false,
      opacityTimer: false
    };
  },
  beforeDestroy() {
    if (this.storageTimer) this.clearReadStorage();
  },
  methods: {
    setData(status, val, address, time) {
      // 缓存数据
      this.storageList.push({
        status: status,
        title: val,
        address: address,
        time: this.parseTime(time, '{h}:{i}:{s}')
      });
      // 开启缓存查询
      this.readStorage();
      // 接收数据，最快0.6s刷一条数据
      this.rollCard();
    },
    rollCard() {
      if (this.rollTimer || this.opacityTimer) return;
      this.isRoll = true;
      this.rollTimer = setTimeout(() => {
        this.isRoll = false;
        this.startAnimation();
        this.clearAnimation();
        // 从缓存读取数据
        this.dataList.unshift(this.storageList[0]);
        this.dataList.splice(3);
        this.storageList.splice(0, 1);
        // console.log(this.storageList);
        // 保证一个完整的动画
        this.rollTimer = null;
      }, 0.4 * 1000);
    },
    startAnimation() {
      this.isOpacity = true;
    },
    clearAnimation() {
      this.opacityTimer = setTimeout(() => {
        this.isOpacity = false;
        this.opacityTimer = null;
      }, 0.2 * 1000);
    },
    // 定时访问缓存里面是否还有数据
    readStorage() {
      if (this.storageList.length === 0) {
        this.clearReadStorage();
        return;
      }
      // 保证当前有且只有一个定时器在工作
      if (this.storageTimer) return;
      this.storageTimer = setInterval(() => {
        if (this.storageList.length > 0) {
          this.rollCard();
          // console.log('查询');
        }
      }, 0.4 * 1000);
    },
    clearReadStorage() {
      clearInterval(this.storageTimer);
    }
  }
};
</script>

<style lang="scss" scoped>
.s-waybill-card{
  position: absolute;
  bottom: 1.5rem;
  left: 1.8rem;
  width: 14.6rem;
  overflow: hidden;
  .s-scroll-box{
    height: 8.1rem;
    overflow: hidden;
    .content__list{
      .content__list__item{
        padding: 0.2rem 0 0.2rem;
        width: 14.6rem;
        height: 2.5rem;
        margin-bottom: 0.3rem;
        overflow: hidden;
        >.title{
          padding: 0 0.6rem;
          font-size: 0.65rem;
          font-weight: 400;
          color: #FFFFFF;
          font-family: PingFang Regular;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          height: 1.2rem;
          line-height: 1.2rem;
          text-align: left;
          margin-bottom: 0;
        }
        >.content{
          padding: 0 0.5rem 0 0.2rem;
          line-height: 0.9rem;
          height: 0.9rem;
          .text{
            font-size: 0.6rem;
            transform: scale(0.9, 0.9);
            font-family: PingFang Regular;
            font-weight: 400;
            color: #FFFFFF;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .time{
            font-size: 0.6rem;
            transform: scale(0.8, 0.8);
            font-family: PingFang Regular;
            font-weight: 400;
            color: #BDC4D7;
          }
        }
        // 背景色
        &.color1{
          background: url('~@/assets/images/statistic/waybill1.png') no-repeat;
          background-size: 100% 100%;
        }
        &.color2{
          background: url('~@/assets/images/statistic/waybill2.png') no-repeat;
          background-size: 100% 100%;
        }
        &.color3{
          background: url('~@/assets/images/statistic/waybill3.png') no-repeat;
          background-size: 100% 100%;
        }
        // 动画
        &.isOpacity:first-child{
          animation: is-opacity 0.2s;
        }
        @keyframes is-opacity {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        &.isSecond{
          &.color1{
            background: url('~@/assets/images/statistic/waybill1_second.png') no-repeat;
            background-size: 100% 100%;
          }
          &.color2{
            background: url('~@/assets/images/statistic/waybill2_second.png') no-repeat;
            background-size: 100% 100%;
          }
          &.color3{
            background: url('~@/assets/images/statistic/waybill3_second.png') no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      // 动画
      transform: translateY(0);
      &.isRoll{
        transform: translateY(2.8rem);
        transition: transform 0.4s;
      }
    }
  }
}
</style>
