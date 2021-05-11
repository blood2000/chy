<template>
  <!-- 评价对话框 -->
  <el-dialog class="i-adjust" :title="title" :visible="visible" width="1400px" :close-on-click-modal="false" append-to-body @close="cancel">
    <el-row :gutter="10" class="mb8">
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

      <el-table-column width="120" label="司机姓名" align="center" prop="driverName" />
      <el-table-column width="120" label="司机电话" align="center" prop="driverPhone" />
      <el-table-column width="120" label="车牌号" align="center" prop="licenseNumber" />

      <el-table-column width="160" label="装货重量" align="center" prop="loadWeight">
        <template slot-scope="scope">
          <el-input-number v-if="true" v-model="scope.row.loadWeight" :controls="false" placeholder="请输入装货重量" style="width:100%;" size="mini" @blur="handlerBlur(scope.row, scope.row.loadWeight, 'loadWeight' )" />

          <span v-else>{{ scope.row.loadWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" label="卸货重量" align="center" prop="unloadWeight">
        <template slot-scope="scope">
          <el-input-number v-if="true" v-model="scope.row.unloadWeight" :controls="false" placeholder="请输入卸货重量" style="width:100%;" size="mini" @blur="handlerBlur(scope.row, scope.row.unloadWeight, 'unloadWeight' )" />
          <span v-else>{{ scope.row.unloadWeight }}</span>
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
      <el-table-column align="center" width="500" label="补贴项目">
        <template slot="header">
          <span>补贴项目 <el-button type="text" @click="isEdit2 = !isEdit2"><i class="el-icon-edit" /></el-button></span>

        </template>
        <template slot-scope="scope">
          <el-form :inline="true" label-position="right" size="mini" class="ly-flex">
            <div v-for="(freight, index) in scope.row.subsidiesFreightList" :key="index">
              <el-form-item :label="freight.cnName">
                <span v-show="!isEdit2">{{ freight.ruleValue }}</span>
                <el-input-number v-show="isEdit2" v-model="freight.ruleValue" :controls="false" :precision="2" :min="0" :placeholder="`请输入${freight.cnName}`" style="width:90px;" @blur="handlerItem(scope.row,freight.ruleValue,'add',freight.enName)" />
              </el-form-item>
            </div>

            <el-form-item label="其他补贴" class="ly-flex-1">
              <span v-show="!isEdit2">{{ scope.row.otherSubsidies }}</span>
              <el-input-number v-show="isEdit2" v-model="scope.row.otherSubsidies" :controls="false" :precision="2" :min="0" :placeholder="`请输入其他扣款`" style="width:90px;" @blur="handlerChange(scope.row,scope.row.otherSubsidies, 'add')" />
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
                <el-input-number v-show="isEdit" v-model="freight.ruleValue" :controls="false" :precision="2" :min="0" :placeholder="`请输入${freight.cnName}`" style="width:90px;" @blur="handlerItem(scope.row,freight.ruleValue,'',freight.enName)" />
              </el-form-item>
            </div>

            <el-form-item label="其他扣款" class="ly-flex-1">
              <span v-show="!isEdit">{{ scope.row.otherCharges }}</span>
              <el-input-number v-show="isEdit" v-model="scope.row.otherCharges" :controls="false" :precision="2" :min="0" :placeholder="`请输入其他扣款`" style="width:90px;" @blur="handlerChange(scope.row,scope.row.otherCharges, '')" />
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
      const filterRow = this.filterRow(row);
      if (key === 'add') {
        // star1 = 未改变前, star2 = 未改变后
        const star1 = filterRow.otherSubsidies;
        const star2 = value;

        row.deliveryCashFee = filterRow.deliveryCashFee + (star2 - star1);
        filterRow.otherSubsidies = value;
      } else {
        const star1 = filterRow.otherCharges;
        const star2 = value;

        row.deliveryCashFee = filterRow.deliveryCashFee + (star1 - star2);
        filterRow.otherCharges = value;
      }

      this.getDeliveryCashFee(row, row.deliveryCashFee);
    },

    handlerItem(row, value, key, name) {
      const filterRow = this.filterRow(row);
      if (key === 'add') {
        // star1 = 未改变前, star2 = 未改变后
        const star1 = this._sum(filterRow.subsidiesFreightList);
        const star2 = this._sum(row.subsidiesFreightList);

        row.deliveryCashFee = filterRow.deliveryCashFee + (star2 - star1);
        filterRow.subsidiesFreightList.forEach(e => {
          if (e.enName === name) {
            e.ruleValue = value;
          }
        });
      } else {
        const star1 = this._sum(filterRow.deductionFreightList);
        const star2 = this._sum(row.deductionFreightList);

        row.deliveryCashFee = filterRow.deliveryCashFee + (star1 - star2);
        filterRow.deductionFreightList.forEach(e => {
          if (e.enName === name) {
            e.ruleValue = value;
          }
        });
      }

      this.getDeliveryCashFee(row, row.deliveryCashFee);
    },

    // 司机实收现金, 改变会出发其他的扣费,和
    // row 当前对象, value 修改的值, key 修改的字段名
    handlerInput(row, value, key) {
      // 获取一下未修改前的对象
      const filterRow = this.filterRow(row);

      if (filterRow[key] === value) return;

      if (!value) {
        this.msgError('司机实收现金不能为空');
        row.deliveryCashFee = filterRow.deliveryCashFee;
        return;
      }
      //  原始值 > 输入值
      if (filterRow.deliveryCashFee > value) {
        // otherCharges: 其他扣款 = 原始值 - 输入值
        row.otherCharges = filterRow.deliveryCashFee - value;

        // 原始值的其他扣款 进行同步一下
        // filterRow.otherCharges = row.otherCharges;
      } else {
        //  原始值 < 输入值
        // otherSubsidies: 其他其他补贴 = 输入值 - 原始值
        row.otherSubsidies = value - filterRow.deliveryCashFee;
        // 原始值的其他补贴 进行同步一下
        // filterRow.otherSubsidies = row.otherSubsidies;
      }

      filterRow.deliveryCashFee = value;
      this.getDeliveryCashFee(row, value);
    },

    // 获取数据
    async getDeliveryCashFee(row, value) {
      const { data } = await deliveryCashFee({
        deliveryCashFee: value, //	司机实收现金		false
        shipperCode: row.shipperCode //	货主Code		false
      });

      // 自动计算出serviceFee=> 平台服务费费用
      // 自动计算出shipperRealPay=> 货主实付金额
      // 自动计算出m0Fee=> 货主实付金额

      console.log(data);

      row.serviceFee = data.serviceFee;
      row.shipperRealPay = data.shipperRealPay;
      row.m0Fee = data.m0Fee ? data.m0Fee : row.m0Fee;

      const filterRow = this.filterRow(row);
      filterRow.deliveryCashFee = row.deliveryCashFee;
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

      if (!value) {
        this.msgError(key === 'loadWeight' ? '装货重量不能为空' : '卸货重量不能为空');
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
      // this.loading = true;
      adjustDetail(this.queryParams).then(response => {
        // console.log(response, '查询核算列表');
        this.oldList = JSON.parse(JSON.stringify(response.data));
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
</style>
