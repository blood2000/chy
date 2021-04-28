<template>
  <div ref="box" class="s-scroll-card" @mouseover="rollStop()" @mouseout="rollStart(60)">
    <ul ref="comment1" class="content__list">
      <li v-for="(item, index) in dataList" :key="index" class="content__list__item ly-flex-pack-justify ly-flex-align-center">
        <p class="text">{{ index + 1 }}福建大道成科技有限公司发布1个货单科技科</p>
        <p class="time">14:26</p>
      </li>
    </ul>
    <ul ref="comment2" class="content__list" />
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      timer: null
    };
  },
  mounted() {
    if (this.dataList.length < 4) return;
    this.$nextTick(() => {
      this.roll(60);
    });
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    roll(t) {
      var ul1 = this.$refs.comment1;
      var ul2 = this.$refs.comment2;
      var ulbox = this.$refs.box;
      ul2.innerHTML = ul1.innerHTML;
      ulbox.scrollTop = 0;
      this.rollStart(t);
    },
    rollStart(t) {
      if (this.dataList.length < 4) return;
      var ul1 = this.$refs.comment1;
      var ulbox = this.$refs.box;
      this.rollStop();
      this.timer = setInterval(() => {
        // 当滚动高度大于列表内容高度时恢复为0
        if (ulbox.scrollTop >= ul1.scrollHeight) {
          ulbox.scrollTop = 0;
        } else {
          ulbox.scrollTop++;
        }
      }, t);
    },
    rollStop() {
      if (this.dataList.length < 4) return;
      clearInterval(this.timer);
    }
  }
};
</script>

<style lang="scss" scoped>
.s-scroll-card{
  height: 4.05rem; //滚屏必须设的样式
  overflow: hidden; //滚屏必须设的样式
  margin: 0.4rem 0.8rem 0.8rem 0.6rem;
  // background: rgba(1, 18, 60, 0.2);
  .content__list{
    .content__list__item{
      line-height: 1.35rem;
      .text{
        width: calc(100% - 2rem);
        font-size: 0.7rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time{
        width: 1.6rem;
        font-size: 0.5rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #A4ACC0;
      }
    }
  }
}
</style>
