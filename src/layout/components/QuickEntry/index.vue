<template>
  <div class="quick-entry ly-flex-align-center ly-flex-align-center">
    <div
      v-for="item in itemList"
      :key="item.name"
      class="quick-entry__item ly-flex-v ly-flex-align-center ly-flex-pack-center"
      @click="handlePath(item.path)"
    >
      <img width="26" height="26" :src="require('@/assets/images/navBar/icon_quick_entry_' + item.path + '.png')">
      <p>{{ item.name }}</p>
      <span v-show="item.count > 0" class="count">{{ item.count }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemList: [
        { name: '调度者审核', path: 'team', count: 0 },
        { name: '司机审核', path: 'driver', count: 0 },
        { name: '车辆审核', path: 'car', count: 5 },
        { name: '运输单', path: 'order', count: 24 },
        { name: '提现申请', path: 'payment', count: 20 }
      ]
    };
  },
  methods: {
    handlePath(path) {
      // 打开对应路由
    }
  }
};
</script>

<style lang="scss" scoped>
.quick-entry{
  height: 100%;
  float: right;
  &__item{
    margin-right: 25px;
    cursor: pointer;
    position: relative;
    >.count{
      display: block;
      position: absolute;
      top: -4px;
      right: -8px;
      height: 16px;
      line-height: 16px;
      color: #fff;
      font-size: 14px;
      background: rgba(245, 108, 108, 1);
      border-radius: 8px;
      padding: 0 6px;
    }
  }
}
</style>
