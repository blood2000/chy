<template>
  <div>
    <!-- 核算页面 -->
    <div v-show="showSearch">
      <QueryForm
        v-model="queryParams"
        :is-shipment="isShipment"
        @handleQuery="()=>{
          queryParams.pageNum = 1;
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
          <!-- <el-button
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="!multiple"
            @click="handlerPiliang"
          >批量核算</el-button> -->
        </el-col>
        <!-- <el-col :span="1.5" class="fr">
          <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
        </el-col> -->
        <right-toolbar
          :show-search.sync="showSearch"
          @queryTable="getList"
        />
      </el-row>


      <AccountingTable
        ref="accountingRef"
        :loading="loading"
        :my-data="myData"
        :columns="tableColumnsConfig"
        @ismultiple="(bool)=> multiple = bool"
        @refresh="getList"
      />

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <!-- 核销IC卡 -->
      <!-- <nuclear-card ref="NuclearCard" :open.sync="nuclearCardDialog" @listData="listData" /> -->
    </div>
  </div>
</template>
<script>
import QueryForm from './components/QueryForm';
import AccountingTable from './components/AccountingTable';
import { cardHistoryList } from '@/api/acaredit';

const com = [
  {
    'label': '配载方式',
    'prop': 'stowageStatus',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '装货截止时间',
    'prop': 'lastLoadingTime',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '运费单价',
    'prop': 'freightPrice',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '实收现金',
    'prop': 'deliveryCashFee',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '服务费',
    'prop': 'serviceFee',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '服务税费',
    'prop': 'serviceTaxFee',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '纳税金额',
    'prop': 'taxPayment',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '打款驳回理由',
    'prop': 'applyMoneyBackRemark',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '不含税价',
    'prop': 'taxFreeFee',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '重量',
    'prop': 'weight',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '含税价',
    'prop': 'taxFee',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '装货地',
    'prop': 'loadAddress',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '卸货地',
    'prop': 'unloadAddress',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '发货企业',
    'prop': 'deliveryCompany',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '下单客户',
    'prop': 'orderClient',
    'isShow': false,
    'sortNum': 0,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '项目名称',
    'prop': 'projectName',
    'isShow': true,
    'sortNum': 1,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'prop': 'icStatus',
    'isShow': true,
    'tooltip': false,
    'sortNum': 2,
    'label': 'IC卡核对状态',
    'width': 120
  },
  {
    'label': '渣土场名称',
    'prop': 'ztcName',
    'isShow': true,
    'sortNum': 2,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '车队名称',
    'prop': 'teamName',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '车牌号',
    'prop': 'licenseNumber',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '运输单号',
    'prop': 'waybillNo',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '车队管理者',
    'prop': 'teamLeaderName',
    'isShow': true,
    'sortNum': 3,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'prop': 'loadWeight',
    'isShow': true,
    'tooltip': false,
    'sortNum': 5,
    'label': '装车数量',
    'width': 120
  },
  {
    'prop': 'unloadWeight',
    'isShow': true,
    'tooltip': false,
    'sortNum': 6,
    'label': '卸车数量',
    'width': 120
  },
  {
    'label': '货物类型',
    'prop': 'goodsBigType',
    'isShow': true,
    'sortNum': 8,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '发布货源时间',
    'prop': 'orderTime',
    'isShow': true,
    'sortNum': 10,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '接单时间',
    'prop': 'receiveTime',
    'isShow': true,
    'sortNum': 11,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '最后操作时间',
    'prop': 'wayBillUpdateTime',
    'isShow': false,
    'sortNum': 12,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '货主备注',
    'prop': 'shipperRemark',
    'isShow': true,
    'sortNum': 50,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'label': '货物单价',
    'prop': 'goodsPrice',
    'isShow': false,
    'sortNum': 99,
    'width': '120',
    'tooltip': true,
    'isChild': false
  },
  {
    'prop': 'shipperCopeFee',
    'isShow': false,
    'tooltip': false,
    'sortNum': 100,
    'label': '货主应付金额',
    'width': 120
  },
  {
    'prop': 'isReturn',
    'isShow': false,
    'tooltip': false,
    'sortNum': 100,
    'label': '纸质回单状态',
    'width': 120
  },
  {
    'prop': 'edit',
    'isShow': false,
    'tooltip': false,
    'label': '操作',
    'width': 240,
    'fixed': 'left'
  }
];
export default {
  name: 'Acaredit',
  components: { QueryForm, AccountingTable },

  data() {
    return {
      'showSearch': true,
      'loading': false,
      'total': 0,
      'queryParams': {
        // 固定--
        'pageNum': 1,
        'pageSize': 10,
        'sjasjosjpjgps': undefined,
        'cheiosslkkk': undefined,
        'receiveTime': []
      },

      isShipment: true,
      tableColumnsConfig: com,

      myData: [],
      multiple: false

    };
  },

  computed: {
    api() {
      return '454545';
    },

    que() {
      return this.queryParams;
    }
  },

  created() {
    this.getList();
  },



  methods: {
    // async getList() {
    //   this.loading = true;
    //   try {
    //     const res = await cardHistoryList(this.que);
    //     console.log(res);
    //     this.loading = false;
    //   } catch (error) {
    //     this.loading = false;
    //   }


    //   console.log(this.que);
    // }

    getList() {
      this.loading = true;
      // const que = {
      //   ...this.alreadyPaid_queryParams,
      //   'pageNum': undefined, // 不做分页
      //   'pageSize': undefined, // 不做分页
      //   'orderStartTime': this.alreadyPaid_queryParams.receiveTime ? this.alreadyPaid_queryParams.receiveTime[0] : undefined,
      //   'orderEndTime': this.alreadyPaid_queryParams.receiveTime ? this.alreadyPaid_queryParams.receiveTime[1] : undefined,
      //   receiveTime: undefined,
      //   scenario: '1200',
      //   waybillType: 1
      // };
      cardHistoryList(this.que).then(response => {
        console.log(response);
        this.myData = response.data;
        this.loading = false;
      }).catch(() => { this.loading = false; });
    }
  }
};
</script>

<style>

</style>
