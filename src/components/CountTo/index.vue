<template>
  <div ref="CountUpRef" class="inline" />
</template>

<script>
import { CountUp } from 'countup.js';

export default {
  name: 'CountTo',
  props: {
    // 动画延迟自定义事件（自定义属性）
    delay: {
      type: Number,
      default: 0
    },
    // 结束值
    endVal: {
      type: Number,
      default: 0
    },
    // 开始值
    startVal: {
      type: Number,
      default: 0
    },
    // 小数位数
    decimalPlaces: {
      type: Number,
      default: 0
    },
    // 动画延迟秒数
    duration: {
      type: Number,
      default: 2
    },
    // 设置变化速度 true变速 false匀速
    useEasing: {
      type: Boolean,
      default: true
    },
    // 设置分组效果 true变速 false匀速
    useGrouping: {
      type: Boolean,
      default: true
    },
    // 设置分组符号
    separator: {
      type: String,
      default: ','
    },
    // 设置小数分组符号
    decimal: {
      type: String,
      default: '.'
    },
    // 后缀
    prefix: {
      type: String,
      default: ''
    },
    // 前缀
    suffix: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      control: null
    };
  },
  watch: {
    endVal(val) {
      this.control.update(val);
    }
  },
  mounted() {
    this.initControl();
  },
  methods: {
    initControl() {
      this.$nextTick(() => {
        // 创建实例
        this.control = new CountUp(this.$refs.CountUpRef, this.endVal, {
          startVal: this.startVal,
          duration: this.duration,
          decimalPlaces: this.decimalPlaces,
          decimal: this.decimal,
          useGrouping: this.useGrouping,
          prefix: this.prefix,
          suffix: this.suffix,
          separator: this.separator,
          useEasing: this.useEasing,
          smartEasingThreshold: 999 // 如果使用useEasing，则对大于此的数字进行平滑缓动
          // easingFn: (t: number, b: number, c: number, d: number) => number, // 动画缓动功能
          // formattingFn: (n: number) => string,  // 格式化数字
        });
        // 开始执行
        if (this.control.error) {
          console.log(this.control.error);
          return;
        }
        setTimeout(() => {
          this.control.start();
        }, this.delay * 1000);
      });
    }
  }
};
</script>

<style scoped>
.inline{
  display: inline;
}
</style>
