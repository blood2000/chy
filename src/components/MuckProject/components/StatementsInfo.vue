
<template>
  <div style="margin-bottom: 50px;">
    <div class="mb20 ly-t-right">
      <tablec-cascader v-model="tableColumnsConfig" :lcokey="api" />
    </div>
    <RefactorTable :loading="loading" :data="adjustlist" :table-columns-config="tableColumnsConfig">
      <template #weight="{row}">
        <span>{{ row.weight +' '+ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
      </template>

      <template #loadWeight="{row}">
        <span>{{ row.loadWeight +' '+ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
      </template>
      <template #unloadWeight="{row}">
        <span>{{ row.unloadWeight +' '+ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
      </template>

      <template #stowageStatus="{row}">
        <span>{{ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
      </template>
      <template #fillTime="{row}">
        <span>{{ parseTime(row.fillTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #signTime="{row}">
        <span>{{ parseTime(row.signTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #status="{row}">
        <span>{{ selectDictLabel([
          { 'dictLabel': '未接单', 'dictValue': '0' },
          { 'dictLabel': '已接单', 'dictValue': '1' },
          { 'dictLabel': '已装货', 'dictValue': '2' },
          { 'dictLabel': '已签收(已卸货)', 'dictValue': '3' },
          { 'dictLabel': '已回单(收单复核)', 'dictValue': '4' },
          { 'dictLabel': '已核算', 'dictValue': '5' },
          { 'dictLabel': '已申请(打款)', 'dictValue': '6' },
          { 'dictLabel': '已打款', 'dictValue': '7' },
          { 'dictLabel': '已申请开票', 'dictValue': '8' },
          { 'dictLabel': '已开票', 'dictValue': '9' }
        ], row.status) }}</span>
      </template>


    </RefactorTable>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { batchRelatedWaybill, BatchInfoListVo } from '@/api/settlement/adjustDregs';
import { getUserInfo } from '@/utils/auth';

export default {
  'name': 'StatementsInfo',
  props: {
    // wayBillCodes: { type: Array, default: () => [] }
    printData: { type: Object, default: () => { return {}; } }
  },
  data() {
    return {
      'tableColumnsConfig': [],
      // 遮罩层
      'loading': false,

      // 表格数据
      'adjustlist': [],
      'total': 0,
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10
      },
      stowageStatusOP: [
        { 'dictLabel': '吨', 'dictValue': '0' },
        { 'dictLabel': '方', 'dictValue': '1' },
        { 'dictLabel': '车', 'dictValue': '2' }
      ]
    };
  },
  computed: {
    api() {
      return BatchInfoListVo + '--' + 'StatementsInfo';
    }
  },


  created() {
    this.tabColInit();
    this.getList();
  },
  'methods': {
    /** 表头初始化 */
    tabColInit() {
      const { isShipment = false } = getUserInfo() || {};
      this.tableColumnsConfig = [];

      const com = [
        {
          'prop': 'waybillNo',
          'isShow': true,
          'tooltip': false,
          'sortNum': 0,
          'label': '运单号',
          'width': 150
        },
        {
          'prop': 'isReturn',
          'isShow': false,
          'tooltip': false,
          'sortNum': 0,
          'label': '纸质回单状态',
          'width': 120
        },
        {
          'label': '公司名称',
          'prop': 'companyName',
          'isShow': !isShipment,
          'sortNum': 0,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '服务费',
          'prop': 'serviceFee',
          'isShow': false,
          'sortNum': 0,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '商品大类',
          'prop': 'goodsBigTypeName',
          'isShow': false,
          'sortNum': 0,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '服务税费',
          'prop': 'serviceTaxFee',
          'isShow': false,
          'sortNum': 0,
          'width': '120',
          'tooltip': true
        },
        {
          'label': '给货主结算的和展示的每车总费',
          'prop': 'shipperDeliveryFee',
          'isShow': false,
          'sortNum': 0,
          'width': '120',
          'tooltip': true
        },
        {
          'prop': 'increaseDes',
          'isShow': true,
          'tooltip': true,
          'sortNum': 10,
          'label': '数值描述',
          'width': 120
        },
        {
          'prop': 'deductionDes',
          'isShow': true,
          'tooltip': true,
          'sortNum': 11,
          'label': '备注',
          'width': 120
        }
      ];




      this.tableHeaderConfig(
        this.tableColumnsConfig,
        this.api, null,
        com
      );
    },

    /** 获取数据 */
    getList() {
      this.loading = true;
      batchRelatedWaybill({ batchNo: this.printData.batchNo }).then(res => {
        this.loading = false;
        this.adjustlist = res.data.list;
        this.total = res.data.total;
      });
    }
  }
};
</script>
