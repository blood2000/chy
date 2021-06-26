<template>
  <div>
    <el-checkbox-group v-model="checkGroup" size="medium" class="ml20">
      <el-row>
        <el-col v-for="item in showSubList" :key="item.code" class="mb20" :span="8">
          <el-checkbox :label="item.cnName" border />
        </el-col>
      </el-row>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  props: {
    showSubList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkGroup: []
    };
  },
  created() {
    console.log(this.showSubList);
  }
};
</script>

<style>

</style>
