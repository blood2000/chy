<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="98px"
  >
    <el-form-item
      label="对账批次号"
      prop="batchNo"
    >
      <el-input
        v-model="queryParams.batchNo"
        placeholder="请输入对账批次号"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>

    <el-form-item
      label="渣土场"
      prop="ztcCode"
    >
      <!-- <el-input
        v-model="queryParams.ztcCode"
        placeholder="请输入渣土场"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
      /> -->
      <FilterableSelect
        v-model="queryParams.ztcCode"
        clearable
        style="width:228px"
        placeholder="请输入渣土场"
        :axios="{
          queryFn:listForWeb,
          queryData:{
            orgCode: orgCode
          },
          key: 'data'
        }"
        :show-key="{
          value: 'code',
          label: 'name',
        }"
        :keywords="'name'"
        @selected="(data)=>{ $emit('handleQuery')}"
      >
        <template #default="{row}">
          <span>{{ row.name }}</span>
        </template>
      </FilterableSelect>
    </el-form-item>

    <el-form-item
      label="调度者名称"
      prop="teamCode"
    >
      <!-- <el-input
        v-model="queryParams.teamCode"
        placeholder="请输入调度者名称"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
      /> -->
      <FilterableSelect
        v-model="queryParams.teamCode"
        clearable
        style="width:228px"
        placeholder="请输入调度者名称"
        :axios="{
          queryFn:teamListInfo,
          queryData:{
            isAsc: 'desc',
            orderByColumn:'t0.create_time'
          },
          key: 'rows'
        }"
        :show-key="{
          value: 'code',
          label: 'teamLeaderName',
        }"
        :keywords="'keywords'"
        @selected="(data)=>{ $emit('handleQuery')}"
      >
        <template #default="{row}">
          <span>{{ row.teamLeaderName }}({{ row.telphone }})</span>
        </template>
      </FilterableSelect>
    </el-form-item>

    <el-form-item
      label="操作人"
      prop="operator"
    >
      <el-input
        v-model="queryParams.operator"
        placeholder="请输入操作人"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>

    <el-form-item
      v-show="!isShipment"
      label="发货企业"
      prop="companyCode"
    >
      <!-- <el-input
        v-model="queryParams.companyCode"
        placeholder="请输入发货企业"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
      /> -->
      <FilterableSelect
        v-model="queryParams.companyCode"
        clearable
        style="width:228px"
        placeholder="请输入发货企业"
        :axios="{
          queryFn:shipmentList,
          queryData:{
            authStatus: undefined
          },
          key: 'rows'
        }"
        :show-key="{
          value: 'orgCode',
          label: 'companyName',
        }"
        :keywords="'searchValue'"
        @selected="(data)=>{ shipmentCode= data.code; orgCode=data.orgCode; companyCode = data.companyCode; $emit('handleQuery')}"
      >
        <template #default="{row}">
          <span>{{ row.companyName }}</span>
        </template>
      </FilterableSelect>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="$emit('handleQuery')"
      >
        搜索
      </el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-refresh"
        size="mini"
        @click="queryParams.pageNum = 1; resetForm('queryForm');$emit('handleQuery');"
      >
        重置
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
// 已打款 - 表格组件
import { shipmentList } from '@/api/finance/askfor'; // 获取货主(搜索用)
import { listForWeb } from '@/api/listForWeb/index';
import { listInfo as teamListInfo } from '@/api/assets/team';


import FilterableSelect from '@/components/FilterableSelect';
export default {
  name: 'AlreadyQueryForm',
  components: { FilterableSelect },
  props: {
    value: {
      type: Object,
      default: () => { return {}; }
    },
    isShipment: Boolean,
    loading: Boolean
  },

  data() {
    return {
      shipmentCode: undefined,
      companyCode: undefined,
      orgCode: undefined,

      shipmentList,
      listForWeb,
      teamListInfo

    };
  },

  computed: {
    queryParams: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  }

};
</script>

<style>

</style>
