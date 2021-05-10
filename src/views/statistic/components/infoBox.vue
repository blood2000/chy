<template>
  <div class="s-info-box" :class="isUser ? 's-info-box--user' : ''">
    <p class="label">
      {{ label }}
      <span v-if="unit && unit !== ''">({{ unit }})</span>
    </p>
    <p class="text" :class="isBlod ? 'blod' : ''">
      <count-to :end-val="count" :decimal-places="places" />
      <template v-if="hasYoy">
        <template v-if="yoyType !== 2">
          <span :class="yoyType===1 ? 'arow_down' : 'arow_up'" />
          <span :class="yoyType===1 ? 'value_down' : 'value_up'">
            <count-to :end-val="yoy" :decimal-places="yoyPlaces" />%
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
    places: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
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
    yoyType: {
      type: Number,
      default: 2
    },
    yoyPlaces: {
      type: Number,
      default: 0
    },
    isUser: {
      type: Boolean,
      default: false
    },
    isBlod: {
      type: Boolean,
      default: false
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
    line-height: 1.3rem;
    font-family: 'PingFang Medium';
    .arow_up{
      display: inline-block;
      width: 0.9rem;
      height: 0.6rem;
      background: url('~@/assets/images/statistic/arow_up.png') no-repeat;
      background-size: 100% 100%;
      margin-left: 0.3rem;
    }
    .arow_down{
      display: inline-block;
      width: 0.9rem;
      height: 0.6rem;
      background: url('~@/assets/images/statistic/arow_down.png') no-repeat;
      background-size: 100% 100%;
      margin-left: 0.3rem;
    }
    .arow_line{
      display: inline-block;
      width: 0.9rem;
      height: 0.02rem;
      background: #00d2ff;
      margin-left: 0.4rem;
      vertical-align: top;
      margin-top: 0.65rem;
    }
    .value_up{
      font-size: 0.6rem;
      vertical-align: top;
      color: rgba(0, 210, 255, 1);
      margin-left: 0.15rem;
    }
    .value_down{
      font-size: 0.6rem;
      vertical-align: top;
      color: rgba(52, 213, 192, 1);
      margin-left: 0.15rem;
    }
  }
  &.s-info-box--user{
    >.label{
      color: #9CAFD0;
    }
    >.text{
      font-family: PingFang Regular;
      &.blod{
        font-family: 'PingFang Bold';
      }
    }
  }
}
</style>
