<template>
  <div class="pr dagao-item">
    <i v-once class="iconfont dagao-icon" :class="layout.iconfont" />
    <div class="g-text">
      <!-- {{ value }}  -->
      <count-to :end-val="value -0 " :decimal-places="0" />
      <span>{{ layout.unit }}</span></div>
    <span v-once class="dagao-name">{{ layout.title }}</span>
    <div v-once class="pa dagao-btn" @click="$emit('click')">
      <svg-icon icon-class="jia" class-name="icon_dagao" />
    </div>
    <!-- <i class="iconfont icon-22800 dagao-icon" />
    <div class="g-text">58 <span>个</span></div>
    <span class="dagao-name">项目</span>
    <div class="pa dagao-btn">
      <svg-icon icon-class="jia" class-name="icon_dagao" />
    </div> -->
  </div>
</template>

<script>
import CountTo from '@/components/CountTo';
export default {
  components: { CountTo },
  props: {
    layout: {
      type: Object,
      default: () => {
        return {
          iconfont: 'icon-22800',
          unit: '个',
          title: '项目'
        };
      }
    },
    value: {
      type: [String, Number],
      default: 0
    }

  }

};
</script>

<style lang="scss" scoped>
.dagao{
  &-item{
    width: 47%;
    height: 100px;
    background: #F6FAFE;
    margin-top: 10px;
    border-radius: 9px;
    padding: 2px 10px;
    overflow: hidden;
  }
  &-item:nth-child(1),&-item:nth-child(2){
    margin-top: 0;
  }

  &-name{
    font-size: 14px;
    color: #262626;
  }
  &-btn{
    right: 4px;
    bottom: -3px;
  }
}

.icon_dagao{
    width: 44px;
    height: 44px;
    cursor: pointer;
    background: #f6fafe;
  }
  .dagao-icon{
    font-size: 30px;
    color: #d9ebfe;
    margin-left: -4px;
  }
  .g-text{
    font-size: 24px;
    font-weight: bold;
    font-family: Bahnschrift;
    color: #262626;
    margin-top: 5px;
    margin-bottom: 2px;
    span{
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 22px;
      color: #262626;
    }
  }

</style>
