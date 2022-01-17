<template>
  <div>
    <Tabs class="frame" :tablist="tablist" @getActiveName="getActiveName" />
    <Waybill v-if="activeName === '运输单' && isShow" />
    <MultimodeTrans v-if="activeName === '多式联运'" />
  </div>
</template>

<script>
import Waybill from './components/Waybill';
import MultimodeTrans from './components/MultimodeTrans';
import Tabs from '@/components/Tabs/index';

export default {
  name: 'Manages',
  components: {
    Tabs,
    Waybill,
    MultimodeTrans
  },
  data() {
    return {
      // Tabs参数
      tablist: [{ tabName: '运输单' }, { tabName: '多式联运' }],
      activeName: '运输单',
      isShow: true
    };
  },
  watch: {
    '$route.query.waybillNo'() {
      this.isShow = false;
      setTimeout(() => {
        this.isShow = true;
      }, 0);
    }
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
