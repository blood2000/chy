<template>
  <div class="title ly-flex">
    <div class="before" />
    <div class="text ly-flex-1">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  prop: {
    icon: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  height: 1.9rem;
  margin-bottom: 1rem;
  background: rgba(44, 62, 90, 0.5);
  color: #01e3ff;
  >.before{
    width: 1.9rem;
    height: 1.9rem;
    background: rgba(65, 99, 153, 0.3);
  }
  >.text{
    line-height: 1.9rem;
    padding-left: 0.6rem;
    font-size: 0.9rem;
    font-weight: bold;
    >span{
      font-size: 0.8rem;
      font-weight: normal;
      padding-left: 0.4rem;
    }
  }
}
</style>
