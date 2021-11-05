<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="98px"
  >

    <div class="app-container app-container--search">
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


      <el-form-item
        label="日期"
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
        prop="xiekashijian"
      >
        <el-date-picker
          v-model.trim="queryParams.xiekashijian"
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
export default {
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
      pickerOptions
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
