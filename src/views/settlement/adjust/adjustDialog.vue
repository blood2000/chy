<template>
  <div>
    <!-- <el-dialog v-loading="adjustLoading" class="i-adjust" :title="title" :visible="visible" width="1400px" :close-on-click-modal="false" append-to-body @close="cancel"> -->
    <el-drawer
      size="96%"
      title="核算"
      :visible.sync="visible"
      direction="rtl"
      append-to-body
      destroy-on-close
      :before-close="cancel"
      class="page-shipment-manage-dialog"
    >
      <div slot="title" class="m20 ly-flex-align-center">
        <div>
          <span class="mr10">批量修改(元)： </span>
          <el-select v-model="selectedValue" size="small" placeholder="请选择" class="mr10">
            <el-option-group
              v-for="group in openShowList"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="(item, index) in group.options"
                :key="index"
                :label="item.cnName"
                :value="item.enName"
              />
            </el-option-group>
          </el-select>
          <el-input-number v-model="selectedNum" style="width:200px;" size="small" controls-position="right" :min="0" :precision="2" placeholder="请输入批量修改的值" @keyup.enter.native="handleSelectedNumChange" />
          <el-button size="small" class="m20" type="primary" :disabled="!modify" :loading="plLoading" @click="handleSelectedNumChange">立即修改</el-button>
        </div>
      </div>

      <div class="cont-frame">
        <el-table v-loading="loading" height="780" highlight-current-row :data="adjustlist" border :row-class-name="tableRowClassName" @row-click="showImg">
          <el-table-column width="160" label="运输单号" show-overflow-tooltip align="center" prop="waybillNo">
            <!-- <template slot-scope="scope">
              <div>
                <span class="mr10">{{ scope.row.waybillNo }}</span>

                <el-popover
                  placement="right"
                  :tabindex="scope.$index"
                  trigger="click"
                >
                  <div v-if="visible">
                    <ImgShow :rowdata="scope.row" />
                  </div>
                  <i slot="reference" class="el-icon-warning shou" />
                </el-popover>
              </div>
            </template> -->
          </el-table-column>
          <el-table-column width="120" label="司机姓名" align="center" prop="driverName" />
          <el-table-column width="120" label="司机电话" align="center" prop="driverPhone" />
          <el-table-column width="120" label="车牌号" align="center" prop="licenseNumber" />
          <el-table-column width="120" label="装货数量" align="center" prop="loadWeight">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.isDregs === 1">{{ scope.row.loadWeight }}</span> -->
              <span v-if="scope.row.isDregs === 1">{{ floor(scope.row.loadWeight, scope.row.stowageStatus === '2'? 0: 3) }}</span>
              <div v-else>
                <el-input-number
                  v-if="scope.row.stowageStatus !== '2'"
                  v-model="scope.row.loadWeight"
                  :precision="3"
                  :controls="false"
                  placeholder="请输入装货数量"
                  style="width:100%;"
                  size="mini"
                  @change="handlerChangev(scope.row)"
                  @keyup.enter.native="handlerChangev(scope.row)"
                />
                <!-- @keyup.native="handlerBlur($event,scope.row,false,'loadWeight')" -->
                <!-- <span v-else>{{ scope.row.loadWeight }}</span> -->
                <span v-else>{{ floor(scope.row.loadWeight, scope.row.stowageStatus === '2'? 0: 3) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120" label="卸货数量" align="center" prop="unloadWeight">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.isDregs === 1">{{ scope.row.unloadWeight }}</span> -->
              <span v-if="scope.row.isDregs === 1">{{ floor(scope.row.unloadWeight, scope.row.stowageStatus === '2'? 0: 3) }}</span>
              <div v-else>
                <el-input-number
                  v-if="scope.row.stowageStatus !== '2'"
                  v-model="scope.row.unloadWeight"
                  :precision="3"
                  :controls="false"
                  placeholder="请输入卸货数量"
                  style="width:100%;"
                  size="mini"
                  @change="handlerChangev(scope.row)"
                  @keyup.enter.native="handlerChangev(scope.row)"
                />
                <!-- @keyup.native="handlerBlur($event,scope.row,false,'unloadWeight')" -->
                <!-- <span v-else>{{ scope.row.unloadWeight }}</span> -->
                <span v-else>{{ floor(scope.row.unloadWeight, scope.row.stowageStatus === '2'? 0: 3) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="80" label="配载方式" align="center" prop="lossAllowScope">
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
          <!-- <el-table-column width="160" label="司机成交单价(元)" align="center" prop="freightPriceDriver" /> -->
          <el-table-column width="160" label="亏涨扣费(元)" align="center" prop="lossDeductionFee">
            <template slot-scope="scope">
              <span>{{ floor(scope.row.lossDeductionFee) }}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" label="抹零金额(元)" align="center" prop="m0Fee" />
          <!-- <el-table-column width="160" label="司机应收运费(元)" align="center" prop="deliveryFeePractical" /> -->
          <el-table-column width="160" label="司机应收运费(元)" align="center" prop="deliveryFeeDeserved">
            <template slot-scope="scope">
              <span>{{ floor(scope.row.deliveryFeeDeserved) }}</span>
            </template>
          </el-table-column>
          <!-- 补贴项目 -->
          <el-table-column align="center" width="450" label="补贴项目">
            <template slot="header">
              <span>补贴项目
                <el-button type="text" @click="isEdit2 = !isEdit2"><i class="el-icon-edit" /></el-button>

                <el-button type="text" @click="handlerClick"><i class="el-icon-plus" /></el-button>

                <!-- 1: 是增 2: 是减
              <el-popover
                placement="right"
                width="400"
                trigger="click"
              >
                <PopoverCom v-if="popoverOpenCom" :list="felexes" />
                <el-button slot="reference" type="text" @click="handlerClick"><i class="el-icon-plus" /></el-button>
              </el-popover> -->
              </span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.isDregs == 1"> -- </span>

              <el-form v-else :inline="true" label-position="right" size="mini" class="ly-flex" label-width="100px">
                <div v-for="(freight, index) in scope.row.subsidiesFreightList" :key="index">
                  <!-- 渣土 其他不能修改 -->
                  <el-form-item :label="freight.cnName + '(元)'">
                    <span v-if="scope.row.isDregs === 1">{{ freight.ruleValue }}</span>
                    <div v-else>
                      <span v-show="!isEdit2">{{ freight.ruleValue }}</span>
                      <el-input-number
                        v-show="isEdit2"
                        v-model="freight.ruleValue"
                        :controls="false"
                        :precision="2"
                        :min="0"
                        :placeholder="`${freight.cnName}`"
                        style="width:100px;"
                        @change="handlerChangev(scope.row)"
                        @keyup.enter.native="handlerChangev(scope.row)"
                      />
                    <!-- @keyup.native="handlerBlur($event,scope.row, freight)" -->
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </el-table-column>
          <!-- 扣费项目 -->
          <el-table-column align="center" width="450" label="扣费项目">
            <template slot="header">
              <span>扣费项目
                <el-button type="text" @click="isEdit = !isEdit"><i class="el-icon-edit" /></el-button>
                <el-button type="text" @click="handlerdeduc"><i class="el-icon-plus" /></el-button>
              </span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.isDregs == 1"> -- </span>
              <el-form v-else :inline="true" label-position="right" size="mini" class="ly-flex" label-width="100px">
                <div v-for="(freight, index) in scope.row.deductionFreightList" :key="index">
                  <el-form-item :label="freight.cnName + '(元)'">
                    <div>
                      <span v-show="!isEdit">{{ freight.ruleValue }}</span>
                      <el-input-number
                        v-show="isEdit"
                        v-model="freight.ruleValue"
                        :controls="false"
                        :precision="2"
                        :min="0"
                        :placeholder="`${freight.cnName}`"
                        style="width:100px;"
                        @change="handlerChangev(scope.row)"
                        @keyup.enter.native="handlerChangev(scope.row)"
                      />
                    <!-- @keyup.native="handlerBlur($event,scope.row, freight)" -->
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
        <ImgShow :rowdata="rowData" />
      </div>


      <div class="drawer-footer">
        <el-button type="primary" :loading="plLoading" @click="submitForm">立即核算</el-button>
        <el-button @click="cancel">返回</el-button>
      </div>
    </el-drawer>
    <!-- </el-dialog> -->

    <el-dialog :title="'规则'" class="i-price" :visible.sync="popoverOpenCom" append-to-body>
      <div slot="title" class="ly-flex">
        <div class="b">规则</div>
        <div v-if="isDifferent && (!isDifferent.sublength || !isDifferent.dedlength)" style="flex:1;margin: 0 50px;">
          <el-alert
            :title="warningtitle"
            type="warning"
            effect="dark"
          />
        </div>
      </div>
      <PopoverCom v-if="popoverOpenCom" :seleced-name="selecedName" :jian-data="jianData" :list="showSubList" @submitForm="handlerSubmit" />
    </el-dialog>
  </div>
</template>

<script>

import PopoverCom from './components/PopoverCom';
import ImgShow from './components/ImgShow';
// import chooseItemDialog from '@/views/enterprise/rules/chooseItemDialog';
import { adjustDetail, calculateFee, batchCheck, batchCalculate } from '@/api/settlement/adjust';
import { getRuleItemList } from '@/api/enterprise/rules';
import { floor, objReduce } from '@/utils/ddc';


export default {
  name: 'AdjustDialog',
  components: { PopoverCom, ImgShow },
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
      windShow: false, // 规则不一样提示

      plLoading: false, // 批量
      selectedValue: '', // 下拉值
      selectedNum: undefined,
      showSubList: [],
      popoverOpenCom: false,
      mtype: '1',
      subsidiesClone: [],
      deductionClone: [],
      selecedName: [],
      jianData: [],
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
      loading1: false,
      // 评价列表
      adjustlist: [],
      // 查询参数
      queryParams: {
        waybillCodeList: []
      },
      floor,
      errList: [],
      className: '',
      adjustLoading: false,
      changeFee: null,
      rowData: {}
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
    },

    openShowList() {
      // const list = this.adjustlist[0] || {};
      // const arr = [{
      //   label: '补贴项目',
      //   options: list.subsidiesFreightList || []
      // }, {
      //   label: '扣费项目',
      //   options: list.deductionFreightList || []
      // }];

      const subList = [];
      const dedList = [];
      this.adjustlist.forEach(e => {
        e.subsidiesFreightList && e.subsidiesFreightList.forEach(ee => {
          subList.push(ee);
        });
        e.deductionFreightList && e.deductionFreightList.forEach(ee => {
          dedList.push(ee);
        });
      });
      // console.log(objReduce(subList, 'enName'));
      // console.log(objReduce(dedList, 'enName'));
      const arr = [{
        label: '补贴项目',
        options: objReduce(subList, 'enName')
      }, {
        label: '扣费项目',
        options: objReduce(dedList, 'enName')
      }];

      // console.log(arr);


      return arr;
    },

    modify() {
      return this.selectedValue && this.selectedNum > 0;
    },

    // 简单提示增减项不一样
    isDifferent() {
      // const bool = true;
      const sublength = [];
      const dedlength = [];
      this.adjustlist.forEach(e => {
        sublength.push(e.subsidiesFreightList ? e.subsidiesFreightList.length : 0);
        dedlength.push(e.deductionFreightList ? e.deductionFreightList.length : 0);
      });


      return {
        sublength: [...new Set(sublength)].length <= 1,
        dedlength: [...new Set(dedlength)].length <= 1
      };
    },
    // 警告提示语
    warningtitle() {
      const sa = this.isDifferent.sublength ? '' : '补贴项目规则数量不同。';
      const sb = this.isDifferent.dedlength ? '' : '扣费项目规则数量不同。';

      return sa + sb + '建议: 核算选择一样的规则再进行批量处理!'; // 批量处理。
    }
  },

  created() {
    this.changeFee = this.newDebounceFun(this.setDeliveryCashFee, 1000);
  },

  methods: {
    showImg(row) {
      this.rowData = row;
    },
    // 数字change事件
    handlerChangev(row) {
      // console.log(row, 'oooo');
      const parame = {
        driverReductionFee: this._sum(row.deductionFreightList),
        m0DictValue: row.m0DictValue,
        freightPrice: row.freightPrice,
        ruleFormulaDictValue: row.ruleFormulaDictValue,
        shipperCode: row.shipperCode,
        stowageStatus: row.stowageStatus,
        driverAddFee: this._sum(row.subsidiesFreightList),
        loadWeight: row.loadWeight,
        unloadWeight: row.unloadWeight,
        waybillCode: row.waybillCode
        // serviceFee,
        // serviceTaxFee,
        // taxPayment
      };


      this.changeFee(parame, row);
    },

    // handlerInput(val) {
    //   // console.log(val);
    //   this.adjustlist.forEach(e => {
    //     e.subsidiesFreightList = val;
    //   });
    //   // this.$forceUpdate();
    // },


    // 单项修改
    // async handlerBlur(event, row, freight, keyName) {
    //   if (event) {
    //     if (this.loading || (!(/^[0-9]*$/.test(event.key - 0)) && event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'Backspace')) return;
    //   }

    //   if (freight) {
    //     // event.target.value - 0 enName freight.enName   ruleValue
    //     if (freight.type === '1') {
    //       row.subsidiesFreightList && row.subsidiesFreightList.forEach(e => {
    //         if (e.enName === freight.enName) {
    //           e.ruleValue = event.target.value;
    //         }
    //       });
    //     } else {
    //       row.deductionFreightList && row.deductionFreightList.forEach(e => {
    //         if (e.enName === freight.enName) {
    //           e.ruleValue = event.target.value;
    //         }
    //       });
    //     }
    //   } else {
    //     // event.target.value - 0 loadWeight unloadWeight
    //     row[keyName] = event.target.value - 0;
    //   }
    //   const {
    //     m0DictValue,
    //     freightPrice,
    //     ruleFormulaDictValue,
    //     shipperCode,
    //     stowageStatus,
    //     loadWeight,
    //     unloadWeight,
    //     waybillCode,
    //     subsidiesFreightList,
    //     deductionFreightList
    //     // serviceFee,
    //     // serviceTaxFee,
    //     // taxPayment

    //   } = row;



    //   const parame = {
    //     driverReductionFee: this._sum(deductionFreightList),
    //     m0DictValue,
    //     freightPrice,
    //     ruleFormulaDictValue,
    //     shipperCode,
    //     stowageStatus,
    //     driverAddFee: this._sum(subsidiesFreightList),
    //     loadWeight,
    //     unloadWeight,
    //     waybillCode
    //     // serviceFee,
    //     // serviceTaxFee,
    //     // taxPayment
    //   };
    //   // if (this.loading1) return;

    //   // this.setDeliveryCashFee(parame, row);
    //   this.changeFee(parame, row);
    // },

    // 单项修改
    async setDeliveryCashFee(parame, row) {
      console.log(parame, row);

      this.loading1 = true;
      this.plLoading = true;
      try {
        var data = {};
        await calculateFee(parame).then(res => {
          data = res.data;
          if (res.msg) {
            this.msgError(res.msg);
          }
        });
        this.loading1 = false;
        this.plLoading = false;
        // lossDeductionFee
        row.lossDeductionFee = data.lossDeductionFee;
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
      } catch (error) {
        this.loading1 = false;
        this.plLoading = false;
      }
    },

    // 批量修改
    async handlerBatchCalculate() {
      // 需要值: selectedValue   selectedNum  this.adjustlist enName ruleValue
      this.plLoading = true;
      const req = this.adjustlist.map(e => {
        return {
          m0DictValue: e.m0DictValue,
          freightPrice: e.freightPrice,
          ruleFormulaDictValue: e.ruleFormulaDictValue,
          shipperCode: e.shipperCode,
          stowageStatus: e.stowageStatus,
          loadWeight: e.loadWeight,
          unloadWeight: e.unloadWeight,
          waybillCode: e.waybillCode,
          driverAddFee: e.subsidiesFreightList ? this._sum(e.subsidiesFreightList) : 0,
          driverReductionFee: e.deductionFreightList ? this._sum(e.deductionFreightList) : 0
        };
      });
      try {
        const res = await batchCalculate(req);

        res.data.forEach(ee => {
          this.adjustlist.forEach(e => {
            if (ee.waybillCode === e.waybillCode) {
              e.lossDeductionFee = ee.lossDeductionFee;
              e.deliveryFeeDeserved = ee.deliveryFeeDeserved;
              e.deliveryCashFee = ee.driverRealFee;
              e.serviceFee = ee.serviceFee;
              e.serviceTaxFee = ee.serviceTaxFee;
              e.shipperCopeFee = ee.shipperCopeFee;
              e.shipperRealPay = ee.shipperRealPay;
              e.taxFreeFee = ee.taxFreeFee;
              e.taxPayment = ee.taxPayment;
              e.m0Fee = ee.m0Fee;
              e.loss = ee.loss;
            }
          });
        });
        this.plLoading = false;
      } catch (error) {
        this.plLoading = false;
      }
    },


    /** 提交按钮 */
    async submitForm() {
      const boList = this.adjustlist.map(e => {
        const aa1 = (e.deductionFreightList || []).map(e => {
          return {
            ...e,
            $_disabled: undefined,
            ee: undefined,
            updateTime: undefined,
            updateCode: undefined,
            isDel: undefined,
            createCode: undefined,
            createTime: undefined
          };
        });
        const bb1 = (e.subsidiesFreightList || []).map(e => {
          return {
            ...e,
            $_disabled: undefined,
            ee: undefined,
            updateTime: undefined,
            updateCode: undefined,
            isDel: undefined,
            createCode: undefined,
            createTime: undefined
          };
        });


        return {
          'deduction': e.deduction,
          'deliveryCashFee': e.deliveryCashFee,
          'deliveryFeeDeserved': e.deliveryFeeDeserved,
          'deliveryFeePractical': e.deliveryFeePractical,
          'driverAddFee': e.driverAddFee,
          'driverReductionFee': e.driverReductionFee,
          'freightList': aa1.concat(bb1),
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
      }).then(() => {
        this.adjustLoading = true;
        return batchCheck({ boList }).then(res => {
          this.adjustLoading = false;
          if (res.data) {
            this.msgError(res.msg);
            // console.log(res);
            const list = res.data.exceptionList;
            this.errList = list.map(item => item.waybillCode);
          } else {
            this.msgSuccess('核算成功');
            this.visible = false;
            this.$emit('refresh');
          }
        }).catch(() => {
          this.adjustLoading = false;
        });
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.errList.length > 0) {
        if (this.errList.includes(row.waybillCode)) {
          return 'warning-row';
        }
      }
    },
    /** 查询核算列表 */
    getList() {
      this.loading = true;
      adjustDetail(this.queryParams).then(response => {
        this.adjustlist = JSON.parse(JSON.stringify(response.data));

        /* 兼容处理*/
        // const subList = [];
        // const dedList = [];
        // this.adjustlist.forEach(e => {
        //   console.log(e.subsidiesFreightList);
        //   e.subsidiesFreightList.forEach(ee => {
        //     subList.push(ee);
        //   });
        //   e.deductionFreightList.forEach(ee => {
        //     dedList.push(ee);
        //   });
        // });


        // this.subsidiesClone = objReduce(subList, 'enName');
        // this.deductionClone = objReduce(dedList, 'enName');

        this.adjustlist.sort((a, b) => {
          const a1 = a.subsidiesFreightList ? a.subsidiesFreightList.length : 0;
          const a2 = a.deductionFreightList ? a.deductionFreightList.length : 0;
          const b1 = b.subsidiesFreightList ? b.subsidiesFreightList.length : 0;
          const b2 = b.deductionFreightList ? b.deductionFreightList.length : 0;

          return (b1 + b2) - (a1 + a2);
        });

        // console.log(this.adjustlist);



        this.subsidiesClone = this.adjustlist[0].subsidiesFreightList || [];
        this.deductionClone = this.adjustlist[0].deductionFreightList || [];

        const felexes = [...this.subsidiesClone, ...this.deductionClone];

        // console.log(felexes);
        let waybillCode = '';

        this.showSubList.forEach(e => {
          felexes.forEach(ee => {
            if (e.enName === ee.enName) {
              e.ee = ee;
              !waybillCode && (waybillCode = ee.waybillCode);
            }
          });
        });



        this.showSubList = this.showSubList.map(e => {
          e.waybillCode = waybillCode;
          e.ruleValue = 0;
          if (e.ee) {
            e = e.ee;
            e.ee = null;
            e.$_disabled = true;
          }
          return e;
        });


        this.total = response.total;
        // 要求初始就要计算一次
        this.handleSelectedNumChange();
        // 单条数据，进行一次计算
        if (this.adjustlist.length === 1) {
          this.handlerChangev(this.adjustlist[0]);
        }
        this.loading = false;
      });
    },

    async getRuleLists() {
      const que = {
        ruleType: 0
      };
      return getRuleItemList(que).then(response => {
        this.showSubList = response.data.list.filter(e => {
          return e.showType === 1;
        });
      });
    },



    /** 取消按钮 */
    cancel() {
      this.rowData = {};
      console.log(this.rowData);
      // this.showSubList = [];
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 获取列表
    async setForm(data) {
      this.selectedValue = '';
      this.selectedNum = '';
      await this.getRuleLists();
      this.isEdit2 = false;
      this.isEdit = false;
      this.deliveryCashFee = undefined;
      this.queryParams.waybillCodeList = data;
      await this.getList();
    },


    // 处理增
    handlerClick() {
      const arr = this.adjustlist[0].subsidiesFreightList || [];
      const jaarr = this.adjustlist[0].deductionFreightList || [];

      // 过滤增
      const a1 = arr.filter(e => {
        return !e.$_disabled;
      });
      // 过滤减(做禁止操作)
      this.jianData = jaarr.filter(e => {
        return !e.$_disabled;
      });
      // 回填的数据
      this.selecedName = (a1).map(e => e.cnName);

      this.mtype = '1';
      this.popoverOpenCom = true;
    },

    // 处理减
    handlerdeduc() {
      // 同上
      const arr = this.adjustlist[0].deductionFreightList || [];
      const jaarr = this.adjustlist[0].subsidiesFreightList || [];

      const a1 = arr.filter(e => {
        return !e.$_disabled;
      });
      this.jianData = jaarr.filter(e => {
        return !e.$_disabled;
      });
      this.selecedName = (a1).map(e => e.cnName);
      this.mtype = '2';
      this.popoverOpenCom = true;
    },

    handlerSubmit(arr) {
      this.popoverOpenCom = false;

      // 如果是增
      if (this.mtype === '1') {
        this.adjustlist.forEach(e => {
          const arrv = arr.map(e => {
            e.type = this.mtype;
            return e;
          });

          e.subsidiesFreightList = this.subsidiesClone.concat(arrv);
        });
      } else {
        // 如果是减
        this.adjustlist.forEach(e => {
          const arrv = arr.map(e => {
            e.type = this.mtype;
            return e;
          });

          e.deductionFreightList = this.deductionClone.concat(arrv);
        });
      }

      // console.log(this.adjustlist);
    },

    /* 批量修改规定的值 */
    handleSelectedNumChange() {
      let isZa = false;
      this.adjustlist.forEach(e => {
        e.deductionFreightList && e.deductionFreightList.forEach(e => {
          if (e.enName === this.selectedValue) {
            // 值要求不一样
            if (e.ruleValue !== this.selectedNum) {
              isZa = true;
              e.ruleValue = this.selectedNum;
            }
          }
        });

        e.subsidiesFreightList && e.subsidiesFreightList.forEach(e => {
          if (e.enName === this.selectedValue) {
            // 同上
            if (e.ruleValue !== this.selectedNum) {
              isZa = true;
              e.ruleValue = this.selectedNum;
            }
          }
        });
      });
      isZa && this.handlerBatchCalculate();
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
    },

    // 防抖=需要带参数,避免和原方法冲突
    newDebounceFun(callback, time) {
      var timer;
      return function(...argument) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          callback(...argument);
        }, time);
      };
    }
  }
};
</script>

<style lang="scss">
  .el-table--scrollable-x .el-table__body-wrapper {
      z-index: 1;
  }
</style>

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
  border: 0;
  background-color: #cceeff;
}
.ly-flex{
  flex-wrap: wrap;
}

::v-deep .warning-row{
  background: #fadbd9;
}

.drawer-footer{
  width: 100%;
  display: flex;
  margin: 20px 20px 0;
}
.cont-frame{
  display: flex;
  margin: 0 20px;
}
</style>
