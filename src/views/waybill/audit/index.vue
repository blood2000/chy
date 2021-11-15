<template>
  <div>
    <Tabs class="frame" :tablist="tablist" @getActiveName="getActiveName" />
    <Audits v-if="activeName === '明细列表'" />
    <MultimodeTrans v-if="activeName === '汇总表'" />
  </div>
</template>

<script>
import Audits from './components/Audit';
import MultimodeTrans from './components/Summary';
import Tabs from '@/components/Tabs/index';

export default {
  name: 'Audit',
  components: {
    Tabs,
    Audits,
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
