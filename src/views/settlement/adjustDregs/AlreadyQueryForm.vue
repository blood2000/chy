<template>
  <el-form
    ref="queryForm"
    :model="queryParams"
    :inline="true"
    label-width="98px"
  >
    <el-form-item
      label="对账批次号"
      prop="dajijsisa"
    >
      <el-input
        v-model="queryParams.dajijsisa"
        placeholder="请输入对账批次号"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>

    <el-form-item
      label="渣土场"
      prop="zhagti"
    >
      <el-input
        v-model="queryParams.zhagti"
        placeholder="请输入渣土场"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>

    <el-form-item
      label="调度组名称"
      prop="jsioejpsw"
    >
      <el-input
        v-model="queryParams.jsioejpsw"
        placeholder="请输入调度组名称"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>

    <el-form-item
      label="操作人"
      prop="eeeww"
    >
      <el-input
        v-model="queryParams.eeeww"
        placeholder="请输入操作人"
        clearable
        size="small"
        style="width: 228px"
        @keyup.enter.native="$emit('handleQuery')"
      />
    </el-form-item>

    <el-form-item
      label="发货企业"
      prop="fanwma"
    >
      <el-input
        v-model="queryParams.fanwma"
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
