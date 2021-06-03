<template>
  <el-dialog class="i-adjust" :title="title" :visible="visible" width="80%" :close-on-click-modal="false" append-to-body @close="cancel">
    <div v-if="open">
      <div class="ly-t-center f20 b mb20">
        <div>对账单</div>
        <div>(UHY123456)</div>
      </div>





      <el-form v-show="showSearch" ref="queryForm1" :model="queryParams" :inline="true" label-width="90px" class="clearfix" disabled @submit.native.prevent>
        <!-- 普通input搜索 -->
        <el-form-item label="托运方" prop="testName1">
          <el-input
            v-model="queryParams.testName1"
            placeholder="请输入托运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="承运方" prop="testName2">
          <el-input
            v-model="queryParams.testName2"
            placeholder="请输入承运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <!-- 时间筛选框 -->
        <el-form-item label="申请日期" prop="testName3">
          <!-- <el-date-picker
            v-model="queryParams.testName3"
            size="small"
            style="width: 228px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          /> -->

          <el-date-picker
            v-model="queryParams.testName3"
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

      <el-table :data="tableData" highlight-current-row border show-summary style="width: 100%">
        <el-table-column
          prop="id"
          label="项目（装货地）"
          width="120"
          align="center"
        />
        <el-table-column
          prop="name"
          label="渣土场（卸货地）"
          width="130"
          align="center"
        />
        <el-table-column
          prop="titnijsoi"
          label="调度者"
          width="120"
          align="center"
        />

        <el-table-column
          prop="amount1"
          sortable
          label="装车数量"
          align="center"
        />
        <el-table-column
          prop="amount2"
          sortable
          label="实发趟数（次）"
          align="center"
        />
        <el-table-column
          prop="amount3"
          sortable
          label="结算趟数（次）"
          align="center"
        />
        <el-table-column
          prop="amount4"
          sortable
          label="运费结算金额（含税）"
          align="center"
        />
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

        <el-button size="mini" type="text" @click="handleBianjiPiaowu">编辑票务信息</el-button>
      </div>
      <el-divider />

      <el-form v-show="showSearch" ref="formData" :model="formData" :inline="true" label-width="120px" class="clearfix" disabled @submit.native.prevent>
        <!-- 普通input搜索 -->
        <el-form-item label="纳税人识别号" prop="tsjsjops">
          <el-input
            v-model="formData.tsjsjops"
            placeholder="请输入托运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="注册地址" prop="tingi1h2i">
          <el-input
            v-model="formData.tingi1h2i"
            placeholder="请输入承运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="注册电话" prop="tinhu3hu2">
          <el-input
            v-model="formData.tinhu3hu2"
            placeholder="请输入承运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="开户行" prop="tinhwenfwn">
          <el-input
            v-model="formData.tinhwenfwn"
            placeholder="请输入承运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="账号" prop="tinhwe34343">
          <el-input
            v-model="formData.tinhwe34343"
            placeholder="请输入承运方"
            clearable
            size="small"
            style="width: 228px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </el-form>
      <div class="mt20 mb20 ly-t-center">
        <el-button type="info" plain>取消</el-button>
        <el-button type="primary">确认</el-button>
      </div>

    </div>

    <!-- 运单详情 对话框 -->
    <el-dialog class="i-adjust" title="运单详情" :visible.sync="openDetailDialog" width="80%" :close-on-click-modal="false" append-to-body>
      <WaybillDialog
        v-if="openDetailDialog"
        :dialog-config="{
          showSearch: false,
          list: []
        }"
      />
    </el-dialog>

    <!-- 开票信息管理 -->
    <el-dialog class="i-adjust" title="票务信息" :visible.sync="openBillPage" width="80%" :close-on-click-modal="false" append-to-body>
      <bill-page v-if="openBillPage" :shipment-code="shipmentCode" />
    </el-dialog>
  </el-dialog>
</template>


<script>
// 运单详情弹窗
import WaybillDialog from '@/views/waybill/manages';

import BillPage from '@/views/enterprise/company/billing';
export default {
  name: 'AdjustDialog',
  components: { WaybillDialog, BillPage },
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


      queryParams: {
        testName1: '山阴利德商贸有限公司',
        testName2: '福建大道成物流科技有限公司',
        testName3: '2021-05-11'
      },
      formData: {
        tsjsjops: '91140621MA0K2NMN7D',
        tingi1h2i: '山阴县岱岳镇府东街兴隆小区',
        tinhu3hu2: '18504214537',
        tinhwenfwn: '晋商银行股份有限公司山阴支行',
        tinhwe34343: '34910230000005897'
      },
      tableData: [{
        id: '八里庄',
        name: '九里庄',
        titnijsoi: '甘某某',
        amount1: '234',
        amount2: '3.2',
        amount3: 10,
        amount4: 20
      }, {
        id: '八里庄',
        name: '九里庄',
        titnijsoi: '甘某某',
        amount1: '165',
        amount2: '4.43',
        amount3: 12,
        amount4: 20
      }, {
        id: '八里庄',
        name: '九里庄',
        titnijsoi: '甘某某',
        amount1: '324',
        amount2: '1.9',
        amount3: 9,
        amount4: 20
      }, {
        id: '八里庄',
        name: '九里庄',
        titnijsoi: '甘某某',
        amount1: '621',
        amount2: '2.2',
        amount3: 17,
        amount4: 20
      }, {
        id: '八里庄',
        name: '九里庄',
        titnijsoi: '甘某某',
        amount1: '539',
        amount2: '4.1',
        amount3: 15,
        amount4: 20
      }]
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
      // this.loading = true;
      // adjustDetail(this.queryParams).then(response => {
      //   // isDregs // 是否渣土   1 是 0 否 (司机实收 只有渣土1能修改)

      //   this.oldList = JSON.parse(JSON.stringify(response.data));
      //   this.adjustlist = JSON.parse(JSON.stringify(response.data));

      //   this.total = response.total;
      //   this.loading = false;
      // });
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
      console.log(data);
      //   this.isEdit2 = false;
      //   this.isEdit = false;

    //   this.isPiliang = data.length > 1;
    //   this.deliveryCashFee = undefined;
    //   this.queryParams.waybillCodeList = data;
    //   this.getList();
    },

    handleBtn(row) {
      // this.$refs.DetailDialog.reset();
      // this.currentId = row.wayBillCode || 'f1bd42167008437e84474f90e27850be';
      this.openDetailDialog = true;
      // this.titleDetailDialog = '运输单信息';
      // this.formDisable = true;
    },

    // 编辑票务信息
    handleBianjiPiaowu() {
      this.shipmentCode = '1eb059d2255b43ee872925164ddfe0d1';
      this.openBillPage = true;
    }



  }
};
</script>

<style>

</style>
