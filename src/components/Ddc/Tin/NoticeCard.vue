<template>
  <div class="notice-card-wrapper" :style="{'--noticeWidth':noticeWidth, '--speed': speed }">
    <div class="inner-container">
      <span ref="noticeRef" style="display: inline-block;" v-html="valueNotice" />
    </div>
  </div>
</template>

<script>
/**
 * 使用: <NoticeCard :notice="tip" speed="30s" />
 * notice: 要滚动的文字
 * lists: 数组['消息1','消息2']
 * speed: 滚动快慢(动画执行的时间)
 *
*/
export default {
  name: 'NoticeCard',
  components: {
  },
  props: {
    notice: {
      type: String,
      default: ''
    },
    lists: {
      type: Array,
      default: null
    },
    speed: {
      type: String,
      default: '30s'
    }
  },
  data() {
    return {
      noticeWidth: 0,
      valueNotice: ''
    };
  },

  created() {
  },

  mounted() {
    this.valueNotice = this.notice;

    if (this.lists) {
      this.lists.forEach((item, index) => {
        this.valueNotice += `<span style="margin-right:${(this.lists.length - 1) === index ? 0 : this.$el.offsetWidth + 'px'}">${item}</span>`;
      });
    }

    this.$nextTick(() => {
      this.noticeWidth = -(this.$refs.noticeRef.offsetWidth);
    });
  }

};
</script>

<style lang="scss" scoped>
.notice-card-wrapper {
  .inner-container {
    margin-left: 100%; // 把文字弄出可见区域
    width: 200%;
    animation: myMove var(--speed) linear infinite; // 重点，定义动画
    animation-fill-mode: forwards;
  }

  .inner-container:hover{
      animation-play-state: paused; // hover 动画暂停
  }

    /*文字无缝滚动*/
  @keyframes myMove {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-50% + var(--noticeWidth) * 1px));
    }
  }
}
</style>
