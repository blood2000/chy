<template>
  <div class="null-cont g-directioncenter g-justifycenter">
    <img class="null-img" src="~@/assets/images/icon/icon_null.png" alt="">
    <div class="null-text">{{ nullTitle }}</div>
  </div>
</template>

<script>
export default {
  props: {
    nullTitle: {
      type: String,
      default: '暂无数据'
    }
  }
};
</script>

<style lang="scss" scoped>
.null-cont{
  width: 100%;
  height: 100%;
}
.null-img{
  height: 80px;
  width: 80px;
}
.null-text{
  margin-top: 8px;
  font-size: 14px;
  font-family: PingFang SC;
  line-height: 22px;
  color: #909398;
}
</style>
