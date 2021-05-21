<template>
  <div class="s-scroll-card">
    <div ref="box" class="s-scroll-box">
      <ul :class="{isRoll: isRoll}" class="content__list">
        <li v-for="(item, index) in dataList" :key="index" :class="{isOpacity: isOpacity}" class="content__list__item ly-flex-pack-justify ly-flex-align-center">
          <p class="text">{{ item.text }}</p>
          <p class="time">{{ item.time }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
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
    setData(val, time) {
      // 缓存数据
      this.storageList.push({
        text: val,
        time: this.parseTime(time, '{h}:{i}')
      });
      // 开启缓存查询
      this.readStorage();
      // 接收数据，最快0.8s刷一条数据
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
      }, 0.5 * 1000);
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
.s-scroll-card{
  height: 5.25rem;
  overflow: hidden;
  padding: 0.4rem 0.8rem 0.8rem 0.6rem;
  background: rgba(1, 18, 60, 0.2);
  .s-scroll-box{
    height: 4.05rem;
    overflow: hidden;
    .content__list{
      .content__list__item{
        line-height: 1.35rem;
        .text{
          width: calc(100% - 2rem);
          font-size: 0.65rem;
          font-family: PingFang Regular;
          font-weight: 400;
          color: #FFFFFF;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .time{
          width: 1.6rem;
          font-size: 0.5rem;
          font-family: PingFang Regular;
          font-weight: 400;
          color: #A4ACC0;
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
      }
      // 动画
      transform: translateY(0);
      &.isRoll{
        color: #000;
        transform: translateY(1.35rem);
        transition: transform 0.4s;
      }
    }
  }
}
</style>
