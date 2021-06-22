<template>
  <el-dialog class="i-adjust" :title="title" :visible="visible" width="1400px" :close-on-click-modal="false" append-to-body @close="cancel">
    <div v-loading="loading">
      <AdjustDitem :list="adjustlist" />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="loading || !adjustlist || adjustlist.length < 1" @click="submitForm">立即核算</el-button>
      <el-button @click="cancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import AdjustItem from './AdjustItem.vue';

import { adjustDetail } from '@/api/settlement/adjust';
import { immediateAccounting, calculateFee } from '@/api/settlement/adjustDregs';

// import { floor } from '@/utils/ddc';
// import { DebounceFun } from '@/utils/index';

// import AdjustItem from './AdjustItem.vue';
import AdjustDitem from './AdjustDitem.vue';

export default {
  name: 'AdjustDialog',
  components: { AdjustDitem },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
  },
  data() {
    return {
      // isPiliang: false,
      // isEdit2: false,
      // isEdit: false,
      // deliveryCashFee: undefined,
      // 遮罩层
      loading: false,
      // 评价列表
      adjustlist: [],
      // 查询参数
      queryParams: {
        waybillCodeList: []
      },
      // floor,
      // changeFee: null,
      que: {},
      listData: null // 外面的列表数据
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        if (!v) {
          this.adjustlist = [];
        }
        this.$emit('update:open', v);
      }
    }
  },
  // created() {
  //   this.changeFee = this.newDebounceFun(this.setDeliveryCashFee, 1000);
  // },
  methods: {
    // 获取数据
    // async getDeliveryCashFee(event, arr) {
    //   // 过滤其他的键盘事件

    //   if (event) {
    //     if (this.loading || (!(/^[0-9]*$/.test(event.key - 0)) && event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'Backspace')) return;
    //   }

    //   this.que = {
    //     deliveryCashFee: event ? event.target.value - 0 : arr[0].deliveryCashFee, //	金额		false
    //     waybillCodeList: arr.map(e => e.waybillCode)//	运单ids
    //   };
    //   this.changeFee(arr);
    // },

    // async setDeliveryCashFee(arr) {
    //   this.loading = true;
    //   try {
    //     const { data } = await calculateFee(this.que);
    //     this.loading = false;
    //     arr && arr.forEach(row => {
    //       data.forEach(da => {
    //         if (row.waybillCode === da.waybillCode) {
    //           const {
    //             deliveryCashFee, //	司机实收现金	number
    //             serviceFee, //	服务费	number
    //             serviceTaxFee, //	服务费税费	number
    //             shipperRealPay, //	货主实付金额	number
    //             taxPayment //	纳税金额	number
    //             // waybillCode //	运单CODE
    //           } = da;

    //           row.deliveryCashFee = deliveryCashFee;
    //           row.serviceFee = serviceFee;
    //           row.shipperRealPay = shipperRealPay;
    //           row.serviceTaxFee = floor(serviceTaxFee);
    //           row.taxPayment = floor(taxPayment);
    //         }
    //       });
    //     });
    //   } catch (error) {
    //     this.loading = false;
    //   }
    // },

    // 防抖=需要带参数,避免和原方法冲突
    // newDebounceFun(callback, time) {
    //   var timer;
    //   return function(argument) {
    //     clearTimeout(timer);
    //     timer = setTimeout(function() {
    //       callback(argument);
    //     }, time);
    //   };
    // },



    // 批量修改
    // handleChange() {
    //   this.adjustlist.forEach(e => {
    //     e.deliveryCashFee = this.deliveryCashFee;
    //   });
    //   this.getDeliveryCashFee(undefined, this.adjustlist);
    // },
    /** 提交按钮 */
    async submitForm() {
      const immediateWaybillBoList = this.adjustlist.map(e => {
        // deductionDes	减项说明		false
        // deliveryCashFee	司机实收现金		false
        // increaseDes	增项说明		false
        // serviceFee	服务费		false
        // serviceTaxFee	服务费税费		false
        // shipperRealPay	货主实付金额		false
        // taxPayment	纳税金额		false
        // waybillCode	运单		false
        return {
          deductionDes: e.deductionDes || '',
          increaseDes: e.increaseDes || '',
          waybillCode: e.waybillCode,
          deliveryCashFee: e.deliveryCashFee,
          // teamUserCode: e.teamUserCode,
          'serviceFee': e.serviceFee,
          'serviceTaxFee': e.serviceTaxFee,
          'shipperRealPay': e.shipperRealPay,
          'taxPayment': e.taxPayment
        };
      });
      const shipmentCodeArr = [...new Set(this.adjustlist.map(e => e.shipperCode))];

      if (shipmentCodeArr.length > 1) {
        this.msgError('存在多个货主, 请确保要同一个货主才行');
        return;
      }

      this.$confirm('确定要立即核算?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;



        // 请求参数
        const que = {
          actualTripsNum: this.listData.actualTripsNum, //	实发趟数（次）		false
          freightAmount: this.listData.freightAmount, //	运费结算金额		false
          companyName: this.listData.deliveryCompany, //	公司名称		false

          immediateWaybillBoList, //	运单金额BOList		false

          loadNum: this.listData.loadNum, //	装车数量		false
          shipmentCode: shipmentCodeArr[0], //	货主Code		false

          projectCode: this.listData.projectCode, //	项目Code		false
          settlementTripsNum: this.listData.settlementTripsNum, //	结算趟数		false
          teamCode: this.listData.teamUserCode, //	调度者code		false
          ztcCode: this.listData.ztcCode //	渣土场Code
        };

        console.log(que);


        return immediateAccounting(que);
      }).then(() => {
        this.loading = false;
        this.msgSuccess('核算成功');
        this.visible = false;
        this.$emit('refresh');
      });
    },
    /** 查询核算列表 */
    getList() {
      this.loading = true;
      adjustDetail(this.queryParams).then(response => {
        this.adjustlist = JSON.parse(JSON.stringify(response.data));
        // this.total = response.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 获取列表
    setForm(arr) {
      console.log(arr); // 所有的运单列表 组合成一个数组 里面要有运单


      // this.isEdit2 = false;
      // this.isEdit = false;

      // this.isPiliang = data.length > 1; // 判断是否显示批量操作
      // this.deliveryCashFee = undefined; // 司机金额归0
      this.queryParams.waybillCodeList = arr.map(e => e.wayBillCode); // 请求参数保存

      this.listData = arr; // 做一下保存 后面核算要

      this.getList();
    }


  }
};
</script>


<style scoped>
.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-form-item{
  margin-bottom: 0;
}
.el-table .el-input-number ::v-deep.el-input__inner {
  /* text-align: left; */
  /* border-radius: 0; */
  border: 0;
  background-color: #cceeff;
}

.ly-flex{
  flex-wrap: wrap;
}

</style>
