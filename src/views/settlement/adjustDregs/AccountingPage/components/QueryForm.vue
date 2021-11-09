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
        label="项目"
        prop="projectCode"
      >
        <FilterableSelect
          v-model="queryParams.projectCode"
          clearable
          style="width:228px"
          placeholder="请输入项目名称"
          :requer-msg="isShipment? null:'请先选择发货企业！'"
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
        label="渣土场"
        prop="ztcCodeIds"
      >
        <EltagGoup v-model="dynamicTags" @handleClose="myHandleQuery">
          <FilterableSelect
            v-model="ztcCode"
            clearable
            style="width:228px"
            placeholder="请输入渣土场"
            :requer-msg="isShipment? null: '请先选择发货企业！'"
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
            @selected="handlerSelected"
          >
            <!-- @selected="(data)=>{ $emit('handleQuery')}" -->
            <template #default="{row}">
              <span>{{ row.name +' - '+ row.goodsName }}</span>
            </template>
          </FilterableSelect>
        </EltagGoup>
      </el-form-item>


      <el-form-item
        label="运输单号"
        prop="waybillNo"
      >
        <el-input
          v-model="queryParams.waybillNo"
          placeholder="请输入运输单号"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="卡批次"
        prop="cardBatchNo"
      >
        <el-input
          v-model="queryParams.cardBatchNo"
          placeholder="请输入卡批次"
          clearable
          size="small"
          style="width: 228px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>



      <el-form-item
        label="调度组名称"
        prop="teamCode"
      >
        <FilterableSelect
          v-model="queryParams.teamCode"
          clearable
          style="width:228px"
          placeholder="请输入调度组名称"
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
        label="班次"
        prop="waybillClasses"
      >
        <el-select
          v-model="queryParams.waybillClasses"
          clearable
          filterable
          style="width:228px"
          placeholder="请选择班次"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in shift_op"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="接单日期"
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


      <!-- <el-form-item
        label="状态查询绍林说去掉的"
        prop="ztConditionStatus"
      >
        <el-select
          v-model="queryParams.ztConditionStatus"
          clearable
          filterable
          style="width:228px"
          placeholder="请选择状态"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in [
              { dictLabel:'未核算', dictValue:'4' },
              { dictLabel:'已核算', dictValue:'5' },
              { dictLabel:'全部', dictValue:'4,5' },
            ]"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item> -->

      <!-- <el-form-item
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
      </el-form-item> -->


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
          @click="queryParams.pageNum = 1; dynamicTags=[]; ztcCode=undefined; resetForm('queryForm'); myHandleQuery();"
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
import EltagGoup from './EltagGoup';
export default {
  components: { FilterableSelect, EltagGoup },
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
      teamListInfo,

      shift_op: [],

      ztcCode: undefined,

      dynamicTags: []

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

  created() {
    this.getDicts('work-shift').then((response) => {
      this.shift_op = response.data.filter(e => e.dictValue !== '2');
    });
  },

  methods: {
    handlerSelected(data) {
      /*
        code: "8c73afb50add458586c029f42d11f152"
        name: "0902渣一"
      */
      if (data && data.code && data.name) {
        // 判断如果重复选中不执行push 和 请求 操作
        for (let i = 0; i < this.dynamicTags.length; i++) {
          const e = this.dynamicTags[i];
          if (e.code === data.code && e.name === data.name) {
            return;
          }
        }

        this.dynamicTags.push({ code: data.code, name: data.name });
        this.myHandleQuery();
      }
    },
    myHandleQuery() {
      this.queryParams.ztcCodeIds = (this.dynamicTags.map(e => e.code)).join(',');
      this.$emit('handleQuery');
    }
  }

};
</script>

<style>

</style>
