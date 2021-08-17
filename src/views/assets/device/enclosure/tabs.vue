<template>
  <div class="tabs g-aligncenter" style="width: 364px">
    <div v-for="(item, index) in tablist" :key="index" :class="activeName === item.code ? 'tabs-onbotton': 'tabs-botton'" @click="handleClick(item.code)">
      <div v-if="activeName === item.code && index === 0" class="tabs-imgleft">
        <img src="~@/assets/images/tabs/tabbg_left_g.png" alt="">
      </div>
      <div v-if="activeName === item.code && index !== tablist.length-1 && index !== 0" class="tabs-imgright">
        <img src="~@/assets/images/tabs/tabbg_center_g.png" alt="">
      </div>
      <div v-if="activeName === item.code && index === tablist.length-1" class="tabs-imgright">
        <img src="~@/assets/images/tabs/tabbg_right_g.png" alt="">
      </div>
      <span class="tabs-title">{{ `${item.tabName} (${item.num})` }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tablist: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      activeName: '0'
    };
  },
  computed: {
  },
  methods: {
    handleClick(e) {
      // this.activeName = e;
      // this.$emit('getActiveName', e);
    }
  }
};
</script>

<style scoped lang="scss">
.tabs{
	height: 34px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}
.tabs-onbotton{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 182px;
  height: 34px;
	font-weight: bold;
	color: #262626;
  cursor: pointer;
}
.tabs-botton{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 182px;
  height: 34px;
	font-weight: bold;
	color: #9FA2B5;
  background: #E9EBEE;
  cursor: pointer;
}
.tabs-imgleft{
	position: relative;
	left: -48px;
  top: -8px;
	height: 0;
	width: 0;
  z-index: 0;
}
.tabs-imgright{
  position: relative;
	left: -120px;
  top: -9px;
	height: 0;
	width: 0;
  z-index: 0;
}
.tabs-title{
  position: relative;
  z-index: 1;
}
</style>
