<template>
  <div>
    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <!-- <el-button
          v-hasPermi="['transportation:waybillBalanceInfo:batchCheck']"
          type="primary"
          icon="el-icon-document-checked"
          size="mini"
          :disabled="multiple"
          @click="handleAdjust"
        >批量核算</el-button>
      </el-col>
      <el-col v-if="activeName == '5'" :span="1.5">
        <el-button
          v-hasPermi="['transportation:waybillBalanceInfo:batchApply']"
          type="primary"
          icon="el-icon-wallet"
          size="mini"
          :disabled="multiple"
          @click="handleApply"
        >批量申请对账</el-button>
      </el-col>
      <el-col v-if="activeName == '7' && !isAdmin" :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-chat-dot-square"
          size="mini"
          :disabled="multiple"
          @click="handleAssess"
        >批量评价</el-button> -->
      </el-col>
      <el-col :span="1.5" class="fr">
        <tablec-cascader v-model="tableColumnsConfig" :lcokey="config.api" />
      </el-col>
      <right-toolbar
        :show-search.sync="openShowSearch"
        @queryTable="$emit('getList')"
      />
    </el-row>
    <RefactorTable :loading="loading" :data="list" :table-columns-config="tableColumnsConfig" is-show-index @selection-change="(rdata)=>$emit('handleSelectionChange', rdata)">
      <!-- <template #goodsBigType="{row}">
        <span>{{ selectDictLabel(commodityCategoryCodeOptions, row.goodsBigType) }}</span>
      </template>
      <template #loadWeight="{row}">
        <span v-if="row.loadWeight">
          <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.loadWeight }} 吨</span>
          <span v-if="row.stowageStatus === '1'">{{ row.loadWeight }} 立方</span>
          <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.loadWeight) }} 车</span>
        </span>
      </template>
      <template #ICCard="{row}">
        <span v-if="row.ICCard == '0'"><i class="el-icon-error g-color-gray" />未核对</span>
        <span v-if="row.ICCard == '1'"><i class="el-icon-success g-color-success" />已核对</span>
      </template>
      <template #unloadWeight="{row}">
        <span v-if="row.unloadWeight">
          <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.unloadWeight }} 吨</span>
          <span v-if="row.stowageStatus === '1'">{{ row.unloadWeight }} 立方</span>
          <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.unloadWeight) }} 车</span>
        </span>
      </template>
      <template #weight="{row}">
        <span v-if="row.weight">
          <span v-if="row.stowageStatus === '0' || !row.stowageStatus">{{ row.weight }} 吨</span>
          <span v-if="row.stowageStatus === '1'">{{ row.weight }} 立方</span>
          <span v-if="row.stowageStatus === '2'">{{ Math.floor(row.weight) }} 车</span>
        </span>
      </template>
      <template #lastLoadingTime="{row}">
        <span>{{ parseTime(row.lastLoadingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template> -->

      <template #edit="{row}">
        <el-button
          v-has-permi="['transportation:waybill:getWayBillByCode']"
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
/*
    :loading = true/false
    :list= []
    :config = { api:' ' }
    :showSearch.sync = ""
    v-modler = queryParams:{ total,pageNum,pageSize }


    事件
    @getList = '' // 重新请求
    @handleSelectionChange = '' // 选中列表
*/
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
      tableColumnsConfig: []
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
    }
  },

  created() {
    this.tableHeaderConfig(this.tableColumnsConfig, this.config.api, {
      prop: 'edit',
      isShow: true,
      tooltip: false,
      label: '操作',
      width: 240,
      fixed: 'right'
    });
  }

  // methods: {
  //   handleTableBtn(row) {
  //     // 打开详情
  //   }
  // }
};
</script>

<style>

</style>
