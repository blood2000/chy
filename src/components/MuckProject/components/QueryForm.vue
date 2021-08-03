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
        label="批次号"
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
          @selected="(data)=>{ $emit('handleQuery')}"
        >
          <!--   -->
          <template #default="{row}">
            <span>{{ row.name }}</span>
          </template>
        </FilterableSelect>
      </el-form-item>

      <el-form-item
        label="调度组名称"
        prop="teamCode"
      >
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
            label: 'name',
          }"
          :keywords="'keywords'"
          @selected="(data)=>{ $emit('handleQuery')}"
        >
          <template #default="{row}">
            <span>{{ row.name }}({{ row.telphone }})</span>
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
              companyCode:companyCode
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
        label="操作时间"
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
        v-if="queryParams.status === 2"
        label="状态"
        prop="pcStatus"
      >
        <el-select v-model="queryParams.pcStatus" placeholder="请选择批次状态" style="width: 228px" @change="$emit('handleQuery')">
          <!-- { dictLabel: '核验驳回', dictValue: -1 },
              { dictLabel: '已核算', dictValue: 0 },
              { dictLabel: '已核验', dictValue: 1 }, -->
          <el-option
            v-for="item in [// -1 核验驳回 0 已核算 1 已核验 2 已索票 3 已开票 4 已打款
              { dictLabel: '已索票', dictValue: 2 },
              { dictLabel: '已开票', dictValue: 3 },
              { dictLabel: '已打款', dictValue: 4 }
            ]"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
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
// 已打款 - 表格组件
import { shipmentList } from '@/api/finance/askfor'; // 获取货主(搜索用)
import { listForWeb } from '@/api/listForWeb/index'; // 获取渣土(搜索用)
import { listInfo } from '@/api/enterprise/project'; // 获取渣土项目(搜索用)
import { listInfo as teamListInfo } from '@/api/assets/team'; // 获取调度者(搜索用)
import { pickerOptions } from '@/utils/dateRange';


import FilterableSelect from '@/components/FilterableSelect'; // 远程组件
export default {
  components: { FilterableSelect },
  props: {
    // 固定 远程
    value: {
      type: Object,
      default: () => { return {}; }
    },
    isShipment: Boolean, // 货主身份
    loading: Boolean
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
  },
  methods: {
    handlerQuery(data) {
      console.log(data);
      this.$emit('handleQuery');
    }
  }

};
</script>

<style>

</style>
