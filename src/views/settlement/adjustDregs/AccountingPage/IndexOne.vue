<template>
  <div>
    <!-- 核算页面 -->
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
            type="primary"
            icon="el-icon-document-checked"
            size="mini"
            :disabled="!multiple"
            @click="handlerPiliang"
          >批量核算</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain size="mini" @click="()=>{sortName = 'cardBatchNo'}">以卡批次排序</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain size="mini" @click="()=>{sortName = 'ztcName'}">以渣土场排序</el-button>
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


      <AccountingTable ref="accountingRef" :my-data="myData" :sort="sortName" :columns="tableColumnsConfig" @ismultiple="(bool)=> multiple = bool" @refresh="getList" />

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
        batchNo: undefined, //	批次号	query	false
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
      sortName: '',

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

        /*
      //     'wayBillCode': '83d7b5856f3247d78ba7ba5ca574151f',
      //     'mainOrderNumber': '2106190954579183',
      //     'waybillNo': '2106191000275187',
      //     'deliveryCompany': '渣土货主公司',
      //     'orderClient': '渣土货主[15859109601]',
      //     'isChild': 0,
      //     'driverName': '测试独立加强',
      //     'driverPhone': '15859109002',
      //     'goodsBigType': '1800',
      //     'licenseNumber': '闽AQ8002',
      //     'loadWeight': '1.00',
      //     'unloadWeight': '1.00',
      //     'goodsPrice': 0,
      //     'freightPrice': null,
      //     'deliveryFeeDeserved': 0,
      //     'deliveryFeePractical': 0,
      //     'deliveryCashFee': 0,
      //     'serviceFee': 0,
      //     'serviceTaxFee': 0,
      //     'taxPayment': 0,
      //     'driverAddFee': 0,
      //     'driverReductionFee': 0,
      //     'loadAddress': '福建省福州市晋安区易速递',
      //     'loadContact': '渣土货主',
      //     'loadContactPhone': '15859109601',
      //     'unloadAddress': '福建省福州市台江区江滨中大道鼓山大桥旁富邦总部大楼',
      //     'unloadContact': null,
      //     'unloadContactPhone': null,
      //     'isReturn': 1,
      //     'lastLoadingTime': null,
      //     'orderTime': '2021-06-19 09:54:57',
      //     'receiveTime': '2021-06-19 10:00:00',
      //     'wayBillUpdateTime': '2021-06-19 10:30:52',
      //     'isApplyMoneyBack': 0,
      //     'applyMoneyBackRemark': null,
      //     'taxFreeFee': 0,
      //     'taxFee': 0,
      //     'stowageStatus': '2',
      //     'weight': null,
      //     'teamLeaderName': '15859109120',
      //     'teamName': '测试网商小强调度',
      //     'teamUserCode': '55221c19f4954853b46dca4a2b481e58',
      //     'icStatus': '1',
      //     'shipperCopeFee': '0.00',
      //     'projectName': '616测试项目1',
      //     'ztcName': '616测试1',
              'cardBatchNo': ''
        */

        // this.total = response.total || 0;
        this.loading = false;
      });
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
      // const data1 = [{
      //   'serialNumber': 31,
      //   'waybillNo': '2106191000275187',
      //   'orderId': 30528,
      //   'projectName': '616测试项目1',
      //   'licenseNumber': '闽AQ8002',
      //   'driverName': '测试独立加强',
      //   'driverPhone': '15859109002',
      //   'fillTime': 1624068000000,
      //   'signTime': 1624068000000,
      //   'mudtail': '616测试1—石渣土',
      //   'writeOffStatus': 0,
      //   'writeOffRemark': null,
      //   'fillTimeDate': '2021-06-19T02:00:00.000+00:00',
      //   'signTimeDate': '2021-06-19T02:00:00.000+00:00',
      //   'icStatus': null,
      //   'batchWayBillBalanceInfoVo': {
      //     'wayBillCode': '83d7b5856f3247d78ba7ba5ca574151f',
      //     'mainOrderNumber': '2106190954579183',
      //     'waybillNo': '2106191000275187',
      //     'deliveryCompany': '渣土货主公司',
      //     'orderClient': '渣土货主[15859109601]',
      //     'isChild': 0,
      //     'driverName': '测试独立加强',
      //     'driverPhone': '15859109002',
      //     'goodsBigType': '1800',
      //     'licenseNumber': '闽AQ8002',
      //     'loadWeight': '1.00',
      //     'unloadWeight': '1.00',
      //     'goodsPrice': 0,
      //     'freightPrice': null,
      //     'deliveryFeeDeserved': 0,
      //     'deliveryFeePractical': 0,
      //     'deliveryCashFee': 0,
      //     'serviceFee': 0,
      //     'serviceTaxFee': 0,
      //     'taxPayment': 0,
      //     'driverAddFee': 0,
      //     'driverReductionFee': 0,
      //     'loadAddress': '福建省福州市晋安区易速递',
      //     'loadContact': '渣土货主',
      //     'loadContactPhone': '15859109601',
      //     'unloadAddress': '福建省福州市台江区江滨中大道鼓山大桥旁富邦总部大楼',
      //     'unloadContact': null,
      //     'unloadContactPhone': null,
      //     'isReturn': 1,
      //     'lastLoadingTime': null,
      //     'orderTime': '2021-06-19 09:54:57',
      //     'receiveTime': '2021-06-19 10:00:00',
      //     'wayBillUpdateTime': '2021-06-19 10:30:52',
      //     'isApplyMoneyBack': 0,
      //     'applyMoneyBackRemark': null,
      //     'taxFreeFee': 0,
      //     'taxFee': 0,
      //     'stowageStatus': '2',
      //     'weight': null,
      //     'teamLeaderName': '15859109120',
      //     'teamName': '测试网商小强调度',
      //     'teamUserCode': '55221c19f4954853b46dca4a2b481e58',
      //     'icStatus': '1',
      //     'shipperCopeFee': '0.00',
      //     'projectName': '616测试项目1',
      //     'ztcName': '616测试1'
      //   }
      // }];

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

<style>

</style>
