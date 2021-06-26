<template>
  <el-popover
    placement="right"
    width="400"
    trigger="click"
  >
    <el-table :data="gridData">
      <el-table-column width="150" property="date" label="日期" />
      <el-table-column width="100" property="name" label="姓名" />
      <el-table-column width="300" property="address" label="地址" />
    </el-table>
    <el-button slot="reference" type="text"><i class="el-icon-plus" /></el-button>
  </el-popover>
</template>

<script>
export default {
  name: 'PopoverCom',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }

};
</script>

<style>

</style>
