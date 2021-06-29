<template>
  <el-dialog class="i-adjust" :title="title" :visible="visible" width="1400px" :close-on-click-modal="false" append-to-body @close="cancel">

    <el-row v-if="isAgain===0 && com.length" :gutter="10" class="mb20 ly-t-left">

      <el-col :span="20">
        <span class="b mr20">快速分组:</span>
        <el-tag
          v-for="(item, index) in com"
          :key="index"
          :class="{'myactive': sort == item.prop}"
          type="success"
          class="shou mr5"
          :disabled="adjustlist.length <= 1"
          @click="()=> sort = item.prop"
        >{{ item.label }}</el-tag>
      </el-col>
    </el-row>

    <div v-for="(item,index) in list" :key="index" v-loading="loading">
      <div class="mb20">
        <AdjustDitem :list="item.childs" />
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="loading || !adjustlist || adjustlist.length < 1" @click="submitForm">立即核算</el-button>
      <el-button @click="cancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { batchDetail } from '@/api/settlement/adjust';
import { immediateAccounting } from '@/api/settlement/adjustDregs';

import AdjustDitem from './AdjustDitem.vue';

export default {
  name: 'AdjustDialog',
  components: { AdjustDitem },
  props: {
    title: {
      type: String,
      default: '核算审核'
    },
    open: Boolean,
    psort: {
      type: String,
      default: ''
    },
    isAgain: {
      type: Number,
      default: 0
    },
    com: {
      type: Array,
      default: () => [
        {
          'label': '调度者名称',
          'prop': 'teamName'
        },
        {
          'label': '项目',
          'prop': 'projectName'
        },
        {
          'label': '渣土场',
          'prop': 'ztcLandName'
        },
        {
          'label': '重置',
          'prop': 'MadeInChina'
        }
      ]
    }
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
      listData: null, // 外面的列表数据
      sort: ''
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
    },

    // 父过来的数据, 进一步处理
    list() {
      const arr = [];

      // 包装方法
      const object = {};

      console.log(this.adjustlist);
      this.adjustlist.forEach(e => {
        const str = e[this.sort];
        const array = object[str];
        if (array) {
          array.push(e);
        } else {
          const suibian = [e];
          object[str] = suibian;
        }
      });

      console.log(object);

      for (const item in object) {
        const obj = {
          freightAmount: 0
        };

        object[item].forEach(ite => {
          obj['freightAmount'] += (ite['shipperRealPay'] - 0); // 运费结算金额(取含税价字段)
          // obj['companyName'] = ite['companyName'] || '没有返回'; // 	公司名称
          // obj['shipmentCode'] = ite['shipmentCode'] || '没有返回';
        });

        const objArr = object[item];

        obj['batchNo'] = [...new Set(objArr.map(e => e.batchNo || ''))][0] || undefined;
        obj['projectCodeIds'] = [...new Set(objArr.map(e => e.projectCode))].join(',');
        obj['teamCodeIds'] = [...new Set(objArr.map(e => e.teamCode))].join(','); // 调度者Code
        obj['ztcCodeIds'] = [...new Set(objArr.map(e => e.ztcLandCode))].join(',');

        obj['projectNames'] = [...new Set(objArr.map(e => e.projectName))].join(','); // 	项目（装货地）
        obj['teamNames'] = [...new Set(objArr.map(e => e.teamName))].join(',');
        obj['ztcLandNames'] = [...new Set(objArr.map(e => e.ztcLandName))].join(',');


        obj['loadNum'] = objArr.length; // 装车数量
        obj['actualTripsNum'] = objArr.length; // 实发趟数（次）
        obj['settlementTripsNum'] = objArr.length; // 结算趟数
        obj['waybillCodeIds'] = objArr.map(e => e.waybillCode); // 	运单CodeIds
        obj['childs'] = objArr;

        arr.push(obj);
      }


      // console.log(arr, '出啊发发');

      return arr;
    }


  },
  watch: {
    psort(value) {
      if (value) {
        console.log(value);
        this.sort = (value === 'ztcName' ? 'ztcLandName' : value);
      }
    }
  },
  methods: {
    handleChange(key) {



      // console.log(123);
    },
    /** 提交按钮 */
    async submitForm() {
      // console.log(this.adjustlist);


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

        const immediateWaybillBoList = this.adjustlist.map(e => {
        // immediateWaybillBoList	运单金额BOList		false
        // deductionDes	减项说明		false
        // deliveryCashFee	司机实收现金		false
        // increaseDes	增项说明		false
        // serviceFee	服务费		false
        // serviceTaxFee	服务费税费		false
        // shipperRealPay	货主实付金额		false
        // taxPayment	纳税金额		false
        // waybillCode	运单
        // shipmentCode
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

        const batchBusAccBoList = this.list.map(e => {
          //   actualTripsNum	实发趟数（次）		false
          //   loadNum	装车数量		false
          //   projectCodeIds	项目CodeIds		false
          //   projectLoadNames	项目名称(装货地)		false
          //   settlementTripsNum	结算趟数		false
          //   teamCodeIds	调度者codeIds		false
          //   teamNames	车队名称		false
          //   waybillCodeIds	运单		false
          //   ztcCodeIds	渣土场CodeIds		false
          //   ztcLandNames	渣土场名称(卸货地)
          return {
            ...e,
            shipperCode: shipmentCodeArr[0],
            batchNo: e.batchNo || undefined,
            childs: undefined
          };
        });

        return immediateAccounting({
          batchBusAccBoList,
          immediateWaybillBoList,
          isAgain: this.isAgain
        });
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
      batchDetail(this.queryParams).then(response => {
        this.adjustlist = JSON.parse(JSON.stringify(response.data));
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
    async setForm(arr) {
      console.log(arr);
      this.listData = arr; // 做一下保存 后面核算要
      if (this.isAgain === 0) {
        this.queryParams.waybillCodeList = arr.map(e => e.wayBillCode); // 请求参数保存
        this.getList();
      } else {
        let resArr = [];
        for (let index = 0; index < arr.length; index++) {
          const e = arr[index];
          const { data } = await batchDetail({ waybillCodeList: e.waybillCodes });
          resArr = (JSON.parse(JSON.stringify(data))).map(ee => {
            ee.batchNo = e.batchNo;
            return ee;
          }).concat(resArr);
        }
        this.sort = 'batchNo';
        this.adjustlist = resArr;
      }
    }


  }
};
</script>

<style scoped>
.myactive.el-tag.el-tag--success{
    background: #13ce66;
    border-color: #13ce66;
    color: #FFFFFF;
}
</style>
