<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="120px"
    size="small"
  >
    <div class="app-container app-container--search">

      <el-form-item
        label="选择项目"
        prop="projectCode"
      >
        <!-- clearable -->
        <el-select
          v-model="queryParams.projectCode"
          filterable
          style="width: 185px"
          placeholder="请选择项目"
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
        label="成员姓名/手机"
        prop="keyWord"
      >
        <el-input
          v-model="queryParams.keyWord"
          placeholder="请输入成员姓名/手机"
          clearable
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="考勤日期"
        prop="attendanceMonth"
      >
        <el-date-picker
          v-model="queryParams.attendanceMonth"
          :picker-options="{disabledDate}"
          type="month"
          :clearable="false"
          value-format="yyyy-MM"
          placeholder="选择考勤月份"
          style="width: 228px"
          @change="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="考勤类型"
        prop="attendanceStatus"
      >
        <el-select
          v-model="queryParams.attendanceStatus"
          clearable
          filterable
          style="width: 185px"
          placeholder="请选择考勤类型"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="(item, index) in attendanceStatusOp"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="queryParams.attendanceStatus"
        label="班次"
        prop="schedule"
      >
        <el-select
          v-model="queryParams.schedule"
          clearable
          filterable
          style="width: 185px"
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
          @click="queryParams.pageNum = 1; resetForm('queryForm'); $emit('handleQuery'); $emit('initPickerOptions');"
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
    shiftOp: {
      type: Array,
      default: () => []
    },
    attendanceStatusOp: {
      type: Array,
      default: () => []
    },
    projectListOP: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      pickerOptions
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
  created() {

  },
  methods: {


    //
    disabledDate: (time) => {
      return time.getTime() > new Date(new Date().getTime()) || time.getTime() < new Date('2010-06-01').getTime();
    }
  }
};
</script>

<style>

</style>
