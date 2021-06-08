
<template>
  <div>
    <!-- @selection-change="handleSelectionChange" -->
    <RefactorTable :loading="loading" :data="adjustlist" :table-columns-config="tableColumnsConfig">
      <template #weight="{row}">
        <span v-if="row.weight">
          <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.weight }} 吨</span>
          <span v-if="row.stowageStatus === '1'">{{ row.weight }} 立方</span>
          <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.weight) }} 车</span>
        </span>
      </template>
      <template #fillTime="{row}">
        <span>{{ parseTime(row.fillTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #signTime="{row}">
        <span>{{ parseTime(row.signTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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


export default {
  'name': 'AdjustDregs',
  props: {
    wayBillCodes: { type: Array, default: () => [] }
  },
  data() {
    return {
      'tableColumnsConfig': [],
      'tableColumnsConfig1': [
        {
          prop: 'icStatus',
          isShow: true,
          tooltip: false,
          sortNum: 8,
          label: 'IC卡核对状态',
          width: 120
        }, { // 需要顶替掉的项
          prop: 'huojhzouihfowe',
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
        }
      ],
      // 遮罩层
      'loading': false,

      // 表格数据
      'adjustlist': [],
      'total': 0,
      'queryParams': {
        'pageNum': 1,
        'pageSize': 10
      }
    };
  },
  computed: {
    api() {
      return BatchInfoListVo + '--adjustDregs66';
    }
  },


  created() {
    this.tabColInit();
    this.getList();
    // if (this.wayBillCodes.length) {
    // }
    console.log(45646);
  },
  'methods': {
    /** 表头初始化 */
    tabColInit() {
      !this.tableColumnsConfig.length && this.tableHeaderConfig(
        this.tableColumnsConfig,
        this.api, null,
        this.tableColumnsConfig1
      );
    },

    /** 获取数据 */
    getList() {
      this.loading = true;
      batchRelatedWaybill({ wayBillCodes: this.wayBillCodes }).then(res => {
        this.loading = false;
        this.adjustlist = res.data.list;
        this.total = res.total - 0;
      });
    }
  }
};
</script>
