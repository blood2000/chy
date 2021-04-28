<template>
  <div class="s-choose-time">
    {{ currentTime }}
    <ul class="time-list">
      <li v-for="item in timeList" :key="item.code" @click="changeTime(item)">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTime: '最近3个月',
      timeList: [
        { name: '最近7天', code: '1' },
        { name: '最近1个月', code: '2' },
        { name: '最近3个月', code: '3' },
        { name: '最近1年', code: '4' },
        { name: '全部数据', code: '5' }
      ]
    };
  },
  methods: {
    changeTime(item) {
      if (this.currentTime === item) return;
      this.currentTime = item.name;
    }
  }
};
</script>

<style lang="scss" scoped>
.s-choose-time{
  position: relative;
  width: 4.5rem;
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: center;
  font-size: 0.6rem;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(196, 238, 255, 0.8);
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
    bottom: -7.5rem;
    right: 0;
    background: #043576;
    border: 0.02rem solid;
    border-image: linear-gradient(45deg, rgba(0, 185, 253, 0.14), rgba(0, 167, 215, 0.14)) 1 1;
    padding: 0 0.6rem;
    >li{
      height: 1.5rem;
      line-height: 1.5rem;
      text-align: center;
      cursor: pointer;
      color: rgba(196, 238, 255, 0.8);
      &:not(:last-child){
        border-bottom: 0.02rem solid rgba(30, 74, 132, 1);
      }
    }
  }
  &::before {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -0.15rem;
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
}
</style>
