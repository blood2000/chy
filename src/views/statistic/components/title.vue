<template>
  <div class="title ly-flex">
    <div class="before">
      <img :src="require('@/assets/images/statistic/title_icon_'+icon+'.png')">
    </div>
    <div class="text ly-flex-1">
      <slot />
    </div>
    <div class="top_line" />
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
    font-weight: bold;
    color: #01e3ff;
    >span{
      font-size: 0.7rem;
      font-weight: normal;
      padding-left: 0.4rem;
      color: #3AA7BC;
    }
  }
  &::before{
    content: '';
    width: 1.2rem;
    height: 1px;
    position: absolute;
    bottom: 0;
    right: 0;
    background: linear-gradient(to right, #1a88b1 0.6rem, rgba(50, 255, 255, 1) 0);
  }
  &::after{
    content: '';
    height: 1px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to right, rgba(50, 255, 255, 0), rgba(79, 131, 131, 0.2));
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
