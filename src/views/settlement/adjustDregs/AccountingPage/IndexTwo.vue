<template>
  <div>
    <!-- 核算驳回页面 -->
    <div v-show="showSearch" class="app-container app-container--search">
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
            v-hasPermi="['transportation:waybillBalanceInfo:batchCheck']"
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="selections.length<=0"
            @click="handlerPiliang"
          >批量核算</el-button>
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


      <AccountingTable :my-data="myData" :columns="tableColumnsConfig" @handleSelectionChange="(arr)=> selections = arr" />

    </div>
  </div>
</template>

<script>
import QueryForm from './components/QueryForm.vue';

import AccountingTable from './components/AccountingTable.vue';

import { getUserInfo } from '@/utils/auth';

import { ztApiList, ztApi } from '@/api/settlement/adjust';
export default {
  components: { QueryForm, AccountingTable },

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
        batchNo: undefined, //	批次号	query	false
        operator: undefined, //	操作人名称	query	false
        status: 2, //	1已申请对账列表 2已申请开票列表 3已申请打款列表 4已完成列表	query	false
        teamCode: undefined, //	调度者名称	query	false
        ztcCode: undefined, //	渣土场	query	false
        projectCode: undefined, // 项目
        receiveTime: []
      },
      isShipment: true,
      tableColumnsConfig: [],
      // adjustlist: [],
      selections: [],

      // 表格
      myData: undefined,
      // multiple: true,

      // ic卡
      nuclearCardDialog: false

    };
  },

  computed: {
    api() {
      return ztApi + '--' + (this.isShipment ? 'isShipment' : 'isNoShipment') + this.activeName;
    }
  },

  created() {
    const { isShipment } = getUserInfo() || {};
    this.isShipment = isShipment;

    this.tableColumnsInit();

    // this.getList();
  },

  methods: {
    /** 查询【请填写功能名称】列表 */

    tableColumnsInit() {
      this.tableHeaderConfig(
        this.tableColumnsConfig,
        this.api,
        { prop: 'edit',
          isShow: true,
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
          isShow: true,
          tooltip: false,
          sortNum: 28,
          label: '货主应付金额',
          width: 120
        }, { // 需要顶替掉的项
          prop: 'isReturn',
          isShow: false,
          tooltip: false,
          sortNum: 0,
          label: '纸质回单状态',
          width: 120
        }]);
    },
    getList() {
      this.loading = true;
      const que = {
        ...this.alreadyPaid_queryParams,
        scenario: '1200',
        waybillType: 1
      };
      ztApiList(que).then(response => {
        this.adjustlist = response.data;
        this.total = response.total || 0;
        this.loading = false;
      });
    },

    handlerPiliang() {
      console.log(this.selections);
    }

  }
};
</script>

<style>

</style>
