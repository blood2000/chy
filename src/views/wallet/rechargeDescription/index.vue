<template>
  <div class="page-wallet">
    <div class="app-container app-container--card">
      <h3 class="g-card-title g-card-header mb20">充值说明</h3>
      <p class="g-text mb20 text-before">如需对钱包账户中的可用余额进行充值，必须使用与下方展示的司机宝电子账户开户名一致的企业对公账户向电子账户进行转账</p>
      <p class="g-text mb20 text-before">当前账户电子托管账户开户信息如下：</p>
      <table class="table-style mb20">
        <tr>
          <td class="label">电子托管账户开户行</td>
          <td class="text">华夏银行武汉分行汉正街支行</td>
        </tr>
        <tr>
          <td class="label">电子托管账户账号</td>
          <td class="text">95165464645541651615</td>
        </tr>
        <tr>
          <td class="label">结算账户名</td>
          <td class="text">福建省XXX有限公司</td>
        </tr>
        <tr>
          <td class="label">结算账户开户行</td>
          <td class="text">农业银行</td>
        </tr>
        <tr>
          <td class="label">结算账户账号</td>
          <td class="text">131561654654651651616</td>
        </tr>
      </table>
    </div>

    <div class="app-container app-container--card">
      <h3 class="g-card-title g-card-header mb10">常见问题</h3>
      <p class="g-text mb20 text-before">关于充值到账时间：</p>
      <table class="table-style mb20">
        <tr>
          <td class="head" />
          <td class="head">时间</td>
          <td class="head">充值金额</td>
          <td class="head">到账时间</td>
        </tr>
        <tr>
          <td rowspan="3">
            工作日
            <p class="g-color-error">(周一至周五)</p>
          </td>
          <td>10:00-16:30</td>
          <td>金额不限</td>
          <td>2小时内</td>
        </tr>
        <tr>
          <td rowspan="2">16:30-次日10:00</td>
          <td>金额≤100W</td>
          <td>2小时内</td>
        </tr>
        <tr>
          <td>金额>100W</td>
          <td>下个工作日</td>
        </tr>
        <tr>
          <td rowspan="2">
            非工作日
            <p class="g-color-error">(周六、周日)</p>
          </td>
          <td rowspan="2">00:00-24:00</td>
          <td>金额≤100W</td>
          <td>2小时内</td>
        </tr>
        <tr>
          <td>金额>100W</td>
          <td>下个工作日</td>
        </tr>
      </table>
      <p class="g-text mb20 g-color-gray">(节假日到账时间按非工作日处理，若充值资金长时间未到账，请致电客服热线：400-8989-256)</p>
      <p class="g-text mb10 text-before">关于充值银行选择：</p>
      <p class="g-text mb20">为确保银行的处理时效，建议使用国有银行(如：中农工建交)或大众银行(如：招商、浦发、广发)等常用银行，请避免使用农村商业银行等地方性的小众银行</p>
      <p class="g-text mb10 text-before">关于充值记录查看：</p>
      <p class="g-text mb20">转账资金到账后，可通过“钱包-钱包首页”中的“钱包账户-可用余额”以及报表或钱包明细(app)查询充值到账详情</p>
      <p class="g-text mb10 text-before">关于误操作：</p>
      <p class="g-text mb10">如若转账错误，银行会在24小时内把对应资金返回原账户，特殊情况请及时咨询各银行的客服热线</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RechargeDescription',
  props: {

  },
  data() {
    return {

    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {

    }
  }
};
</script>

<style lang="scss" scoped>
.text-before{
  padding-left: 15px;
  position: relative;
  &::before{
    content: '';
    position: absolute;
    top: 8px;
    left: 0;
    background-color: #00bd93;
    width: 6px;
    height: 6px;
    border-radius: 100%;
  }
}
.table-style{
  border: 1px solid rgba(229, 229, 229, 1);
  td{
    padding: 15px;
    border-bottom: 1px solid rgba(229, 229, 229, 1);
    border-right: 1px solid rgba(229, 229, 229, 1);
    text-align: center;
    &.label{
      width: 300px;
      background: rgba(0, 0, 0, 0.02);
    }
    &.text{
      width: 500px;
    }
    &.head{
      width: 200px;
      background: rgba(0, 0, 0, 0.02);
    }
  }
}
</style>
