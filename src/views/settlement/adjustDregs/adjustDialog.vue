<template>
  <el-dialog class="i-adjust" :title="title" :visible="visible" width="1400px" :close-on-click-modal="false" append-to-body @close="cancel">



    <div>
      <el-row v-if="isPiliang" :gutter="10" class="mb8">
        <el-col :span="10">
          <span class="mr3">司机实收金额</span>
          <el-input-number
            v-model="deliveryCashFee"
            placeholder="请输入司机实收金额"
            :controls="false"
            :precision="2"
            :step="1"
            :min="0"
            size="small"
            style="width: 180px"
            class="mr3"
            @keyup.enter.native="handleChange"
          />

          <el-button type="primary" @click="handleChange">批量修改</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" highlight-current-row :data="adjustlist" border>

        <el-table-column width="160" label="运输单号" show-overflow-tooltip align="center" prop="waybillNo" />

        <el-table-column width="120" label="调度者名称" align="center" prop="teamName" />

        <el-table-column width="120" label="司机姓名" align="center" prop="driverName" />
        <el-table-column width="120" label="司机电话" align="center" prop="driverPhone" />
        <el-table-column width="120" label="车牌号" align="center" prop="licenseNumber" />

        <el-table-column width="160" label="装货数量" align="left" prop="loadWeight">
          <template slot-scope="scope">
            <span>{{ scope.row.loadWeight }}</span>
          </template>
        </el-table-column>

        <el-table-column width="160" label="卸货数量" align="left" prop="unloadWeight">
          <template slot-scope="scope">
            <span>{{ scope.row.unloadWeight }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120" label="纳税金额(元)" align="center" prop="taxPayment" fixed="right" />

        <el-table-column width="120" label="服务费(元)" align="center" prop="serviceFee" fixed="right">
          <template slot-scope="scope">
            <span> {{ floor(scope.row.serviceFee) }} </span>
          </template>
        </el-table-column>

        <el-table-column width="162" label="司机实收金额(元)" align="center" prop="deliveryCashFee" fixed="right">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.deliveryCashFee" :controls="false" :precision="2" placeholder="请输入司机实收金额" style="width:100%;" size="mini" @keyup.native="getDeliveryCashFee($event,[scope.row])" />
          </template>
        </el-table-column>

        <el-table-column width="162" label="增" align="center" prop="deductionDes" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.deductionDes" />
          </template>
        </el-table-column>
        <el-table-column width="162" label="减" align="center" prop="increaseDes" fixed="right">
          <template slot-scope="scope">
            <el-input v-model="scope.row.increaseDes" />
          </template>
        </el-table-column>

        <el-table-column width="140" label="货主实付金额(元)" align="center" prop="shipperRealPay" fixed="right">
          <template slot-scope="scope">
            <span> {{ floor(scope.row.shipperRealPay) }} </span>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="loading || !adjustlist || adjustlist.length < 1" @click="submitForm">立即核算</el-button>
      <el-button @click="cancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { adjustDetail } from '@/api/settlement/adjust';
import { immediateAccounting, calculateFee } from '@/api/settlement/adjustDregs';

import { floor } from '@/utils/ddc';
// import { DebounceFun } from '@/utils/index';

export default {
  name: 'AdjustDialog',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
  },
  data() {
    return {
      isPiliang: false,
      isEdit2: false,
      isEdit: false,
      deliveryCashFee: undefined,
      // 遮罩层
      loading: false,
      // 评价列表
      adjustlist: [],
      // 查询参数
      queryParams: {
        waybillCodeList: []
      },
      floor,
      changeFee: null,
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
  created() {
    this.changeFee = this.newDebounceFun(this.setDeliveryCashFee, 1000);
  },
  methods: {
    // 获取数据
    async getDeliveryCashFee(event, arr) {
      // 过滤其他的键盘事件

      if (event) {
        if (this.loading || (!(/^[0-9]*$/.test(event.key - 0)) && event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'Backspace')) return;
      }

      this.que = {
        deliveryCashFee: event ? event.target.value - 0 : arr[0].deliveryCashFee, //	金额		false
        waybillCodeList: arr.map(e => e.waybillCode)//	运单ids
      };
      this.changeFee(arr);
    },

    async setDeliveryCashFee(arr) {
      this.loading = true;
      try {
        const { data } = await calculateFee(this.que);
        this.loading = false;
        arr && arr.forEach(row => {
          data.forEach(da => {
            if (row.waybillCode === da.waybillCode) {
              const {
                deliveryCashFee, //	司机实收现金	number
                serviceFee, //	服务费	number
                serviceTaxFee, //	服务费税费	number
                shipperRealPay, //	货主实付金额	number
                taxPayment //	纳税金额	number
                // waybillCode //	运单CODE
              } = da;

              row.deliveryCashFee = deliveryCashFee;
              row.serviceFee = serviceFee;
              row.shipperRealPay = shipperRealPay;
              row.serviceTaxFee = floor(serviceTaxFee);
              row.taxPayment = floor(taxPayment);
            }
          });
        });
      } catch (error) {
        this.loading = false;
      }
    },

    // 防抖=需要带参数,避免和原方法冲突
    newDebounceFun(callback, time) {
      var timer;
      return function(argument) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          callback(argument);
        }, time);
      };
    },



    // 批量修改
    handleChange() {
      this.adjustlist.forEach(e => {
        e.deliveryCashFee = this.deliveryCashFee;
      });
      this.getDeliveryCashFee(undefined, this.adjustlist);
    },
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
        this.total = response.total;
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
    setForm(data, row) {
      console.log(row);
      this.isEdit2 = false;
      this.isEdit = false;

      this.isPiliang = data.length > 1;
      this.deliveryCashFee = undefined;
      this.queryParams.waybillCodeList = data;

      this.listData = row;

      this.getList();
    },

    /* 处理路耗展示 */
    _lossAllowScope(value, bool) {
      if (value) {
        const arr = value.match(/\d+(\.\d+)?/g);

        arr[0] = (arr[0] - 0) === 0 ? 0 : -arr[0];
        arr[1] = arr[1] - 0;
        if (bool) {
          arr[0] = this.floor(arr[0] / 1000, 6);
          arr[1] = this.floor(arr[1] / 1000, 6);
        }

        return JSON.stringify(arr);
      }
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
