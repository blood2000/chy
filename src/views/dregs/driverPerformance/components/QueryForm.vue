<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    size="small"
    label-width="98px"
  >

    <div v-if="!isDispatcher" class="app-container" style="display: flex; align-items: center;">
      <el-form-item
        label="调度组名称"
      >
        <!-- prop="teamCode" -->
        <FilterableSelect
          v-model="queryParams.teamCode"
          clearable
          style="width:250px"
          placeholder="请输入调度者名称"
          :axios="{
            queryFn:teamListInfo,
            queryData:{
              isAsc: 'desc',
              orderByColumn: 't0.create_time',
              authStatus: 3
            },
            key: 'rows'
          }"
          :show-key="{
            value: 'code',
            label: 'name',
          }"
          :keywords="'name'"
          @selected="(data)=>{ handeleByTeamCode(queryParams.teamCode, data); $emit('handleQuery'); }"
        >
          <template #default="{row}">
            <span>{{ row.name }}</span><span style="color:#ccc;">({{ row.telphone }})</span>
          </template>
        </FilterableSelect>
      </el-form-item>

      <span v-if="!queryParams.teamCode" class="g-color-warning">
        <i class="el-icon-warning" />
        您还未选择调度组
      </span>
    </div>


    <div class="app-container app-container--search">

      <!-- <el-form-item
        label="项目"
        prop="projectCode"
      >
        <FilterableSelect
          v-model="queryParams.projectCode"
          clearable
          style="width:228px"
          placeholder="请输入项目名称"
          :requer-msg="isDispatcher?null:'请先选择调度者！'"
          :is-sure-key="'companyCode'"
          :axios="{
            queryFn:disZtcList,
            queryData:{
              teamCode: queryParams.teamCode
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
      </el-form-item> -->

      <!-- <el-form-item
        label="渣土场"
        prop="ztcCode"
      >
        <FilterableSelect
          v-model="queryParams.ztcCode"
          clearable
          style="width:228px"
          placeholder="请输入渣土场"
          :requer-msg="isDispatcher?null:'请先选择调度者！'"
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
          @selected="(data)=>{ $emit('handleQuery')}"
        >
          <template #default="{row}">
            <span>{{ row.name +' - '+ row.goodsName }}</span>
          </template>
        </FilterableSelect>
      </el-form-item> -->

      <el-form-item
        label="项目"
        prop="projectCode"
      >
        <el-select
          v-model="queryParams.projectCode"
          clearable
          filterable
          placeholder="请输入项目名称"
          style="width:228px"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in projectCodeOp"
            :key="index"
            :label="item.projectName"
            :value="item.projectCode"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="渣土场"
        prop="ztcCode"
      >
        <el-select
          v-model="queryParams.ztcCode"
          filterable
          placeholder="请输入渣土场"
          style="width:228px"
          clearable
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in ztcCodeCodeOp"
            :key="index"
            :label="item.ztcName"
            :value="item.ztcCode"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="司机"
        prop="driverName"
      >
        <el-input
          v-model="queryParams.driverName"
          placeholder="请输入司机名称"
          clearable
          style="width: 228px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="车牌号"
        prop="licenseNumber"
      >
        <el-input
          v-model="queryParams.licenseNumber"
          placeholder="请输入车牌号"
          clearable
          style="width: 228px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="装货日期"
        prop="loadTime"
      >
        <el-date-picker
          v-model="queryParams.loadTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 228px"
          @change="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="卸货日期"
        prop="unloadTime"
      >
        <el-date-picker
          v-model="queryParams.unloadTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 228px"
          @change="$emit('handleQuery')"
        />
      </el-form-item>


      <el-form-item
        label="班次"
        prop="waybillClasses"
      >
        <el-select
          v-model="queryParams.waybillClasses"
          clearable
          filterable
          style="width: 228px"
          placeholder="请选择班次"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in shiftOp"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="$emit('handleQuery')"
        >
          搜索
        </el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh"
          @click="queryParams.pageNum = 1; resetForm('queryForm');$emit('handleQuery');"
        >
          重置
        </el-button>
      </el-form-item>
    </div>

  </el-form>
</template>

<script>
// import { listForWeb } from '@/api/listForWeb/index'; // 获取渣土(搜索用)
import { listInfo as teamListInfo } from '@/api/assets/team'; // 获取调度组(搜索用)
import { disZtcList, disProjectList } from '@/api/dregs/driverPerformance'; // 获取项目

import { pickerOptions } from '@/utils/dateRange';

import { getUserInfo } from '@/utils/auth';

import FilterableSelect from '@/components/FilterableSelect'; // 远程组件
export default {
  components: { FilterableSelect },
  props: {
    // 固定 远程
    value: {
      type: Object,
      default: () => { return {}; }
    },
    isDispatcher: Boolean, // 货主身份
    loading: Boolean,
    shiftOp: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      pickerOptions,

      // 自己页面要用
      shipmentCode: undefined,
      companyCode: undefined,
      orgCode: undefined,

      // 请求接口
      // shipmentList,
      // listForWeb,
      // listInfo,
      teamListInfo,
      disZtcList,

      // 字典值
      // shiftOp: []
      projectCodeOp: [],
      ztcCodeCodeOp: []

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
    },
    // 当前登录信息
    teamCode() {
      const userInfo = getUserInfo() || {};
      let teamCode;
      if (userInfo.isDispatcher) {
        teamCode = userInfo.dispatcher ? userInfo.dispatcher.code : undefined;
      } else {
        teamCode = this.queryParams.teamCode;
      }
      return teamCode;
    }
  },

  created() {
    if (this.isDispatcher) {
      this.handeleByTeamCode();
    }
  },
  methods: {
    handeleByTeamCode() {
      disZtcList(this.teamCode).then(res => {
        this.ztcCodeCodeOp = res.rows.filter(e => e);
      });
      disProjectList(this.teamCode).then(res => {
        this.projectCodeOp = res.rows.filter(e => e);
      });
    }
  }

};
</script>

<style>

</style>
