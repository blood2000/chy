<template>
  <div>
    <!-- 核验的页面 独立 -->
    <div v-show="showSearch">
      <QueryForm ref="queryRefForm" v-model="queryParams" :is-dispatcher="userInfo.isDispatcher" :shift-op="shiftOp" @handleQuery="handleQuery" />
    </div>

    <div class="app-container">
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :disabled="!(total>0)"
            :loading="exportLoading"
            @click="handleExport"
          >导出</el-button>
        </el-col>

        <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" /><!-- api 使用computed -->
        </el-col>
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>

      <RefactorTable
        :loading="loading"
        :data="dataList || []"
        :table-columns-config="tableColumnsConfig"
      >
        <template #waybillClasses="{row}">
          <span>{{ selectDictLabel(shiftOp, row.waybillClasses) }}</span>
        </template>
      </RefactorTable>
      <!-- @selection-change="(selection)=> selections = selection" -->

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>



import { getUserInfo } from '@/utils/auth';

import { driverValueList } from '@/api/dregs/driverPerformance.js';

import QueryForm from './components/QueryForm.vue';
// import StatementsInfo from './components/StatementsInfo';
// import SettlementPrint from './components/SettlementPrint';
// import RejectDialog from './components/rejectDialog';
// import BillPage from '@/views/enterprise/company/billing';
// import DismissedTrack from './components/DismissedTrack';

// // 回单
// import ReceiptDialog from './components/ReceiptDialog.vue';

// // 开票弹窗
// import BillingDialog from '@/views/finance/list/dregs/billingDialog';
// // 核算
// import AdjustDialog from '@/views/settlement/adjustDregs/adjustDialog';

// import { sha1 } from '@/utils/sha1';


export default {
  // 'name': 'DriverPerformance',
  components: { QueryForm }, // 筛选条件

  props: {
    status: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      // --------------s= 以下是页面基本初始数据(禁止删除)-------------------------------
      'exportLoading': false,
      // 总条数
      'total': 0,
      // 查询参数
      'queryParams': {
        // 固定--
        'pageNum': 1,
        'pageSize': 10,
        // 搜索条件----
        teamCode: undefined, // 调度组Code
        projectCode: undefined, // 项目Code
        ztcCode: undefined, // 渣土场Code
        driverName: undefined, // 司机
        licenseNumber: undefined, // 车牌号

        loadTime: [], // 装货时间
        unloadTime: [], // 卸货时间

        waybillClasses: undefined // 运单班次
      },
      // 显示搜索条件
      'showSearch': true,
      // 遮罩层
      'loading': false,
      // 当前页列表数据
      'dataList': [],
      // 当前页表头
      'tableColumnsConfig': [],
      // 列表多择
      'selections': [],

      // --------------e= 以上是页面基本初始数据(禁止删除)-------------------------------

      // 字典值
      shiftOp: []

    };
  },
  computed: {
    // 表头地址 和 本地存储key
    api() {
      const api = 'adjustListApi';
      return api;
    },
    // 当前登录信息
    userInfo() {
      // const { isShipment = false, shipment = {}} = getUserInfo() || {};
      // userInfo.isShipment
      const userInfo = getUserInfo() || {};
      console.log(userInfo);
      return userInfo;
    },
    // 表头本地写死
    tableColumns() {
      const arr = [
        {
          'label': '项目',
          'prop': 'projectName',
          'isShow': true,
          'sortNum': 2,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '渣土场',
          'prop': 'ztcName',
          'isShow': true,
          'sortNum': 2,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '司机姓名',
          'prop': 'driverName',
          'isShow': true,
          'sortNum': 2,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '司机电话',
          'prop': 'driverPhone',
          'sortable': true,
          'isShow': true,
          'sortNum': 2,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '车牌号',
          'prop': 'licenseNumber',
          'isShow': true,
          'sortNum': 2,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '装货日期',
          'prop': 'fillTime1',
          'isShow': true,
          'sortNum': 2,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '装货时间',
          'prop': 'fillTime',
          'isShow': true,
          'sortNum': 2,
          'width': '170',
          'tooltip': true
        },
        {
          'label': '卸货日期',
          'prop': 'signTime1',
          'isShow': true,
          'sortNum': 2,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '卸货时间',
          'prop': 'signTime',
          'isShow': true,
          'sortNum': 2,
          'width': '170',
          'tooltip': true
        },
        {
          'label': '运单班次',
          'prop': 'waybillClasses',
          'isShow': true,
          'sortNum': 2,
          'width': '120',
          'tooltip': true
        }
      ];
      return arr;
    },

    // 请求参数处理
    que() {
      return {
        ...this.queryParams,
        loadTimeBegin: this.queryParams.loadTime ? this.queryParams.loadTime[0] : undefined, //	装货日期begin	query	false
        loadTimeEnd: this.queryParams.loadTime ? this.queryParams.loadTime[1] : undefined, //	装货日期end

        receiveDateBegin: this.queryParams.unloadTime ? this.queryParams.unloadTime[0] : undefined,	 // 卸货日期begin	query	false
        receiveDateEnd: this.queryParams.unloadTime ? this.queryParams.unloadTime[1] : undefined,	 // 卸货日期end

        projectCode: this.queryParams.projectCode || undefined,

        loadTime: undefined,
        unloadTime: undefined
      };
    }
  },

  created() {
    this.getDicts('work-shift').then((response) => { this.shiftOp = response.data; });
    this.tableColumnsInit();
    this.getList();
  },
  'methods': {
    /** 初始化表头 */
    tableColumnsInit() {
      this.tableColumnsConfig = [];

      this.tableHeaderConfig(this.tableColumnsConfig, this.api, null, this.tableColumns);
    },

    /** 查询批次列表 */
    async getList() {
      this.loading = true;

      try {
        const res = await driverValueList(this.que);

        this.dataList = res.data.list;
        this.total = res.data.total;

        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },


    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.selections = [];
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },

    /** 导出操作 */
    async handleExport() {
      this.exportLoading = true;
      await this.download('/transportation/batch/disExport', this.que, '车队管理助手');
      this.exportLoading = false;
    }


  }
};
</script>

