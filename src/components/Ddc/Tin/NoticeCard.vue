<template>
  <div class="notice-card-wrapper" :style="{'--noticeWidth':noticeWidth, '--speed': speed, '--innercontainer': innercontainer }">
    <div :class="noticeWidth?'inner-container':null">
      <span ref="noticeRef" style="display: inline-block; white-space:nowrap;" v-html="valueNotice" />
    </div>
  </div>
</template>

<script>
/**
 * 使用: <NoticeCard v-if="tip" :notice="tip" speed="30s" />
 * 使用: <NoticeCard v-if="tips.length>1" :lists="tips" speed="30s" />
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
      default: '暂无消息~'
    },
    lists: {
      type: Array,
      default: () => []
    },
    speed: {
      type: String,
      default: '30s'
    }
  },
  data() {
    return {
      noticeWidth: 0,
      valueNotice: '',
      innercontainer: 0
    };
  },

  watch: {
    notice: {
      handler(value) {
        if (value) {
          this.valueNotice = this.notice.replace(/<\/?.+?>/g, '');
          // this.valueNotice = this.valueNotice.replace(/\s/ig, '');
          this.$nextTick(() => {
            this.noticeWidth = -(this.$refs.noticeRef.offsetWidth);
            this.innercontainer = this.$el.offsetWidth;
          });
        }
      },
      immediate: true
    },

    lists: {
      handler(value) {
        if (value && value.length) {
          let valueNotice = '';
          if (this.lists) {
            this.lists.forEach((item, index) => {
              valueNotice += `<span style="margin-right:${(this.lists.length - 1) === index ? 0 : this.$el.offsetWidth + 'px'}">${item}</span>`;
            });
            this.valueNotice = valueNotice;
          }
          this.$nextTick(() => {
            this.noticeWidth = -(this.$refs.noticeRef.offsetWidth);
          });
        } else {
          !this.notice && (this.valueNotice = '暂无消息~');
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.notice-card-wrapper {
  .inner-container {
    margin-left: 100%; // 把文字弄出可见区域
    width: calc((var(--noticeWidth) * -1px));
    animation: myMove var(--speed) linear infinite; // 重点，定义动画
    animation-fill-mode: forwards;
  }

  .inner-container:hover{
      animation-play-state: paused; // hover 动画暂停 running
  }

    /*文字无缝滚动*/
  @keyframes myMove {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(var(--innercontainer) * -1px + -100%));
    }
  }
}
</style>
