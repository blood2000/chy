<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="98px"
  >

    <!--  batchNo: undefined, //	批次号	query	false
        companyName: undefined, //	发货企业	query	false
        invoiceTitle: undefined, //	发票抬头	query	false
        operator: undefined, //	操作人名称	query	false
        status: 1, //	1已申请对账列表 2已申请开票列表 3已申请打款列表 4已完成列表	query	false
        teamName: undefined, //	调度者名称	query	false
        ztcName: undefined, //	渣土场	query	false -->
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
      prop="ztcName"
    >
      <el-input
        v-model="queryParams.ztcName"
        placeholder="请输入渣土场"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>

    <el-form-item
      label="调度组名称"
      prop="teamName"
    >
      <el-input
        v-model="queryParams.teamName"
        placeholder="请输入调度组名称"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
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
      label="发货企业"
      prop="companyName"
    >
      <el-input
        v-model="queryParams.companyName"
        placeholder="请输入发货企业"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
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

  </el-form>
</template>

<script>
// 已打款 - 表格组件
export default {
  name: 'AlreadyQueryForm',
  props: {
    value: {
      type: Object,
      default: () => { return {}; }
    },
    loading: Boolean
  },

  data() {
    return {};
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
