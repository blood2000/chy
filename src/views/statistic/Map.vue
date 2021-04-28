<template>
  <div class="s-container" />
</template>

<script>
import echarts from 'echarts';
import { setfontSize } from '@/utils/fontSize';

export default {
  data() {
    return {

    };
  },
  mounted() {

  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.s-container{
  // 7.2 = scrollDataHeight
  // 4.8 = TotalDataHeight
  height: calc(100% - 7.2rem - 4.8rem);
}
</style>
