<template>
  <div>

    <div class="g-radio-group ly-flex-pack-justify">
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button label="0">核算</el-radio-button>
        <el-radio-button label="1">核验驳回</el-radio-button>
      </el-radio-group>
    </div>

    <IndexOne v-if="activeName=='0'" />
    <MuckProject v-if="activeName=='1'" :status="-1" />


  </div>
</template>

<script>
import IndexOne from './IndexOne.vue';
import MuckProject from '@/components/MuckProject';
export default {
  components: {
    IndexOne,
    MuckProject
  },
  data() {
    return {
      activeName: '0'
    };
  }
};
</script>

<style>

</style>
