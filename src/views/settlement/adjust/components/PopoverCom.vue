<template>
  <!-- <el-checkbox-group v-model="checkGroup" size="medium" class="ml20">
      <el-row>
        <el-col v-for="(item, index) in list" :key="index" class="mb20" :span="8">
          <el-checkbox :label="item.cnName" style="width: 150px;" :disabled="item.$_disabled" />
        </el-col>
      </el-row>
    </el-checkbox-group> -->



  <div>
    <div class="mb20 b f20">
      规则
    </div>
    <el-row>
      <el-checkbox-group v-model="checkGroup" size="medium" class="ml20">
        <el-col v-for="(item, index) in list" :key="index" class="mb20" :span="8">
          <el-checkbox :label="item.cnName" style="width: 120px;" border :disabled="item.$_disabled" />
        </el-col>
      </el-checkbox-group>
    </el-row>
  </div>

</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkGroup: []
    };
  },
  // watch: {
  //   list: {
  //     handler() {
  //       console.log(this.list);
  //     },
  //     immediate: true,
  //     deep: true
  //   }
  // },
  created() {
    console.log(this.list);
  },

  methods: {
    handlerClick() {
      console.log(13);
      console.log(this.list);
    }
  }
};
</script>

<style>

</style>
