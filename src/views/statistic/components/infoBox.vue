<template>
  <div class="s-info-box" :class="isUser ? 's-info-box--user' : ''">
    <p class="label">
      {{ label }}
      <span v-if="unit && unit !== ''">({{ unit }})</span>
    </p>
    <p class="text" :class="[{blod: isBlod}, {small: isSmall}, {smallSize: isSmallSize}]">
      <count-to :end-val="changedCount" :decimal-places="places" />
      <!-- 单位 -->
      <span v-if="hasChangeUnit" class="count-unit">{{ changedUnit }}</span>
      <!-- 同比 -->
      <template v-if="hasYoy">
        <template v-if="myYoyType !== null && myYoyType !== 2">
          <span :class="myYoyType===1 ? 'arow_down' : 'arow_up'" />
          <span :class="myYoyType===1 ? 'value_down' : 'value_up'">
            <count-to :end-val="myYoy" :decimal-places="yoyPlaces" />%
          </span>
        </template>
        <template v-else>
          <span class="arow_line" />
        </template>
      </template>
    </p>
  </div>
</template>

<script>
import CountTo from '@/components/CountTo';

export default {
  components: {
    CountTo
  },
  props: {
    count: {
      type: Number,
      default: 0
    },
    lastCount: {
      type: Number,
      default: 0
    },
    places: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
    // 固定单位 (备注：为'万'单位时，不能和hasChangeUnit同时传)
    unit: {
      type: String,
      default: ''
    },
    hasYoy: {
      type: Boolean,
      default: false
    },
    yoy: {
      type: Number,
      default: 0
    },
    // 0=上升 1=下降 2=没变化
    yoyType: {
      type: Number,
      default: 2
    },
    yoyPlaces: {
      type: Number,
      default: 0
    },
    // 样式区分
    isUser: {
      type: Boolean,
      default: false
    },
    isBlod: {
      type: Boolean,
      default: false
    },
    isSmall: {
      type: Boolean,
      default: false
    },
    isSmallSize: {
      type: Boolean,
      default: false
    },
    // 是否换算单位 (备注： unit为'万'单位时，不能和unit同时传)
    hasChangeUnit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myYoy: 0,
      myYoyType: 2
    };
  },
  computed: {
    changedCount() {
      let num = this.count;
      if (this.unit === '万') {
        num = Math.floor(this.count / 100) / 100;
      } else if (this.hasChangeUnit) {
        if (this.count > 9999 && this.count <= 99999999) {
          num = Math.floor(this.count / 100) / 100;
        } else if (this.count > 99999999) {
          num = Math.floor(Math.floor(Math.floor(this.count / 100) / 100) / 100) / 100;
        }
      }
      return num;
    },
    changedUnit() {
      let unit = '';
      if (this.hasChangeUnit) {
        if (this.count > 9999 && this.count <= 99999999) {
          unit = '万';
        } else if (this.count > 99999999) {
          unit = '亿';
        }
      }
      return unit;
    }
  },
  watch: {
    count(val) {
      if (!this.hasYoy) return;
      if (!val || val === 0) return;
      if (!this.lastCount || this.lastCount === 0) return;
      this.computeYoy();
    },
    yoy(val) {
      this.myYoy = val;
    },
    yoyType(val) {
      this.myYoyType = val;
    }
  },
  methods: {
    // 计算同比和同比类型
    // 同比 = (当日数据-(昨天数据*当时时间/24))/(昨天数据*当时时间/24)*100
    computeYoy() {
      const time = Number(this.parseTime(new Date(), '{h}'));
      const yoy = (this.count - (this.lastCount * time / 24)) / (this.lastCount * time / 24) * 100;
      // 0=上升 1=下降 2=没变化
      if (yoy > 0) {
        this.myYoyType = 0;
      } else if (yoy < 0) {
        this.myYoyType = 1;
      } else {
        this.myYoyType = 2;
      }
      this.myYoy = Math.abs(yoy);
      this.$emit('update:yoy', this.myYoy);
      this.$emit('update:yoyType', this.myYoyType);
    }
  }
};
</script>

<style lang="scss" scoped>
.s-info-box{
  width: 100%;
  height: 50%;
  >.label{
    font-size: 0.6rem;
    font-weight: 200;
    color: rgba(213, 234, 255, 1);
    line-height: 1rem;
  }
  >.text{
    font-size: 1.1rem;
    font-weight: normal;
    color: #FFFFFF;
    // line-height: 1.3rem; //会和vertical-align冲突
    font-family: 'PingFang Medium';
    .count-unit{
      font-family: PingFang Regular;
      font-size: 0.65rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
      vertical-align: baseline;
      margin-left: 0.2rem;
    }
    .arow_up{
      display: inline-block;
      width: 0.9rem;
      height: 0.6rem;
      background: url('~@/assets/images/statistic/arow_up.png') no-repeat;
      background-size: 100% 100%;
      margin-left: 0.6rem;
    }
    .arow_down{
      display: inline-block;
      width: 0.9rem;
      height: 0.6rem;
      background: url('~@/assets/images/statistic/arow_down.png') no-repeat;
      background-size: 100% 100%;
      margin-left: 0.6rem;
    }
    .arow_line{
      display: inline-block;
      width: 0.9rem;
      height: 0.02rem;
      background: #00d2ff;
      margin-left: 0.6rem;
      vertical-align: top;
      margin-top: 0.7rem;
    }
    .value_up{
      display: inline-block;
      font-size: 0.6rem;
      vertical-align: top;
      color: rgba(0, 210, 255, 1);
      margin-left: 0.15rem;
      font-family: 'PingFang Medium' !important;
      transform: scale(0.95, 0.95);
    }
    .value_down{
      display: inline-block;
      font-size: 0.6rem;
      vertical-align: top;
      color: rgba(52, 213, 192, 1);
      margin-left: 0.15rem;
      font-family: 'PingFang Medium' !important;
      transform: scale(0.95, 0.95);
    }
    // 样式区分
    &.blod{
      // font-family: 'PingFang Bold' !important;
    }
    &.small{
      .arow_up{
        background: url('~@/assets/images/statistic/arow_up_small.png') no-repeat;
        background-size: 100% 100%;
      }
      .arow_down{
        background: url('~@/assets/images/statistic/arow_down_small.png') no-repeat;
        background-size: 100% 100%;
      }
      .arow_line{
        background: #019cff;
      }
      .value_up{
        color: #019cff;
      }
      .value_down{
        color: #34A398;
      }
    }
    &.smallSize{
      font-size: 0.8rem;
      .arow_up{
        width: 0.7rem;
        height: 0.45rem;
      }
      .arow_down{
        width: 0.7rem;
        height: 0.45rem;
      }
      .arow_line{
        margin-top: 0.5rem;
      }
      .value_up{
        transform: scale(0.85, 0.85);
        margin-left: 0.05rem;
      }
      .value_down{
        transform: scale(0.85, 0.85);
        margin-left: 0.05rem;
      }
    }
  }
  // 用户字体样式
  &.s-info-box--user{
    >.label{
      color: #9CAFD0;
    }
    >.text{
      font-family: PingFang Regular;
    }
  }
}
</style>
