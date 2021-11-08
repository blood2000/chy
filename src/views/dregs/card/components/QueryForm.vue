<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="98px"
  >
    <div v-if="!isShipment" class="app-container" style="display: flex; align-items: center;">
      <el-form-item
        label="发货企业"
        prop="companyCode"
        style="margin-bottom:0"
      >
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

      <span v-if="!shipmentCode" class="g-color-warning">
        <i class="el-icon-warning" />
        您还未选择货主
      </span>
    </div>

    <div class="app-container app-container--search">
      <el-form-item
        label="渣土场"
        prop="ztcCode"
      >
        <FilterableSelect
          v-model="queryParams.ztcCode"
          clearable
          style="width:228px"
          placeholder="请输入渣土场"
          :requer-msg="isShipment?null:'请先选择发货企业！'"
          :is-sure-key="'orgCode'"
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
        >
          <!-- @selected="(data)=>{ $emit('handleQuery')}" -->
          <!--   -->
          <template #default="{row}">
            <span>{{ row.name +' - '+ row.goodsName }}</span>
          </template>
        </FilterableSelect>
      </el-form-item>

      <el-form-item
        label="项目"
        prop="projectCode"
      >
        <FilterableSelect
          v-model="queryParams.projectCode"
          clearable
          style="width:228px"
          placeholder="请输入项目名称"
          :requer-msg="isShipment?null:'请先选择发货企业！'"
          :is-sure-key="'companyCode'"
          :axios="{
            queryFn:listInfo,
            queryData:{
              isAsc:'desc',
              orderByColumn:'t0.id',
              companyCode:companyCode,
              shipmentCode
            }
          }"
          :show-key="{
            value: 'code',
            label: 'projectName',
            telphone: ''
          }"
          :keywords="'projectName'"
          @selected="(data)=>{ $emit('handleQuery') }"
        >
          <template #default="{row}">
            <span>{{ row.projectName }}</span>
          </template>
        </FilterableSelect>
      </el-form-item>


      <el-form-item
        label="司机"
        prop="driverNameOrPhone"
      >
        <el-input
          v-model.trim="queryParams.driverNameOrPhone"
          placeholder="请输入司机名称或手机号"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="车牌号"
        prop="licenseNumber"
      >
        <el-input
          v-model.trim="queryParams.licenseNumber"
          placeholder="请输入车牌号"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="接单日期"
        prop="receiveTime"
      >
        <el-date-picker
          v-model.trim="queryParams.receiveTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 228px"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="写卡日期"
        prop="ztCreateTime"
      >
        <el-date-picker
          v-model.trim="queryParams.ztCreateTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 228px"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="卡ID"
        prop="card16no"
      >
        <el-input
          v-model.trim="queryParams.card16no"
          placeholder="请输入卡ID或读卡获取卡ID"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="$emit('handleQuery')"
        />

        <el-button class="ml10" size="small" type="primary" plain @click="$emit('getCardInfo')">读卡获取ID</el-button>
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
    </div>

  </el-form>
</template>

<script>
import { pickerOptions } from '@/utils/dateRange';
import { shipmentList } from '@/api/finance/askfor'; // 获取货主(搜索用)
import { listForWeb } from '@/api/listForWeb/index'; // 获取渣土(搜索用)
import { listInfo } from '@/api/enterprise/project'; // 获取渣土项目(搜索用)
import { listInfo as teamListInfo } from '@/api/assets/team'; // 获取调度者(搜索用)

import FilterableSelect from '@/components/FilterableSelect'; // 远程组件
export default {
  components: {
    FilterableSelect
  },

  props: {
    // 固定 远程
    value: {
      type: Object,
      default: () => { return {}; }
    },
    isShipment: Boolean // 货主身份
  },

  data() {
    return {
      pickerOptions,

      // 自己页面要用
      shipmentCode: undefined,
      companyCode: undefined,
      orgCode: undefined,

      shipmentList,
      listForWeb,
      listInfo,
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
