<template>


  <div>
    <div v-if="btnShow" class="ly-t-right mb20">
      <el-button
        v-print="{
          id: 'receipt-printer',
          popTitle: '福建大道成物流科技有限公司',
          extraCss: 'ddc',
          extraHead: `<meta http-equiv='Content-Language' content='zh-cn'/>`
        }"
        size="mini"
        type="primary"
        icon="el-icon-printer"
        plain
        class="wholecont-print"
      >打印</el-button>
    </div>
    <div id="receipt-printer" class="receipt" :loading="loading">

      <!-- <div class="receipt-heater">
        <div class="receipt-heater-content">
          <img class="m_log pa" src="../../../assets/images/login/chylog.png" alt="chylog">
        </div>
      </div> -->

      <div class="receipt-box">
        <div class="receipt-title">交易详情</div>

        <div class="receipt-res">交易成功</div>

        <div class="receipt-list">
          <div class="receipt_sain">
            <img class="receipt_img" src="~@/assets/images/tm123.png" alt="深圳市凯意达建设工程有限公司">
          </div>

          <RefactorTable :border="false" :is-show-index="true" :data="list" :table-columns-config="tableColumnsConfig">

            <template #amount="{row}">
              <span class="g-color-require">
                <!-- <count-to :end-val="row.amount - 0" :decimal-places="2" :duration="0" /> -->
                {{ row.amount - 0 }}
                元
              </span>
            </template>
          </RefactorTable>
        </div>

        <div class="receipt-data">
          <div class="receipt-row">
            <!-- <div class="ly-flex">
              <div class="word-break">
                付款方信息：
              </div>
              <div class="ly-flex-1">
                {{ recData.companyName || '--' }}
              </div>
            </div> -->

            <div>
              <div class="receipt-row-i">付款方：{{ recData.companyName || '--' }}</div>
              <div class="receipt-row-i">付款账号：{{ recData.payAccount || '--' }}</div>
              <div class="receipt-row-i">&nbsp;</div>
            </div>
          </div>
          <div class="receipt-row">
            <!-- <div class="ly-flex">
              <div class="word-break">
                收款方信息：
              </div>
              <div class="ly-flex-1">
                {{ recData.teamLeaderName || '--' }}
              </div>
            </div> -->
            <div>
              <div class="receipt-row-i">收款方：{{ recData.teamLeaderName || '--' }}</div>
              <div class="receipt-row-i">收款账号：{{ recData.payeeAccount || '--' }}</div>
              <div class="receipt-row-i">&nbsp;</div>
            </div>
          </div>
          <div class="receipt-row">
            <div>
              <div class="receipt-row-i">创建时间：{{ recData.applyTime || '--' }}</div>
              <div class="receipt-row-i">付款时间：{{ recData.updateTime || '--' }}</div>
              <div class="receipt-row-i">结束时间：{{ recData.finishTime || '--' }}</div>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
// import CountTo from '@/components/CountTo';
import { receiptInfo } from '@/api/settlement/adjustDregs';
export default {
  name: 'ReceiptDialog',
  // components: { CountTo },
  props: {
    receiptData: {
      type: Object,
      default: null
    },
    btnShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      recData: {},
      tableColumnsConfig: [
        {
          prop: 'transactionType',
          isShow: true,
          tooltip: false,
          sortNum: 0,
          align: 'left',
          width: 120,
          label: '交易类型'
        },
        {
          prop: 'projectNames',
          isShow: true,
          tooltip: false,
          sortNum: 1,
          align: 'left',
          width: 150,
          label: '项目名称'
        },
        {
          prop: 'batchNo',
          isShow: true,
          tooltip: false,
          width: 150,
          sortNum: 2,
          align: 'left',
          label: '批次号'
        },
        {
          prop: 'ztcLandNames',
          isShow: true,
          tooltip: false,
          sortNum: 3,
          align: 'left',
          width: 150,
          label: '渣土场'
        },
        {
          prop: 'amount',
          isShow: true,
          tooltip: false,
          sortNum: 4,
          align: 'left',
          width: 120,
          label: '交易金额'
        }
      ]
    };
  },

  created() {
    this.getList();
  },

  methods: {
    async getList() {
      this.loading = true;
      try {
        const res = await receiptInfo({ batchNo: this.receiptData.batchNo });
        this.list = [
          {
            transactionType: '支付',
            ...res.data
          }];
        this.recData = res.data || {};

        this.loading = false;
        this.$nextTick(() => {
          this.$emit('onsuccess', 200, this.receiptData.batchNo);
        });
      } catch (error) {
        console.log(error);
        this.$emit('onerror', 500);
        this.loading = false;
      }
    }
  }


};
</script>

<style lang="scss" scoped>
.ly-t-right .wholecont-print{
  position: static;
}
.receipt{
    position: relative;
    width: 794px;
    height: 1123px;
    margin: 0 auto;
}

.receipt-heater{
    border-top: 5px solid #00babc;
    border-bottom: 1px solid #ebebeb;
    box-shadow: 0px 6px 8px #ebebeb;
    margin-bottom: 50px;
    height: 66px;
    .receipt-heater-content{
        padding: 20px 50px;
        line-height: 1;
        display: flex;
        align-items: center;
        .m_log{
            width: 128px;
        }
    }
}

.receipt-box{
    padding: 60px 50px 0;
    height: 100%;
}
.receipt-title{
    // width: 100%;
    // line-height: 1;
    // padding: 10px 0;

    font-size: 14px;
    font-weight: bold;
    line-height: 22px;
    color: #262626;
    opacity: 1;
    height: 20px;
    padding-left: 8px;
    border-left: 4px solid #409eff;

}
.receipt-res{
    margin: 20px 0;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 25px;
    background-color: #f5fbfa;
    border: 1px solid #d0eeee;
}

.receipt-list{
    width: 100%;
    margin: 20px 0;
    border: 1px solid #f3f3f3;
    position: relative;
    .receipt_sain{
      position: absolute;
      right: 102px;
      top: -80px;
      width: 120px;
      height: 120px;
      z-index: 99;
      img.receipt_img{
        width: 100%;
        height: 100%;
      }
    }
}

.receipt-data{
    display: flex;
    padding: 30px 10px;
    background-color: #f9f9f9;
    border: 1px solid #f9f9f9;
    .word-break{
        word-break: break-all;
    }
    .receipt-row{
        // width: 33%;
        flex: 1;
        display: flex;
        justify-content: center;
        .receipt-row-i{
            padding: 5px 0;
        }
    }
}

</style>
