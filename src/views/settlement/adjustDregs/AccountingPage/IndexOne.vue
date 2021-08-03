<template>
  <div>
    <!-- 核算页面 -->
    <div v-show="showSearch">
      <QueryForm
        v-model="alreadyPaid_queryParams"
        :is-shipment="isShipment"
        @handleQuery="()=>{
          alreadyPaid_queryParams.pageNum = 1;
          getList()
        }"
      />
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="!multiple"
            @click="handlerPiliang"
          >批量核算</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain :class="{'myactive': sortName=='cardBatchNo'}" size="mini" @click="()=>{sortName = 'cardBatchNo'}">以卡批次排序</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain :class="{'myactive': sortName=='ztcName'}" size="mini" @click="()=>{sortName = 'ztcName'}">以渣土场排序</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain :class="{'myactive': sortName=='teamName'}" size="mini" @click="()=>{sortName = 'teamName'}">以调度组排序</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" size="mini" @click="nuclearCardOpen">核销IC卡</el-button>
        </el-col>
        <el-col :span="1.5" class="fr">
          <!-- api 使用computed -->
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>


      <AccountingTable ref="accountingRef" :loading="loading" :my-data="myData" :sort="sortName" :columns="tableColumnsConfig" @ismultiple="(bool)=> multiple = bool" @refresh="getList" />

      <!-- 核销IC卡 -->
      <nuclear-card ref="NuclearCard" :open.sync="nuclearCardDialog" @listData="listData" />
    </div>
  </div>
</template>

<script>
import QueryForm from './components/QueryForm.vue';

import AccountingTable from './components/AccountingTable.vue';

// 核销IC卡
import NuclearCard from '../NuclearCard';

import { getUserInfo } from '@/utils/auth';

import { ztApiList, ztApi } from '@/api/settlement/adjust';
export default {
  components: { QueryForm, AccountingTable, NuclearCard },

  data() {
    return {
      showSearch: true,
      loading: false,
      'total': 0,
      alreadyPaid_queryParams: {
        // 固定--
        'pageNum': 1,
        'pageSize': 10,

        companyCode: undefined, // 发货企业	query	false
        waybillNo: undefined, //	批次号	query	false
        operator: undefined, //	操作人名称	query	false
        // status: 2, //	1已申请对账列表 2已申请开票列表 3已申请打款列表 4已完成列表	query	false
        teamCode: undefined, //	调度者名称	query	false
        ztcCode: undefined, //	渣土场	query	false
        projectCode: undefined, // 项目
        receiveTime: [],
        cardBatchNo: undefined // 卡批次
      },
      isShipment: true,
      tableColumnsConfig: [],
      // adjustlist: [],
      // selections: [],
      sortName: 'cardBatchNo',

      // 表格
      myData: undefined,
      multiple: false,

      // ic卡
      nuclearCardDialog: false

    };
  },

  computed: {
    api() {
      return ztApi + '--' + (this.isShipment ? 'isShipment' : 'isNoShipment') + this.activeName;
    }
  },

  watch: {
    '$route.query.adjust': {
      handler(va) {
        console.log(va === '4');
        if (va && va === '4' && !this.myData) {
          this.getList();
        }
      },
      immediate: true
    }
  },

  created() {
    const { isShipment } = getUserInfo() || {};
    this.isShipment = isShipment;

    this.tableColumnsInit();
  },

  methods: {
    /** 查询【请填写功能名称】列表 */

    tableColumnsInit() {
      this.tableHeaderConfig(
        this.tableColumnsConfig,
        this.api,
        { prop: 'edit',
          isShow: false,
          tooltip: false,
          label: '操作',
          width: 240,
          fixed: 'left' }, [{
          prop: 'icStatus',
          isShow: true,
          tooltip: false,
          sortNum: 2,
          label: 'IC卡核对状态',
          width: 120
        }, { // 需要顶替掉的项
          prop: 'shipperCopeFee',
          isShow: false,
          tooltip: false,
          sortNum: 100,
          label: '货主应付金额',
          width: 120
        }, { // 需要顶替掉的项
          prop: 'isReturn',
          isShow: false,
          tooltip: false,
          sortNum: 100,
          label: '纸质回单状态',
          width: 120
        }, { // 需要顶替掉的项
          prop: 'loadWeight',
          isShow: true,
          tooltip: false,
          sortNum: 5,
          label: '装车数量',
          width: 120
        }, { // 需要顶替掉的项
          prop: 'unloadWeight',
          isShow: true,
          tooltip: false,
          sortNum: 6,
          label: '卸车数量',
          width: 120
        }
        ]);
    },
    getList() {
      this.loading = true;
      const que = {
        ...this.alreadyPaid_queryParams,
        'pageNum': undefined, // 不做分页
        'pageSize': undefined, // 不做分页
        'orderStartTime': this.alreadyPaid_queryParams.receiveTime ? this.alreadyPaid_queryParams.receiveTime[0] : undefined,
        'orderEndTime': this.alreadyPaid_queryParams.receiveTime ? this.alreadyPaid_queryParams.receiveTime[1] : undefined,
        receiveTime: undefined,
        scenario: '1200',
        waybillType: 1
      };
      ztApiList(que).then(response => {
        this.myData = response.data;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },

    handlerPiliang() {
      this.$refs.accountingRef.handleTableBtn();
    },

    // 读卡
    nuclearCardOpen() {
      this.$confirm('请确认读卡器USB设备连接上了吗? 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.nuclearCardDialog = true;
      }).catch(() => {});
    },
    /** IC卡核销完的数据 */
    listData(data) {
      this.sortName = 'cardBatchNo';
      const batchWayBillBalanceInfoVo = data.map(e => {
        // 追加 卡批次维度
        return {
          ...e.batchWayBillBalanceInfoVo,
          cardBatchNo: e.$_userInfo.issuing_pc
        };
      });
      if (!this.myData) { this.myData = []; }
      this.myData = this.myData.concat(batchWayBillBalanceInfoVo);

      console.log(this.myData, '返回的数据了----');
    }
  }
};
</script>

<style scoped>
.myactive.el-button--success.is-plain{
    background: #13ce66 !important;
    border-color: #13ce66 !important;
    color: #FFFFFF !important;
}
</style>
