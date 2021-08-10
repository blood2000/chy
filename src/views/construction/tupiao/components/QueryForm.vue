<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="98px"
  >
    <div class="app-container app-container--search">

      <el-form-item
        label="选择项目"
        prop="projectCode"
      >
        <el-select
          v-model="queryParams.projectCode"
          clearable
          size="small"
          filterable
          style="width: 185px"
          placeholder="请选择选择项目"
          @change="$emit('handleQuery')"
        >
          <el-option
            v-for="item in projectList"
            :key="item.id + item.code"
            :label="item.projectName"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="土票名称"
        prop="ticketName"
      >
        <el-input
          v-model="queryParams.ticketName"
          placeholder="请输入土票名称"
          clearable
          size="small"
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
      </el-form-item>

      <el-form-item
        label="接收工地"
        prop="receiveSite"
      >
        <el-input
          v-model="queryParams.receiveSite"
          placeholder="请输入接收工地"
          clearable
          size="small"
          style="width: 185px"
          @keyup.enter.native="$emit('handleQuery')"
        />
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
import { webGetMachineProjectList } from '@/api/construction/comon';
export default {
  props: {
    value: {
      type: Object,
      default: () => { return {}; }
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
    this.initData();
  },
  methods: {
    // 初始化搜索数据
    async initData() {
      const res = await webGetMachineProjectList();
      this.projectList = res.data;
    }
  }
};
</script>

<style>

</style>
