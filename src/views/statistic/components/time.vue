<template>
  <div class="s-choose-time" :class="{isSecond: isSecond}">
    {{ timeList[currentTime] }}
    <ul class="time-list">
      <li v-for="(value, key) in timeList" :key="key" :class="{active: currentTime == key}" @click="changeTime(key)">{{ value }}</li>
    </ul>
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
      currentTime: 2,
      timeList: {
        1: '最近7天',
        2: '最近30天',
        3: '最近3个月',
        4: '最近1年',
        5: '全部数据' // 实际key为0, 为了排序设为5
      }
    };
  },
  created() {
    this.setTimeType();
  },
  methods: {
    changeTime(key) {
      if (this.currentTime === Number(key)) return;
      this.currentTime = Number(key);
      this.setTimeType();
    },
    changeKey() {
      if (this.currentTime === 5) {
        return 0;
      }
      return this.currentTime;
    },
    setTimeType() {
      const timeKey = this.changeKey();
      this.$emit('getTimeType', timeKey, this.timeList[timeKey === 0 ? 5 : timeKey]);
    }
  }
};
</script>

<style lang="scss" scoped>
.s-choose-time{
  position: relative;
  width: 5rem;
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: center;
  font-size: 0.6rem;
  font-family: 'PingFang Medium';
  font-weight: 500;
  color: rgba(196, 238, 255, 0.8);
  cursor: pointer;
  &::after{
    display: none;
    z-index: 1;
    content: '';
    width: 100%;
    height: 7.5rem;
    position: absolute;
    bottom: -7.5rem;
    right: 0;
  }
  >.time-list{
    display: none;
    z-index: 2;
    position: absolute;
    bottom: -7.6rem;
    right: 0;
    background: #043576;
    border: 0.02rem solid;
    border-image: linear-gradient(45deg, rgba(0, 185, 253, 0.14), rgba(0, 167, 215, 0.14)) 1 1;
    padding: 0 0.6rem;
    width: 100%;
    >li{
      height: 1.5rem;
      line-height: 1.5rem;
      text-align: center;
      cursor: pointer;
      color: rgba(196, 238, 255, 0.8);
      transition: all 0.2s;
      font-size: 0.6rem;
      white-space: nowrap;
      &:not(:last-child){
        border-bottom: 0.02rem solid rgba(30, 74, 132, 1);
      }
      &.active{
        font-weight: bold;
        color: #01E3FF;
        transition: all 0.2s;
      }
    }
  }
  &::before {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    margin: -0.15rem 0.3rem 0;
    width: 0.3rem;
    height: 0.3rem;
    cursor: pointer;
    background: url('~@/assets/images/statistic/arrow_select.png') no-repeat;
    background-size: 100% 100%;
    -webkit-transition: all .15s;
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transition: all 0.15s;
    -moz-transition: all 0.15s;
    -o-transition: all 0.15s;
    -ms-transition: all 0.15s;
  }
  &:hover{
    &::after{
      display: block;
    }
    >.time-list{
      display: block;
    }
    &::before{
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transition: transform 0.15s;
      -moz-transition: -moz-transform 0.15s;
      -o-transition: -o-transform 0.15s;
      -ms-transition: -ms-transform 0.15s;
    }
  }

  // 第二版时间控件样式
  &.isSecond{
    width: 5rem;
    height: 1.8rem;
    border: 1px solid rgba(55, 255, 248, 0.18);
    background: rgba(0, 45, 93, 0.2);
    position: absolute;
    right: calc(50% - 17rem);
    top: 0;
    text-align: left;
    padding-left: 0.6rem;
    font-size: 0.7rem;
    color: rgba(196, 238, 255, 0.5);
  }
}
</style>
