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
        <AdjustDitem :is-again="isAgain" :open="open" :list="item.childs" @isLoading="(bool)=> isLoading = bool" />
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-row class="ly-flex-align-center">
        <el-col :span="14" style="text-align:left;" class="my-all-totalBar">
          <TotalBar :total-list="totalList" />
        </el-col>
        <el-col :span="10">
          <el-button type="primary" :disabled="loading || !adjustlist || adjustlist.length < 1" :loading="isLoading" @click="submitForm">立即核算</el-button>
          <el-button @click="cancel">返回</el-button>
        </el-col>
      </el-row>

    </div>
  </el-dialog>
</template>

<script>
function sum(arr) {
  return arr.reduce(function(prev, curr, idx, arr) {
    return prev + curr;
  });
}
import { floor } from '@/utils/ddc';
import { batchDetail } from '@/api/settlement/adjust';
import { immediateAccounting } from '@/api/settlement/adjustDregs';

import AdjustDitem from './AdjustDitem.vue';
import TotalBar from '@/components/Ddc/Tin/TotalBar';

export default {
  name: 'AdjustDialog',
  components: { AdjustDitem, TotalBar },
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
        // {
        //   'label': '调度者名称',
        //   'prop': 'teamName'
        // },
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
      isLoading: false,
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
      sort: '',

      // 渣土场 1001 场内1002 自倒 1003
      loadUnloadType_op: [
        // { 'dictLabel': '渣土场', 'dictValue': '1001' },
        { 'dictLabel': '场内', 'dictValue': '1002' },
        { 'dictLabel': '自倒', 'dictValue': '1003' }
      ]
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

      // console.log(object);

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
        obj['loadUnloadType'] = [...new Set(objArr.map(e => e.loadUnloadType))].join(',');


        obj['loadNum'] = objArr.length; // 装车数量
        obj['actualTripsNum'] = objArr.length; // 实发趟数（次）
        obj['settlementTripsNum'] = objArr.length; // 结算趟数
        obj['waybillCodeIds'] = objArr.map(e => e.waybillCode); // 	运单CodeIds
        obj['childs'] = objArr;

        arr.push(obj);
      }



      return arr;
    },

    totalList() {
      const arr = [
        {
          label: '结算车数',
          value: 0,
          key: 'loadWeight'
        },
        {
          label: '留存运费',
          value: 0,
          key: 'taxPayment'
        },
        {
          label: '服务费',
          value: 0,
          key: 'serviceFee'
        },
        {
          label: '司机实收',
          value: 0,
          key: 'deliveryCashFee'
        },
        {
          label: '货主实付',
          value: 0,
          key: 'shipperRealPay'
        }
      ];

      if (this.list.length > 0) {
        arr.forEach(item => {
          const value = sum(this.list.map(e => sum(e.childs.map(e => e[item.key] - 0 || 0))));
          if (item.key === 'loadWeight') {
            item.value = value;
          } else {
            item.value = floor(value);
          }
        });
      }

      return arr;
    }


  },
  watch: {
    psort(value) {
      if (value) {
        this.sort = (value === 'ztcName' ? 'ztcLandName' : value);
      }
    }
  },
  methods: {
    handleChange(key) {


    },
    /** 提交按钮 */
    async submitForm() {
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

        let deliveryCashFee = 0;
        let taxPayment = 0;
        let serviceFee = 0;

        const immediateWaybillBoList = this.adjustlist.map(e => {
          // immediateWaybillBoList	运单金额BOList		false
          // deductionDes	减项说明		false
          // deliveryCashFee	司机实收现金		false
          // increaseDes	增项说明		false
          // serviceFee	服务费		false
          // serviceTaxFee	服务费税费		false
          // shipperRealPay	货主实付金额		false
          // taxPayment	留存运费		false
          // waybillCode	运单
          // shipmentCode
          deliveryCashFee += (e.deliveryCashFee ? e.deliveryCashFee - 0 : 0);
          taxPayment += (e.taxPayment ? e.taxPayment - 0 : 0);
          serviceFee += (e.serviceFee ? e.serviceFee - 0 : 0);

          return {
            deliveryFeeDeserved: e.deliveryFeeDeserved,
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


        // 合并
        let actualTripsNum = 0;
        let freightAmount = 0;
        let loadNum = 0;
        let settlementTripsNum = 0;
        const loadUnloadType = [];
        const projectCodeIds = [];
        const projectNames = [];
        const teamCodeIds = [];
        const teamNames = [];
        const waybillCodeIds = [];
        const ztcCodeIds = [];
        const ztcLandNames = [];
        let batchNo; // 驳回的时候使用

        this.list.forEach(e => {
          actualTripsNum += e.actualTripsNum - 0;
          freightAmount += e.freightAmount - 0;
          loadNum += e.loadNum - 0;
          settlementTripsNum += e.settlementTripsNum;
          e.loadUnloadType && loadUnloadType.push(...e.loadUnloadType.split(','));
          e.projectCodeIds && projectCodeIds.push(...e.projectCodeIds.split(','));
          e.projectNames && projectNames.push(...e.projectNames.split(','));
          e.teamCodeIds && teamCodeIds.push(...e.teamCodeIds.split(','));
          e.teamNames && teamNames.push(...e.teamNames.split(','));
          e.ztcCodeIds && ztcCodeIds.push(...e.ztcCodeIds.split(','));
          ztcLandNames.push(...e.ztcLandNames.split(','));
          waybillCodeIds.push(...e.waybillCodeIds);
          e.batchNo && (batchNo = e.batchNo);
        });

        const batchBusAccBoList = [{
          actualTripsNum,
          freightAmount,
          loadNum,
          settlementTripsNum,
          loadUnloadType: [...new Set(loadUnloadType)].join(','),
          projectCodeIds: [...new Set(projectCodeIds)].join(','),
          projectNames: [...new Set(projectNames)].join(','),
          teamCodeIds: [...new Set(teamCodeIds)].join(','),
          teamNames: [...new Set(teamNames)].join(','),
          ztcCodeIds: [...new Set(ztcCodeIds)].join(','),
          ztcLandNames: [...new Set(ztcLandNames)].join(','),
          waybillCodeIds,

          deliveryCashFee,
          taxPayment,
          serviceFee,
          shipperCode: shipmentCodeArr[0],
          childs: undefined,
          batchNo: batchNo || undefined
        }];
        // 合并


        // const batchBusAccBoList = this.list.map(e => {
        //   //   actualTripsNum	实发趟数（次）		false
        //   //   loadNum	装车数量		false
        //   //   projectCodeIds	项目CodeIds		false
        //   //   projectLoadNames	项目名称(装货地)		false
        //   //   settlementTripsNum	结算趟数		false
        //   //   teamCodeIds	调度者codeIds		false
        //   //   teamNames	车队名称		false
        //   //   waybillCodeIds	运单		false
        //   //   ztcCodeIds	渣土场CodeIds		false
        //   //   ztcLandNames	渣土场名称(卸货地)
        //   return {
        //     ...e,
        //     deliveryCashFee,
        //     taxPayment,
        //     serviceFee,
        //     shipperCode: shipmentCodeArr[0],
        //     batchNo: e.batchNo || undefined,
        //     childs: undefined
        //   };
        // });

        // console.log({
        //   batchBusAccBoList,
        //   immediateWaybillBoList,
        //   isAgain: this.isAgain
        // });

        // return;
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
      }).catch(() => {
        this.loading = false;
      });
    },
    /** 查询核算列表 */
    getList() {
      this.loading = true;
      batchDetail(this.queryParams).then(response => {
        this.adjustlist = JSON.parse(JSON.stringify(
          response.data.map(e => {
            if (e.loadUnloadType !== '1001') {
              e.ztcLandName = this.selectDictLabel(this.loadUnloadType_op, e.loadUnloadType) || '-';
            }
            return e;
          })
        ));
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
::v-deep .my-all-totalBar .total_bg{
  background-color: #fff;
  padding: 0;
  margin: 0;
}
</style>
