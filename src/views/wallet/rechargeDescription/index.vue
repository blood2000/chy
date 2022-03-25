<template>
  <div class="page-wallet">
    <div class="app-container app-container--card" style="position: relative">
      <h3 class="g-card-title g-card-header mb20">充值说明</h3>
      <p v-if="companyName" class="g-text mb20">{{ companyName }}：</p>
      <p class="g-text mb20">您好！这是贵司充值运费的账号，必须使用与超好运注册账户一致的企业对公户进行充值，充值成功后在超好运货主端APP的个人中心即可显示充值的金额。</p>
      <el-button class="mb20" type="primary" size="small" @click="copy">复制账号信息</el-button>
      <span class="ml10">（双击或拖动列表文字，通过鼠标右键选择复制，也可复制信息）</span>
      <!-- 网商显示 -->
      <template v-if="form.paymentChannels === 'WSBK' || form.paymentChannels === 'SXWSBK'">
        <table class="table-style mb20">
          <tr>
            <td class="label">银行账号</td>
            <!-- 货主认证后网商生成的账号 -->
            <td class="text">{{ form.account ? form.account : '' }}</td>
          </tr>
          <tr>
            <td class="label">开户名称</td>
            <td class="text">{{ form.paymentChannels === 'WSBK' ? '福建大道成物流科技有限公司' : '山西道承信息技术有限公司' }}</td>
          </tr>
          <tr>
            <td class="label">开户行</td>
            <td class="text">浙江网商银行</td>
          </tr>
          <tr>
            <td class="label">省份</td>
            <td class="text">浙江省</td>
          </tr>
          <tr>
            <td class="label">城市</td>
            <td class="text">杭州市</td>
          </tr>
          <tr>
            <td class="label">联行号</td>
            <td class="text">323331000001</td>
          </tr>
        </table>
        <input
          id="table-inner-id"
          :value="inputValue"
          style="width: 100px;"
        >
      </template>
      <!-- 民生显示-->
      <template v-if="form.paymentChannels === 'CMBC'">
        <table class="table-style mb20">
          <tr>
            <td class="label">银行账号</td>
            <td class="text">{{ form.bankAcc ? form.bankAcc : '' }}</td>
          </tr>
          <tr>
            <td class="label">开户名称</td>
            <td class="text">{{ form.accName ? form.accName : '' }}</td>
          </tr>
          <tr>
            <td class="label">开户行</td>
            <td class="text">民生银行</td>
          </tr>
          <tr>
            <td class="label">当前绑定卡号（请使用当前绑定卡号充值，否则无法到账）</td>
            <td class="text">{{ form.atBindBankCard ? form.atBindBankCard : '' }}</td>
          </tr>
        </table>
        <input
          id="table-inner-id"
          :value="inputValue"
          style="width: 100px;"
        >
      </template>
      <!-- 浦发银行 -->
      <!-- <template v-if="form.paymentChannels === 'SPDB'">
        <table class="table-style mb20">
          <tr>
            <td class="label">银行账号</td>
            <td class="text">171913247</td>
          </tr>
          <tr>
            <td class="label">开户名称</td>
            <td class="text">福建大道成物流科技有限公司</td>
          </tr>
          <tr>
            <td class="label">开户行</td>
            <td class="text">中国民生银行福州福清龙田支行</td>
          </tr>
          <tr>
            <td class="label">省份选</td>
            <td class="text">福建省</td>
          </tr>
          <tr>
            <td class="label">城市选</td>
            <td class="text">福州市</td>
          </tr>
          <tr>
            <td class="label">联行号</td>
            <td class="text">305391015267</td>
          </tr>
        </table>
        <input
          id="table-inner-id"
          :value="inputValue"
          style="width: 100px;"
        >
      </template> -->
      <div style="width: 110px; height: 30px; background: #fff; position: absolute; left: 15px; bottom: 15px" />
    </div>

    <!-- <div class="app-container app-container--card">
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
    </div> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getUserWalletBank } from '@/api/wallet/wallet';
export default {
  name: 'RechargeDescription',
  props: {

  },
  data() {
    return {
      companyName: null,
      form: {}
    };
  },
  computed: {
    ...mapGetters(['shipment']),
    inputValue() {
      let result = '';
      if (this.form.paymentChannels === 'WSBK' || this.form.paymentChannels === 'SXWSBK') {
        result = `银行账号：${this.form.account ? this.form.account : ''}; 开户名称：${this.form.paymentChannels === 'WSBK' ? '福建大道成物流科技有限公司' : '山西道承信息技术有限公司'}; 开户行：浙江网商银行; 省份：浙江省; 城市：杭州市; 联行号：323331000001`;
      }
      if (this.form.paymentChannels === 'CMBC') {
        result = `银行账号：${this.form.bankAcc ? this.form.bankAcc : ''}; 开户名称：${this.form.accName ? this.form.accName : ''}; 开户行：民生银行; 当前绑定卡号（请使用当前绑定卡号充值，否则无法到账）：${this.form.atBindBankCard ? this.form.atBindBankCard : ''}`;
      }
      // if (this.form.paymentChannels === 'SPDB') {
      //   result = `银行账号：171913247; 开户名称：福建大道成物流科技有限公司; 开户行：中国民生银行福州福清龙田支行; 省份选：福建省; 城市选：福州市; 联行号：305391015267`;
      // }
      return result;
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      if (this.shipment && this.shipment.info && this.shipment.info.companyName) {
        this.companyName = this.shipment.info.companyName;
      }
      getUserWalletBank().then(response => {
        this.form = response.data || {};
      });
    },
    copy() {
      document.getElementById('table-inner-id').select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        this.msgSuccess('复制成功!');
      } else {
        this.msgError('复制失败');
      }
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
  border: 1px solid rgba(229, 229, 229, 0.8);
  td{
    padding: 15px;
    border-bottom: 1px solid rgba(229, 229, 229, 0.8);
    border-right: 1px solid rgba(229, 229, 229, 0.8);
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
