<template>
  <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-download"
        :loading="exportLoading"
        @click="$emit('handleExport')"
      >导出</el-button>
    </el-col>
    <right-toolbar :show-search.sync="visible" @queryTable="$emit('getList')" />
  </el-row>
</template>

<script>
export default {
  props: {
    exportLoading: {
      type: Boolean,
      default: false
    },
    showSearch: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    visible: {
      get() {
        return this.showSearch;
      },
      set(v) {
        this.$emit('update:showSearch', v);
      }
    }
  }
};
</script>
