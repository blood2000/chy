<template>
  <div>
    <div class="g-radio-group ly-flex-pack-justify">
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button v-has-permi="['list:dregs:applayed']" label="1">开票</el-radio-button>
        <el-radio-button v-has-permi="['list:dregs:invoiced']" label="5">打款</el-radio-button>
      </el-radio-group>
    </div>
    <MuckProject v-if="activeName==='1'" :status="2" />
    <MuckProject v-if="activeName==='5'" :status="3" />
  </div>
</template>

<script>
import MuckProject from '@/components/MuckProject';
export default {
  name: 'Dregs',
  components: { MuckProject },
  data() {
    return {
      activeName: '1'
    };
  }
};
</script>

<style>

</style>
