
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
        <span>{{ floor(row.loadWeight, row.stowageStatus === '2'? 0: 3) +' '+ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
        <!-- <span>{{ row.loadWeight +' '+ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span> -->
      </template>
      <template #unloadWeight="{row}">
        <!-- <span>{{ row.unloadWeight +' '+ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span> -->
        <span>{{ floor(row.unloadWeight, row.stowageStatus === '2'? 0: 3) +' '+ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
      </template>

      <template #stowageStatus="{row}">
        <span>{{ selectDictLabel(stowageStatusOP, row.stowageStatus) }}</span>
      </template>

      <template #isChild="{row}">
        <span>{{ selectDictLabel(isChild_op, row.isChild) }}</span>
      </template>

      <template #applyStatus="{row}">
        <span :class="applyStatusClass(row.applyStatus)" @click="handlerClick(row)">
          {{ selectDictLabel(applyStatus_op, row.applyStatus) }}
        </span>
      </template>

      <template #fillTime="{row}">
        <span>{{ parseTime(row.fillTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #signTime="{row}">
        <span>{{ parseTime(row.signTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <!-- status -->
      <!-- 运单状态：0未接单/1已接单/2已装货/3已签收（已卸货）/4已回单（收单复核）/5已核算/6已申请（打款）/7已打款/10.已作废 11/已核验 12 已完成 -->
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
          { 'dictLabel': '已开票', 'dictValue': '9' },
          { 'dictLabel': '已作废', 'dictValue': '10' },
          { 'dictLabel': '已核验', 'dictValue': '11' },
          { 'dictLabel': '已完成', 'dictValue': '12' }
        ], row.status ) }}</span>
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
import { batch } from '@/api/settlement/payment';
import { getUserInfo } from '@/utils/auth';
import { floor } from '@/utils/ddc';

export default {
  'name': 'StatementsInfo',
  props: {
    // wayBillCodes: { type: Array, default: () => [] }
    printData: { type: Object, default: () => { return {}; } },
    status: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      floor,
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
      // 配载方式 0->吨，1->方 2->车数配载
      stowageStatusOP: [
        { 'dictLabel': '吨', 'dictValue': '0' },
        { 'dictLabel': '方', 'dictValue': '1' },
        { 'dictLabel': '车', 'dictValue': '2' }
      ],
      // isChild
      // 是否子单 0 不是 （正常单），1 是（子单） ，2 超载的主单
      isChild_op: [
        { 'dictLabel': '不是 （正常单）', 'dictValue': 0 },
        { 'dictLabel': '是（子单）', 'dictValue': 1 },
        { 'dictLabel': '超载的主单', 'dictValue': 2 }
      ],

      //  0: 未申请 1: 已申请 2: 已驳回 3: 打款中 4: 已打款 5: 打款失败 "
      applyStatus_op: [
        { dictLabel: '未申请', dictValue: 0 },
        { dictLabel: '已申请', dictValue: 1 },
        { dictLabel: '已驳回', dictValue: 2 },
        { dictLabel: '打款中', dictValue: 3 },
        { dictLabel: '已打款', dictValue: 4 },
        { dictLabel: '打款失败', dictValue: 5 }
      ]
    };
  },
  computed: {
    api() {
      let str = BatchInfoListVo + '--' + 'StatementsInfo';
      if (this.status === 4) {
        str = BatchInfoListVo + '--' + 'StatementsInfo4';
      }
      return str;
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
          'sortNum': 100,
          'label': '纸质回单状态',
          'width': 120
        },
        {
          'label': '公司名称',
          'prop': 'companyName',
          'isShow': !isShipment,
          'sortNum': 100,
          'width': '120',
          'tooltip': true
        },

        {
          'prop': 'increaseDes',
          'isShow': true,
          'tooltip': true,
          'sortNum': 100,
          'label': '数值描述',
          'width': 120
        },
        {
          'prop': 'deductionDes',
          'isShow': true,
          'tooltip': true,
          'sortNum': 100,
          'label': '备注',
          'width': 120
        }
      ];

      // 已打款特殊另加打款状态
      if (this.status === 4) {
        com.push({
          'label': '打款状态',
          'prop': 'applyStatus',
          'isShow': true,
          'sortNum': 21,
          'width': '120',
          'tooltip': true
        });
      }

      // console.log(com);




      this.tableHeaderConfig(
        this.tableColumnsConfig,
        this.api, null,
        com
      );
    },

    /** 获取数据 */
    getList() {
      this.loading = true;
      batchRelatedWaybill({ ...this.queryParams, batchNo: this.printData.batchNo }).then(res => {
        this.loading = false;
        this.adjustlist = res.data.list.sort((m, n) => {
          return m.applyStatus - n.applyStatus;
        });
        this.total = res.data.total;
      });
    },

    applyStatusClass(status) {
      let className = 'g-color-success';

      if (status === 3) {
        className = 'g-color-warning';
      } else if (status === 5) {
        className = 'g-color-require shou';
      }

      return className;
    },

    // 再打款
    handlerClick(row) {
      if (row.applyStatus === 5) {
        this.$confirm('是否确认打款？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batch({ wayBillSettlementCodeList: [row.settlementCode] }).then(response => {
            this.$message({ type: 'success', message: '发起打款成功！' });
            this.getList();
          });
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消' });
        });
      }
    }

  }
};
</script>

