<template>
  <!-- 表格按钮超出显示...，hover后下拉展示 -->
  <el-dropdown class="ml10" trigger="click" placement="bottom">
    <el-button type="text" class="dropdown-button">
      <span class="g-strong">···</span>
    </el-button>
    <el-dropdown-menu slot="dropdown" class="dropdown-menu">
      <slot />
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {

};
</script>

<style scoped>
/* 自定义下拉样式 */
.dropdown-button{
  padding: 7px 0;
}
.dropdown-menu{
  margin-top: 5px;
}
</style>
