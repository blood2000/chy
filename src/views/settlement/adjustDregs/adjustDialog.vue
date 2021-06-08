<template>
  <!-- 评价对话框 -->
  <el-dialog class="i-adjust" :title="title" :visible="visible" width="1400px" :close-on-click-modal="false" append-to-body @close="cancel">
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

      <el-table-column width="160" label="配载方式" align="center" prop="lossAllowScope">
        <template slot-scope="scope">
          <span v-show="scope.row.stowageStatus === '0'">
            吨数配载
          </span>
          <span v-show="scope.row.stowageStatus === '1'">
            方数配载
          </span>
          <span v-show="scope.row.stowageStatus === '2'">
            车数配载
          </span>
        </template>
      </el-table-column>

      <el-table-column width="160" label="路耗" align="center" prop="loss" />

      <el-table-column width="160" label="路耗允许范围" align="center" prop="lossAllowScope">
        <template slot-scope="scope">
          <span>{{ scope.row.lossAllowScope? _lossAllowScope(scope.row.lossAllowScope) : null }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160" label="货物单价" align="center" prop="goodsPrice" />

      <el-table-column width="160" label="运费单价" align="center" prop="freightPrice" />

      <el-table-column width="160" label="司机成交单价" align="center" prop="freightPriceDriver" />
      <el-table-column width="160" label="亏涨扣费" align="center" prop="lossDeductionFee" />


      <el-table-column width="120" label="抹零金额" align="center" prop="m0Fee" />

      <el-table-column width="160" label="司机应收运费" align="center" prop="deliveryFeeDeserved" />
      <el-table-column width="160" label="司机实收运费" align="center" prop="deliveryFeePractical" />


      <el-table-column width="120" label="纳税金额" align="center" prop="taxPayment" fixed="right" />
      <el-table-column width="162" label="司机实收金额" align="center" prop="deliveryCashFee" fixed="right">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.deliveryCashFee" :controls="false" :precision="2" placeholder="请输入司机实收金额" style="width:100%;" size="mini" @blur="getDeliveryCashFee([scope.row])" />
        </template>
      </el-table-column>

    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="loading || !adjustlist || adjustlist.length < 1" @click="submitForm">立即核算</el-button>
      <el-button @click="cancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { adjustDetail } from '@/api/settlement/adjust'; // 获取列表
import { immediateAccounting, calculateFee } from '@/api/settlement/adjustDregs'; // 立即核算

import { floor } from '@/utils/ddc';


export default {
  name: 'AdjustDialog',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // disable: Boolean
  },
  data() {
    return {
      isPiliang: false,
      isEdit2: false,
      isEdit: false,
      deliveryCashFee: undefined,
      // tableColumnsConfig: [],
      // 遮罩层
      loading: false,
      // 总条数
      // total: 0,
      // 旧的数据
      // oldList: [],
      // 评价列表
      adjustlist: [],
      // 查询参数
      queryParams: {
        waybillCodeList: []
      }
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  created() {
  },
  methods: {
    // 修改了增项
    handlerChange(row, value, key) {},

    // 修改
    handlerItem(row, value, key, name) {},

    handlerInput(row, value, key) {},

    // 获取数据
    async getDeliveryCashFee(arr) {
      // console.log(arr);
      const que = {
        deliveryCashFee: arr[0].deliveryCashFee, //	金额		false
        waybillCodeList: arr.map(e => e.waybillCode)//	运单ids
      };
      const { data } = await calculateFee(que);

      arr.forEach(row => {
        data.forEach(da => {
          if (row.waybillCode === da.waybillCode) {
            const {
              // deliveryCashFee, //	司机实收现金	number
              // serviceFee, //	服务费	number
              serviceTaxFee, //	服务费税费	number
              // shipperRealPay, //	货主实付金额	number
              taxPayment //	纳税金额	number
              // waybillCode //	运单CODE
            } = da;

            // row.serviceFee = serviceFee;
            // row.shipperRealPay = shipperRealPay;
            row.serviceTaxFee = floor(serviceTaxFee);
            // row.deliveryCashFee = driverFee;
            row.taxPayment = floor(taxPayment);
          }
        });
      });
    },

    // 批量修改
    handleChange() {
      this.adjustlist.forEach(e => {
        e.deliveryCashFee = this.deliveryCashFee;
      });
      this.getDeliveryCashFee(this.adjustlist);
    },
    /** 提交按钮 */
    async submitForm() {
      const immediateWaybillBoList = this.adjustlist.map(e => {
        return {
          waybillCode: e.waybillCode,
          deliveryCashFee: e.deliveryCashFee,
          teamUserCode: e.teamUserCode,
          'serviceFee': e.serviceFee,
          'serviceTaxFee': e.serviceTaxFee,
          'shipperRealPay': e.shipperRealPay,
          'taxPayment': e.taxPayment
        };
      });
      // const teamUserCode = [...new Set(this.adjustlist.map(e => e.teamUserCode))];
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
        return immediateAccounting({ immediateWaybillBoList, shipmentCode: shipmentCodeArr[0] });
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
        // isDregs // 是否渣土   1 是 0 否 (司机实收 只有渣土1能修改)
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
    setForm(data) {
      this.isEdit2 = false;
      this.isEdit = false;

      this.isPiliang = data.length > 1;
      this.deliveryCashFee = undefined;
      this.queryParams.waybillCodeList = data;
      this.getList();
    },

    /* 处理路耗展示 */
    _lossAllowScope(value) {
      if (value) {
        const arr = value.match(/\d+(\.\d+)?/g);

        arr[0] = (arr[0] - 0) === 0 ? 0 : -arr[0];
        arr[1] = arr[1] - 0;

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
.el-input-number ::v-deep.el-input__inner {
  text-align: left;
}
.ly-flex{
  flex-wrap: wrap;
}

</style>
