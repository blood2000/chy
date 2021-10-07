<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    size="small"
    label-width="98px"
  >
    <div class="app-container app-container--search">

      <el-form-item
        label="选择项目"
      >
        <el-select
          v-model="queryParams.projectCode"
          filterable
          style="width: 228px"
          placeholder="请选择项目"
          @change="
            $emit('handleQuery');
            queryParams.ticketName=undefined;
            queryParams.receiveSite=undefined;
            projectName = projectListOP.find((e)=> e.code === queryParams.projectCode).projectName"
        >
          <el-option
            v-for="item in projectListOP"
            :key="item.id + item.code"
            :label="item.projectName"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item
        label="土票名称"
        prop="ticketName"
      >
        <el-input
          v-model="queryParams.ticketName"
          placeholder="请输入土票名称"
          clearable
          style="width: 228px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item> -->

      <el-form-item
        label="土票名称"
        prop="ticketName"
      >
        <FilterableSelect
          v-model="queryParams.ticketName"
          clearable
          style="width: 228px"
          placeholder="请输入土票名称"
          requer-msg="请先选择项目！"
          :is-sure-key="'projectCode'"
          is-blur-search
          :axios="{
            queryFn: getTicketName,
            queryData:{
              // projectName: queryParams.projectName,
              projectCode: queryParams.projectCode,
            },
          }"
          :keywords="'ticketName'"
          :show-key="{
            value: 'value',
            label: 'label',
          }"
          @selected="(data)=>{ $emit('handleQuery') }"
          @handleQuery="$emit('handleQuery')"
        >
          <template #default="{row}">
            <span>{{ row.label }}</span>
          </template>
        </FilterableSelect>
      </el-form-item>

      <!-- <el-form-item
        label="接收工地"
        prop="receiveSite"
      >
        <el-input
          v-model="queryParams.receiveSite"
          placeholder="请输入接收工地"
          clearable
          style="width: 228px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item> -->

      <el-form-item
        label="接收工地"
        prop="receiveSite"
      >
        <FilterableSelect
          v-model="queryParams.receiveSite"
          clearable
          style="width: 228px"
          placeholder="请输入接收工地"
          requer-msg="请先选择项目！"
          :is-sure-key="'projectCode'"
          :axios="{
            queryFn: getReceiveSite,
            queryData:{
              // projectName: queryParams.projectName,
              projectCode: queryParams.projectCode,
            }
          }"
          :keywords="'receiveSite'"
          :show-key="{
            value: 'value',
            label: 'label',
          }"
          @selected="(data)=>{ $emit('handleQuery') }"
        >
          <template #default="{row}">
            <span>{{ row.label }}</span>
          </template>
        </FilterableSelect>
      </el-form-item>



      <el-form-item
        label="接收时间"
        prop="receiveTime"
      >
        <el-date-picker
          v-model="queryParams.receiveTime"
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
import { pickerOptions } from '@/utils/dateRange';
import FilterableSelect from '@/components/FilterableSelect'; // 远程组件
import { getTicketName, getReceiveSite } from '@/api/construction/tupiao';

export default {
  components: { FilterableSelect },

  props: {
    value: {
      type: Object,
      default: () => { return {}; }
    },
    projectListOP: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      pickerOptions,
      getTicketName,
      getReceiveSite

      // projectName: ''
      // 'projectList': []
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
  },
  methods: {

  }
};
</script>

<style>

</style>
