<template>
  <div>
    <el-row
      :gutter="10"
      class="mb8"
    >
      <slot />
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="config.api" />
      </el-col>
      <right-toolbar
        :show-search.sync="openShowSearch"
        @queryTable="$emit('getList')"
      />
    </el-row>
    <RefactorTable :loading="loading" :data="list" :table-columns-config="tableColumnsConfig" is-show-index @selection-change="(rdata)=>$emit('handleSelectionChange', rdata)">
      <template #status="{row}">
        <span>{{ selectDictLabel(statusOptions, row.status) }}</span>
      </template>

      <template #edit="{row}">
        <el-button
          v-has-permi="['transportation:batch:batchInfo']"
          size="mini"
          type="text"
          @click="$emit('handleTableBtn', row, 'XIANGQONG')"
        >详情</el-button>
      </template>
    </RefactorTable>
    <pagination
      v-show="queryParams.total>0"
      :total="queryParams.total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="$emit('getList')"
    />
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth';
export default {
  name: 'AlreadyTable',
  props: {
    loading: Boolean,
    list: {
      type: Array,
      default: () => []
    },

    config: {
      type: Object,
      default: () => {
        return {
          api: ''
        };
      }
    },
    showSearch: Boolean,
    value: {
      type: Object,
      default: () => { return {}; }
    }
  },
  data() {
    return {
      isShipment: false,
      tableColumnsConfig: [],

      statusOptions: [
        { dictLabel: '已申请对账', dictValue: 1 },
        { dictLabel: '已申请开票', dictValue: 2 },
        { dictLabel: '已申请打款', dictValue: 3 },
        { dictLabel: '已完成', dictValue: 4 }
      ]
    };
  },

  computed: {
    queryParams: {
      get() {
        return this.value;
      },
      set(data) {
        this.$emit('input', data);
      }
    },
    openShowSearch: {
      get() {
        return this.showSearch;
      },
      set(data) {
        this.$emit('update:showSearch', data);
      }
    },
    isShipmentTableColumnsConfig() {
      return !this.isShipment ? [
        {
          prop: 'companyName',
          isShow: true,
          label: '发货企业',
          sortNum: 2,
          width: 180
        },
        {
          prop: 'shipper',
          isShow: true,
          label: '发票抬头',
          sortNum: 2,
          width: 180
        },
        {
          prop: 'taxpayerNumber',
          isShow: true,
          label: '税务登记',
          sortNum: 2,
          width: 180
        }
      ] : [];
    }
  },

  created() {
    const { isShipment = false } = getUserInfo() || {};
    this.isShipment = isShipment;
    this.tableHeaderConfig(this.tableColumnsConfig, this.config.api, {
      prop: 'edit',
      isShow: true,
      tooltip: false,
      label: '操作',
      width: 100,
      fixed: 'left'
    }, [{
      prop: 'status',
      isShow: true,
      label: '状态',
      sortNum: 2,
      width: 180
    }].concat(this.isShipmentTableColumnsConfig));
  }
};
</script>

<style>

</style>
