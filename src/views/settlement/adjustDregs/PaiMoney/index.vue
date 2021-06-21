<template>
  <div>
    <!-- 核验的页面 独立 -->
    <div v-show="showSearch" class="app-container app-container--search">
      <AlreadyQueryForm v-model="alreadyPaid_queryParams" :is-shipment="isShipment" @handleQuery="handleQuery" />
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <!-- 已打款 -->
      <div v-if="activeName === '7'">
        <AlreadyTable
          v-model="alreadyPaid_queryParams"
          :list="alreadyTableList"
          :loading="loading"
          :config="{api: adjustDregsApi}"
          :show-search.sync="showSearch"
          @getList="getadjustDregsList"
          @handleTableBtn="handleTableBtn"
          @handleSelectionChange="handleSelectionChange1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AlreadyQueryForm from './components/AlreadyQueryForm.vue';
import AlreadyTable from './components/AlreadyTable';

import { adjustDregsList, adjustListApi as adjustDregsApi, accountStatement } from '@/api/settlement/adjustDregs';
export default {
  components: { AlreadyQueryForm, AlreadyTable },

  data() {
    return {
      alreadyPaid_queryParams: {
        batchNo: undefined, //	批次号	query	false
        companyCode: undefined, //	发货企业	query	false
        invoiceTitle: undefined, //	发票抬头	query	false
        operator: undefined, //	操作人名称	query	false
        status: 4, //	1已申请对账列表 2已申请开票列表 3已申请打款列表 4已完成列表	query	false
        teamCode: undefined, //	调度者名称	query	false
        ztcCode: undefined, //	渣土场	query	false

        'pageNum': 1,
        'pageSize': 10,
        'total': 0
      },
      showSearch: true,

      loading: false,
      alreadyTableList: []

    };
  },

  computed: {

    adjustDregsApi() {
      return adjustDregsApi + '--' + (this.isShipment ? 'isShipment' : 'isNoShipment') + ('4');
    }

  },

  created() {
    //   this.alreadyPaid_queryParams.pageNum = 1;
    this.getadjustDregsList();
  },

  methods: {
    /** 获取渣土已审核列表 */
    getadjustDregsList() {
      this.loading = true;
      adjustDregsList(this.alreadyPaid_queryParams).then(res => {
        this.alreadyTableList = res.data.list;
        this.alreadyPaid_queryParams.total = res.data.total;
        this.loading = false;
      });
    },

    handleTableBtn(row) {
      this.Statementsdialog = true;
      this.title = '对账单详情';
    //   this.$refs.StatementsDialog.setBatchStatementCode(row.batchStatementCode, row); // 传code
    }

  }

};
</script>

<style>

</style>
