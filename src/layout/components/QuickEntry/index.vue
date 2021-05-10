<template>
  <div class="quick-entry ly-flex-align-center ly-flex-align-center">
    <div
      v-for="item in itemList"
      :key="item.label"
      class="quick-entry__item ly-flex-v ly-flex-align-center ly-flex-pack-center"
      @click="handleRouter(item.name, item.query)"
    >
      <img width="26" height="26" :src="require('@/assets/images/navBar/icon_quick_entry_' + item.icon + '.png')">
      <p>{{ item.label }}</p>
      <span v-show="item.count > 0" class="count">{{ item.count }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemList: [
        { label: '调度者审核', icon: 'team', name: 'Team', query: { authStatus: 0 }, count: 0 },
        { label: '司机审核', icon: 'driver', name: 'Driver', query: { authStatus: 0 }, count: 0 },
        { label: '车辆审核', icon: 'vehicle', name: 'Vehicle', query: { authStatus: 0 }, count: 5 },
        { label: '运输单', icon: 'order', name: 'Manages', query: {}, count: 24 },
        { label: '提现申请', icon: 'withdrawal', name: 'Withdrawal', query: { status: 0 }, count: 20 }
      ]
    };
  },
  methods: {
    handleRouter(name, query) {
      // 打开对应路由
      if (name === '') {
        return;
      } else if (name === this.$route.name) {
        this.$router.replace({
          name: name,
          query: {
            data: JSON.stringify(query)
          }
        });
      } else {
        this.$router.push({
          name: name,
          query: {
            data: JSON.stringify(query)
          }
        });
      }
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
