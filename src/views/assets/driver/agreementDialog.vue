<template>
  <el-dialog
    class="page-agreement-dialog"
    :visible="visible"
    width="1000px"
    title="协议"
    append-to-body
    @close="cancel"
  >
    <div v-html="agreementHtml" />
  </el-dialog>
</template>

<script>
export default {
  name: 'AgreementDialog',
  props: {
    open: Boolean,
    agreementHtml: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }
  },
  create() {

  },
  methods: {
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
