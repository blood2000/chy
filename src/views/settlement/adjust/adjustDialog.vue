<template>

  <div>
    <el-dialog class="i-adjust" :title="title" :visible="visible" width="1400px" :close-on-click-modal="false" append-to-body @close="cancel">

      <el-table v-loading="loading" highlight-current-row :data="adjustlist" border>

        <el-table-column width="160" label="运输单号" show-overflow-tooltip align="center" prop="waybillNo" />

        <el-table-column width="120" label="司机姓名" align="center" prop="driverName" />
        <el-table-column width="120" label="司机电话" align="center" prop="driverPhone" />
        <el-table-column width="120" label="车牌号" align="center" prop="licenseNumber" />

        <el-table-column width="160" label="装货数量" align="left" prop="loadWeight">
          <template slot-scope="scope">
            <span v-if="scope.row.isDregs === 1">{{ scope.row.loadWeight }}</span>
            <div v-else>
              <el-input-number v-if="scope.row.stowageStatus !== '2'" v-model="scope.row.loadWeight" :controls="false" placeholder="请输入装货数量" style="width:100%;" size="mini" @blur="handlerBlur(scope.row)" />
              <span v-else>{{ scope.row.loadWeight }}</span>
            </div>

          </template>
        </el-table-column>
        <el-table-column width="160" label="卸货数量" align="left" prop="unloadWeight">
          <template slot-scope="scope">
            <span v-if="scope.row.isDregs === 1">{{ scope.row.unloadWeight }}</span>
            <div v-else>
              <el-input-number v-if="scope.row.stowageStatus !== '2'" v-model="scope.row.unloadWeight" :controls="false" placeholder="请输入卸货数量" style="width:100%;" size="mini" @blur="handlerBlur(scope.row)" />
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

        <el-table-column width="160" label="路耗(吨/方)" align="center" prop="loss">
          <template slot-scope="scope">
            <span v-if="scope.row.stowageStatus === '0'">{{ floor((scope.row.loss -0), 2) }}</span>
            <span v-else>{{ scope.row.loss || 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column width="160" label="路耗允许范围(吨/方)" align="center" prop="lossAllowScope">
          <template slot-scope="scope">
            <span>{{ scope.row.lossAllowScope? _lossAllowScope(scope.row.lossAllowScope, scope.row.stowageStatus === '0' ) : '--' }}</span>
          </template>
        </el-table-column>

        <el-table-column width="160" label="货物单价(元)" align="center" prop="goodsPrice" />

        <el-table-column width="160" label="货主成交单价(元)" align="center" prop="freightPrice" />

        <el-table-column width="160" label="司机成交单价(元)" align="center" prop="freightPriceDriver" />
        <el-table-column width="160" label="亏涨扣费(元)" align="center" prop="lossDeductionFee" />


        <el-table-column width="120" label="抹零金额(元)" align="center" prop="m0Fee" />

        <el-table-column width="160" label="司机实收运费(元)" align="center" prop="deliveryFeePractical" />

        <!-- 补贴项目 -->
        <el-table-column align="center" width="420" label="补贴项目">
          <template slot="header">
            <span>补贴项目
              <el-button type="text" @click="isEdit2 = !isEdit2"><i class="el-icon-edit" /></el-button>

              <!-- <el-button type="text" @click="handlerPlus"><i class="el-icon-plus" /></el-button> -->
              <!-- 1: 是增 2: 是减 -->
              <PopoverCom :list="showSubList" />
            </span>

          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.isDregs == 1"> -- </span>

            <el-form v-else :inline="true" label-position="right" size="mini" class="ly-flex" label-width="110px">
              <div v-for="(freight, index) in scope.row.subsidiesFreightList" :key="index">
                <!-- 渣土 其他不能修改 -->
                <el-form-item :label="freight.cnName + '(元)'">
                  <span v-if="scope.row.isDregs === 1">{{ freight.ruleValue }}</span>
                  <div v-else>
                    <span v-show="!isEdit2">{{ freight.ruleValue }}</span>
                    <el-input-number v-show="isEdit2" v-model="freight.ruleValue" :controls="false" :precision="2" :min="0" :placeholder="`${freight.cnName}`" style="width:110px;" @blur="handlerBlur(scope.row)" />
                  </div>
                </el-form-item>
              </div>

            </el-form>
          </template>
        </el-table-column>
        <!-- 扣费项目 -->
        <el-table-column align="center" width="420">
          <template slot="header">
            <span>扣费项目 <el-button type="text" @click="isEdit = !isEdit"><i class="el-icon-edit" /></el-button></span>
          </template>

          <template slot-scope="scope">
            <span v-if="scope.row.isDregs == 1"> -- </span>

            <el-form v-else :inline="true" label-position="right" size="mini" class="ly-flex" label-width="110px">
              <div v-for="(freight, index) in scope.row.deductionFreightList" :key="index">
                <el-form-item :label="freight.cnName + '(元)'">
                  <div>
                    <span v-show="!isEdit">{{ freight.ruleValue }}</span>
                    <el-input-number v-show="isEdit" v-model="freight.ruleValue" :controls="false" :precision="2" :min="0" :placeholder="`${freight.cnName}`" style="width:110px;" @blur="handlerBlur(scope.row)" />
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </template>
        </el-table-column>



        <el-table-column width="120" label="纳税金额(元)" align="center" prop="taxPayment" fixed="right">
          <template slot-scope="scope">
            <span> {{ floor(scope.row.taxPayment) }} </span>
          </template>
        </el-table-column>
        <el-table-column width="120" label="服务费(元)" align="center" prop="serviceFee" fixed="right">
          <template slot-scope="scope">
            <span> {{ floor(scope.row.serviceFee) }} </span>
          </template>
        </el-table-column>
        <el-table-column width="162" label="司机实收金额(元)" align="center" prop="deliveryCashFee" fixed="right">
          <template slot-scope="scope">
            <span>{{ floor(scope.row.deliveryCashFee) }}</span>
          </template>
        </el-table-column>

        <el-table-column width="140" label="货主实付金额(元)" align="center" prop="shipperRealPay" fixed="right">
          <template slot-scope="scope">
            <span> {{ floor(scope.row.shipperRealPay) }} </span>
          </template>
        </el-table-column>

      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">立即核算</el-button>
        <el-button @click="cancel">返回</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

import PopoverCom from './components/PopoverCom';
// import chooseItemDialog from '@/views/enterprise/rules/chooseItemDialog';
import { adjustDetail, calculateFee, batchCheck } from '@/api/settlement/adjust';
import { getRuleItemList } from '@/api/enterprise/rules';
import { floor } from '@/utils/ddc';


export default {
  name: 'AdjustDialog',
  components: { PopoverCom },
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

      showSubList: [],
      // fixed: [], // 固定的规则
      // title12: '',
      // open12: false,
      // shipmentCode: '',

      //
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
      floor
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

  // watch: {
  //   ruleDetails(val) {
  //     console.log(val);
  //   }
  // },
  created() {
    this.getRuleLists();
  },

  methods: {
    handlerInput(val) {
      console.log(val);
      this.adjustlist.forEach(e => {
        e.subsidiesFreightList = val;
      });
      // this.$forceUpdate();
    },


    // 单项修改
    async handlerBlur(row) {
      const {
        m0DictValue,
        freightPrice,
        ruleFormulaDictValue,
        shipperCode,
        stowageStatus,
        loadWeight,
        unloadWeight,
        waybillCode,
        subsidiesFreightList,
        deductionFreightList
        // serviceFee,
        // serviceTaxFee,
        // taxPayment

      } = row;

      const parame = {
        driverReductionFee: this._sum(deductionFreightList),
        m0DictValue,
        freightPrice,
        ruleFormulaDictValue,
        shipperCode,
        stowageStatus,
        driverAddFee: this._sum(subsidiesFreightList),
        loadWeight,
        unloadWeight,
        waybillCode
        // serviceFee,
        // serviceTaxFee,
        // taxPayment
      };
      if (this.loading) return;
      this.loading = true;
      try {
        const { data } = await calculateFee(parame);
        this.loading = false;
        const {
          deliveryFeeDeserved, //	司机应收运费	number
          driverRealFee, //	司机实收金额	number
          serviceFee, //	平台服务费费用	number
          serviceTaxFee, //	服务税费	number
          shipperCopeFee, //	货主应付金额	number
          shipperRealPay, //	货主实付金额	number
          taxFreeFee, //	不含税价	number
          taxPayment, //	纳税金额	number
          m0Fee,
          loss
        } = data;



        row.deliveryFeeDeserved = deliveryFeeDeserved;
        row.deliveryCashFee = driverRealFee; // ?
        row.serviceFee = serviceFee;
        row.serviceTaxFee = serviceTaxFee; // ?
        row.shipperCopeFee = shipperCopeFee;
        row.shipperRealPay = shipperRealPay;
        row.taxFreeFee = taxFreeFee; // ?
        row.taxPayment = taxPayment;
        row.m0Fee = m0Fee;
        row.loss = loss;
      } catch (error) {
        this.loading = false;
        return;
      }
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
          'freightList': (e.deductionFreightList || []).concat(e.subsidiesFreightList),
          'freightPrice': e.freightPrice,
          'goodsPrice': e.goodsPrice,
          'loadWeight': e.loadWeight,
          'lossDeductionFee': e.lossDeductionFee,
          'm0Amount': e.m0Amount,
          'm0Fee': e.m0Fee,
          'otherCharges': e.otherCharges,
          'otherSubsidies': e.otherSubsidies,
          'serviceFee': e.serviceFee,
          'serviceTaxFee': e.serviceTaxFee,
          'taxPayment': e.taxPayment,
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

        const felexes = [...this.adjustlist[0].subsidiesFreightList, ...this.adjustlist[0].deductionFreightList];



        this.showSubList.forEach(e => {
          felexes.forEach(ee => {
            if (e.enName === ee.enName) {
              e.ee = ee;
              e.$_disabled = true;
            }
          });
        });
        console.log(this.showSubList);

        this.total = response.total;
        this.loading = false;
      });
    },

    getRuleLists() {
      const que = {
        ruleType: 0
      };
      getRuleItemList(que).then(response => {
        this.showSubList = response.data.list.filter(e => {
          return e.showType === 1;
        });
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
      this.deliveryCashFee = undefined;
      this.queryParams.waybillCodeList = data;
      this.getList();
    },

    // 处理增减
    handlerPlus() {
      this.$refs.RulesDialog.reset();
      this.open12 = true;
      this.title12 = '添加';
      this.$refs.RulesDialog.setLossList();
    },

    /* 计算价格 */
    _sum(arr = []) {
      let sum = 0;
      arr.forEach(e => {
        sum += (e.ruleValue - 0);
      });
      return sum;
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
