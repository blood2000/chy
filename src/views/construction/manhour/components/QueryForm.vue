<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    size="small"
    label-width="100px"
  >
    <div class="app-container app-container--search">

      <el-form-item
        label="选择项目"
      >
        <el-select
          v-model="queryParams.projectCode"
          filterable
          style="width: 228px"
          placeholder="请选择选择项目"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="item in projectListOP"
            :key="item.id + item.code"
            :label="item.projectName"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="外部人员手机"
        prop="phone"
      >
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入外部人员手机"
          clearable
          style="width: 228px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="创建时间"
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
        label="提交审核时间"
        prop="submitAuditTime"
      >
        <el-date-picker
          v-model="queryParams.submitAuditTime"
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
        label="审核时间"
        prop="confirmAuditTime"
      >
        <el-date-picker
          v-model="queryParams.confirmAuditTime"
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
        label="班次"
        prop="schedule"
      >
        <el-select
          v-model="queryParams.schedule"
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
      <el-form-item
        label="工作内容"
        prop="jobContent"
      >
        <el-select
          v-model="queryParams.jobContent"
          clearable
          filterable
          style="width: 228px"
          placeholder="请选择工作内容"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in ztJxTasksOp"
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
import { pickerOptions } from '@/utils/dateRange';

export default {
  props: {
    value: {
      type: Object,
      default: () => { return {}; }
    },
    projectListOP: {
      type: Array,
      default: () => []
    },
    shiftOp: {
      type: Array,
      default: () => []
    },
    ztJxTasksOp: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      pickerOptions,
      'projectList': []
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

  },
  methods: {

  }
};
</script>

<style>

</style>
