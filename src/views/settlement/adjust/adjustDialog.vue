<template>
  <!-- 评价对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body @close="cancel">
    <el-row :gutter="10" class="mb8">
      <el-col :span="10">
        <span class="mr3">司机实收金额</span>
        <!-- v-model="adjustlist.deliveryCashFee" -->
        <el-input
          placeholder="请输入司机实收金额"
          clearable
          size="small"
          style="width: 180px"
          class="mr3"
          @keyup.enter.native="handleQuery"
        />
        <el-button type="primary">批量修改</el-button>
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

      <el-table-column width="120" label="企业名称" show-overflow-tooltip align="center" prop="name" />
      <el-table-column width="120" label="运输单号" show-overflow-tooltip align="center" prop="waybillNo" />
      <el-table-column width="120" label="装车重量(吨)" align="center" prop="loadWeight">
        <template slot-scope="scope">
          <el-input v-model="scope.row.loadWeight" placeholder="请输入装车重量" style="width:100%;" />
        </template>
      </el-table-column>
      <el-table-column width="120" label="卸车重量(吨)" align="center" prop="unloadWeight">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unloadWeight" placeholder="请输入卸车重量" style="width:100%;" />
        </template>
      </el-table-column>
      <el-table-column width="120" label="实际承运重量（吨）" align="center" prop="tttttt" />
      <el-table-column width="120" label="路耗（吨）" align="center" prop="loss" />
      <el-table-column width="120" label="货物单价" align="center" prop="goodsPrice" />
      <el-table-column width="120" label="司机成交单价(元/吨)" align="center" prop="deliveryFeeDeserved" />
      <el-table-column width="120" label="亏涨吨费用(元)" align="center" prop="deduction" />

      <el-table-column width="120" label="司机实收抹零(元)" align="center" prop="deliveryFeePractical" />

      <!-- <el-table-column width="120" label="路耗允许范围" align="center" prop="lossAllowScope" /> -->
      <!-- <el-table-column width="120" label="司机姓名" align="center" prop="driverName" /> -->
      <!-- <el-table-column width="120" label="司机电话" align="center" prop="driverPhone" /> -->
      <!-- <el-table-column width="120" label="车牌号" align="center" prop="licenseNumber" /> -->
      <!-- <el-table-column width="120" label="司机减项费用" align="center" prop="driverReductionFee" /> -->
      <!-- <el-table-column width="120" label="司机增项费用" align="center" prop="driverAddFee" /> -->
      <!-- <el-table-column width="120" label="运费单价" align="center" prop="freightPrice" /> -->
      <!-- <el-table-column width="120" label="抹零金额" align="center" prop="m0Amount" /> -->

      <el-table-column align="center" width="300" label="补贴项目">
        <template slot-scope="scope">
          <el-form :inline="true" label-position="right" size="mini" class="ly-flex">
            <div v-for="(freight, index) in scope.row.subsidiesFreightList" :key="index">
              <el-form-item :label="freight.cnName">
                <!-- <span>{{ freight.ruleValue }}</span> -->
                <el-input v-model="freight.ruleValue" :placeholder="`请输入${freight.cnName}`" style="width:60px;" />
              </el-form-item>
            </div>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" width="300" label="扣费项目">
        <template slot="header">
          <span>扣费项目</span>
        </template>

        <template slot-scope="scope">
          <el-form :inline="true" label-position="right" size="mini" class="ly-flex">
            <div v-for="(freight, index) in scope.row.deductionFreightList" :key="index">
              <el-form-item :label="freight.cnName">
                <!-- <span v-show="!freight.isEdit">{{ freight.ruleValue }}</span> -->
                <el-input v-model="freight.ruleValue" :placeholder="`请输入${freight.cnName}`" style="width:60px;" />
              </el-form-item>
            </div>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column width="120" label="服务费" align="center" prop="serviceFee" />
      <el-table-column width="120" label="司机实收现金" align="center" prop="deliveryCashFee">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deliveryCashFee" placeholder="请输入司机实收现金" style="width:100%;" />
        </template>
      </el-table-column>
      <el-table-column width="120" label="要扣的货主金额" align="center" prop="deductShipmentAmount" />
      <el-table-column width="120" label="核算规则" align="center" prop="freightList.enName" />
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即核算</el-button>
      <el-button @click="cancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { adjustDetail } from '@/api/settlement/adjust';
// import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'AdjustDialog',
  components: {
    // UploadImage
  },
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
      // tableColumnsConfig: [],
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
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
    /** 提交按钮 */
    submitForm() {
      console.log('点击');
    },
    /** 查询核算列表 */
    getList() {
      // this.loading = true;
      adjustDetail(this.queryParams).then(response => {
        console.log(response.rows);
        // this.adjustlist = response.rows;
        // this.total = response.total;
        this.loading = false;
      });


      const data = [
        {
          'waybillCode': '155cc017f06b4f9c9ce678060ff299a0',
          'waybillNo': '2103221739334454',
          'loadWeight': 55,
          'unloadWeight': 1,
          'loss': 54,
          'deliveryFeeDeserved': 660,
          'deliveryFeePractical': 0,
          'deliveryCashFee': 0,
          'deduction': null,
          'm0Amount': null,
          'goodsPrice': 180,
          'freightPrice': 12,
          'serviceFee': 0,
          'lossAllowScope': null,
          'licenseNumber': '辽N3368E',
          'driverName': '师彩明',
          'driverPhone': '17642168716',
          'deductShipmentAmount': null,
          'goodsCode': '84b8fe1a9ec34c67a5f9800d23dbf8a7',
          'driverAddFee': 0,
          'driverReductionFee': 0,
          'lossDeductionFee': 0,
          'm0Fee': 0,
          'shipperCopeFee': 0,
          'shipperRealPay': 0,
          'subsidiesFreightList': [{
            'id': 184657,
            'code': '745d673607d94cc894949f108337c697',
            'ruleItemCode': '11',
            'ruleValue': '0',
            'type': '2',
            'cnName': '装车费',
            'enName': 'LOADING_FEE',
            'showType': 1,
            'dictCode': null,
            'ruleType': 0,
            'unit': null,
            'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
          }],
          'deductionFreightList': [{
            'id': 184658,
            'code': '801beaf817324ba483d926edb6e6a2f4',
            'ruleItemCode': '12',
            'ruleValue': '0',
            'type': '21',
            'cnName': '卸车费',
            'enName': 'DISCHARGE_FARE',
            'showType': 1,
            'dictCode': null,
            'ruleType': 0,
            'unit': null,
            'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
          },
          {
            'id': 184659,
            'code': '519132a0e08742e79dc7e17b4dc430fd',
            'ruleItemCode': '15',
            'ruleValue': '0',
            'type': '1',
            'cnName': '超时费',
            'enName': 'OVERTIME_FEE',
            'showType': 1,
            'dictCode': null,
            'ruleType': 0,
            'unit': null,
            'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
          },
          {
            'id': 184660,
            'code': '8958d41b839648c2bd11ebde634cc63a',
            'ruleItemCode': '16',
            'ruleValue': '0',
            'type': '1',
            'cnName': '扣回单费',
            'enName': 'RECEIPT_FEE',
            'showType': 1,
            'dictCode': null,
            'ruleType': 0,
            'unit': null,
            'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
          }],
          'freightList': [
            {
              'id': 184657,
              'code': '745d673607d94cc894949f108337c697',
              'ruleItemCode': '11',
              'ruleValue': '0',
              'type': '2',
              'cnName': '装车费',
              'enName': 'LOADING_FEE',
              'showType': 1,
              'dictCode': null,
              'ruleType': 0,
              'unit': null,
              'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
            },
            {
              'id': 184658,
              'code': '801beaf817324ba483d926edb6e6a2f4',
              'ruleItemCode': '12',
              'ruleValue': '0',
              'type': '2',
              'cnName': '卸车费',
              'enName': 'DISCHARGE_FARE',
              'showType': 1,
              'dictCode': null,
              'ruleType': 0,
              'unit': null,
              'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
            },
            {
              'id': 184659,
              'code': '519132a0e08742e79dc7e17b4dc430fd',
              'ruleItemCode': '15',
              'ruleValue': '0',
              'type': '2',
              'cnName': '超时费',
              'enName': 'OVERTIME_FEE',
              'showType': 1,
              'dictCode': null,
              'ruleType': 0,
              'unit': null,
              'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
            },
            {
              'id': 184660,
              'code': '8958d41b839648c2bd11ebde634cc63a',
              'ruleItemCode': '16',
              'ruleValue': '0',
              'type': '2',
              'cnName': '扣回单费',
              'enName': 'RECEIPT_FEE',
              'showType': 1,
              'dictCode': null,
              'ruleType': 0,
              'unit': null,
              'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
            }
          ]
        },
        {
          'waybillCode': '155cc017f06b4f9c9ce678060ff299a0',
          'waybillNo': '2103221739334454',
          'loadWeight': 55,
          'unloadWeight': 1,
          'loss': 54,
          'deliveryFeeDeserved': 660,
          'deliveryFeePractical': 0,
          'deliveryCashFee': 0,
          'deduction': null,
          'm0Amount': null,
          'goodsPrice': 180,
          'freightPrice': 12,
          'serviceFee': 0,
          'lossAllowScope': null,
          'licenseNumber': '辽N3368E',
          'driverName': '师彩明',
          'driverPhone': '17642168716',
          'deductShipmentAmount': null,
          'goodsCode': '84b8fe1a9ec34c67a5f9800d23dbf8a7',
          'driverAddFee': 0,
          'driverReductionFee': 0,
          'lossDeductionFee': 0,
          'm0Fee': 0,
          'shipperCopeFee': 0,
          'shipperRealPay': 0,
          'subsidiesFreightList': [{
            'id': 184657,
            'code': '745d673607d94cc894949f108337c697',
            'ruleItemCode': '11',
            'ruleValue': '0',
            'type': '2',
            'cnName': '装车费',
            'enName': 'LOADING_FEE',
            'showType': 1,
            'dictCode': null,
            'ruleType': 0,
            'unit': null,
            'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
          }],
          'deductionFreightList': [{
            'id': 184658,
            'code': '801beaf817324ba483d926edb6e6a2f4',
            'ruleItemCode': '12',
            'ruleValue': '0',
            'type': '21',
            'cnName': '卸车费',
            'enName': 'DISCHARGE_FARE',
            'showType': 1,
            'dictCode': null,
            'ruleType': 0,
            'unit': null,
            'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
          },
          {
            'id': 184659,
            'code': '519132a0e08742e79dc7e17b4dc430fd',
            'ruleItemCode': '15',
            'ruleValue': '0',
            'type': '1',
            'cnName': '超时费',
            'enName': 'OVERTIME_FEE',
            'showType': 1,
            'dictCode': null,
            'ruleType': 0,
            'unit': null,
            'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
          },
          {
            'id': 184660,
            'code': '8958d41b839648c2bd11ebde634cc63a',
            'ruleItemCode': '16',
            'ruleValue': '0',
            'type': '1',
            'cnName': '扣回单费',
            'enName': 'RECEIPT_FEE',
            'showType': 1,
            'dictCode': null,
            'ruleType': 0,
            'unit': null,
            'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
          }],
          'freightList': [
            {
              'id': 184657,
              'code': '745d673607d94cc894949f108337c697',
              'ruleItemCode': '11',
              'ruleValue': '0',
              'type': '2',
              'cnName': '装车费',
              'enName': 'LOADING_FEE',
              'showType': 1,
              'dictCode': null,
              'ruleType': 0,
              'unit': null,
              'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
            },
            {
              'id': 184658,
              'code': '801beaf817324ba483d926edb6e6a2f4',
              'ruleItemCode': '12',
              'ruleValue': '0',
              'type': '2',
              'cnName': '卸车费',
              'enName': 'DISCHARGE_FARE',
              'showType': 1,
              'dictCode': null,
              'ruleType': 0,
              'unit': null,
              'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
            },
            {
              'id': 184659,
              'code': '519132a0e08742e79dc7e17b4dc430fd',
              'ruleItemCode': '15',
              'ruleValue': '0',
              'type': '2',
              'cnName': '超时费',
              'enName': 'OVERTIME_FEE',
              'showType': 1,
              'dictCode': null,
              'ruleType': 0,
              'unit': null,
              'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
            },
            {
              'id': 184660,
              'code': '8958d41b839648c2bd11ebde634cc63a',
              'ruleItemCode': '16',
              'ruleValue': '0',
              'type': '2',
              'cnName': '扣回单费',
              'enName': 'RECEIPT_FEE',
              'showType': 1,
              'dictCode': null,
              'ruleType': 0,
              'unit': null,
              'waybillCode': '155cc017f06b4f9c9ce678060ff299a0'
            }
          ]
        }
      ];

      this.adjustlist = data;
      // .map(e => {
      //   e.addfreightList = [];
      //   e.cutfreightList = [];

      //   e.freightList.forEach(ee => {
      //     ee.isEdit = false;
      //     if (ee.type === '1') {
      //       e.addfreightList.push(ee);
      //     } else {
      //       e.cutfreightList.push(ee);
      //     }
      //   });

      //   return e;
      // });
      console.log(this.adjustlist);
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
      console.log(data);
      this.queryParams.waybillCodeList = data;
      this.getList();
    }
  }
};
</script>

<style>
.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-input-number ::v-deep.el-input__inner {
  text-align: left;
}
</style>
