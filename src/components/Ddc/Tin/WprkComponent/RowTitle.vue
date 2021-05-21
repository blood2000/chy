<template>
  <div class="middle-row-title">
    <div class="middle-row-title-box">
      <div class="g-ciont-style">{{ index }}</div>
      <slot>账户充值</slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: [String, Number],
      default: 1
    }
  }

};
</script>

<style lang="scss" scoped>

.middle-row-title{
    display: flex;
    &-box{
        height: 23px;
        background: #DBE7F2;
        opacity: 0.68;
        border-radius: 12px;
        display: flex;
        align-items: center;
        color: #409EFF;
        padding: 0 15px 0 3px;
    }
    .g-ciont-style{
        width: 17px;
        height: 17px;
        background: linear-gradient(168deg, #69ADF3 0%, #066FDC 100%);
        border-radius: 50%;
        opacity: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        margin-right: 5px;
    }
}
</style>
