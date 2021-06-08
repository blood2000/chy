<template>
  <el-dialog class="i-adjust" :title="title" :visible="visible" width="80%" :close-on-click-modal="false" append-to-body @close="cancel">
    <div v-if="open">
      <div class="ly-t-center f20 b mb20">
        <div>对账单</div>
        <div v-if="statementNo">({{ statementNo }})</div>
      </div>

      <el-form v-show="showSearch" ref="queryForm1" :model="queryParams" :inline="true" label-width="90px" class="clearfix" disabled @submit.native.prevent>
        <!-- 普通input搜索 -->
        <el-form-item label="托运方" prop="shipper">
          <el-input
            v-model="queryParams.shipper"
            placeholder="请输入托运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="承运方" prop="carrier">
          <el-input
            v-model="queryParams.carrier"
            placeholder="请输入承运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <!-- 时间筛选框 -->
        <el-form-item label="申请日期" prop="applyTime">
          <el-date-picker
            v-model="queryParams.applyTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>

      </el-form>

      <div class="mt20 f20 b">
        费用信息
      </div>
      <el-divider />

      <el-table :data="tableData" highlight-current-row border show-summary :summary-method="getSummaries" style="width: 100%">
        <el-table-column
          prop="load"
          label="项目（装货地）"
          width="120"
          align="center"
        />
        <el-table-column
          prop="land"
          label="渣土场（卸货地）"
          width="130"
          align="center"
        />
        <el-table-column
          prop="teamName"
          label="调度者"
          width="120"
          align="center"
        />

        <el-table-column
          prop="loadNum"
          sortable
          label="装车数量"
          align="center"
        />
        <el-table-column
          prop="actualTripsNum"
          sortable
          label="实发趟数（次）"
          align="center"
        />
        <el-table-column
          prop="settlementTripsNum"
          sortable
          label="结算趟数（次）"
          align="center"
        />
        <el-table-column
          prop="freightAmount"
          sortable
          label="运费结算金额（含税）"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            {{ floorFn(scope.row.freightAmount) }}
          </template>
        </el-table-column>
        <el-table-column
          label="运单明细"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['consigner-order-edit']"
              size="mini"
              type="text"
              @click="handleBtn(scope.row)"
            >相关运单</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt20 f20 b ly-flex-pack-justify">
        票务信息

        <el-button v-if="!batchStatementCode" size="mini" type="text" @click="handleBianjiPiaowu">编辑票务信息</el-button>
      </div>
      <el-divider />



      <el-form v-show="showSearch" ref="formData" :model="formData" :inline="true" label-width="120px" class="clearfix" disabled @submit.native.prevent>
        <!-- 普通input搜索 -->
        <el-form-item label="纳税人识别号" prop="taxpayerNumber">
          <el-input
            v-model="formData.taxpayerNumber"
            placeholder="请输入托运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="注册地址" prop="registeredAddress">
          <el-input
            v-model="formData.registeredAddress"
            placeholder="请输入承运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="注册电话" prop="registeredPhone">
          <el-input
            v-model="formData.registeredPhone"
            placeholder="请输入承运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="开户行" prop="bankNo">
          <el-input
            v-model="formData.bankNo"
            placeholder="请输入承运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="formData.account"
            placeholder="请输入账号"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </el-form>
      <div v-if="!isStatementCode" class="mt20 mb20 ly-t-center">
        <el-button type="info" plain @click="$emit('update:open', v)">取消</el-button>
        <el-button type="primary" @click="handlerSubm">确认</el-button>
      </div>

    </div>

    <!-- 运单详情 对话框 -->
    <el-dialog class="i-adjust" title="运单详情" :visible.sync="openDetailDialog" width="80%" :close-on-click-modal="false" append-to-body>
      <StatementsInfo
        v-if="openDetailDialog"
        :way-bill-codes="a_dataList"
      />
    </el-dialog>

    <!-- 开票信息管理 -->
    <el-dialog class="i-adjust" title="票务信息" :visible.sync="openBillPage" width="80%" :close-on-click-modal="false" append-to-body>
      <bill-page v-if="openBillPage" :shipment-code="shipmentCode" />
    </el-dialog>
  </el-dialog>
</template>


<script>
import StatementsInfo from './StatementsInfo';
// 批次详情
import { applyForReconciliation, batchInfo } from '@/api/settlement/adjustDregs';

import BillPage from '@/views/enterprise/company/billing';

import { floor } from '@/utils/ddc';
export default {
  name: 'AdjustDialog',
  components: { StatementsInfo, BillPage },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    disable: Boolean
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      showSearch: true,

      currentId: undefined,
      openDetailDialog: false,
      titleDetailDialog: '',
      formDisable: false,

      openBillPage: false,
      shipmentCode: undefined,

      // 赋值
      statementNo: '',
      queryParams: {
        shipper: undefined,
        carrier: undefined,
        applyTime: undefined
      },
      formData: {
        taxpayerNumber: undefined,
        registeredAddress: undefined,
        registeredPhone: undefined,
        bankNo: undefined,
        account: undefined
      },
      tableData: [],

      batchStatementCode: undefined,

      accountStatementVo: null,
      a_dataList: undefined,
      isStatementCode: false,
      floorFn: floor // 方法
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
    /** 查询核算列表 */
    getList() {
      this.loading = true;
      batchInfo({ batchStatementCode: this.batchStatementCode, batchNo: this.batchNo }).then(response => {
        console.log(response);
        this.setForm(undefined, response.data);
        this.tableData = this.tableData.map(e => {
          return {
            ...e,
            waybillCods: response.data.waybillCods
          };
        });

        console.log(this.tableData);
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
      this.batchStatementCode = undefined;
    },
    // 获取列表
    setForm(object, data2) {
      console.log(object);
      const {
        account, //	账号	string
        // actualTripsNumCount, //	实发趟数合计前端统计	integer(int32)	integer(int32)
        applyTime, //	申请日期	string(date-time)	string(date-time)
        bankNo, //	开户行	string
        carrier, //	承运方 默认大道成	string
        // carrierCode, //	承运方code	string
        // freightAmountCount, //	运费金额合计前端统计	integer(int32)	integer(int32)
        // loadNumCount, //	装车数量合计前端统计	integer(int32)	integer(int32)
        registeredAddress, //	注册地址	string
        registeredPhone, //	注册电话	string
        // settlementTripsNumCount, //	结算趟数合计前端统计	integer(int32)	integer(int32)
        shipper, //	托运方 货主公司名称	string
        shipperCode, //	货主code	string
        // statementInfoCode, //	对账单code	string
        statementNo, //	对账单编号	string
        taxpayerNumber //	纳税人识别号
      } = data2;
      this.accountStatementVo = data2;

      this.shipmentCode = shipperCode;

      this.statementNo = statementNo;
      this.queryParams = {
        shipper,
        carrier,
        applyTime
      };
      this.formData = {
        taxpayerNumber,
        registeredAddress,
        registeredPhone,
        bankNo,
        account
      };

      if (object) {
        this.tableData = [];
        for (const item in object) {
          const obj = {
            freightAmount: 0
          };

          object[item].forEach(ite => {
            obj['freightAmount'] += ite['taxFee'] - 0; // 运费结算金额(取含税价字段)
            obj['teamName'] = ite['teamName']; // 调度者Code
            obj['teamCode'] = ite['teamCode']; // 调度者Code

            obj['land'] = ite['unloadAddress']; // 渣土场（卸货地）
            obj['landCode'] = ite['unloadAddressCode']; // 	渣土场（卸货地）Code
            obj['load'] = ite['loadAddress']; // 	项目（装货地）
            obj['loadCode'] = ite['loadAddressCode']; // 	项目（装货地）Code
          });
          obj['loadNum'] = object[item].length; // 装车数量
          obj['actualTripsNum'] = object[item].length; // 实发趟数（次）
          obj['settlementTripsNum'] = object[item].length; // 结算趟数
          obj['waybillCods'] = object[item].map(e => e.wayBillCode); // 	运单CodeIds
          obj['a_dataList'] = object[item];
          console.log(obj);

          this.tableData.push(obj);
        }
      }
    },

    // 已生成通过code请求详情
    setBatchStatementCode(data, row) {
      this.isStatementCode = true;
      if (data) {
        console.log(row);

        this.batchStatementCode = data;
        this.batchNo = row.batchNo;
        this.tableData = [row].map(e => {
          return {
            ...e,
            load: e.ztcLoad,
            land: e.ztcLand
          };
        });

        this.getList();
      }
    },

    handleBtn(row) {
      console.log(row);
      this.a_dataList = row.waybillCods;
      this.openDetailDialog = true;
    },

    // 编辑票务信息
    handleBianjiPiaowu() {
      this.openBillPage = true;
    },

    // 确认
    handlerSubm() {
      this.$confirm('确定立即申请对账, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        const accountStatementVo = this.accountStatementVo;
        const statementBatchVoList = this.tableData.map(e => {
          return {
            ...e,
            waybillCodes: e.waybillCods,
            waybillCods: undefined,
            a_dataList: undefined
          };
        });
        applyForReconciliation({ accountStatementVo, statementBatchVoList }).then(res => {
          this.msgSuccess('申请对账成功');
          this.loading = false;
          this.close();
          this.$emit('refresh');
        });
      }).catch(() => {});
    },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = floor(sums[index]);
        } else {
          sums[index] = '';
        }
      });

      return sums;
    }

  }
};
</script>

<style>

</style>
