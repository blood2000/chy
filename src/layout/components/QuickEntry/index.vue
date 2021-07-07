<template>
  <div class="quick-entry ly-flex-align-center ly-flex-align-center">
    <div
      v-for="item in lists"
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
import { getUserInfo } from '@/utils/auth';

import { getUnreviewed } from '@/api/workBanch';

export default {
  data() {
    return {
      itemList: [
        { label: '调度者审核', icon: 'team', name: 'Team', query: { authStatus: 0 }, count: 0 },
        { label: '司机审核', icon: 'driver', name: 'Driver', query: { authStatus: 0 }, count: 0 },
        { label: '车辆审核', icon: 'vehicle', name: 'Vehicle', query: { authStatus: 0 }, count: 0 },
        { label: '货主审核', icon: 'shipment', name: 'Shipment', query: { authStatus: 0 }, count: 0 },
        // { label: '运输单', icon: 'order', name: 'Manages', query: {}, count: 24 }, // 5/25 产品说去掉
        { label: '提现申请', icon: 'withdrawal', name: 'Withdrawal', query: { status: 0 }, count: 0 }
        // { label: '消息', icon: 'msg', name: 'Withdrawal', query: { status: 0 }, count: 20 }
      ],
      itemListShipment: [
        { label: '联系客服', icon: 'service', name: '', query: { authStatus: 0, type: 'service' }, count: 0 },
        { label: 'app下载', icon: 'download', name: '', query: { authStatus: 0, url: 'https://ddcwl.com/kuaiche/apps' }, count: 0 }
        // { label: '消息', icon: 'msg', name: '', query: { authStatus: 0 }, count: 0 } // 5/25 产品说去掉
      ],
      open: false,
      branchCode: undefined
    };
  },

  computed: {
    lists() {
      const { isShipment = false } = getUserInfo() || {};
      return isShipment ? this.itemListShipment : this.itemList;
    }
  },

  created() {
    const { isShipment = false, user = {}} = getUserInfo() || {};

    if (!isShipment) {
      this.branchCode = user.branch.code;
      this.getList();
    }
  },

  methods: {
    handleRouter(name, query) {
      // 打开对应路由
      if (name === '') {
        query.url && (window.open(query.url));
        query.type === 'service' && this.serviceOpen();
        return;
      } else if (name === this.$route.name) {
        this.$store.dispatch('settings/changeQuick', name);
        this.$router.replace({
          name: name,
          query: {
            data: JSON.stringify(query)
          }
        });
      } else {
        this.$store.dispatch('settings/changeQuick', name);
        this.$router.push({
          name: name,
          query: {
            data: JSON.stringify(query)
          }
        });
      }

      this.getList();
    },

    serviceOpen() {
      const msg = `
      <strong class="g-title-big"><i class="el-icon-phone mr10"></i> 400 827 0535</strong>
      `;
      this.$alert(msg, '联系客服', {
        showClose: false,
        dangerouslyUseHTMLString: true
      });
    },

    getList() {
      getUnreviewed(
        this.branchCode
      ).then(response => {
        const {
          driver, //	司机审核	integer(int32)	integer(int32)
          team, //	调度者审核	integer(int32)	integer(int32)
          vehicle, //	车辆审核	integer(int32)	integer(int32)
          withdrawDeposit: withdrawal, //	提款申请
          shipment
        } = response.data;

        const data = {
          team,
          driver,
          vehicle,
          withdrawal,
          shipment
        };

        this.itemList.forEach(e => {
          Object.keys(data).forEach(ee => {
            if (e.icon === ee) {
              e.count = data[ee];
            }
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.quick-entry{
  height: 100%;
  float: right;
  color: #fff;
  font-size: 12px;
  padding-top: 10px;
  margin-right: 30px;
  &__item{
    cursor: pointer;
    position: relative;
    width: 75px;
    >.count{
      display: block;
      position: absolute;
      top: -8px;
      left: 44px;
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
