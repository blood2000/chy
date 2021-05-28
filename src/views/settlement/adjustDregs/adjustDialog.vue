<template>
  <!-- 评价对话框 -->
  <el-dialog class="i-adjust" :title="title" :visible="visible" width="1400px" :close-on-click-modal="false" append-to-body @close="cancel">
    <el-row v-if="isPiliang" :gutter="10" class="mb8">
      <el-col :span="10">
        <span class="mr3">司机实收金额</span>
        <!-- v-model="adjustlist.deliveryCashFee" -->
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
        <!-- :max="999999" -->


        <el-button type="primary" @click="handleChange">批量修改</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="adjustlist" border stripe>

      <el-table-column width="160" label="运输单号" show-overflow-tooltip align="center" prop="waybillNo" />

      <el-table-column width="120" label="调度组名称" align="center" prop="driverName" />

      <el-table-column width="120" label="司机姓名" align="center" prop="driverName" />
      <el-table-column width="120" label="司机电话" align="center" prop="driverPhone" />
      <el-table-column width="120" label="车牌号" align="center" prop="licenseNumber" />

      <!-- stowageStatus "配载方式 0->吨，1->方 2->车数配载" -->
      <el-table-column width="160" label="装货数量" align="left" prop="loadWeight">
        <template slot-scope="scope">
          <span v-if="scope.row.isDregs === 1">{{ scope.row.loadWeight }}</span>
          <div v-else>
            <el-input-number v-if="scope.row.stowageStatus !== '2'" v-model="scope.row.loadWeight" :controls="false" placeholder="请输入装货数量" style="width:100%;" size="mini" @blur="handlerBlur(scope.row, scope.row.loadWeight, 'loadWeight' )" />
            <span v-else>{{ scope.row.loadWeight }}</span>
          </div>

        </template>
      </el-table-column>
      <el-table-column width="160" label="卸货数量" align="left" prop="unloadWeight">
        <template slot-scope="scope">
          <span v-if="scope.row.isDregs === 1">{{ scope.row.unloadWeight }}</span>
          <div v-else>
            <el-input-number v-if="scope.row.stowageStatus !== '2'" v-model="scope.row.unloadWeight" :controls="false" placeholder="请输入卸货数量" style="width:100%;" size="mini" @blur="handlerBlur(scope.row, scope.row.unloadWeight, 'unloadWeight' )" />
            <span v-else>{{ scope.row.unloadWeight }}</span>
          </div>
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

      <!-- 补贴项目 -->
      <el-table-column v-if="false" align="center" width="400" label="补贴项目">
        <template slot="header">
          <span>补贴项目 <el-button type="text" @click="isEdit2 = !isEdit2"><i class="el-icon-edit" /></el-button></span>

        </template>
        <template slot-scope="scope">
          <el-form :inline="true" label-position="right" size="mini" class="ly-flex" label-width="80px">
            <div v-for="(freight, index) in scope.row.subsidiesFreightList" :key="index">
              <!-- 渣土 其他不能修改 -->
              <el-form-item :label="freight.cnName">
                <span v-if="scope.row.isDregs === 1">{{ freight.ruleValue }}</span>
                <div v-else>
                  <span v-show="!isEdit2">{{ freight.ruleValue }}</span>
                  <el-input-number v-show="isEdit2" v-model="freight.ruleValue" :controls="false" :precision="2" :min="0" :placeholder="`${freight.cnName}`" style="width:90px;" @blur="handlerItem(scope.row,freight.ruleValue,'add',freight.enName)" />
                </div>
              </el-form-item>
            </div>

            <el-form-item label="其他补贴">
              <span v-if="scope.row.isDregs === 1">{{ scope.row.otherSubsidies }}</span>
              <div v-else>
                <span v-show="!isEdit2">{{ scope.row.otherSubsidies }}</span>
                <el-input-number v-show="isEdit2" v-model="scope.row.otherSubsidies" :controls="false" :precision="2" :min="0" :placeholder="`其他扣款`" style="width:90px;" @blur="handlerChange(scope.row,scope.row.otherSubsidies, 'add')" />
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 扣费项目 -->
      <el-table-column v-if="false" align="center" width="400">
        <template slot="header">
          <span>扣费项目 <el-button type="text" @click="isEdit = !isEdit"><i class="el-icon-edit" /></el-button></span>

        </template>

        <template slot-scope="scope">
          <el-form :inline="true" label-position="right" size="mini" class="ly-flex" label-width="80px">
            <div v-for="(freight, index) in scope.row.deductionFreightList" :key="index">
              <el-form-item :label="freight.cnName">

                <span v-if="scope.row.isDregs === 1">{{ freight.ruleValue }}</span>

                <div v-else>
                  <span v-show="!isEdit">{{ freight.ruleValue }}</span>
                  <el-input-number v-show="isEdit" v-model="freight.ruleValue" :controls="false" :precision="2" :min="0" :placeholder="`${freight.cnName}`" style="width:90px;" @blur="handlerItem(scope.row,freight.ruleValue,'',freight.enName)" />
                </div>
              </el-form-item>
            </div>

            <el-form-item label="其他扣款">
              <span v-if="scope.row.isDregs === 1">{{ scope.row.otherCharges }}</span>
              <div v-else>
                <span v-show="!isEdit">{{ scope.row.otherCharges }}</span>
                <el-input-number v-show="isEdit" v-model="scope.row.otherCharges" :controls="false" :precision="2" :min="0" :placeholder="`其他扣款`" style="width:90px;" @blur="handlerChange(scope.row,scope.row.otherCharges, '')" />
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>



      <el-table-column width="120" label="纳税金额" align="center" prop="taxPayment" fixed="right" />
      <el-table-column width="120" label="服务费" align="center" prop="serviceFee" fixed="right" />
      <el-table-column width="162" label="司机实收金额" align="center" prop="deliveryCashFee" fixed="right">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.deliveryCashFee }}</span> -->
          <el-input-number v-model="scope.row.deliveryCashFee" :controls="false" :precision="2" placeholder="请输入司机实收金额" style="width:100%;" size="mini" @blur="handlerInput(scope.row,scope.row.deliveryCashFee, 'deliveryCashFee')" />
        </template>
      </el-table-column>

      <el-table-column width="120" label="货主实付金额" align="center" prop="shipperRealPay" fixed="right" />

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
      if (!value && value !== 0) return;
      this.gongshi(row);
      this.getDeliveryCashFee(row);
    },

    // 修改
    handlerItem(row, value, key, name) {
      if (!value && value !== 0) return;

      this.gongshi(row);
      this.getDeliveryCashFee(row);
    },

    handlerInput(row, value, key) {
      if (!value && value !== 0) {
        this.msgError('司机实收现金不能为空');
        return;
      }

      this.otherdeValue(row);

      this.getDeliveryCashFee(row);
    },

    // 获取数据
    async getDeliveryCashFee(row) {
      const { data } = await deliveryCashFee({
        deliveryCashFee: row.deliveryCashFee, //	司机实收现金		false
        m0DictValue: row.m0DictValue,
        waybillCode: row.waybillCode,
        // deliveryFeeDeserved: row.deliveryFeeDeserved, // 司机应收运费
        shipperCode: row.shipperCode //	货主Code		false
      });


      row.serviceFee = data.serviceFee;
      row.shipperRealPay = data.shipperRealPay;
      row.m0Fee = data.m0Fee;
      row.deliveryCashFee = data.driverFee;
      row.taxPayment = data.taxPayment;

      row.tin_deliveryCashFee = row.deliveryCashFee;
    },

    // 过滤当前
    filterRow(row) {
      return (this.oldList.filter(e => {
        return e.waybillCode === row.waybillCode;
      }))[0];
    },

    // 单项修改
    async handlerBlur(row, value, key) {
      const filterRow = this.filterRow(row);

      if (filterRow[key] === value) return;

      if (!value && value !== 0) {
        this.msgError(key === 'loadWeight' ? '装货数量不能为空' : '卸货数量不能为空');
        row[key] = filterRow[key];
        return;
      }

      const parame = {
        driverReductionFee: row.driverReductionFee,
        m0DictValue: row.m0DictValue,
        freightPrice: row.freightPrice,
        ruleFormulaDictValue: row.ruleFormulaDictValue,
        shipperCode: row.shipperCode,
        stowageStatus: row.stowageStatus,
        driverAddFee: row.driverAddFee,
        loadWeight: row.loadWeight,
        unloadWeight: row.unloadWeight,
        waybillCode: row.waybillCode
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
      row.m0Fee = data.m0Fee;
      row.loss = data.loss;

      filterRow.deliveryCashFee = row.deliveryCashFee;
      filterRow[key] = row[key];
    },

    // 批量修改
    handleChange() {
      this.adjustlist.forEach(e => {
        // deliveryCashFee => 司机实收现金
        e.deliveryCashFee = this.deliveryCashFee;

        this.handlerInput(e, this.deliveryCashFee);
      });
    },
    /** 提交按钮 */
    async submitForm() {
      const boList = this.adjustlist.map(e => {
        return {
          'deduction': e.deduction,
          'deliveryCashFee': e.deliveryCashFee,
          'deliveryFeeDeserved': e.deliveryFeeDeserved,
          'deliveryFeePractical': e.deliveryFeePractical,
          'driverAddFee': e.driverAddFee,
          'driverReductionFee': e.driverReductionFee,
          'freightList': e.deductionFreightList.concat(e.subsidiesFreightList),
          'freightPrice': e.freightPrice,
          'goodsPrice': e.goodsPrice,
          'loadWeight': e.loadWeight,
          'lossDeductionFee': e.lossDeductionFee,
          'm0Amount': e.m0Amount,
          'm0Fee': e.m0Fee,
          'otherCharges': e.otherCharges,
          'otherSubsidies': e.otherSubsidies,
          'serviceFee': e.serviceFee,
          'shipperCopeFee': e.shipperCopeFee,
          'shipperRealPay': e.shipperRealPay,
          'unloadWeight': e.unloadWeight,
          'waybillCode': e.waybillCode
        };
      });


      this.$confirm('确定要立即核算?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return batchCheck({ boList });
      }).then(() => {
        // this.getList();
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

        this.oldList = JSON.parse(JSON.stringify(response.data));
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

    /* 工具 */
    _dataSync(obj1, obj2) {
      Object.keys(obj1).forEach(prop => {
        obj1[prop] = obj2[prop]; // 需要同步的两个对象
      });
    },
    /* 计算价格 */
    _sum(arr) {
      let sum = 0;
      arr.forEach(e => {
        sum += (e.ruleValue - 0);
      });
      return sum;
    },
    _mynum(arr, key) {
      const valueobj = (arr.filter(e => e.enName === key))[0];
      return valueobj ? valueobj.ruleValue : undefined;
    },


    /* 处理路耗展示 */
    _lossAllowScope(value) {
      if (value) {
        const arr = value.match(/\d+(\.\d+)?/g);

        arr[0] = (arr[0] - 0) === 0 ? 0 : -arr[0];
        arr[1] = arr[1] - 0;

        return JSON.stringify(arr);
      }
    },

    /* 计算公式1 */
    gongshi(row) {
      const shazhi = this.sharzhi(row);
      const { otherSubsidies, otherCharges, subsidiesFreightList, deductionFreightList } = row;

      const rowsubsidies = this._sum(subsidiesFreightList);
      const rowdeduction = this._sum(deductionFreightList);

      row.deliveryCashFee = ((rowsubsidies + otherSubsidies) - (rowdeduction + otherCharges)) + shazhi;
    },
    /* 计算公式2 */
    otherdeValue(row) {
      const shazhi = this.sharzhi(row);
      const { deliveryCashFee, otherSubsidies, otherCharges, subsidiesFreightList, deductionFreightList } = row;
      const rowsubsidies = this._sum(subsidiesFreightList);
      const rowdeduction = this._sum(deductionFreightList);

      // row.tin_deliveryCashFee 上一次修改的值
      if (deliveryCashFee >= (row.tin_deliveryCashFee || deliveryCashFee)) {
        row.otherSubsidies = (deliveryCashFee - shazhi) + (rowdeduction + otherCharges) - rowsubsidies;
      } else {
        row.otherCharges = (rowsubsidies + otherSubsidies) + shazhi - deliveryCashFee - rowdeduction;
      }
    },

    /* 计算公式 a */
    aa() {


      // ---货主应付运费（四舍五入保留两位小数）= 货主成交单价 * 承运重量；
      // ---司机应收运费（四舍五入保留两位小数）= 货主成交单价 /（1 + 税率比例） * 承运重量；
      // a、货主实付金额（四舍五入保留两位小数）= 司机实收金额  + 平台服务金额；
      // b、司机实收金额（四舍五入保留两位小数,再应用抹零规则） =  货主成交单价 /（1 + 税率比例） * 承运重量 - 扣费 + 补贴；
      // c、平台服务金额（四舍五入保留两位小数）= 货主应付运费 - 司机应收运费 ；


    },

    /* 计算差值 */
    sharzhi(row) {
      const { deliveryCashFee, otherSubsidies, otherCharges, subsidiesFreightList, deductionFreightList } = this.filterRow(row);
      const subsidies = this._sum(subsidiesFreightList);
      const deduction = this._sum(deductionFreightList);
      return deliveryCashFee - ((subsidies + otherSubsidies) - (deduction + otherCharges));
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
