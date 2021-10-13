<template>
  <div>
    <span :style="{'margin-right': dynamicTags.length ? '10px': '0px'}">
      <el-tag
        v-for="(tag,index) in dynamicTags"
        :key="tag.code +''+ index"
        closable
        :disable-transitions="true"
        @close="handleClose(tag)"
      >
        {{ tag.name }}
      </el-tag>
    </span>

    <slot />
  </div>
</template>

<script>
export default {
  name: 'EltagGoup',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },


  data() {
    return {
      inputVisible: false,
      inputValue: ''
    };
  },

  computed: {
    dynamicTags: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.$emit('handleClose');
    }
  }
};
</script>

<style lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  ::v-deep .el-tag .el-icon-close{
    line-height: 20px;
  }
</style>
