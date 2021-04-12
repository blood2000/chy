<template>
  <!-- 评价对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body @close="cancel">
    <el-row :gutter="10" class="mb8">
      <el-col :span="10">
        <span class="mr3">司机实收金额</span>
        <!-- v-model="adjustlist.deliveryCashFee" -->
        <el-input-number
          v-model="deliveryCashFee"
          placeholder="请输入司机实收金额"
          :controls="false"
          :precision="2"
          size="small"
          style="width: 180px"
          class="mr3"
          @keyup.enter.native="handleChange"
        />


        <el-button type="primary" @click="handleChange">批量修改</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="adjustlist" border stripe>
      <!-- <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row :gutter="100">
            <el-col :span="12">

              <el-form label-position="right" label-width="80px">
                <el-form-item label="规则1">
                  <el-input v-model="scope.row.tin1.guize1" placeholder="审批人" />
                </el-form-item>
                <el-form-item label="规则2">
                  <el-input v-model="scope.row.tin1.guize2" placeholder="审批人" />
                </el-form-item>
                <el-form-item label="规则3">
                  <el-input v-model="scope.row.tin1.guize3" placeholder="审批人" />
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">

              <el-form label-position="right" label-width="80px">
                <el-form-item label="规则1">
                  <el-input v-model="scope.row.tin1.guize1" placeholder="审批人" />
                </el-form-item>
                <el-form-item label="规则2">
                  <el-input v-model="scope.row.tin1.guize2" placeholder="审批人" />
                </el-form-item>
                <el-form-item label="规则3">
                  <el-input v-model="scope.row.tin1.guize3" placeholder="审批人" />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>

        </template>
      </el-table-column> -->


      <el-table-column width="160" label="运输单号" show-overflow-tooltip align="center" prop="waybillNo" />

      <el-table-column width="120" label="司机姓名" align="center" prop="driverName" />
      <el-table-column width="120" label="司机电话" align="center" prop="driverPhone" />
      <el-table-column width="120" label="车牌号" align="center" prop="licenseNumber" />

      <el-table-column width="160" label="装车重量" align="center" prop="loadWeight">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.loadWeight" :controls="false" placeholder="请输入装车重量" style="width:100%;" size="mini" @blur="handlerBlur(scope.row, scope.row.loadWeight, 'loadWeight' )" />
        </template>
      </el-table-column>
      <el-table-column width="160" label="卸车重量" align="center" prop="unloadWeight">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.unloadWeight" :controls="false" placeholder="请输入卸车重量" style="width:100%;" size="mini" @blur="handlerBlur(scope.row, scope.row.unloadWeight, 'unloadWeight' )" />
        </template>
      </el-table-column>

      <el-table-column width="160" label="实际承运重量??" align="center" prop="tin11111111" />

      <el-table-column width="160" label="路耗" align="center" prop="loss" />
      <!-- <el-table-column width="120" label="路耗允许范围" align="center" prop="lossAllowScope" /> -->
      <el-table-column width="160" label="货物单价" align="center" prop="goodsPrice" />

      <el-table-column width="120" label="运费单价" align="center" prop="freightPrice" />

      <el-table-column width="160" label="司机成交单价" align="center" prop="freightPriceDriver" />
      <el-table-column width="160" label="亏涨扣费" align="center" prop="deduction" />


      <el-table-column width="120" label="抹零金额" align="center" prop="m0Amount" />

      <el-table-column width="160" label="司机应收运费" align="center" prop="deliveryFeeDeserved" />
      <el-table-column width="160" label="司机实收运费" align="center" prop="deliveryFeePractical" />
      <el-table-column width="160" label="司机实收抹零??" align="center" prop="tin11111111" />



      <!-- 补贴项目 -->
      <el-table-column align="center" width="500" label="补贴项目">
        <template slot="header">
          <span>扣费项目 <el-button type="text" @click="isEdit2 = !isEdit2"><i class="el-icon-edit" /></el-button></span>

        </template>
        <template slot-scope="scope">
          <el-form :inline="true" label-position="right" size="mini" class="ly-flex">
            <div v-for="(freight, index) in scope.row.subsidiesFreightList" :key="index">
              <el-form-item :label="freight.cnName">
                <span v-show="!isEdit2">{{ freight.ruleValue }}</span>
                <el-input-number v-show="isEdit2" v-model="freight.ruleValue" :controls="false" :precision="2" :placeholder="`请输入${freight.cnName}`" style="width:90px;" @blur="handlerChange(scope.row,freight.ruleValue,'add')" />
              </el-form-item>
            </div>

            <el-form-item label="其他补贴" class="ly-flex-1">
              <span v-show="!isEdit2">{{ scope.row.otherSubsidies }}</span>
              <el-input-number v-show="isEdit2" v-model="scope.row.otherSubsidies" :controls="false" :precision="2" :placeholder="`请输入其他扣款`" style="width:90px;" @blur="handlerChange(scope.row,scope.row.otherSubsidies, 'add')" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 扣费项目 -->
      <el-table-column align="center" width="500">
        <template slot="header">
          <span>扣费项目 <el-button type="text" @click="isEdit = !isEdit"><i class="el-icon-edit" /></el-button></span>

        </template>

        <template slot-scope="scope">
          <el-form :inline="true" label-position="right" size="mini" class="ly-flex">
            <div v-for="(freight, index) in scope.row.deductionFreightList" :key="index" class="ly-flex-1">
              <el-form-item :label="freight.cnName">
                <span v-show="!isEdit">{{ freight.ruleValue }}</span>
                <el-input-number v-show="isEdit" v-model="freight.ruleValue" :controls="false" :precision="2" :placeholder="`请输入${freight.cnName}`" style="width:90px;" @blur="handlerChange(scope.row,freight.ruleValue,'')" />
              </el-form-item>
            </div>

            <el-form-item label="其他扣款" class="ly-flex-1">
              <span v-show="!isEdit">{{ scope.row.otherCharges }}</span>
              <el-input-number v-show="isEdit" v-model="scope.row.otherCharges" :controls="false" :precision="2" :placeholder="`请输入其他扣款`" style="width:90px;" @blur="handlerChange(scope.row,scope.row.otherCharges, '')" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>



      <el-table-column width="120" label="纳税金额" align="center" prop="taxPayment" fixed="right" />
      <el-table-column width="120" label="服务费" align="center" prop="serviceFee" fixed="right" />
      <el-table-column width="120" label="司机实收现金" align="center" prop="deliveryCashFee" fixed="right">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.deliveryCashFee" :controls="false" :precision="2" placeholder="请输入司机实收现金" style="width:100%;" size="mini" @blur="handlerInput(scope.row,scope.row.deliveryCashFee, 'deliveryCashFee')" />
        </template>
      </el-table-column>

      <el-table-column width="120" label="货主实付金额" align="center" prop="shipperRealPay" fixed="right" />

      <!-- <el-table-column width="120" label="要扣的货主金额" align="center" prop="deductShipmentAmount" /> -->

      <!-- <el-table-column width="120" label="司机增项费用" align="center" prop="driverAddFee" />

      <el-table-column width="120" label="司机减项费用" align="center" prop="driverReductionFee" /> -->


      <!-- <el-table-column width="120" label="核算规则" align="center" prop="freightList.enName" /> -->
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即核算</el-button>
      <el-button @click="cancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { adjustDetail, calculateFee, deliveryCashFee, batchCheck } from '@/api/settlement/adjust';

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
      isEdit2: false,
      isEdit: false,
      deliveryCashFee: undefined,
      // tableColumnsConfig: [],
      // 遮罩层
      loading: false,
      // 总条数
      // total: 0,
      // 旧的数据
      oldList: [],
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
    handlerChange(row, value, key) {
      if (key === 'add') {
        row.deliveryCashFee += value;
      } else {
        row.deliveryCashFee -= value;
      }

      this.getDeliveryCashFee(row, row.deliveryCashFee);
    },

    // 司机实收现金, 改变会出发其他的扣费,和
    handlerInput(row, value, key) {
      const filterRow = this.filterRow(row);

      if (filterRow.deliveryCashFee > row.deliveryCashFee) {
        row.otherCharges = filterRow.deliveryCashFee - row.deliveryCashFee;
        filterRow.otherCharges = row.otherCharges;
      } else {
        row.otherSubsidies = row.deliveryCashFee - filterRow.deliveryCashFee;
        filterRow.otherSubsidies = row.otherSubsidies;
      }

      this.getDeliveryCashFee(row, value);
    },

    // 获取数据
    async getDeliveryCashFee(row, value) {
      const { data } = await deliveryCashFee({
        deliveryCashFee: value, //	司机实收现金		false
        shipperCode: row.shipperCode //	货主Code		false
      });

      row.serviceFee = data.serviceFee;
      row.shipperRealPay = data.shipperRealPay;
    },

    // 过滤当前
    filterRow(row) {
      return (this.oldList.filter(e => {
        return e.waybillCode === row.waybillCode;
      }))[0];
    },

    // 单项修改
    async handlerBlur(row, value, key) {
      const parame = {
        driverReductionFee: row.driverReductionFee,
        m0DictValue: row.m0DictValue,
        freightPrice: row.freightPrice,
        ruleFormulaDictValue: row.ruleFormulaDictValue,
        shipperCode: row.shipperCode,
        stowageStatus: row.stowageStatus,
        driverAddFee: row.driverAddFee,
        loadWeight: row.loadWeight,
        unloadWeight: row.unloadWeight
      };

      const { data } = await calculateFee(parame);

      // deliveryFeeDeserved	司机应收运费	number
      // driverRealFee	司机实收金额	number
      // serviceFee	平台服务费费用	number
      // serviceTaxFee	服务税费	number
      // shipperCopeFee	货主应付金额	number
      // shipperRealPay	货主实付金额	number
      // taxFreeFee	不含税价	number
      // taxPayment	纳税金额	number



      row.deliveryFeeDeserved = data.deliveryFeeDeserved;
      row.deliveryCashFee = data.driverRealFee; // ?
      row.serviceFee = data.serviceFee;
      row.serviceTaxFee = data.serviceTaxFee; // ?
      row.shipperCopeFee = data.shipperCopeFee;
      row.shipperRealPay = data.shipperRealPay;
      row.taxFreeFee = data.taxFreeFee; // ?
      row.taxPayment = data.taxPayment;
    },

    // 批量修改
    handleChange() {
      this.adjustlist.forEach(e => {
        e.deliveryCashFee = this.deliveryCashFee;
        // this.$set(e, 'deliveryCashFee', this.deliveryCashFee);
        this.handlerInput(e, this.deliveryCashFee);
      });
    },
    /** 提交按钮 */
    async submitForm() {
      const res = await batchCheck({ boList: this.adjustlist });

      console.log(res);
    },
    /** 查询核算列表 */
    getList() {
      // this.loading = true;
      adjustDetail(this.queryParams).then(response => {
        console.log(response, '查询核算列表');
        this.oldList = response.data;
        this.adjustlist = JSON.parse(JSON.stringify(response.data));
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.close();
      // this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 获取列表
    setForm(data) {
      // console.log(data);
      this.deliveryCashFee = undefined;
      this.queryParams.waybillCodeList = data;
      this.getList();
    },

    // 规则
    // ---货主应付运费（四舍五入保留两位小数）= 货主成交单价 * 承运重量；
    rule_1() {
      // const shipperCopeFee = 0
      // return 货主成交单价 * 承运重量
    }
    // ---司机应收运费（四舍五入保留两位小数）= 货主成交单价 /（1 + 税率比例） * 承运重量；
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
</style>
