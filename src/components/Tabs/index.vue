<template>
  <div class="tabs g-aligncenter">
    <div v-for="(item, index) in tabList" :key="index" :class="activeName === item.tabName ? 'tabs-onbotton': 'tabs-botton'" @click="handleClick(item.tabName)">
      {{ item.tabName }}
      <div class="tabs-img">
        <img v-if="activeName === item.tabName && index === 0" src="~@/assets/images/tabs/tabbg_left.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabList: {
      type: Array,
      default: function() {
        return [{ tabName: '运单动态' }, { tabName: '发票动态' }];
      }
    }
  },
  data() {
    return {
      activeName: null
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  methods: {
    handleClick(e) {
      this.activeName = e;
    }
  }
};
</script>

<style scoped>
.tabs{
	width: 100%;
	height: 36px;
}
.tabs-onbotton{
	font-weight: bold;
	color: #262626;
}
.tabs-botton{
	font-weight: bold;
	color: #BABDCA;
}
.tabs-img{
	position: relative;
	left: -10px;
	top: 0px;
	height: 0;
	width: 0;
}
</style>
