<template>
  <div>
    <Tabs class="frame" :tablist="tablist" @getActiveName="getActiveName" />
    <Audit v-if="activeName === '明细列表'" />
    <MultimodeTrans v-if="activeName === '汇总表'" />
  </div>
</template>

<script>
import Audit from './components/Audit';
import MultimodeTrans from './components/Summary';
import Tabs from '@/components/Tabs/index';

export default {
  name: 'Manages',
  components: {
    Tabs,
    Audit,
    MultimodeTrans
  },
  data() {
    return {
      // Tabs参数
      tablist: [{ tabName: '明细列表' }, { tabName: '汇总表' }],
      activeName: '明细列表'
    };
  },
  created() {
  },
  methods: {
    getActiveName(val) {
      this.activeName = val;
    }
  }
};
</script>

<style>
.frame{
  margin:0 15px !important;
  /* height: 100%; */
}
</style>
