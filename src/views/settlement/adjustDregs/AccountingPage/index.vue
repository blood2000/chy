<template>
  <div>

    <div class="g-radio-group ly-flex-pack-justify">
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button label="0">已复核</el-radio-button>
        <el-radio-button label="1">复核驳回</el-radio-button>
      </el-radio-group>
    </div>

    <IndexOne v-show="activeName=='0'" />
    <IndexTwo v-show="activeName=='1'" />

  </div>
</template>

<script>
import IndexOne from './IndexOne.vue';
import IndexTwo from './IndexTwo.vue';
export default {
  components: { IndexOne, IndexTwo },
  data() {
    return {
      activeName: '0'
    };
  }
};
</script>

<style>

</style>
