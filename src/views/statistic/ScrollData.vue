<template>
  <div class="s-container ly-flex-pack-justify">
    <!-- 货单数据 -->
    <div class="s-container__card">
      <div class="herder">
        <h5>
          货单数据
          <span class="flash flash_left" />
          <span class="flash flash_right" />
        </h5>
      </div>
      <!-- <ScrollCard :data-list="orderList" /> -->
      <StaticCard ref="orderRef" />
    </div>

    <!-- 交易数据 -->
    <div class="s-container__card">
      <div class="herder">
        <h5>
          交易数据
          <span class="flash flash_left" />
          <span class="flash flash_right" />
        </h5>
      </div>
      <!-- <ScrollCard :data-list="dealList" /> -->
      <StaticCard ref="transferRef" />
    </div>

    <!-- 用户/车辆 -->
    <div class="s-container__card">
      <div class="herder">
        <h5>
          用户、车辆数据
          <span class="flash flash_left" />
          <span class="flash flash_right" />
        </h5>
      </div>
      <!-- <ScrollCard :data-list="userList" /> -->
      <StaticCard ref="userRef" />
    </div>
  </div>
</template>

<script>
// import ScrollCard from './components/scrollCard';
import StaticCard from './components/staticCard';
import { getOrderTop, getSettlementTop, getUserAndCarTop } from '@/api/statistic/statistic.js';
export default {
  components: {
    // ScrollCard
    StaticCard
  },
  data() {
    return {
      // orderList: [{}],
      // dealList: [{}],
      // userList: [{}]
    };
  },
  mounted() {
    this.getOrderData();
    this.getSettlementData();
    this.getUserData();
  },
  methods: {
    // 处理实时数据-开票
    setInvoiceData(val, time) {
      const { remark } = val;
      if (remark) {
        this.$refs.transferRef.setData(remark, time);
      }
    },
    // 处理实时数据-用户
    setUserData(val, time) {
      const { car, user } = val;
      if (car) {
        const { remark } = car;
        if (remark) {
          this.$refs.userRef.setData(remark, time);
        }
      }
      if (user) {
        const { remark } = user;
        if (remark) {
          this.$refs.userRef.setData(remark, time);
        }
      }
    },
    // 处理实时数据-货单
    setOrderData(val, time) {
      const { remark } = val;
      if (remark) {
        this.$refs.orderRef.setData(remark, time);
      }
    },
    // 处理实时数据-打款
    setWaybillData(val, time) {
      const { remark } = val;
      if (remark) {
        this.$refs.transferRef.setData(remark, time);
      }
    },
    // 获取货单初始数据
    getOrderData() {
      getOrderTop().then(response => {
        const dataList = [];
        response.data.forEach(el => {
          dataList.push({
            text: el.remark,
            time: this.idToday(el.createTime)
          });
        });
        this.$refs.orderRef.initDataList(dataList);
      });
    },
    // 获取交易初始数据
    getSettlementData() {
      getSettlementTop().then(response => {
        const dataList = [];
        response.data.forEach(el => {
          dataList.push({
            text: el.remark,
            time: this.idToday(el.createTime)
          });
        });
        this.$refs.transferRef.initDataList(dataList);
      });
    },
    // 获取用户初始数据
    getUserData() {
      getUserAndCarTop().then(response => {
        const dataList = [];
        response.data.forEach(el => {
          dataList.push({
            text: el.remark,
            time: this.idToday(el.create_time)
          });
        });
        this.$refs.userRef.initDataList(dataList);
      });
    },
    // 判断数据是否当天
    idToday(time) {
      const today = this.parseTime(new Date(), '{m}:{d}');
      const day = this.parseTime(time, '{m}:{d}');
      if (today === day) {
        return this.parseTime(time, '{h}:{i}');
      } else {
        return this.parseTime(time, '{m}/{d}');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.s-container{
  margin: 0 0.6rem;
  &__card{
    margin: 0 0.4rem;
    width: calc(33.33% - 0.8rem);
    height: 7.2rem;
    border: 2px solid rgba(23, 129, 167, 0.2);
    padding: 0 0.45rem 0.45rem;
    position: relative;
    >.herder{
      text-align: center;
      height: 1.5rem;
      line-height: 1.5rem;
      >h5{
        display: inline-block;
        position: relative;
        height: 1.5rem;
        font-size: 0.6rem;
        font-family: 'PingFang Medium';
        font-weight: 500;
        color: #01E3FF;
        &::before{
          content: '';
          position: absolute;
          top: 50%;
          margin-top: -0.175rem;
          left: -2.6rem;
          width: 2.35rem;
          height: 0.35rem;
          background: url('~@/assets/images/statistic/min_title_left.png') no-repeat;
          background-size: 100% 100%;
        }
        &::after{
          content: '';
          position: absolute;
          top: 50%;
          margin-top: -0.175rem;
          right: -2.6rem;
          width: 2.35rem;
          height: 0.35rem;
          background: url('~@/assets/images/statistic/min_title_right.png') no-repeat;
          background-size: 100% 100%;
        }
        >.flash{
          display: block;
          position: absolute;
          top: 50%;
          margin-top: -0.175rem;
          width: 2.35rem;
          height: 0.35rem;
          &.flash_left{
            left: -2.6rem;
            background: url('~@/assets/images/statistic/min_title_left.gif') no-repeat;
            background-size: 100% 100%;
          }
          &.flash_right{
            right: -2.6rem;
            background: url('~@/assets/images/statistic/min_title_right.gif') no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
    &::after{
      content: '';
      position: absolute;
      bottom: 0.5rem;
      right: 0.8rem;
      width: 2.55rem;
      height: 0.15rem;
      background: url('~@/assets/images/statistic/card_after_small.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
