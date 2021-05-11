<template>
  <div class="title ly-flex">
    <div class="before">
      <img :src="require('@/assets/images/statistic/title_icon_'+icon+'.gif')">
    </div>
    <div class="text ly-flex-1">
      <slot />
    </div>
    <div class="top_line" />
    <!-- 动效 -->
    <ul class="top_line_flash ly-flex-pack-justify">
      <li class="flash1" />
      <li class="flash2" />
      <li class="flash3" />
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '1'
    }
  }
};
</script>

<style lang="scss" scoped>
.title{
  height: 1.6rem;
  margin-bottom: 1rem;
  position: relative;
  >.before{
    width: 1.6rem;
    height: 1.6rem;
    >img{
      width: 1.4rem;
      height: 1.4rem;
      margin: 0.08rem 0;
    }
  }
  >.text{
    line-height: 1.6rem;
    font-size: 0.9rem;
    color: #01e3ff;
    font-family: 'PingFang Bold';
    >span{
      font-size: 0.7rem;
      font-weight: normal;
      padding-left: 0.4rem;
      color: #3AA7BC;
      font-family: 'PingFang Medium';
    }
  }
  &::before{
    content: '';
    width: 1.2rem;
    height: 1px;
    position: absolute;
    bottom: 0;
    right: 0;
    background: linear-gradient(to right, rgba(26, 136, 177, 1) 0.6rem, rgba(50, 255, 255, 1) 0);
  }
  &::after{
    content: '';
    height: 1px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to right, rgba(50, 255, 255, 0), rgba(50, 255, 255, 0.2));
  }
  .top_line{
    // &::before{
    //   content: '';
    //   position: absolute;
    //   top: 0.05rem;
    //   right: -0.3rem;
    //   width: 4rem;
    //   height: 0.6rem;
    //   background: url('~@/assets/images/statistic/title_flash.gif');
    //   background-size: 100% 100%;
    // }
  }
  .top_line_flash{
    position: absolute;
    right: 0;
    top: 0.15rem;
    width: 3.15rem;
    >li{
      width: 0.85rem;
      height: 0.35rem;
      background: rgba(50, 255, 255, 0.9);
      &.flash1{
        animation: title-flash-1 2.6s infinite;
      }
      &.flash2{
        animation: title-flash-2 2.6s infinite;
      }
      &.flash3{
        animation: title-flash-3 2.6s infinite;
      }
      @keyframes title-flash-1 {
        0% { opacity: 0; }
        12% { opacity: 0.25; }
        25% { opacity: 0.5; }
        37% { opacity: 0.75; }
        50% { opacity: 1; }
        62% { opacity: 0.75; }
        75% { opacity: 0.5; }
        87% { opacity: 0.25; }
        100% { opacity: 0; }
      }
      @keyframes title-flash-2 {
        0% { opacity: 0.5; }
        12% { opacity: 0.75; }
        25% { opacity: 1; }
        37% { opacity: 0.75; }
        50% { opacity: 0.5; }
        62% { opacity: 0.75; }
        75% { opacity: 1; }
        87% { opacity: 0.75; }
        100% { opacity: 0.5; }
      }
      @keyframes title-flash-3 {
        0% { opacity: 1; }
        12% { opacity: 0.75; }
        25% { opacity: 0.5; }
        37% { opacity: 0.25; }
        50% { opacity: 0; }
        62% { opacity: 0.25; }
        75% { opacity: 0.5; }
        87% { opacity: 0.75; }
        100% { opacity: 1; }
      }
    }
  }
  &.title_1, &.title_2, &.title_3, &.title_4, &.title_5{
    .top_line{
      position: absolute;
      top: 0;
      right: 0;
      height: 0.6rem;
    }
  }
  &.title_1 .top_line{
    width: 19.25rem;
    background: url('~@/assets/images/statistic/title_1.png');
    background-size: 100% 100%;
  }
  &.title_2 .top_line{
    width: 19.25rem;
    background: url('~@/assets/images/statistic/title_2.png');
    background-size: 100% 100%;
  }
  &.title_3 .top_line{
    width: 39.7rem;
    background: url('~@/assets/images/statistic/title_3.png');
    background-size: 100% 100%;
  }
  &.title_4 .top_line{
    width: 9.35rem;
    background: url('~@/assets/images/statistic/title_4.png');
    background-size: 100% 100%;
  }
  &.title_5 .top_line{
    width: 9.35rem;
    background: url('~@/assets/images/statistic/title_5.png');
    background-size: 100% 100%;
  }
}
</style>
