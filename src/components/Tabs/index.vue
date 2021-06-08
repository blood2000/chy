<template>
  <div class="tabs g-aligncenter" :style="{width: tabwidth + 'px'}">
    <div v-for="(item, index) in tablist" :key="index" :class="activeName === item.tabName ? 'tabs-onbotton': 'tabs-botton'" @click="handleClick(item.tabName)">
      <div v-if="activeName === item.tabName && index === 0" class="tabs-imgleft">
        <img src="~@/assets/images/tabs/tabbg_left.png" alt="">
      </div>
      <div v-if="activeName === item.tabName && index !== tablist.length-1 && index !== 0" class="tabs-imgright">
        <img src="~@/assets/images/tabs/tabbg_center.png" alt="">
      </div>
      <div v-if="activeName === item.tabName && index === tablist.length-1" class="tabs-imgright">
        <img src="~@/assets/images/tabs/tabbg_right.png" alt="">
      </div>
      <span class="tabs-title">{{ item.tabName }}</span>
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
      activeName: this.tablist[0].tabName,
      tabwidth: this.tablist.length * 135
    };
  },
  computed: {
  },
  methods: {
    handleClick(e) {
      this.activeName = e;
      this.$emit('getActiveName', e);
    }
  }
};
</script>

<style scoped>
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
  width: 135px;
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
  width: 135px;
  height: 34px;
	font-weight: bold;
	color: #BABDCA;
  background: #E9EBEE;
  cursor: pointer;
}
.tabs-imgleft{
	position: relative;
	left: -68px;
  top: -8px;
	height: 0;
	width: 0;
  z-index: 0;
}
.tabs-imgright{
  position: relative;
	left: -100px;
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
